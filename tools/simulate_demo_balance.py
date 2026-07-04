import pathlib
import random
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
APP = ROOT / "游戏demo" / "app.js"
src = APP.read_text(encoding="utf-8")


def match(s, i, op, cl):
    depth = 0
    quote = None
    esc = False
    for k in range(i, len(s)):
        ch = s[k]
        if quote:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == quote:
                quote = None
        else:
            if ch in "\"'`":
                quote = ch
            elif ch == op:
                depth += 1
            elif ch == cl:
                depth -= 1
                if depth == 0:
                    return k
    raise ValueError("no match")


def block_after(marker, op="[", cl="]"):
    i = src.index(marker)
    j = src.index(op, i)
    return src[j : match(src, j, op, cl) + 1]


def split_objs(arr):
    out = []
    i = 0
    while i < len(arr):
        if arr[i] == "{":
            j = match(arr, i, "{", "}")
            out.append(arr[i : j + 1])
            i = j + 1
        else:
            i += 1
    return out


def split_props(obj):
    body = obj[1:-1]
    out = []
    i = 0
    while i < len(body):
        while i < len(body) and (body[i].isspace() or body[i] == ","):
            i += 1
        m = re.match(r"([A-Za-z0-9_$]+)\s*:", body[i:])
        if not m:
            i += 1
            continue
        key = m.group(1)
        i += m.end()
        while i < len(body) and body[i].isspace():
            i += 1
        if i < len(body) and body[i] == "{":
            j = match(body, i, "{", "}")
            out.append((key, body[i : j + 1]))
            i = j + 1
        else:
            while i < len(body) and body[i] != ",":
                i += 1
    return out


def object_after(marker):
    return block_after(marker, "{", "}")


def sf(block, name):
    m = re.search(r"\b" + re.escape(name) + r'\s*:\s*"((?:[^"\\]|\\.)*)"', block)
    return m.group(1).replace("\\n", "\n") if m else ""


def nf(block, name):
    m = re.search(r"\b" + re.escape(name) + r"\s*:\s*(-?\d+(?:\.\d+)?)", block)
    if not m:
        return 0
    return float(m.group(1)) if "." in m.group(1) else int(m.group(1))


def effect(block):
    m = re.search(r"\beffect\s*:\s*{([^{}]*)}", block)
    if not m:
        return {}
    return {
        k: float(v) if "." in v else int(v)
        for k, v in re.findall(r"([A-Za-z0-9_$]+)\s*:\s*(-?\d+(?:\.\d+)?)", m.group(1))
    }


def string_list(block):
    return re.findall(r'"([^"]+)"', block)


def nested_arrays(block):
    body = block[1:-1]
    out = []
    i = 0
    while i < len(body):
        if body[i] == "[":
            j = match(body, i, "[", "]")
            out.append(string_list(body[i : j + 1]))
            i = j + 1
        else:
            i += 1
    return out


def parse_stages(name):
    stages = []
    for b in split_objs(block_after("const " + name)):
        stages.append(
            {k: sf(b, k) for k in ["title", "short", "enemyName", "target", "blockText", "powerText", "intro"]}
            | {k: nf(b, k) for k in ["hp", "attack", "rounds", "rewardFunds", "recover"]}
        )
    return stages


def parse_cards(name, group):
    return {
        cid: {
            "name": sf(b, "name"),
            "cost": nf(b, "cost"),
            "fundCost": nf(b, "fundCost"),
            "text": sf(b, "text"),
            "group": group,
        }
        for cid, b in split_props(object_after("const " + name))
    }


def parse_events(name):
    return [{"id": sf(b, "id"), "name": sf(b, "name"), "effect": effect(b)} for b in split_objs(block_after("const " + name))]


tracks = []
for block in split_objs(block_after("const tracks")):
    traits = []
    trait_match = re.search(r"traits\s*:\s*\[", block)
    if trait_match:
        start = trait_match.end() - 1
        trait_block = block[start : match(block, start, "[", "]") + 1]
        for trait in split_objs(trait_block):
            traits.append({"id": sf(trait, "id"), "name": sf(trait, "name"), "effect": effect(trait)})
    tracks.append(
        {
            "id": sf(block, "id"),
            "name": sf(block, "name"),
            "time": nf(block, "time"),
            "funds": nf(block, "funds"),
            "difficulty": nf(block, "difficulty"),
            "traits": traits,
            "specialRoute": "specialRoute: true" in block,
        }
    )
track_by_id = {t["id"]: t for t in tracks}

base_cards = parse_cards("cardCatalog", "base")
iphone_cards = parse_cards("iphoneBaseCards", "iphone")
reward_cards = parse_cards("rewardCards", "reward")

cards = {}
cards.update(base_cards)
cards.update(iphone_cards)
cards.update(reward_cards)

ROUTES = {
    track["id"]: {
        "track": track,
        "stages": parse_stages("stages"),
        "starter": list(base_cards.keys()),
        "rewards": nested_arrays(block_after("const stageRewardIds")),
        "events": parse_events("specialEvents"),
        "profileTraits": True,
    }
    for track in tracks
    if not track["specialRoute"]
}
ROUTES.update(
    {
    "iphone": {
        "track": track_by_id["iphone"],
        "stages": parse_stages("iphoneStages"),
        "starter": string_list(block_after("const iphoneStarterDeck")),
        "rewards": nested_arrays(block_after("const iphoneStageRewardIds")),
        "events": parse_events("iphoneSpecialEvents"),
        "profileTraits": False,
    }
}
)


def draw(state, count):
    for _ in range(count):
        if not state["deck"]:
            if not state["discard"]:
                return
            state["deck"] = state["discard"]
            state["discard"] = []
            random.shuffle(state["deck"])
        state["hand"].append(state["deck"].pop())


def play(state, card_id):
    card = cards[card_id]
    text = card["text"]
    state["energy"] -= card["cost"]
    state["funds"] -= card.get("fundCost", 0)

    for m in re.finditer(r"核心工作 -([0-9]+)", text):
        amount = int(m.group(1)) + state["momentum"]
        blocked = min(state["enemyBlock"], amount)
        state["enemyBlock"] -= blocked
        state["enemyHp"] -= max(0, amount - blocked)

    if "抽 1 张牌" in text:
        draw(state, 1)
    if "抽 2 张牌" in text:
        draw(state, 2)

    for m in re.finditer(r"时间缓冲 \+([0-9]+)", text):
        state["block"] += int(m.group(1))
    for m in re.finditer(r"剩余时间 \+([0-9]+)", text):
        state["hp"] = min(state["maxHp"], state["hp"] + int(m.group(1)))
    for m in re.finditer(r"资金 \+([0-9]+)", text):
        state["funds"] += int(m.group(1))
    if not card.get("fundCost"):
        for m in re.finditer(r"资金 -([0-9]+)", text):
            state["funds"] -= int(m.group(1))
    for m in re.finditer(r"阻力 -([0-9]+)", text):
        state["enemyBlock"] = max(0, state["enemyBlock"] - int(m.group(1)))
    for m in re.finditer(r"压力 -([0-9]+)", text):
        state["enemyPower"] = max(0, state["enemyPower"] - int(m.group(1)))
    for m in re.finditer(r"压力 \+([0-9]+)", text):
        state["enemyPower"] += int(m.group(1))
    if any(x in text for x in ["后续推进 +1", "推进加成 +1", "后续推进核心工作 +1"]):
        state["momentum"] += 1
    if "行动力上限 +1" in text:
        state["maxEnergy"] = min(6, state["maxEnergy"] + 1)
        state["energy"] = min(state["maxEnergy"], state["energy"] + 1)
    for m in re.finditer(r"时间 -([0-9]+)", text):
        state["hp"] -= int(m.group(1))


def score_card(card_id):
    text = cards[card_id]["text"]
    score = 0
    for m in re.finditer(r"核心工作 -([0-9]+)", text):
        score += int(m.group(1)) * 10
    for m in re.finditer(r"阻力 -([0-9]+)", text):
        score += int(m.group(1)) * 6
    for m in re.finditer(r"资金 \+([0-9]+)", text):
        score += int(m.group(1)) * 3
    for m in re.finditer(r"剩余时间 \+([0-9]+)|时间缓冲 \+([0-9]+)", text):
        score += int(m.group(1) or m.group(2)) * 2
    if "抽 1 张牌" in text:
        score += 8
    if "抽 2 张牌" in text:
        score += 14
    if "推进加成 +1" in text or "后续推进 +1" in text:
        score += 12
    return score - cards[card_id]["cost"] * 2 - cards[card_id].get("fundCost", 0)


def clamp_number(value, lower, upper):
    return max(lower, min(upper, value))


def trait_score(trait):
    e = trait["effect"]
    return e.get("time", 0) * 1.5 + e.get("funds", 0) * 0.7 - e.get("difficulty", 0) * 25


def apply_recommended_traits(track):
    traits = sorted(track.get("traits", []), key=trait_score, reverse=True)
    core_traits = traits[:2]
    opportunity_traits = traits[2:3]
    time = track["time"]
    funds = track["funds"]
    difficulty = track["difficulty"]
    for trait in core_traits:
        e = trait["effect"]
        time += e.get("time", 0)
        funds += e.get("funds", 0)
        difficulty += e.get("difficulty", 0)
    for trait in opportunity_traits:
        e = trait["effect"]
        time += round(e.get("time", 0) * 0.7)
        funds += round(e.get("funds", 0) * 0.7)
        difficulty += e.get("difficulty", 0) * 0.7
    time = round(clamp_number(time, 18, 34))
    funds = round(clamp_number(funds, 6, 32))
    difficulty = round(clamp_number(difficulty, 0.78, 1.35), 2)
    return time, funds, difficulty, [trait["id"] for trait in core_traits + opportunity_traits]


def choose_playable(state):
    playable = [cid for cid in state["hand"] if cards[cid]["cost"] <= state["energy"] and cards[cid].get("fundCost", 0) <= state["funds"]]
    return max(playable, key=score_card) if playable else None


def battle(stage, campaign, deck):
    state = {
        "hp": campaign["time"],
        "maxHp": campaign["maxTime"],
        "funds": campaign["funds"],
        "maxEnergy": 3,
        "energy": 3,
        "block": campaign["mods"]["startBuffer"],
        "momentum": 0,
        "enemyHp": round(stage["hp"] * campaign["difficulty"] * (1 + campaign["mods"]["enemyHpPct"])),
        "enemyBlock": 0,
        "enemyPower": 0,
        "baseAttack": max(1, round(stage["attack"] * campaign["difficulty"]) + campaign["mods"]["attackDelta"]),
        "deck": deck[:],
        "discard": [],
        "hand": [],
    }
    random.shuffle(state["deck"])
    draw(state, 5)
    for rnd in range(1, stage["rounds"] + 1):
        state["energy"] = state["maxEnergy"]
        for _ in range(30):
            cid = choose_playable(state)
            if not cid:
                break
            state["hand"].remove(cid)
            state["discard"].append(cid)
            play(state, cid)
            if state["enemyHp"] <= 0:
                campaign["time"] = min(campaign["maxTime"], state["hp"] + stage["recover"])
                campaign["funds"] = state["funds"] + max(0, stage["rewardFunds"] + campaign["mods"]["rewardFunds"])
                return True
            if state["hp"] <= 0:
                return False
        state["discard"].extend(state["hand"])
        state["hand"] = []
        idx = (rnd - 1) % 5
        base = state["baseAttack"] + state["enemyPower"]
        if idx == 0:
            damage = base
        elif idx == 1:
            state["enemyBlock"] += 7
            damage = 0
        elif idx == 2:
            damage = max(1, base - 1)
        elif idx == 3:
            state["enemyPower"] += 2
            damage = 0
        else:
            damage = base + 2
        if damage:
            blocked = min(state["block"], damage)
            state["block"] -= blocked
            state["hp"] -= damage - blocked
        state["block"] = 0
        if state["hp"] <= 0:
            return False
        draw(state, 5)
    return False


def apply_event(campaign, event):
    e = event["effect"]
    campaign["funds"] += e.get("funds", 0)
    campaign["time"] += e.get("time", 0)
    campaign["maxTime"] += e.get("maxTime", 0)
    campaign["difficulty"] += e.get("difficulty", 0)
    campaign["time"] = max(1, min(campaign["time"], campaign["maxTime"]))
    for key in campaign["mods"]:
        campaign["mods"][key] += e.get(key, 0)


def card_price(card_id, campaign):
    card = cards[card_id]
    discount = campaign["mods"].get("shopDiscount", 0)
    return max(1, 4 + card["cost"] + card.get("fundCost", 0) - discount)


def buy_shop_cards(route, campaign, owned):
    offers = [card_id for card_id in route["starter"] if card_id not in set(owned)][:4]
    for card_id in sorted(offers, key=score_card, reverse=True):
        price = card_price(card_id, campaign)
        if campaign["funds"] >= price:
            campaign["funds"] -= price
            owned.append(card_id)


def run_route(route_id, seed):
    route = ROUTES[route_id]
    random.seed(seed)
    track = route["track"]
    if route.get("profileTraits"):
        time, funds, difficulty, selected_traits = apply_recommended_traits(track)
    else:
        time, funds, difficulty, selected_traits = track["time"], track["funds"], track["difficulty"], []
    campaign = {
        "time": time,
        "maxTime": max(30, time + 6),
        "funds": funds,
        "difficulty": difficulty,
        "selectedTraits": selected_traits,
        "mods": {"enemyHpPct": 0, "attackDelta": 0, "shopDiscount": 0, "startBuffer": 0, "rewardFunds": 0},
    }
    starter = route["starter"][:]
    if route.get("profileTraits"):
        starter = sorted(starter, key=score_card, reverse=True)[:8]
    owned = starter[:]
    deck = starter[:]
    for index, stage in enumerate(route["stages"]):
        if not battle(stage, campaign, deck):
            return False, index + 1, stage["title"], campaign
        if index == len(route["stages"]) - 1:
            return True, index + 1, stage["title"], campaign
        reward = max(route["rewards"][index], key=score_card)
        owned.append(reward)
        apply_event(campaign, route["events"][index])
        buy_shop_cards(route, campaign, owned)
        limit = 8 + index + 1
        deck = sorted(owned, key=score_card, reverse=True)[:limit]
    return True, len(route["stages"]), "done", campaign


if __name__ == "__main__":
    for route_id in ROUTES:
        results = [run_route(route_id, seed) for seed in range(500)]
        wins = sum(1 for r in results if r[0])
        failures = {}
        for result in results:
            if not result[0]:
                failures[result[2]] = failures.get(result[2], 0) + 1
        print(route_id, wins, "/", len(results), failures)
        if wins < len(results):
            print([r for r in results if not r[0]][:5])
        else:
            print("sample final", results[0])

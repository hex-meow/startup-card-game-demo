"""Local static-file and contextual story service for the card-game demo."""

from __future__ import annotations

import argparse
import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


TRANSITIONS = {
    "first": ["开场的方向确定后，", "面对最先暴露的问题，", "很快，"],
    "after_pressure": ["压力尚未散去，", "短暂的动荡之后，", "局势逼着大家更快作出回应，"],
    "same_thread": ["沿着刚刚找到的线索，", "顺着这股刚建立起来的节奏，", "前一步带来的变化很快显出作用，"],
    "new_thread": ["与此同时，", "局面稍稍打开后，", "当上一项决定开始见效，", "随后，"],
}

BRIDGES = {
    "person": "刚刚形成的分工没有停留在会议室里。",
    "tech": "测试留下的结果很快成了下一步判断的依据。",
    "fund": "来之不易的喘息立刻被用在最需要它的地方。",
    "time": "重新找回的节奏让团队有余力看向下一个缺口。",
    "management": "刚刚达成的共识开始在具体工作中发挥作用。",
    "resource": "新接通的资源很快带动了另一个停滞的环节。",
    "default": "前一步留下的变化仍在工坊里延续。",
}

STORY_LIBRARY = {
    "person": [
        "一位熟悉这类难题的伙伴坐到桌边，没有急着给出答案，而是先把大家忽略的细节一一指出。原本分散的争论有了共同语言，团队也更接近眼前的目标：{objective}。",
        "团队把最棘手的部分交给真正擅长它的成员。随着责任被稳稳接住，会议室里的焦虑逐渐变成清晰的分工，眼前的目标也不再显得遥远：{objective}。",
        "新的经验补上了团队一直没有察觉的盲区。几只猫围着草图重新梳理方案，终于找到一种能让所有人继续前进的办法，而目标没有改变：{objective}。",
    ],
    "tech": [
        "团队停止在口头上兜圈，把争论写进原型，把猜测交给测试。屏幕上亮起的结果并不完美，却给{objective}留下了一条能够反复验证的路。",
        "工作台再次亮了起来。故障被暴露、修复，又重新接受检验；那段曾经摇摆不定的可能，渐渐变成可靠的证据，也让团队离眼前的目标更近一步：{objective}。",
        "工程猫们把难题拆成几个能够验证的小部分。杂乱的线索被重新连接，‘{objective}’不再只是纸面上的愿望，而开始以真实的形态运转。",
    ],
    "fund": [
        "账本上那条绷紧的线终于松开了一点。团队仍谈不上宽裕，却争取到足够的喘息，能够把注意力重新放回眼前的目标：{objective}。",
        "有限的筹码被重新安排，每一笔投入都有了明确的去处。那些一度被迫搁置的工作重新回到桌面，也为眼前的目标补上了缺失的一环：{objective}。",
        "一份关键支持在最后时刻落定。它没有让所有困难消失，却给了团队继续承担风险、坚持{objective}的底气。",
    ],
    "time": [
        "团队从拥挤的日程里抢回一段完整时间。大家关掉无关的消息，把难得的安静全部留给眼前的目标：{objective}。",
        "轻重缓急被重新排开，最重要的事情终于可以先发生。节奏恢复之后，‘{objective}’不再被接连不断的琐事打断。",
        "几只疲惫的猫重新校准了步调。急迫并没有消失，但团队终于能用更从容、更少返工的方式去{objective}。",
    ],
    "management": [
        "模糊的责任被逐一说清，绕远的沟通也被及时截断。所有爪子重新朝向同一个方向，团队终于能专心{objective}。",
        "一场几乎失控的讨论重新有了边界。分歧没有被掩盖，而是被整理成可以执行的决定，扫开内耗之后，团队得以继续{objective}。",
        "团队重新确认什么值得坚持、什么可以暂时放下。选择变少以后，‘{objective}’反而变得清晰而具体。",
    ],
    "resource": [
        "散落在各处的资源被聚到同一个目标下。原本缺口重重的计划重新闭合，团队又有了继续{objective}的条件。",
        "一条意料之外的通路出现在眼前。团队顺势连接伙伴与工具，越过原先难以跨越的门槛，继续{objective}。",
        "有限的条件开始彼此补足。一次聪明的组合没有凭空创造奇迹，却为{objective}换来了新的空间。",
    ],
    "default": [
        "团队抓住短暂的窗口，把犹豫变成行动。这并不是解决所有问题的捷径，却让每只猫都离目标更近一步，而目标正是：{objective}。",
        "一个停滞已久的环节重新运转，工坊里的气氛也随之改变。大家没有停下来庆祝，而是继续推进眼前的目标：{objective}。",
        "眼前的线索终于被转化成一次具体行动。变化虽然细小，却恰好接住了前面的努力，也让‘{objective}’有了新的可能。",
    ],
}


def generate_story(payload: dict) -> str:
    kind = str(payload.get("kind") or "default")
    objective = str(payload.get("objective") or "把眼前的事业继续向前推进")
    action_count = max(0, int(payload.get("actionCount") or 0))
    previous_kind = str(payload.get("previousKind") or "opening")
    previous_thread = str(payload.get("previousThread") or "")
    same_thread = bool(payload.get("sameThread"))

    if action_count == 0:
        transition_key = "first"
    elif previous_kind == "pressure":
        transition_key = "after_pressure"
    elif same_thread:
        transition_key = "same_thread"
    else:
        transition_key = "new_thread"

    transitions = TRANSITIONS[transition_key]
    templates = STORY_LIBRARY.get(kind, STORY_LIBRARY["default"])
    if transition_key == "new_thread" and previous_thread:
        lead = BRIDGES.get(previous_thread, BRIDGES["default"])
    else:
        lead = transitions[action_count % len(transitions)]
    body = templates[action_count % len(templates)].format(objective=objective)
    return f"{lead}{body}"


class StoryRequestHandler(SimpleHTTPRequestHandler):
    server_version = "MeowStoryLocal/1.0"

    def send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        if self.path.split("?", 1)[0] == "/api/story/health":
            self.send_json(200, {"ok": True, "engine": "local-context-grammar-v1"})
            return
        super().do_GET()

    def do_POST(self) -> None:
        if self.path.split("?", 1)[0] != "/api/story/continue":
            self.send_json(404, {"ok": False, "error": "not_found"})
            return
        try:
            length = min(int(self.headers.get("Content-Length", "0")), 32_768)
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            text = generate_story(payload)
        except (ValueError, TypeError, json.JSONDecodeError) as error:
            self.send_json(400, {"ok": False, "error": str(error)})
            return
        self.send_json(200, {"ok": True, "engine": "local-context-grammar-v1", "text": text})


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve the demo and its local story generator.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=4173)
    args = parser.parse_args()

    root = Path(__file__).resolve().parent
    handler = lambda *handler_args, **handler_kwargs: StoryRequestHandler(  # noqa: E731
        *handler_args, directory=str(root), **handler_kwargs
    )
    server = ThreadingHTTPServer((args.host, args.port), handler)
    print(f"Local story demo running at http://{args.host}:{args.port}")
    server.serve_forever()


if __name__ == "__main__":
    main()

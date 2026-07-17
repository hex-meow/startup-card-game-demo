import html
import os
import re
import zipfile

import simulate_demo_balance as sim

ROOT = sim.ROOT
APP = sim.APP
OUT = ROOT / "游戏demo" / "内容编辑器实际Demo表格.xlsx"


def col_letter(n):
    out = ""
    while n:
        n, r = divmod(n - 1, 26)
        out = chr(65 + r) + out
    return out


def cell_xml(value, row, col):
    ref = f"{col_letter(col)}{row}"
    text = "" if value is None else str(value)
    return f'<c r="{ref}" t="inlineStr"><is><t>{html.escape(text)}</t></is></c>'


def sheet_xml(rows):
    max_cols = max(len(row) for row in rows) if rows else 1
    sheet_rows = []
    for r_idx, row in enumerate(rows, 1):
        cells = "".join(cell_xml(value, r_idx, c_idx) for c_idx, value in enumerate(row, 1))
        sheet_rows.append(f'<row r="{r_idx}">{cells}</row>')
    cols = "".join(f'<col min="{i}" max="{i}" width="24" customWidth="1"/>' for i in range(1, max_cols + 1))
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" '
        'activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'
        f"<cols>{cols}</cols><sheetData>{''.join(sheet_rows)}</sheetData></worksheet>"
    )


def write_xlsx(path, sheets):
    content_types = [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
        '<Default Extension="xml" ContentType="application/xml"/>',
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>',
        '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>',
    ]
    for idx in range(1, len(sheets) + 1):
        content_types.append(
            f'<Override PartName="/xl/worksheets/sheet{idx}.xml" '
            'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
        )
    content_types.append("</Types>")

    rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
        "</Relationships>"
    )

    workbook_sheets = []
    workbook_rels = [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
    ]
    for idx, (name, _) in enumerate(sheets, 1):
        workbook_sheets.append(f'<sheet name="{html.escape(name)}" sheetId="{idx}" r:id="rId{idx}"/>')
        workbook_rels.append(
            f'<Relationship Id="rId{idx}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" '
            f'Target="worksheets/sheet{idx}.xml"/>'
        )
    workbook_rels.append(
        f'<Relationship Id="rId{len(sheets) + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
    )
    workbook_rels.append("</Relationships>")

    workbook = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        f"<sheets>{''.join(workbook_sheets)}</sheets></workbook>"
    )
    styles = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
        '<fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>'
        '<fills count="1"><fill><patternFill patternType="none"/></fill></fills>'
        '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
        '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
        '<cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>'
        "</styleSheet>"
    )

    os.makedirs(path.parent, exist_ok=True)
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", "".join(content_types))
        z.writestr("_rels/.rels", rels)
        z.writestr("xl/workbook.xml", workbook)
        z.writestr("xl/_rels/workbook.xml.rels", "".join(workbook_rels))
        z.writestr("xl/styles.xml", styles)
        for idx, (_, rows) in enumerate(sheets, 1):
            z.writestr(f"xl/worksheets/sheet{idx}.xml", sheet_xml(rows))


def parse_tracks_and_traits():
    tracks = []
    traits = []
    for block in sim.split_objs(sim.block_after("const tracks")):
        track_id = sim.sf(block, "id")
        track_name = sim.sf(block, "name")
        route_type = "喵史映射路线" if "specialRoute: true" in block else "自由喵创路线"
        tracks.append(
            [
                track_id,
                track_name,
                route_type,
                sim.sf(block, "note"),
                sim.nf(block, "time"),
                sim.nf(block, "funds"),
                sim.nf(block, "difficulty"),
            ]
        )
        match = re.search(r"traits\s*:\s*\[", block)
        if match:
            start = match.end() - 1
            trait_block = block[start : sim.match(block, start, "[", "]") + 1]
            for trait in sim.split_objs(trait_block):
                traits.append(
                    [
                        track_id,
                        track_name,
                        sim.sf(trait, "id"),
                        sim.sf(trait, "name"),
                        sim.sf(trait, "tag"),
                        sim.nf(trait, "time"),
                        sim.nf(trait, "funds"),
                        sim.nf(trait, "difficulty"),
                    ]
                )
    return tracks, traits


def stage_rows(route_id, route_name, stages):
    rows = []
    for index, stage in enumerate(stages, 1):
        rows.append(
            [
                f"{route_id}_stage_{index:02d}",
                route_id,
                route_name,
                index,
                stage["title"],
                stage["short"],
                stage["enemyName"],
                stage["target"],
                stage["hp"],
                stage["attack"],
                stage["rounds"],
                stage["blockText"],
                stage["powerText"],
                stage["intro"],
                stage["rewardFunds"],
                stage["recover"],
                "是" if index == len(stages) else "否",
            ]
        )
    return rows


def event_rows(route, event_type, events):
    rows = []
    for event in events:
        date = event["name"].split("：", 1)[0] if re.match(r"^\d{4}-\d{2}-\d{2}", event["name"]) else ""
        rows.append(
            [
                event["id"],
                event["name"],
                event_type,
                route,
                date,
                "; ".join(f"{k}={v}" for k, v in event["effect"].items()),
            ]
        )
    return rows


tracks, traits = parse_tracks_and_traits()
normal_stages = sim.parse_stages("stages")
iphone_stages = sim.parse_stages("iphoneStages")
normal_events = sim.parse_events("specialEvents")
iphone_events = sim.parse_events("iphoneSpecialEvents")

card_rows = [["卡牌ID", "卡牌名称", "归属", "行动力消耗", "资金消耗", "效果描述"]]
for card_id, card in sim.cards.items():
    card_rows.append([card_id, card["name"], card["group"], card["cost"], card.get("fundCost", 0), card["text"]])

sheets = [
    (
        "使用说明",
        [
            ["说明项", "内容"],
            ["用途", "按当前 app.js 真实 demo 数据预填的内容编辑器表格。"],
            ["来源", str(APP)],
            ["最近用途", "同步喵喵世界观迁移后的默认参数。"],
        ],
    ),
    ("路线配置", [["路线ID", "路线名称", "路线类型", "简介", "初始时间", "初始资金", "难度系数"]] + tracks),
    ("猫群画像", [["路线ID", "路线名称", "画像ID", "画像名称", "标签", "时间修正", "资金修正", "难度修正"]] + traits),
    (
        "关卡参数",
        [
            [
                "关卡ID",
                "路线ID",
                "路线名称",
                "顺序",
                "阶段名称",
                "短名",
                "敌人名称",
                "目标名称",
                "敌人血条",
                "基础攻击",
                "回合限制",
                "阻力文案",
                "压力文案",
                "阶段简介",
                "奖励资金",
                "恢复时间",
                "是否最终关",
            ]
        ]
        + stage_rows("route_demo", "自由喵创路线", normal_stages)
        + stage_rows("route_iphone", "初代喵掌机", iphone_stages),
    ),
    ("卡牌参数", card_rows),
    (
        "事件参数",
        [["事件ID", "事件名称", "事件类型", "触发路线", "历史日期", "效果数值"]]
        + event_rows("自由喵创路线", "标准/随机事件", normal_events)
        + event_rows("初代喵掌机", "喵史时间线事件", iphone_events),
    ),
    (
        "敌人行动",
        [
            ["行动ID", "行动名称", "行动类型", "意图文本", "时间伤害", "阻力增加", "压力增加", "触发规则"],
            ["intent_attack", "关键压力", "attack", "关键压力：将扣减 base 天", "base=敌人基础攻击+压力", "", "", "按 intentIndex 循环"],
            ["intent_block", "阶段阻力", "block", "关卡 blockText +7", "", "7", "", "按 intentIndex 循环"],
            ["intent_incident", "突发问题", "attack", "突发问题：将扣减 max(1, base-1) 天", "max(1,base-1)", "", "", "按 intentIndex 循环"],
            ["intent_power", "压力上升", "power", "关卡 powerText +2", "", "", "2", "按 intentIndex 循环"],
            ["intent_final", "最终催办", "attack", "最终催办：将扣减 base+2 天", "base+2", "", "", "按 intentIndex 循环"],
        ],
    ),
    (
        "商店与重组规则",
        [
            ["规则ID", "适用路线", "规则项", "当前值", "说明"],
            ["shop_default", "通用", "可售卡牌", "尚未拥有的基础卡", "关卡之间进入商店"],
            ["deck_min", "通用", "最低出战张数", "8", "进入关卡前至少选择 8 张"],
            ["deck_limit", "通用", "出战上限", "8 + 已完成关卡数 + 事件加成", "每完成一关出战上限 +1"],
        ],
    ),
]

write_xlsx(OUT, sheets)
print(OUT)

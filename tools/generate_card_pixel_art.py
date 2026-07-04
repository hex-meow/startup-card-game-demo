from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "游戏demo" / "assets" / "card-art"
SCALE = 4
GRID = 128
SIZE = GRID * SCALE
CARD_BG = "#edf4b8"
CARD_BG_ALT = "#f3f7c7"

COLORS = {
    "outline": "#14234a",
    "deep": "#1f2d63",
    "shadow": "#283a72",
    "teal": "#1cc9c3",
    "cyan": "#72f2e9",
    "mint": "#b7ffe6",
    "green_bg": "#e8f6ad",
    "blue_bg": "#d9f3ff",
    "cream_bg": "#f7f0c7",
    "gold": "#f2b84b",
    "yellow": "#ffe27a",
    "orange": "#ef7b3f",
    "magenta": "#bc2d74",
    "violet": "#6d4bc8",
    "white": "#f8ffe8",
    "gray": "#8aa0b9",
}


def rect(draw, x, y, w, h, fill):
    draw.rectangle([x, y, x + w - 1, y + h - 1], fill=fill)


def poly(draw, pts, fill):
    draw.polygon(pts, fill=fill)


def line(draw, pts, fill, width=2):
    draw.line(pts, fill=fill, width=width)


def base(bg=CARD_BG):
    img = Image.new("RGB", (GRID, GRID), "#f7f4cf")
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([2, 2, GRID - 3, GRID - 3], radius=6, fill=CARD_BG, outline=COLORS["outline"], width=2)
    draw.rounded_rectangle([5, 5, GRID - 6, GRID - 6], radius=4, outline="#6f7b4a", width=1)
    rect(draw, GRID - 8, 14, 3, GRID - 28, "#cad681")
    rect(draw, 14, GRID - 8, GRID - 28, 3, "#cad681")
    dots = [
        (24, 20), (34, 17), (44, 22), (94, 21), (104, 28),
        (20, 36), (108, 48), (25, 92), (37, 104), (100, 94),
        (90, 108), (72, 20), (18, 70), (112, 74)
    ]
    for i, (x, y) in enumerate(dots):
        color = COLORS["teal"] if i % 3 else COLORS["gold"]
        rect(draw, x, y, 2, 2, color)
    return img, draw


def lighten(hex_color, amount):
    hex_color = hex_color.lstrip("#")
    r, g, b = [int(hex_color[i : i + 2], 16) for i in (0, 2, 4)]
    r = min(255, int(r + (255 - r) * amount))
    g = min(255, int(g + (255 - g) * amount))
    b = min(255, int(b + (255 - b) * amount))
    return f"#{r:02x}{g:02x}{b:02x}"


def save_card(name, draw_fn):
    img, draw = draw_fn()
    large = img.resize((SIZE, SIZE), Image.Resampling.NEAREST)
    path = OUT_DIR / f"{name}.png"
    large.save(path)
    return path


def draw_multitouch():
    img, d = base()
    rect(d, 26, 28, 70, 55, COLORS["outline"])
    rect(d, 31, 33, 60, 44, COLORS["deep"])
    rect(d, 36, 38, 50, 32, COLORS["teal"])
    for x in [42, 55, 68]:
        rect(d, x, 45, 8, 5, COLORS["cyan"])
        rect(d, x, 56, 8, 5, COLORS["mint"])
    rect(d, 22, 75, 16, 14, COLORS["outline"])
    rect(d, 25, 70, 11, 15, "#ffd1a6")
    rect(d, 84, 75, 16, 14, COLORS["outline"])
    rect(d, 87, 70, 11, 15, "#ffd1a6")
    line(d, [(43, 82), (54, 68), (58, 62)], COLORS["outline"], 3)
    line(d, [(80, 82), (69, 68), (65, 62)], COLORS["outline"], 3)
    return img, d


def draw_secret_room():
    img, d = base()
    for x, y, c in [(30, 52, COLORS["magenta"]), (80, 52, COLORS["violet"]), (42, 42, COLORS["teal"]), (68, 42, COLORS["deep"])]:
        rect(d, x, y + 15, 18, 25, COLORS["outline"])
        rect(d, x + 4, y, 10, 22, c)
        rect(d, x + 2, y + 7, 14, 10, COLORS["outline"])
    rect(d, 50, 58, 28, 34, COLORS["outline"])
    rect(d, 55, 63, 18, 24, COLORS["teal"])
    rect(d, 59, 69, 10, 10, COLORS["cyan"])
    rect(d, 61, 75, 6, 6, COLORS["outline"])
    line(d, [(64, 56), (64, 45)], COLORS["outline"], 3)
    rect(d, 58, 41, 12, 8, COLORS["outline"])
    rect(d, 60, 43, 8, 4, COLORS["mint"])
    return img, d


def draw_funding():
    img, d = base()
    for i, y in enumerate([80, 70, 60, 50]):
        rect(d, 28 + i * 5, y, 44, 9, COLORS["outline"])
        rect(d, 31 + i * 5, y + 2, 38, 5, COLORS["gold"])
        rect(d, 38 + i * 5, y + 2, 10, 5, COLORS["yellow"])
    rect(d, 62, 30, 42, 54, COLORS["outline"])
    rect(d, 66, 34, 34, 46, COLORS["white"])
    line(d, [(72, 46), (94, 46)], COLORS["gray"], 2)
    line(d, [(72, 56), (94, 56)], COLORS["gray"], 2)
    line(d, [(72, 66), (88, 66)], COLORS["gray"], 2)
    rect(d, 82, 70, 10, 6, COLORS["magenta"])
    line(d, [(22, 35), (30, 27), (38, 35)], COLORS["yellow"], 3)
    line(d, [(100, 22), (108, 14), (116, 22)], COLORS["yellow"], 3)
    return img, d


def draw_schedule_buffer():
    img, d = base()
    rect(d, 24, 31, 54, 60, COLORS["outline"])
    rect(d, 29, 38, 44, 48, COLORS["white"])
    rect(d, 29, 38, 44, 10, COLORS["teal"])
    for x in [36, 50, 64]:
        line(d, [(x, 54), (x, 78)], COLORS["gray"], 1)
    for y in [58, 68, 78]:
        line(d, [(34, y), (68, y)], COLORS["gray"], 1)
    poly(d, [(80, 40), (105, 49), (101, 82), (84, 99), (67, 82), (64, 49)], COLORS["outline"])
    poly(d, [(80, 46), (98, 52), (95, 78), (84, 90), (72, 78), (69, 52)], COLORS["cyan"])
    rect(d, 78, 58, 6, 18, COLORS["deep"])
    rect(d, 78, 70, 14, 5, COLORS["deep"])
    return img, d


def draw_supplier():
    img, d = base()
    rect(d, 24, 70, 30, 24, COLORS["outline"])
    rect(d, 28, 74, 22, 16, COLORS["gold"])
    rect(d, 78, 70, 30, 24, COLORS["outline"])
    rect(d, 82, 74, 22, 16, COLORS["orange"])
    line(d, [(39, 70), (39, 94)], COLORS["outline"], 2)
    line(d, [(93, 70), (93, 94)], COLORS["outline"], 2)
    rect(d, 37, 42, 26, 14, COLORS["outline"])
    rect(d, 41, 45, 20, 8, COLORS["white"])
    rect(d, 65, 45, 26, 14, COLORS["outline"])
    rect(d, 68, 48, 20, 8, COLORS["white"])
    rect(d, 55, 55, 23, 13, COLORS["outline"])
    rect(d, 58, 57, 17, 8, COLORS["gold"])
    line(d, [(30, 35), (48, 24), (65, 34)], COLORS["teal"], 3)
    line(d, [(98, 35), (82, 24), (65, 34)], COLORS["magenta"], 3)
    return img, d


def draw_marketing():
    img, d = base()
    poly(d, [(28, 55), (70, 40), (70, 76), (28, 66)], COLORS["outline"])
    poly(d, [(34, 57), (65, 47), (65, 69), (34, 63)], COLORS["cyan"])
    rect(d, 22, 58, 14, 12, COLORS["outline"])
    rect(d, 24, 60, 10, 8, COLORS["magenta"])
    rect(d, 40, 66, 10, 24, COLORS["outline"])
    rect(d, 43, 69, 5, 18, COLORS["orange"])
    for i, h in enumerate([16, 26, 38]):
        rect(d, 82 + i * 10, 84 - h, 7, h, COLORS["outline"])
        rect(d, 84 + i * 10, 86 - h, 3, h - 4, COLORS["teal"])
    for x in [77, 88, 101]:
        rect(d, x, 92, 7, 7, COLORS["outline"])
        rect(d, x + 2, 94, 3, 3, COLORS["gold"])
    line(d, [(73, 45), (86, 34)], COLORS["yellow"], 3)
    line(d, [(76, 60), (95, 60)], COLORS["yellow"], 3)
    return img, d


def draw_glass():
    img, d = base()
    poly(d, [(43, 28), (91, 40), (78, 96), (30, 84)], COLORS["outline"])
    poly(d, [(48, 34), (85, 43), (74, 89), (36, 80)], COLORS["teal"])
    poly(d, [(54, 40), (78, 46), (70, 78), (43, 73)], COLORS["cyan"])
    line(d, [(48, 35), (75, 88)], COLORS["mint"], 3)
    line(d, [(88, 26), (102, 15)], COLORS["yellow"], 2)
    line(d, [(91, 37), (109, 37)], COLORS["yellow"], 2)
    rect(d, 29, 89, 10, 8, COLORS["magenta"])
    rect(d, 76, 94, 9, 7, COLORS["magenta"])
    return img, d


def draw_webapp():
    img, d = base()
    rect(d, 34, 25, 60, 78, COLORS["outline"])
    rect(d, 39, 31, 50, 66, COLORS["deep"])
    rect(d, 43, 37, 42, 11, COLORS["cyan"])
    rect(d, 45, 55, 16, 14, COLORS["teal"])
    rect(d, 67, 55, 16, 14, COLORS["gold"])
    rect(d, 45, 75, 16, 14, COLORS["magenta"])
    rect(d, 67, 75, 16, 14, COLORS["violet"])
    for x, y, c in [(18, 44, COLORS["teal"]), (104, 44, COLORS["gold"]), (20, 86, COLORS["magenta"]), (104, 86, COLORS["violet"])]:
        rect(d, x, y, 13, 13, COLORS["outline"])
        rect(d, x + 3, y + 3, 7, 7, c)
        line(d, [(x + 13, y + 7), (39 if x < 50 else 89, 64)], COLORS["gray"], 2)
    return img, d


CARDS = [
    ("multi_touch_prototype", "多点触控原型", draw_multitouch),
    ("secret_project_room", "保密项目室", draw_secret_room),
    ("angel_funding", "天使资金", draw_funding),
    ("schedule_buffer", "排期缓冲", draw_schedule_buffer),
    ("supplier_negotiation", "供应商谈判", draw_supplier),
    ("market_launch", "市场宣发", draw_marketing),
    ("optical_glass", "光学玻璃表面", draw_glass),
    ("web_app_ecosystem", "Web App生态", draw_webapp),
]


def make_preview(paths):
    sheet = Image.new("RGB", (SIZE * 4, SIZE * 2), "#f7f4cf")
    for idx, (path, _title) in enumerate(paths):
        image = Image.open(path).convert("RGB")
        x = (idx % 4) * SIZE
        y = (idx // 4) * SIZE
        sheet.paste(image, (x, y))
    preview_path = OUT_DIR / "card_art_preview.png"
    sheet.save(preview_path)

    label_h = 44
    labeled = Image.new("RGB", (SIZE * 4, (SIZE + label_h) * 2), "#17213f")
    draw = ImageDraw.Draw(labeled)
    try:
        font = ImageFont.truetype("msyh.ttc", 24)
    except OSError:
        font = ImageFont.load_default()
    for idx, (path, title) in enumerate(paths):
        image = Image.open(path).convert("RGB")
        x = (idx % 4) * SIZE
        y = (idx // 4) * (SIZE + label_h)
        labeled.paste(image, (x, y))
        draw.text((x + 18, y + SIZE + 8), title, fill="#f8ffe8", font=font)
    labeled.save(OUT_DIR / "card_art_preview_labeled.png")
    return preview_path


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    outputs = []
    for filename, title, fn in CARDS:
        outputs.append((save_card(filename, fn), title))
    preview = make_preview(outputs)
    print(preview)
    for path, _ in outputs:
        print(path)


if __name__ == "__main__":
    main()

import random
from pathlib import Path
from PIL import Image, ImageDraw


OUT = Path("游戏demo/assets/deck-art")
SCALE = 2
BASE = 128
DETAIL_BASE = BASE * 2

NAVY = "#071026"
NAVY2 = "#182746"
BG = "#111827"
BG2 = "#1a2433"
TEAL = "#31c7bf"
TEAL2 = "#80f3e6"
TEAL3 = "#168f90"
GOLD = "#f4bb3c"
GOLD2 = "#ffe276"
ORANGE = "#db6a31"
PINK = "#bd2e75"
PURPLE = "#6948bd"
CREAM = "#fff4d0"
SKIN = "#ffc27e"
SKIN2 = "#f0a45d"
GREEN = "#76b852"
MUTED = "#8aa0b3"
WHITE = "#f8f8e7"
SHADOW = "#050914"


def R(draw, xy, fill, outline=None, width=1):
    draw.rectangle(xy, fill=fill, outline=outline, width=width)


def P(draw, pts, fill, outline=None):
    draw.polygon(pts, fill=fill, outline=outline)


def L(draw, pts, fill=NAVY, width=3):
    draw.line(pts, fill=fill, width=width, joint="curve")


def spark(draw, x, y, color=GOLD2):
    R(draw, (x, y + 2, x + 8, y + 5), color)
    R(draw, (x + 2, y, x + 5, y + 8), color)
    R(draw, (x + 3, y + 3, x + 4, y + 4), WHITE)


def dots(draw):
    return


def frame():
    img = Image.new("RGB", (BASE, BASE), BG)
    d = ImageDraw.Draw(img)
    for y in range(BASE):
        r = 17 + int(y * 0.03)
        g = 24 + int(y * 0.05)
        b = 39 + int(y * 0.08)
        d.line((0, y, BASE, y), fill=(r, g, b))
    R(d, (0, 0, 127, 127), "#0b1220")
    R(d, (4, 4, 123, 123), "#101929")
    R(d, (8, 8, 119, 119), BG)
    for y in range(10, 118):
        r = 15 + int((y - 10) * 0.03)
        g = 23 + int((y - 10) * 0.05)
        b = 38 + int((y - 10) * 0.08)
        d.line((10, y, 117, y), fill=(r, g, b))
    return img, d


def screen(draw, x=25, y=36, w=78, h=45):
    R(draw, (x + 5, y + 6, x + w + 5, y + h + 6), "#76845e")
    R(draw, (x - 2, y - 2, x + w + 2, y + h + 2), NAVY)
    R(draw, (x + 3, y + 3, x + w - 3, y + h - 3), "#164f67")
    R(draw, (x + 8, y + 8, x + w - 8, y + h - 8), "#2abcb6")
    for yy in range(y + 14, y + h - 8, 9):
        for xx in range(x + 14, x + w - 14, 12):
            R(draw, (xx, yy, xx + 6, yy + 4), "#76e2d8")
    R(draw, (x + 14, y + 12, x + 32, y + 17), TEAL2)
    R(draw, (x + 38, y + 14, x + 46, y + 19), WHITE)
    R(draw, (x + 56, y + 13, x + 66, y + 18), TEAL2)
    R(draw, (x + w // 2 - 8, y + h + 3, x + w // 2 + 8, y + h + 8), NAVY)


def hand(draw, x, y, flip=False):
    pts = [(x, y + 22), (x + 12, y + 15), (x + 22, y + 18), (x + 27, y + 32), (x + 18, y + 40), (x + 4, y + 37)]
    if flip:
        pts = [(128 - px, py) for px, py in pts]
    P(draw, pts, NAVY)
    pts2 = [(x + 3, y + 20), (x + 13, y + 16), (x + 21, y + 20), (x + 24, y + 31), (x + 17, y + 36), (x + 7, y + 34)]
    if flip:
        pts2 = [(128 - px, py) for px, py in pts2]
    P(draw, pts2, SKIN)
    fx = 128 - x - 18 if flip else x + 18
    R(draw, (fx, y + 10, fx + 7, y + 30), NAVY)
    R(draw, (fx + (1 if not flip else -1), y + 12, fx + (5 if not flip else 3), y + 28), SKIN2)
    R(draw, (x - 1 if not flip else 128 - x - 20, y + 36, x + 22 if not flip else 128 - x + 1, y + 45), NAVY2)
    R(draw, (x + 5 if not flip else 128 - x - 17, y + 36, x + 18 if not flip else 128 - x - 4, y + 41), TEAL)


def coin(draw, x, y, r=8):
    draw.ellipse((x - r - 2, y - r - 2, x + r + 2, y + r + 2), fill=NAVY)
    draw.ellipse((x - r, y - r, x + r, y + r), fill=GOLD)
    draw.ellipse((x - r + 3, y - r + 3, x + r - 3, y + r - 3), outline=GOLD2, width=2)
    R(draw, (x - 1, y - r + 4, x + 1, y + r - 4), GOLD2)


def person(draw, x, y, color=TEAL3):
    draw.ellipse((x - 6, y - 18, x + 6, y - 6), fill=NAVY)
    draw.ellipse((x - 4, y - 16, x + 4, y - 8), fill=color)
    R(draw, (x - 9, y - 7, x + 9, y + 14), NAVY)
    R(draw, (x - 6, y - 4, x + 6, y + 14), color)


def clipboard(draw, x=36, y=28):
    R(draw, (x, y + 5, x + 54, y + 73), NAVY)
    R(draw, (x + 5, y + 10, x + 49, y + 68), CREAM)
    R(draw, (x + 18, y, x + 36, y + 12), NAVY)
    R(draw, (x + 23, y + 2, x + 31, y + 8), MUTED)
    for i in range(4):
        L(draw, [(x + 18, y + 24 + i * 10), (x + 42, y + 24 + i * 10)], MUTED, 2)
    for i in range(3):
        L(draw, [(x + 9, y + 22 + i * 10), (x + 13, y + 27 + i * 10), (x + 20, y + 18 + i * 10)], TEAL3, 3)


def megaphone(draw, x=28, y=52):
    P(draw, [(x, y + 14), (x + 42, y), (x + 42, y + 30), (x, y + 18)], NAVY)
    P(draw, [(x + 5, y + 14), (x + 39, y + 5), (x + 39, y + 25), (x + 5, y + 18)], TEAL2)
    R(draw, (x - 7, y + 9, x + 6, y + 23), NAVY)
    R(draw, (x - 5, y + 11, x + 4, y + 21), PINK)
    R(draw, (x + 20, y + 27, x + 30, y + 49), NAVY)
    R(draw, (x + 22, y + 27, x + 28, y + 45), ORANGE)
    for i in range(4):
        R(draw, (x + 52 + i * 9, y + 28 - i * 9, x + 56 + i * 9, y + 34 - i * 9), TEAL3)


def draw_icon(kind, card_id):
    img, d = frame()
    dots(d)
    if kind == "engineer":
        screen(d, 25, 38, 78, 42)
        R(d, (45, 55, 50, 60), CREAM)
        R(d, (58, 55, 63, 60), CREAM)
        L(d, [(42, 87), (86, 87)], NAVY, 5)
    elif kind == "product":
        clipboard(d, 38, 27)
        L(d, [(40, 82), (54, 70), (66, 76), (82, 56)], TEAL, 4)
        spark(d, 83, 48)
    elif kind == "designer":
        screen(d, 30, 34, 68, 44)
        P(d, [(50, 88), (82, 58), (90, 66), (58, 96)], NAVY)
        P(d, [(55, 86), (82, 61), (87, 66), (60, 92)], TEAL2)
        R(d, (78, 57, 91, 70), PINK)
    elif kind == "sales":
        megaphone(d, 28, 48)
        for x, c in [(35, TEAL3), (50, PURPLE), (65, PINK), (80, TEAL3)]:
            person(d, x, 101, c)
    elif kind == "supply":
        for x, y, c in [(26, 82, GOLD), (43, 82, GOLD), (84, 82, ORANGE), (101, 82, ORANGE), (34, 66, "#9b6a32"), (92, 66, "#9b6a32")]:
            R(d, (x, y, x + 16, y + 14), NAVY)
            R(d, (x + 2, y + 2, x + 14, y + 12), c)
        hand(d, 24, 44, False)
        hand(d, 54, 44, True)
    elif kind == "legal":
        R(d, (43, 39, 86, 89), NAVY)
        R(d, (47, 43, 82, 85), CREAM)
        for y in [55, 66, 77]:
            L(d, [(53, y), (76, y)], MUTED, 2)
        L(d, [(64, 31), (64, 96)], NAVY, 3)
        L(d, [(45, 50), (83, 50)], NAVY, 3)
        P(d, [(42, 50), (32, 72), (52, 72)], TEAL3)
        P(d, [(86, 50), (76, 72), (96, 72)], TEAL3)
    elif kind == "tech":
        R(d, (46, 38, 56, 78), NAVY)
        R(d, (51, 33, 76, 43), NAVY)
        R(d, (56, 37, 72, 41), TEAL2)
        R(d, (58, 72, 82, 80), NAVY)
        L(d, [(68, 78), (88, 98)], NAVY, 5)
        R(d, (37, 92, 93, 100), NAVY)
        R(d, (50, 52, 61, 64), TEAL)
        spark(d, 82, 35)
    elif kind == "architecture":
        for x, y, w, h, c in [(28, 70, 22, 26, TEAL), (53, 56, 22, 40, TEAL3), (78, 42, 22, 54, NAVY2)]:
            R(d, (x, y, x + w, y + h), NAVY)
            R(d, (x + 4, y + 5, x + w - 4, y + 13), c)
            R(d, (x + 4, y + 18, x + w - 4, y + 21), MUTED)
        L(d, [(32, 36), (96, 36)], TEAL2, 4)
    elif kind == "data":
        R(d, (29, 37, 83, 88), NAVY)
        R(d, (34, 42, 78, 83), CREAM)
        for i, h in enumerate([11, 22, 34]):
            R(d, (43 + i * 12, 76 - h, 51 + i * 12, 78), [TEAL, GOLD, PINK][i])
        d.ellipse((70, 70, 102, 102), outline=NAVY, width=5)
        d.ellipse((75, 75, 97, 97), outline=TEAL2, width=4)
        L(d, [(94, 96), (106, 108)], NAVY, 5)
    elif kind == "automation":
        for x in [48, 70]:
            draw_gear(d, x, 61, 15, TEAL if x == 48 else GOLD)
        R(d, (41, 88, 87, 99), NAVY)
        R(d, (48, 91, 80, 96), MUTED)
        L(d, [(31, 44), (42, 54), (51, 50)], TEAL2, 4)
    elif kind == "angel":
        for x, y in [(36, 69), (49, 59), (63, 72), (78, 60)]:
            coin(d, x, y, 8)
        R(d, (61, 38, 99, 83), NAVY)
        R(d, (65, 42, 95, 79), CREAM)
        spark(d, 48, 31)
    elif kind == "lean":
        R(d, (32, 48, 72, 86), NAVY)
        R(d, (36, 52, 68, 82), "#f79a55")
        d.ellipse((55, 42, 98, 82), fill=NAVY)
        d.ellipse((59, 46, 94, 78), fill=PINK)
        R(d, (86, 54, 99, 62), NAVY)
        R(d, (88, 56, 96, 60), PINK)
        coin(d, 44, 91, 7)
    elif kind == "outsourcing":
        screen(d, 25, 50, 42, 30)
        d.ellipse((62, 41, 102, 81), fill=NAVY)
        d.ellipse((66, 45, 98, 77), fill=TEAL3)
        L(d, [(66, 61), (98, 61)], TEAL2, 2)
        L(d, [(82, 45), (82, 77)], TEAL2, 2)
        L(d, [(74, 47), (90, 75)], TEAL2, 2)
        spark(d, 92, 35)
    elif kind == "runway":
        R(d, (29, 33, 83, 87), NAVY)
        R(d, (34, 39, 78, 82), CREAM)
        R(d, (34, 39, 78, 51), PINK)
        for x in [43, 57, 71]:
            R(d, (x, 28, x + 5, 43), NAVY)
        draw_hourglass(d, 84, 57)
    elif kind == "schedule":
        R(d, (30, 33, 88, 88), NAVY)
        R(d, (35, 40, 83, 83), CREAM)
        R(d, (35, 40, 83, 52), PINK)
        for x in range(42, 77, 11):
            for y in range(58, 78, 10):
                R(d, (x, y, x + 5, y + 5), TEAL)
        draw_clock(d, 87, 79)
    elif kind == "cut":
        L(d, [(36, 42), (88, 94)], NAVY, 6)
        L(d, [(88, 42), (36, 94)], NAVY, 6)
        d.ellipse((25, 31, 47, 53), outline=TEAL, width=5)
        d.ellipse((81, 31, 103, 53), outline=PINK, width=5)
        R(d, (52, 59, 76, 77), GOLD)
        R(d, (28, 90, 100, 98), NAVY)
    elif kind == "mentor":
        R(d, (36, 48, 65, 91), NAVY)
        R(d, (40, 52, 62, 87), CREAM)
        R(d, (66, 48, 95, 91), NAVY)
        R(d, (69, 52, 91, 87), CREAM)
        spark(d, 58, 27)
        spark(d, 78, 34, TEAL2)
    elif kind == "overtime":
        d.ellipse((33, 31, 76, 74), fill=NAVY)
        d.ellipse((45, 27, 84, 66), fill=BG)
        R(d, (68, 72, 92, 91), NAVY)
        R(d, (71, 75, 89, 88), CREAM)
        R(d, (90, 78, 102, 85), NAVY)
        L(d, [(42, 90), (63, 90)], TEAL, 4)
    elif kind == "alignment":
        for x, y, c in [(38, 48, TEAL), (82, 48, GOLD), (60, 82, PINK)]:
            draw_node(d, x, y, c)
        L(d, [(48, 52), (72, 52)], NAVY, 4)
        L(d, [(43, 59), (55, 74)], NAVY, 4)
        L(d, [(78, 59), (65, 74)], NAVY, 4)
    elif kind == "crowd":
        for x, c in [(36, TEAL3), (50, PURPLE), (64, PINK), (78, TEAL), (92, ORANGE)]:
            person(d, x, 96, c)
        coin(d, 64, 49, 13)
    elif kind == "touch":
        screen(d, 25, 36, 78, 45)
        hand(d, 22, 64, False)
        hand(d, 59, 64, True)
        d.ellipse((43, 63, 57, 77), outline=TEAL2, width=4)
        d.ellipse((72, 63, 86, 77), outline=TEAL2, width=4)
    elif kind == "lock_group":
        for x, c in [(39, TEAL3), (64, NAVY2), (89, PINK)]:
            person(d, x, 93, c)
        R(d, (48, 55, 80, 88), NAVY)
        R(d, (53, 61, 75, 84), TEAL)
        d.arc((53, 40, 75, 68), 180, 360, fill=NAVY, width=5)
        R(d, (62, 70, 66, 78), NAVY)
    elif kind == "monitor":
        screen(d, 28, 37, 72, 45)
        R(d, (44, 88, 84, 96), NAVY)
        R(d, (56, 75, 72, 80), GOLD)
        L(d, [(45, 52), (56, 63), (45, 74)], CREAM, 4)
    elif kind == "deal":
        hand(d, 22, 51, False)
        hand(d, 58, 51, True)
        R(d, (30, 91, 50, 104), "#8b5a2b")
        R(d, (78, 91, 98, 104), "#8b5a2b")
        L(d, [(95, 38), (95, 80)], NAVY, 4)
        for r in [11, 18, 25]:
            d.arc((95 - r, 44 - r, 95 + r, 44 + r), 300, 40, fill=TEAL2, width=2)
    elif kind == "voicemail":
        R(d, (34, 45, 94, 82), NAVY)
        R(d, (39, 50, 89, 77), CREAM)
        d.ellipse((48, 57, 64, 73), outline=TEAL, width=5)
        d.ellipse((66, 57, 82, 73), outline=TEAL, width=5)
        L(d, [(56, 73), (74, 73)], TEAL, 4)
    elif kind == "glass":
        P(d, [(49, 30), (92, 44), (78, 101), (35, 88)], NAVY)
        P(d, [(52, 36), (86, 47), (75, 94), (41, 84)], TEAL)
        L(d, [(63, 40), (76, 90)], TEAL2, 4)
        spark(d, 86, 35)
    elif kind == "battery":
        R(d, (31, 48, 92, 77), NAVY)
        R(d, (36, 53, 83, 72), CREAM)
        R(d, (93, 57, 101, 68), NAVY)
        R(d, (39, 56, 74, 69), TEAL)
        R(d, (37, 86, 91, 93), GREEN)
    elif kind == "browser":
        R(d, (31, 35, 95, 92), NAVY)
        R(d, (36, 45, 90, 87), CREAM)
        R(d, (36, 40, 90, 48), TEAL)
        d.ellipse((51, 52, 83, 84), outline=NAVY, width=4)
        P(d, [(67, 56), (73, 73), (58, 68)], ORANGE, NAVY)
    elif kind == "stage":
        R(d, (28, 49, 100, 91), NAVY)
        R(d, (34, 55, 94, 85), "#293964")
        R(d, (52, 67, 76, 85), TEAL)
        R(d, (41, 42, 87, 49), GOLD)
        spark(d, 91, 35)
    elif kind == "dashboard":
        screen(d, 28, 38, 72, 45)
        for x, h, c in [(45, 14, TEAL), (60, 23, GOLD), (75, 31, PINK)]:
            R(d, (x, 86 - h, x + 7, 86), c)
        for x in [44, 61, 78]:
            R(d, (x, 94, x + 6, 100), GOLD)
    elif kind == "antenna":
        R(d, (52, 82, 76, 95), NAVY)
        L(d, [(64, 82), (64, 47)], NAVY, 5)
        for r in [15, 27, 39]:
            d.arc((64 - r, 47 - r, 64 + r, 47 + r), 300, 60, fill=TEAL2, width=3)
        R(d, (57, 40, 71, 52), PINK)
    elif kind == "chip":
        R(d, (38, 40, 90, 88), NAVY)
        R(d, (45, 47, 83, 81), TEAL3)
        R(d, (55, 57, 73, 73), TEAL2)
        for x in [30, 94]:
            for y in range(48, 83, 9):
                R(d, (x, y, x + 8, y + 4), GOLD)
        coin(d, 88, 88, 8)
    elif kind == "silos":
        R(d, (24, 43, 53, 91), NAVY)
        R(d, (28, 48, 49, 86), TEAL3)
        R(d, (75, 43, 104, 91), NAVY)
        R(d, (79, 48, 100, 86), PINK)
        L(d, [(58, 33), (58, 100)], NAVY, 4)
        L(d, [(69, 33), (69, 100)], NAVY, 4)
    elif kind == "ecosystem":
        R(d, (52, 39, 82, 88), NAVY)
        R(d, (57, 44, 77, 83), CREAM)
        for x, y, c in [(29, 35, TEAL), (98, 38, PINK), (30, 94, GOLD), (98, 92, GREEN)]:
            R(d, (x, y, x + 17, y + 17), NAVY)
            R(d, (x + 4, y + 4, x + 13, y + 13), c)
            L(d, [(x + 17, y + 8), (64, 63)], NAVY, 2)
    elif kind == "sync":
        screen(d, 31, 38, 66, 38)
        L(d, [(42, 88), (83, 88)], TEAL, 5)
        P(d, [(84, 88), (73, 80), (73, 96)], TEAL)
        L(d, [(86, 31), (45, 31)], GOLD, 5)
        P(d, [(44, 31), (55, 23), (55, 39)], GOLD)
        R(d, (60, 53, 70, 69), PINK)
    elif kind == "retail":
        R(d, (28, 48, 100, 94), NAVY)
        R(d, (34, 57, 94, 89), CREAM)
        R(d, (31, 39, 97, 56), PINK)
        R(d, (50, 68, 65, 89), TEAL)
        for x in [72, 84]:
            person(d, x, 101, GOLD if x == 72 else TEAL3)
    elif kind == "review":
        R(d, (33, 37, 91, 91), NAVY)
        R(d, (38, 42, 86, 86), CREAM)
        R(d, (43, 49, 61, 64), TEAL)
        for y in [51, 61, 72, 80]:
            L(d, [(66, y), (81, y)], MUTED, 2)
        spark(d, 78, 31)
    elif kind == "activation":
        clipboard(d, 37, 28)
        R(d, (81, 77, 101, 89), NAVY)
        R(d, (84, 80, 98, 86), TEAL)
        L(d, [(91, 77), (91, 67), (100, 67)], NAVY, 4)
    elif kind == "manual":
        R(d, (35, 39, 86, 92), NAVY)
        R(d, (40, 44, 81, 87), CREAM)
        for y in [55, 64, 73]:
            L(d, [(49, y), (72, y)], MUTED, 2)
        L(d, [(31, 35), (93, 97)], PINK, 6)
        L(d, [(93, 35), (31, 97)], PINK, 6)
    else:
        screen(d)
    return polish(fit_subject(img), card_id)


def draw_gear(draw, x, y, r, color):
    for dx, dy in [(-r, 0), (r, 0), (0, -r), (0, r), (-10, -10), (10, -10), (-10, 10), (10, 10)]:
        R(draw, (x + dx - 3, y + dy - 3, x + dx + 3, y + dy + 3), NAVY)
    draw.ellipse((x - r, y - r, x + r, y + r), fill=NAVY)
    draw.ellipse((x - r + 4, y - r + 4, x + r - 4, y + r - 4), fill=color)
    draw.ellipse((x - 5, y - 5, x + 5, y + 5), fill=NAVY)


def draw_hourglass(draw, x, y):
    R(draw, (x - 13, y - 24, x + 13, y + 24), NAVY)
    R(draw, (x - 8, y - 19, x + 8, y + 19), CREAM)
    P(draw, [(x - 8, y - 19), (x + 8, y - 19), (x, y - 3)], TEAL)
    P(draw, [(x, y + 3), (x - 8, y + 19), (x + 8, y + 19)], GOLD)


def draw_clock(draw, x, y):
    draw.ellipse((x - 18, y - 18, x + 18, y + 18), fill=NAVY)
    draw.ellipse((x - 13, y - 13, x + 13, y + 13), fill=CREAM)
    L(draw, [(x, y), (x, y - 8), (x + 8, y)], NAVY, 3)


def draw_node(draw, x, y, c):
    draw.ellipse((x - 11, y - 11, x + 11, y + 11), fill=NAVY)
    draw.ellipse((x - 7, y - 7, x + 7, y + 7), fill=c)


def is_subject_pixel(pixel):
    r, g, b = pixel
    if r < 35 and g < 45 and b < 60:
        return False
    if abs(r - 17) < 8 and abs(g - 24) < 10 and abs(b - 39) < 14:
        return False
    if abs(r - 26) < 10 and abs(g - 36) < 12 and abs(b - 51) < 16:
        return False
    return True


def lighten(pixel, amount):
    r, g, b = pixel
    return (min(255, r + amount), min(255, g + amount), min(255, b + amount))


def darken(pixel, amount):
    r, g, b = pixel
    return (max(0, r - amount), max(0, g - amount), max(0, b - amount))


def fit_subject(img):
    px = img.load()
    points = [
        (x, y)
        for y in range(BASE)
        for x in range(BASE)
        if is_subject_pixel(px[x, y])
    ]
    if not points:
        return img

    min_x = max(0, min(x for x, _ in points) - 3)
    max_x = min(BASE - 1, max(x for x, _ in points) + 3)
    min_y = max(0, min(y for _, y in points) - 3)
    max_y = min(BASE - 1, max(y for _, y in points) + 3)
    width = max_x - min_x + 1
    height = max_y - min_y + 1
    if width <= 0 or height <= 0:
        return img

    scale = min(98 / width, 94 / height, 1.75)
    if scale <= 1.03:
        return img

    crop = img.crop((min_x, min_y, max_x + 1, max_y + 1))
    new_size = (max(1, int(width * scale)), max(1, int(height * scale)))
    crop = crop.resize(new_size, Image.Resampling.NEAREST)
    new_img, _ = frame()
    x = (BASE - new_size[0]) // 2
    y = (BASE - new_size[1]) // 2 + 3
    new_img.paste(crop, (x, y))
    return new_img


def polish(img, card_id):
    img = img.resize((DETAIL_BASE, DETAIL_BASE), Image.Resampling.NEAREST)
    d = ImageDraw.Draw(img)
    px = img.load()
    width, height = img.size

    # Drop shadow belongs to the object silhouette, not the background.
    subject_points = []
    for y in range(12, height - 12, 2):
        for x in range(12, width - 12, 2):
            if is_subject_pixel(px[x, y]):
                subject_points.append((x, y))

    for x, y in reversed(subject_points):
        sx = min(width - 3, x + 8)
        sy = min(height - 3, y + 8)
        if not is_subject_pixel(px[sx, sy]):
            d.rectangle((sx, sy, sx + 3, sy + 3), fill="#050914")

    # Structured pixel shading: top-left planes get highlights, lower-right planes get shade.
    for x, y in subject_points:
        pixel = px[x, y]
        if x % 16 in (0, 2) and y % 20 in (4, 6, 8):
            d.rectangle((x, y, x + 5, y + 1), fill=lighten(pixel, 38))
        elif x % 18 in (10, 12) and y % 18 in (12, 14):
            d.rectangle((x + 2, y + 2, x + 5, y + 5), fill=darken(pixel, 34))

        if not is_subject_pixel(px[min(width - 1, x + 6), y]) or not is_subject_pixel(px[x, min(height - 1, y + 6)]):
            d.rectangle((x + 3, y + 3, x + 5, y + 5), fill=darken(pixel, 46))

    # Crisp top-left rim highlights on exposed subject edges.
    for x, y in subject_points:
        if not is_subject_pixel(px[max(0, x - 6), y]) or not is_subject_pixel(px[x, max(0, y - 6)]):
            pixel = px[x, y]
            d.rectangle((x, y, x + 3, y + 1), fill=lighten(pixel, 42))

    return img.resize((DETAIL_BASE * SCALE, DETAIL_BASE * SCALE), Image.Resampling.NEAREST)


CARD_KINDS = {
    "engineer": "engineer",
    "productManager": "product",
    "designer": "designer",
    "salesPartner": "sales",
    "supplyExpert": "supply",
    "legalAdvisor": "legal",
    "techResearch": "tech",
    "architecture": "architecture",
    "dataInsight": "data",
    "automation": "automation",
    "angelFunding": "angel",
    "leanBudget": "lean",
    "outsourcing": "outsourcing",
    "runway": "runway",
    "scheduleBuffer": "schedule",
    "cutScope": "cut",
    "mentor": "mentor",
    "overtime": "overtime",
    "alignment": "alignment",
    "crowdfunding": "crowd",
    "multiTouchDemo": "touch",
    "purpleRoom": "lock_group",
    "osxPort": "monitor",
    "cingularDeal": "deal",
    "visualVoicemail": "voicemail",
    "glassSurface": "glass",
    "batteryBoost": "battery",
    "safariBrowser": "browser",
    "keynoteRehearsal": "stage",
    "goldenPath": "runway",
    "fakeDataRig": "dashboard",
    "radioLab": "antenna",
    "armChipBudget": "chip",
    "secrecySilos": "silos",
    "webAppPitch": "ecosystem",
    "itunesSync": "sync",
    "retailLaunch": "retail",
    "reviewSeeding": "review",
    "activationPrep": "activation",
    "noManualDesign": "manual",
    "demoMvp": "product",
    "demoPrototype": "designer",
    "demoUserInterview": "crowd",
    "investorDeck": "angel",
    "termSheet": "legal",
    "leadInvestor": "angel",
    "devQa": "dashboard",
    "devBeta": "monitor",
    "devRefactor": "architecture",
    "supplierAudit": "supply",
    "supplierBackup": "supply",
    "supplierCredit": "deal",
    "massQc": "legal",
    "massLine": "architecture",
    "massForecast": "data",
    "launchKol": "sales",
    "launchPress": "review",
    "launchCommunity": "crowd",
    "iphoneFingerFirst": "touch",
    "iphoneNoKeyboard": "manual",
    "iphonePurpleSprint": "lock_group",
    "iphoneCarrierControl": "deal",
    "iphoneVisualVoicemailDeal": "voicemail",
    "iphoneRevenueShare": "angel",
    "iphoneSpringboard": "ecosystem",
    "iphoneTouchKeyboard": "touch",
    "iphoneMemoryDiet": "dashboard",
    "iphoneCorningCall": "glass",
    "iphoneBatteryChart": "battery",
    "iphoneRfChamber": "antenna",
    "iphoneThreeDevices": "sync",
    "iphoneDemoReset": "stage",
    "iphonePressShock": "review",
    "iphoneSafariSdk": "browser",
    "iphoneWeb2Pitch": "ecosystem",
    "iphoneActivationDryRun": "activation",
}


def make_preview(files):
    cols = 8
    thumb = 160
    gap = 12
    rows = (len(files) + cols - 1) // cols
    img = Image.new("RGB", (cols * thumb + (cols + 1) * gap, rows * thumb + (rows + 1) * gap), "#0f1730")
    for i, path in enumerate(files):
        x = gap + (i % cols) * (thumb + gap)
        y = gap + (i // cols) * (thumb + gap)
        icon = Image.open(path).resize((thumb, thumb), Image.Resampling.NEAREST)
        img.paste(icon, (x, y))
    img.save(OUT / "deck_art_preview.png")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    files = []
    for card_id, kind in CARD_KINDS.items():
        path = OUT / f"{card_id}.png"
        draw_icon(kind, card_id).save(path, optimize=True)
        files.append(path)
    make_preview(files)
    print(f"generated {len(files)} deck art images in {OUT}")


if __name__ == "__main__":
    main()

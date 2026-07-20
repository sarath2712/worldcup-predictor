from io import BytesIO
from pathlib import Path

from PIL import Image
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "downloads" / "hall-of-champions.pdf"
W, H = A4

NAVY = HexColor("#071225")
PANEL = HexColor("#101f38")
PANEL_2 = HexColor("#142742")
GOLD = HexColor("#fbbf24")
AMBER = HexColor("#f59e0b")
MUTED = HexColor("#aab5c6")
BLUE = HexColor("#60a5fa")
GREEN = HexColor("#34d399")
PINK = HexColor("#f472b6")
TEAL = HexColor("#2dd4bf")
SILVER = HexColor("#d1d5db")


def page_background(pdf):
    pdf.setFillColor(NAVY)
    pdf.rect(0, 0, W, H, fill=1, stroke=0)
    pdf.setFillColor(HexColor("#0b2b27"))
    pdf.circle(W + 35, -20, 180, fill=1, stroke=0)
    pdf.setFillColor(HexColor("#10203a"))
    pdf.circle(-45, H + 15, 150, fill=1, stroke=0)


def footer(pdf, page):
    pdf.setStrokeColor(HexColor("#243650"))
    pdf.line(36, 28, W - 36, 28)
    pdf.setFont("Helvetica", 8)
    pdf.setFillColor(MUTED)
    pdf.drawString(36, 15, "FIFA WC 2026 - Sobha Lake Gardens")
    pdf.drawRightString(W - 36, 15, f"Hall of Champions | {page}")


def heading(pdf, eyebrow, title, y):
    pdf.setFillColor(GOLD)
    pdf.setFont("Helvetica-Bold", 9)
    pdf.drawString(38, y, eyebrow.upper())
    pdf.setFillColor(white)
    pdf.setFont("Helvetica-Bold", 24)
    pdf.drawString(38, y - 30, title)
    return y - 48


def cover_image(path, width, height, y_focus=0.5):
    image = Image.open(path).convert("RGB")
    source_ratio = image.width / image.height
    target_ratio = width / height
    if source_ratio > target_ratio:
        crop_width = int(image.height * target_ratio)
        left = (image.width - crop_width) // 2
        image = image.crop((left, 0, left + crop_width, image.height))
    else:
        crop_height = int(image.width / target_ratio)
        top = int((image.height - crop_height) * y_focus)
        top = max(0, min(top, image.height - crop_height))
        image = image.crop((0, top, image.width, top + crop_height))
    image.thumbnail((int(width * 2), int(height * 2)), Image.Resampling.LANCZOS)
    buffer = BytesIO()
    image.save(buffer, format="JPEG", quality=88, optimize=True)
    buffer.seek(0)
    return ImageReader(buffer)


def winner_card(pdf, x, y, width, height, winner):
    pdf.setFillColor(PANEL)
    pdf.roundRect(x, y, width, height, 12, fill=1, stroke=0)
    pdf.setFillColor(winner["color"])
    pdf.roundRect(x, y + height - 5, width, 5, 2, fill=1, stroke=0)

    image_h = height - 70
    image = cover_image(
        ROOT / winner["image"],
        width,
        image_h,
        winner.get("focus", 0.5),
    )
    pdf.drawImage(image, x, y + 70, width, image_h, mask="auto")

    pdf.setFillColor(winner["color"])
    pdf.roundRect(x + 10, y + height - 27, 28, 17, 8, fill=1, stroke=0)
    pdf.setFillColor(NAVY)
    pdf.setFont("Helvetica-Bold", 9)
    pdf.drawCentredString(x + 24, y + height - 22, winner["badge"])

    pdf.setFillColor(GOLD)
    pdf.setFont("Helvetica-Bold", 7.5)
    pdf.drawString(x + 12, y + 51, winner["competition"].upper())
    pdf.setFillColor(white)
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(x + 12, y + 33, winner["name"])
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 8.5)
    pdf.drawString(x + 12, y + 18, f'{winner["place"]} | Flat {winner["flat"]}')
    pdf.drawRightString(x + width - 12, y + 18, winner["detail"])


def team_panel(pdf, x, y, width, title, team, runner_up, players, color):
    row_h = 28
    columns = 2 if len(players) > 5 else 1
    rows = (len(players) + columns - 1) // columns
    height = 78 + rows * row_h
    pdf.setFillColor(PANEL)
    pdf.roundRect(x, y - height, width, height, 14, fill=1, stroke=0)
    pdf.setFillColor(color)
    pdf.roundRect(x, y - 5, width, 5, 2, fill=1, stroke=0)

    pdf.setFillColor(white)
    pdf.setFont("Helvetica-Bold", 17)
    pdf.drawString(x + 18, y - 32, title)
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 9)
    pdf.drawString(x + 18, y - 49, f"{team} - Champions")
    pdf.drawRightString(x + width - 18, y - 49, f"Runner-up: {runner_up}")

    col_w = (width - 36) / columns
    for index, (name, flat, role) in enumerate(players):
        col = index // rows
        row = index % rows
        px = x + 18 + col * col_w
        py = y - 73 - row * row_h
        pdf.setFillColor(PANEL_2)
        pdf.roundRect(px, py - 17, col_w - 8, 23, 6, fill=1, stroke=0)
        pdf.setFillColor(white)
        pdf.setFont("Helvetica-Bold", 8.5)
        pdf.drawString(px + 8, py - 7, name + (" (C)" if role else ""))
        pdf.setFillColor(MUTED)
        pdf.setFont("Helvetica", 8)
        pdf.drawRightString(px + col_w - 16, py - 7, f"Flat {flat}")
    return y - height


prediction = [
    {
        "name": "Mahesh Tirupati",
        "flat": "2063",
        "competition": "Prediction Contest",
        "place": "Champion",
        "detail": "8,523 points",
        "image": "public/winners/mahesh-tirupati.webp",
        "focus": 0.55,
        "badge": "1st",
        "color": GOLD,
    },
    {
        "name": "Arjun",
        "flat": "5182",
        "competition": "Prediction Contest",
        "place": "Runner-up",
        "detail": "7,836 points",
        "image": "public/winners/arjun.webp",
        "focus": 0.42,
        "badge": "2nd",
        "color": SILVER,
    },
]

fc26 = [
    {
        "name": "Pikanshu Kumar",
        "flat": "7082",
        "competition": "PlayStation FC26",
        "place": "Champion",
        "detail": "Final 6-2",
        "image": "public/winners/pikanshu.webp",
        "badge": "1st",
        "color": GOLD,
    },
    {
        "name": "Kshiraj Nair",
        "flat": "8062",
        "competition": "PlayStation FC26",
        "place": "Runner-up",
        "detail": "Finalist",
        "image": "public/winners/kshiraj.webp",
        "badge": "2nd",
        "color": SILVER,
    },
]

mens = [
    ("Kshiraj Nair", "8062", "Captain"),
    ("Rohan", "5154", ""),
    ("Kishor", "1067", ""),
    ("Sriram S", "7131", ""),
    ("Jay Patel", "2132", ""),
]

kids = [
    ("Aaradhya Rawat", "7062", "Captain"),
    ("Antonio Rishon", "L-6063", ""),
    ("Priyanshu", "8003", ""),
    ("Hreyansh", "5183", ""),
    ("Aaron Bennett", "L-6063", ""),
    ("Uddeshya", "5143", ""),
    ("Magizhan Ganeshan", "3143", ""),
    ("Surya Raj", "2152", ""),
    ("Krishna", "-", ""),
]

womens = [
    ("Preemy Wilson", "6152", "Captain"),
    ("Srilakshmi", "-", ""),
    ("Tanya", "5181", ""),
    ("Reshma", "4072", ""),
    ("Aiswarya", "4032", ""),
]


def generate():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(OUTPUT), pagesize=A4)
    pdf.setTitle("FIFA WC 2026 - Hall of Champions")
    pdf.setAuthor("Sobha Lake Gardens")

    # Cover
    page_background(pdf)
    pdf.setFillColor(GOLD)
    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawCentredString(W / 2, H - 160, "FIFA WC 2026")
    pdf.setFillColor(white)
    pdf.setFont("Helvetica-Bold", 38)
    pdf.drawCentredString(W / 2, H - 215, "HALL OF CHAMPIONS")
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 15)
    pdf.drawCentredString(W / 2, H - 247, "Sobha Lake Gardens")
    pdf.setStrokeColor(GOLD)
    pdf.setLineWidth(2)
    pdf.line(W / 2 - 75, H - 273, W / 2 + 75, H - 273)
    pdf.setFillColor(PANEL)
    pdf.roundRect(65, 275, W - 130, 175, 18, fill=1, stroke=0)
    pdf.setFillColor(white)
    pdf.setFont("Helvetica-Bold", 20)
    pdf.drawCentredString(W / 2, 410, "Celebrating Our Community")
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 11)
    lines = [
        "Prediction talent. FC26 skill. Football teamwork.",
        "Creative expression. One unforgettable celebration.",
        "",
        "Congratulations to every champion, runner-up,",
        "participant, volunteer, and supporter.",
    ]
    for index, line in enumerate(lines):
        pdf.drawCentredString(W / 2, 380 - index * 20, line)
    footer(pdf, 1)
    pdf.showPage()

    # Prediction
    page_background(pdf)
    y = heading(pdf, "World Cup Prediction Contest", "Prediction Champions", H - 55)
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 9.5)
    pdf.drawString(38, y, "A tournament-long test of football knowledge, match forecasting, and prediction skill.")
    card_w = 225
    card_h = 560
    winner_card(pdf, 55, 70, card_w, card_h, prediction[0])
    winner_card(pdf, W - 55 - card_w, 70, card_w, card_h, prediction[1])
    footer(pdf, 2)
    pdf.showPage()

    # FC26
    page_background(pdf)
    y = heading(pdf, "PlayStation Tournament", "FC26 Champions", H - 55)
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 9.5)
    pdf.drawString(38, y, "Thirty-three players battled through a complete knockout bracket to reach the grand final.")
    winner_card(pdf, 55, 70, card_w, card_h, fc26[0])
    winner_card(pdf, W - 55 - card_w, 70, card_w, card_h, fc26[1])
    footer(pdf, 3)
    pdf.showPage()

    # Caricature
    page_background(pdf)
    y = heading(pdf, "Creative Competition", "Caricature Contest Champion", H - 55)
    portrait = cover_image(ROOT / "public/winners/pavan-itagi.webp", 230, 305, 0.4)
    pdf.setFillColor(PANEL)
    pdf.roundRect(38, 305, W - 76, 430, 16, fill=1, stroke=0)
    pdf.drawImage(portrait, 56, 385, 230, 305, mask="auto")
    pdf.setFillColor(TEAL)
    pdf.setFont("Helvetica-Bold", 9)
    pdf.drawString(315, 650, "CARICATURE CONTEST")
    pdf.setFillColor(white)
    pdf.setFont("Helvetica-Bold", 28)
    pdf.drawString(315, 612, "Pavan Itagi")
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(315, 587, "Champion | Flat 8043")
    pdf.setFont("Helvetica", 10)
    text = pdf.beginText(315, 545)
    text.setLeading(17)
    text.textLine("The community's winning")
    text.textLine("caricature secured first place")
    text.textLine("with 9 votes.")
    text.textLine("")
    text.textLine("Runner-up:")
    text.textLine("Kirti Bagga | Flat 6043")
    text.textLine("8 votes")
    pdf.drawText(text)
    footer(pdf, 4)
    pdf.showPage()

    # Men's and Kids'
    page_background(pdf)
    y = heading(pdf, "Community Football", "Championship Teams", H - 55)
    y = team_panel(pdf, 38, y, W - 76, "Men's Football Champions", "Team 2", "Team 4", mens, BLUE) - 22
    team_panel(pdf, 38, y, W - 76, "Kids' Football Champions", "Team 3", "Team 4", kids, GREEN)
    footer(pdf, 5)
    pdf.showPage()

    # Women's and closing
    page_background(pdf)
    y = heading(pdf, "Community Football", "Women's Football Champions", H - 55)
    y = team_panel(pdf, 38, y, W - 76, "Women's Football Champions", "Team 1", "Team 2", womens, PINK)
    pdf.setFillColor(PANEL)
    pdf.roundRect(38, 185, W - 76, 190, 16, fill=1, stroke=0)
    pdf.setFillColor(GOLD)
    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawCentredString(W / 2, 335, "CONGRATULATIONS")
    pdf.setFillColor(white)
    pdf.setFont("Helvetica-Bold", 22)
    pdf.drawCentredString(W / 2, 300, "To All Our Champions")
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 10.5)
    closing = [
        "Thank you to every participant and volunteer who made",
        "the FIFA WC 2026 celebration a memorable community event.",
        "",
        "www.slgevents.in/hall-of-champions",
    ]
    for index, line in enumerate(closing):
        pdf.drawCentredString(W / 2, 265 - index * 20, line)
    footer(pdf, 6)
    pdf.save()


if __name__ == "__main__":
    generate()
    print(OUTPUT)

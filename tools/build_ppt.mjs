import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "outputs");
const QA_DIR = path.join(OUT_DIR, "pptx_render");
const PPTX_PATH = path.join(OUT_DIR, "创业故事卡牌_项目介绍与玩法说明.pptx");
const ARTIFACT_TOOL_ENTRY =
  process.env.ARTIFACT_TOOL_ENTRY ||
  "C:/Users/a4631/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const { Presentation, PresentationFile } = await import(pathToFileURL(ARTIFACT_TOOL_ENTRY).href);

const W = 1280;
const H = 720;
const ink = "#000000";
const muted = "#555555";
const panel = "#EDEDED";
const rule = "#B8BCC4";
const highlight = "#FF6B35";
const font = "Microsoft YaHei";

async function writeBlob(filePath, blob) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, Buffer.from(await blob.arrayBuffer()));
}

function addText(slide, text, x, y, w, h, opts = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    fontSize: opts.size ?? 24,
    bold: opts.bold ?? false,
    color: opts.color ?? ink,
    typeface: font,
    alignment: opts.align ?? "left",
  };
  return shape;
}

function addBox(slide, x, y, w, h, opts = {}) {
  return slide.shapes.add({
    geometry: opts.geometry ?? "rect",
    position: { left: x, top: y, width: w, height: h },
    fill: opts.fill ?? panel,
    line: { style: "solid", fill: opts.line ?? "none", width: opts.lineWidth ?? 0 },
  });
}

function addRule(slide, x, y, w) {
  addBox(slide, x, y, w, 2, { fill: rule });
}

function addHeader(slide, title, section = "创业故事卡牌") {
  addText(slide, section, 42, 36, 280, 28, { size: 16, bold: true, color: muted });
  addText(slide, title, 42, 74, 900, 64, { size: 40, bold: true });
  addRule(slide, 42, 156, 1196);
}

function addFooter(slide, n) {
  addText(slide, String(n).padStart(2, "0"), 1188, 660, 50, 28, { size: 16, color: muted, align: "right" });
}

function addPanelText(slide, title, body, x, y, w, h, opts = {}) {
  addBox(slide, x, y, w, h, { fill: opts.fill ?? panel, line: opts.line ?? "none" });
  addText(slide, title, x + 24, y + 22, w - 48, 34, { size: opts.titleSize ?? 24, bold: true });
  addText(slide, body, x + 24, y + 68, w - 48, h - 86, { size: opts.bodySize ?? 18, color: opts.bodyColor ?? "#222222" });
}

function addProcess(slide, items, y = 250) {
  const gap = 14;
  const width = (1196 - gap * (items.length - 1)) / items.length;
  items.forEach((item, i) => {
    const x = 42 + i * (width + gap);
    addBox(slide, x, y, width, 170, { fill: i % 2 === 0 ? panel : "#F7F7F7", line: rule, lineWidth: 1 });
    addText(slide, String(i + 1).padStart(2, "0"), x + 18, y + 16, 60, 26, { size: 18, bold: true, color: highlight });
    addText(slide, item.title, x + 18, y + 52, width - 36, 42, { size: 24, bold: true });
    addText(slide, item.body, x + 18, y + 104, width - 36, 52, { size: 16, color: "#333333" });
  });
}

const deck = Presentation.create({ slideSize: { width: W, height: H } });

// 1 Cover
{
  const slide = deck.slides.add();
  slide.background.fill = "#FFFFFF";
  addText(slide, "创业故事卡牌", 42, 72, 720, 92, { size: 64, bold: true });
  addText(slide, "项目介绍与玩法说明", 42, 178, 620, 42, { size: 30, color: muted });
  addRule(slide, 42, 250, 520);
  addText(slide, "用卡牌对战表达从立项、构筑、阶段交付到最终发售的创业全过程。", 42, 292, 560, 88, { size: 24, color: "#222222" });
  addBox(slide, 724, 68, 472, 520, { fill: panel });
  addText(slide, "赛道", 768, 118, 150, 36, { size: 26, bold: true });
  addText(slide, "画像", 960, 118, 150, 36, { size: 26, bold: true });
  addText(slide, "组牌", 768, 270, 150, 36, { size: 26, bold: true });
  addText(slide, "对战", 960, 270, 150, 36, { size: 26, bold: true });
  addText(slide, "发售", 864, 434, 150, 40, { size: 34, bold: true, color: highlight, align: "center" });
  addFooter(slide, 1);
}

// 2 Project position
{
  const slide = deck.slides.add();
  addHeader(slide, "这个原型把创业过程拆成可玩的资源决策");
  addPanelText(slide, "玩家做什么", "选择路线、配置起点、打出卡牌、处理事件、买卡成长，最终完成发售。", 42, 210, 360, 280);
  addPanelText(slide, "系统表达什么", "时间是血量，资金是成长资源，敌人血条是阶段核心工作，事件是外部环境。", 460, 210, 360, 280);
  addPanelText(slide, "内容有什么", "三条通用创业赛道，加一条基于 2007 年真实时间线的初代 iPhone 故事线。", 878, 210, 360, 280);
  addFooter(slide, 2);
}

// 3 Whole flow
{
  const slide = deck.slides.add();
  addHeader(slide, "完整循环由路线选择、阶段对战和局外成长组成");
  addProcess(slide, [
    { title: "选路线", body: "通用赛道或初代 iPhone 真实故事线" },
    { title: "定起点", body: "画像影响初始时间、资金和难度" },
    { title: "进关卡", body: "每关代表一个核心工作目标" },
    { title: "打对战", body: "在回合限制内清空敌人血条" },
    { title: "拿成长", body: "奖励、事件、商店、重组选牌" },
  ], 250);
  addText(slide, "核心循环：阶段胜利后，牌库与事件会持续改变下一关的风险和打法。", 42, 560, 1040, 44, { size: 24, bold: true });
  addFooter(slide, 3);
}

// 4 Common routes
{
  const slide = deck.slides.add();
  addHeader(slide, "普通创业线先定义人群，再进入初始牌库构筑");
  addPanelText(slide, "银发健康", "照护、康复、慢病管理与家庭协同。适合表达高频刚需和渠道协作。", 42, 205, 360, 160);
  addPanelText(slide, "AI效率工具", "面向企业、创作者与专业岗位的流程提效。强调效率、预算和技术门槛。", 460, 205, 360, 160);
  addPanelText(slide, "绿色消费", "可持续材料、低碳生活方式与新渠道消费。关注供应、品牌和渠道扩散。", 878, 205, 360, 160);
  addBox(slide, 42, 430, 1196, 96, { fill: "#F7F7F7", line: rule, lineWidth: 1 });
  addText(slide, "画像选择：核心人群 3 个 + 机会人群 3 个", 72, 454, 460, 32, { size: 24, bold: true });
  addText(slide, "影响初始时间、资金和难度；随后从 20 张创业要素牌中选择 8 张初始牌。", 560, 452, 620, 42, { size: 22, color: "#222222" });
  addFooter(slide, 4);
}

// 5 iPhone line
{
  const slide = deck.slides.add();
  addHeader(slide, "初代 iPhone 线按 2007 年真实节点推进");
  addProcess(slide, [
    { title: "Purple", body: "多点触控方向决策" },
    { title: "AT&T", body: "运营商控制权谈判" },
    { title: "OS X", body: "触控系统移植" },
    { title: "Macworld", body: "2007-01-09 发布演示" },
    { title: "Launch", body: "2007-06-29 发售" },
  ], 218);
  addText(slide, "关卡间事件也切换为真实时间线：Cisco 商标、FCC 批准、WWDC Web App、玻璃与续航、首发排队。", 42, 512, 1040, 72, { size: 24, bold: true });
  addFooter(slide, 5);
}

// 6 Battle rules
{
  const slide = deck.slides.add();
  addHeader(slide, "对战用清晰数值把创业压力变成回合决策");
  addPanelText(slide, "玩家时间", "玩家血量。敌人攻击会扣减时间，归零失败。", 42, 205, 270, 150);
  addPanelText(slide, "资金", "打出部分卡牌、商店买牌和路线成长的资源。", 344, 205, 270, 150);
  addPanelText(slide, "敌人血条", "阶段核心工作剩余量。清空即完成该阶段。", 646, 205, 270, 150);
  addPanelText(slide, "回合限制", "在规定回合内完成，否则项目超期失败。", 948, 205, 270, 150);
  addBox(slide, 42, 430, 1196, 100, { fill: "#F7F7F7", line: rule, lineWidth: 1 });
  addText(slide, "常用战斗状态", 72, 456, 220, 30, { size: 24, bold: true, color: highlight });
  addText(slide, "时间缓冲抵消伤害；推进加成提高后续输出；阻力抵消推进；压力提高敌人后续攻击。", 300, 452, 840, 44, { size: 22 });
  addFooter(slide, 6);
}

// 7 Meta progression
{
  const slide = deck.slides.add();
  addHeader(slide, "关卡胜利后进入奖励、事件、商店和重组选牌");
  addProcess(slide, [
    { title: "阶段说明", body: "展示完成结果和现实进度说明" },
    { title: "奖励三选一", body: "前 6 关每关 3 张独特卡" },
    { title: "关卡间事件", body: "正负效果转成常驻影响" },
    { title: "卡牌商店", body: "消耗资金购买新基础卡" },
    { title: "重组选牌", body: "每关上限 +1，至少 8 张" },
  ], 245);
  addFooter(slide, 7);
}

// 8 Editor and deliverables
{
  const slide = deck.slides.add();
  addHeader(slide, "内容编辑器让关卡、事件和卡牌可以手动调参");
  addPanelText(slide, "可改关卡", "名称、敌人、血量、攻击、回合数、奖励资金、恢复时间和简介。", 42, 210, 360, 220);
  addPanelText(slide, "可改事件", "事件名称、正面效果、负面效果和常驻数值。", 460, 210, 360, 220);
  addPanelText(slide, "可改卡牌", "名称、类型、费用、商店价格和描述；卡牌逻辑暂时固定。", 878, 210, 360, 220);
  addText(slide, "当前交付文件：index.html、styles.css、app.js、Markdown说明、Word说明、PPT说明。", 42, 540, 1080, 42, { size: 24, bold: true });
  addFooter(slide, 8);
}

await fs.mkdir(OUT_DIR, { recursive: true });
await fs.mkdir(QA_DIR, { recursive: true });

for (const [index, slide] of deck.slides.items.entries()) {
  const png = await deck.export({ slide, format: "png", scale: 1 });
  await writeBlob(path.join(QA_DIR, `slide-${String(index + 1).padStart(2, "0")}.png`), png);
  const layout = await slide.export({ format: "layout" });
  await fs.writeFile(path.join(QA_DIR, `slide-${String(index + 1).padStart(2, "0")}.layout.json`), await layout.text(), "utf8");
}

const montage = await deck.export({ format: "webp", montage: true, scale: 1 });
await writeBlob(path.join(QA_DIR, "montage.webp"), montage);

const pptx = await PresentationFile.exportPptx(deck);
await pptx.save(PPTX_PATH);

console.log(PPTX_PATH);

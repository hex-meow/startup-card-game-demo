const app = document.querySelector("#app");
const modal = document.querySelector("#gameOverModal");
const modalPanel = modal.querySelector(".modal-panel");
const modalGlyph = modal.querySelector(".modal-glyph");
const modalTitle = document.querySelector("#modalTitle");
const modalText = document.querySelector("#modalText");
const modalActionBtn = document.querySelector("#modalActionBtn");
const modalScrollHint = document.createElement("button");
modalScrollHint.className = "modal-scroll-hint";
modalScrollHint.type = "button";
modalScrollHint.hidden = true;
modalScrollHint.innerHTML = `<span aria-hidden="true">⌄</span><strong>向下滑动继续阅读</strong>`;
modalText.insertAdjacentElement("afterend", modalScrollHint);

const FUND_SCALE = 10;
const FUND_UNIT = "万";
const DAYS_PER_WEEK = 7;
const TIME_SCALE = DAYS_PER_WEEK;
const CORE_PERSONA_MULTIPLIER = 1.2;
const OPPORTUNITY_PERSONA_MULTIPLIER = 1;
const CURRENT_CONTENT_STORAGE_KEY = "meowStartupCardGameContentV2";
const LEGACY_CONTENT_STORAGE_KEYS = ["meowStartupCardGameContentV1", "startupCardGameContentV1"];
const MONEY_FIELD_NAMES = new Set(["funds", "rewardFunds", "fundCost", "price", "shopDiscount"]);
const MONEY_TEXT_FIELD_NAMES = new Set(["text", "positive", "negative"]);

const simulationSteps = ["赛道", "喵群", "策略", "对战"];
const historySteps = ["赛道", "旅程", "对战"];

const tracks = [
  {
    id: "health",
    name: "银须经济",
    note: "养儿不防老，养喵呢？",
    base: { time: 30, funds: 14, difficulty: 0.94 },
    traits: [
      { id: "h1", name: "慢病老喵", tag: "高频刚需", effect: { time: 3, funds: 0, difficulty: -0.05 } },
      { id: "h2", name: "小喵照护者", tag: "付费决策", effect: { time: 1, funds: 3, difficulty: -0.03 } },
      { id: "h3", name: "街区喵医", tag: "专业入口", effect: { time: 0, funds: 2, difficulty: -0.04 } },
      { id: "h4", name: "康复喵舍", tag: "渠道伙伴", effect: { time: -1, funds: 4, difficulty: 0.02 } },
      { id: "h5", name: "活跃银须喵", tag: "增长喵群", effect: { time: 2, funds: 1, difficulty: -0.01 } },
      { id: "h6", name: "喵币保险顾问", tag: "商业合作", effect: { time: -1, funds: 5, difficulty: 0.04 } },
      { id: "h7", name: "护理窝长", tag: "交付约束", effect: { time: 1, funds: 2, difficulty: 0.01 } },
      { id: "h8", name: "独居老喵", tag: "触达困难", effect: { time: 4, funds: -1, difficulty: 0.04 } },
      { id: "h9", name: "草药铺店喵", tag: "线下触点", effect: { time: 1, funds: 1, difficulty: -0.02 } },
      { id: "h10", name: "养老喵舍采购", tag: "大单机会", effect: { time: -2, funds: 6, difficulty: 0.07 } },
      { id: "h11", name: "康复教练喵", tag: "专业内容", effect: { time: 0, funds: 2, difficulty: -0.01 } },
      { id: "h12", name: "上门护士喵", tag: "服务闭环", effect: { time: 1, funds: 2, difficulty: 0.02 } },
    ],
  },
  {
    id: "ai",
    name: "喵工智能",
    note: "我曾有个傻人保姆，现在有喵工智能！",
    base: { time: 28, funds: 17, difficulty: 0.98 },
    traits: [
      { id: "a1", name: "独立开发者", tag: "早期拥护", effect: { time: 2, funds: 0, difficulty: -0.04 } },
      { id: "a2", name: "中小企业主", tag: "预算明确", effect: { time: -1, funds: 5, difficulty: 0.03 } },
      { id: "a3", name: "一线运营喵", tag: "流程痛点", effect: { time: 2, funds: 1, difficulty: -0.03 } },
      { id: "a4", name: "内容喵班", tag: "增长喵群", effect: { time: 1, funds: 2, difficulty: -0.01 } },
      { id: "a5", name: "数账分析喵", tag: "专业门槛", effect: { time: -1, funds: 3, difficulty: 0.04 } },
      { id: "a6", name: "外包喵队", tag: "交付生态", effect: { time: 0, funds: 4, difficulty: 0.03 } },
      { id: "a7", name: "销售主管", tag: "付费线索", effect: { time: -1, funds: 4, difficulty: 0.02 } },
      { id: "a8", name: "法务经理", tag: "合规压力", effect: { time: -2, funds: 3, difficulty: 0.07 } },
      { id: "a9", name: "织界面喵", tag: "轻量场景", effect: { time: 2, funds: 1, difficulty: -0.02 } },
      { id: "a10", name: "客服喵群", tag: "批量需求", effect: { time: 0, funds: 4, difficulty: 0.01 } },
      { id: "a11", name: "军师顾问喵", tag: "高客单价", effect: { time: -1, funds: 6, difficulty: 0.05 } },
      { id: "a12", name: "学徒喵社群", tag: "传播扩散", effect: { time: 3, funds: -1, difficulty: -0.01 } },
    ],
  },
  {
    id: "green",
    name: "绿喵能源",
    note: "为爱发电~喵~",
    base: { time: 29, funds: 15, difficulty: 0.96 },
    traits: [
      { id: "g1", name: "尝鲜车主喵", tag: "愿意尝鲜", effect: { time: 2, funds: 2, difficulty: -0.03 } },
      { id: "g2", name: "屋顶光伏喵", tag: "自发自用", effect: { time: 0, funds: 4, difficulty: 0.02 } },
      { id: "g3", name: "充电站长喵", tag: "场景清晰", effect: { time: 2, funds: 1, difficulty: -0.02 } },
      { id: "g4", name: "车队运营喵", tag: "渠道杠杆", effect: { time: -1, funds: 4, difficulty: 0.03 } },
      { id: "g5", name: "园区采购喵", tag: "订单机会", effect: { time: -2, funds: 6, difficulty: 0.05 } },
      { id: "g6", name: "绿电布道喵", tag: "传播节点", effect: { time: 3, funds: 0, difficulty: -0.02 } },
      { id: "g7", name: "社区储能喵", tag: "线下测试", effect: { time: 1, funds: 2, difficulty: 0.01 } },
      { id: "g8", name: "学堂节能喵群", tag: "低成本扩散", effect: { time: 3, funds: -1, difficulty: -0.01 } },
      { id: "g9", name: "企业能源经理", tag: "用能入口", effect: { time: -1, funds: 5, difficulty: 0.04 } },
      { id: "g10", name: "电池供应喵", tag: "供应约束", effect: { time: -2, funds: 4, difficulty: 0.06 } },
      { id: "g11", name: "换电快跑喵", tag: "爆发渠道", effect: { time: -1, funds: 5, difficulty: 0.05 } },
      { id: "g12", name: "碳账本喵", tag: "信任背书", effect: { time: 0, funds: 3, difficulty: 0.02 } },
    ],
  },
  {
    id: "iphone",
    name: "Mphone的诞生",
    note: "一款智能手机从秘密立项到正式上市的产品创新历程",
    base: { time: 34, funds: 20, difficulty: 0.96 },
    specialRoute: true,
  },
];

const stages = [
  {
    title: "凡事总有第一次",
    short: "初次尝试",
    enemyName: "核心工作：可演示产品样机",
    target: "样机剩余工作",
    hp: 42,
    attack: 5,
    rounds: 8,
    blockText: "评审毛结",
    powerText: "截止铃压力",
    intro: "把脑海里的想法变成第一个可以真正演示的 Demo，用最小可行版本验证核心体验，也为后续迭代找到清晰起点。",
    rewardFunds: 4,
    recover: 4,
  },
  {
    title: "千里马常有而伯乐不常有",
    short: "寻找伯乐",
    enemyName: "核心工作：投资人疑虑",
    target: "金主疑虑",
    hp: 48,
    attack: 5,
    rounds: 8,
    blockText: "挑刺纸条",
    powerText: "追问压力",
    intro: "带着 Demo 和创业故事寻找愿意相信早期愿景的天使投资人，讲清市场机会、团队能力、商业路径与资金用途。",
    rewardFunds: 10,
    recover: 4,
  },
  {
    title: "梦想也需要落地",
    short: "产品落地",
    enemyName: "核心工作：产品研发待办",
    target: "研发待办",
    hp: 58,
    attack: 5,
    rounds: 9,
    blockText: "技术债",
    powerText: "返工压力",
    intro: "把验证过的 Demo 拆解为可靠的功能、结构与工艺方案，反复打磨细节，让梦想成为真正能够稳定量产的产品。",
    rewardFunds: 6,
    recover: 5,
  },
  {
    title: "粮草先行",
    short: "量产筹备",
    enemyName: "核心工作：供应商分歧",
    target: "谈判分歧",
    hp: 48,
    attack: 5,
    rounds: 9,
    blockText: "契约毛结",
    powerText: "议价压力",
    intro: "在开工量产前先把后勤底盘搭稳：确认 BOM 成本、供应商、交期、备货节奏与品质管理方案，为规模交付扫清障碍。",
    rewardFunds: 7,
    recover: 5,
  },
  {
    title: "流水线初体验",
    short: "初次量产",
    enemyName: "核心工作：批量生产风险",
    target: "生产风险",
    hp: 56,
    attack: 5,
    rounds: 9,
    blockText: "良率毛病",
    powerText: "交付压力",
    intro: "第一次走上流水线，把设计和方案变成一批批真实产品；在生产节拍、良率、成本与交付压力中完成量产磨合。",
    rewardFunds: 8,
    recover: 5,
  },
  {
    title: "广而告之",
    short: "上市预热",
    enemyName: "核心工作：市场声量缺口",
    target: "声量缺口",
    hp: 50,
    attack: 5,
    rounds: 9,
    blockText: "传闻杂音",
    powerText: "热度压力",
    intro: "用产品故事、真实体验和用户口碑持续积累声量，让更多人听见、理解并愿意期待它，为正式上市完成预热。",
    rewardFunds: 5,
    recover: 5,
  },
  {
    title: "把它上市吧",
    short: "正式上市",
    enemyName: "核心工作：开摊关键事项",
    target: "发售待办",
    hp: 54,
    attack: 5,
    rounds: 10,
    blockText: "摊位问题",
    powerText: "舆情压力",
    intro: "把准备已久的产品正式推向市场，完成上架、开卖、履约与首批用户反馈闭环，让创业构想真正接受市场检验。",
    rewardFunds: 0,
    recover: 0,
  },
];

const iphoneStages = [
  {
    title: "Mphone项目立项",
    short: "项目立项",
    enemyName: "核心工作：多点触控方向决策",
    target: "方向不确定性",
    hp: 44,
    attack: 5,
    rounds: 8,
    blockText: "实体键惯性",
    powerText: "保密压力",
    intro: "从便携音乐播放器、手机和互联网终端的交叉点，押注全触控智能设备。",
    rewardFunds: 5,
    recover: 3,
  },
  {
    title: "运营商合作谈判",
    short: "运营商谈判",
    enemyName: "核心工作：运营商合作控制权",
    target: "谈判阻力",
    hp: 52,
    attack: 6,
    rounds: 8,
    blockText: "塔盟条款",
    powerText: "网络顾虑",
    intro: "争取罕见的硬件、软件和营销自主权，同时承受独家塔盟合作压力。",
    rewardFunds: 10,
    recover: 2,
  },
  {
    title: "Mac OS X系统移植",
    short: "系统移植",
    enemyName: "核心工作：移动操作系统",
    target: "系统待办",
    hp: 60,
    attack: 6,
    rounds: 9,
    blockText: "记忆毛球约束",
    powerText: "崩溃压力",
    intro: "把桌面级系统重写成能在移动芯片、触控和电池限制下运行的版本。",
    rewardFunds: 6,
    recover: 3,
  },
  {
    title: "Macworld发布会演示",
    short: "发布会演示",
    enemyName: "核心工作：现场展演风险",
    target: "演示风险",
    hp: 66,
    attack: 6,
    rounds: 9,
    blockText: "样机故障",
    powerText: "舆论压力",
    intro: "在 2007-01-09 的发布会上证明：它是一台音乐播放器、一部手机和一个互联网通信设备。",
    rewardFunds: 9,
    recover: 5,
  },
  {
    title: "玻璃面板与续航冲刺",
    short: "硬件冲刺",
    enemyName: "核心工作：耐用玻璃面板与电池",
    target: "硬件风险",
    hp: 52,
    attack: 5,
    rounds: 9,
    blockText: "刮痕问题",
    powerText: "续航焦虑",
    intro: "在发售前把塑料表面换成抗刮玻璃，并提升通话和影音续航。",
    rewardFunds: 7,
    recover: 4,
  },
  {
    title: "Web应用生态准备",
    short: "应用生态",
    enemyName: "核心工作：第三方开发者应用路径",
    target: "生态缺口",
    hp: 52,
    attack: 5,
    rounds: 9,
    blockText: "开发者疑虑",
    powerText: "平台压力",
    intro: "先用浏览器 Web 应用打开第三方生态入口，为正式发售补足软件体验。",
    rewardFunds: 6,
    recover: 4,
  },
  {
    title: "2007年6月29日正式发售",
    short: "正式发售",
    enemyName: "核心工作：首发开摊执行",
    target: "发售待办",
    hp: 54,
    attack: 5,
    rounds: 12,
    blockText: "激活排队",
    powerText: "缺货压力",
    intro: "完成品牌门店首发、运营商合约激活、媒体评测和首批用户交付。",
    rewardFunds: 0,
    recover: 0,
  },
];

const legacySpecialEvents = [
  {
    id: "policyPilot",
    name: "喵喵币试点窗口",
    description: "城镇议会开放试点申报，项目获得背书机会，但合规卷轴显著增多。",
    positive: "喵喵币 +6，后续商店价格 -1。",
    negative: "后续敌人血量 +8%。",
    effects: { funds: 6, shopDiscount: 1, enemyHpMultiplier: 0.08 },
  },
  {
    id: "pandemicShock",
    name: "公共卫生事件冲击",
    description: "线下推进受阻，团队节奏被打乱，但远程协作和线上渠道因此加速成熟。",
    positive: "每场开局推进加成 +1。",
    negative: "路线时间 -4，后续敌人攻击 +1。",
    effects: { time: -4, startMomentum: 1, enemyAttackDelta: 1 },
  },
  {
    id: "supplyShortage",
    name: "关键物料短缺",
    description: "核心物料供应波动导致成本和交付压力上升，但团队提前建立了备选供应方案。",
    positive: "每场开局时间缓冲 +4。",
    negative: "喵喵币 -4，后续敌人攻击 +1。",
    effects: { funds: -4, startBuffer: 4, enemyAttackDelta: 1 },
  },
  {
    id: "mediaBoost",
    name: "媒体意外曝光",
    description: "一次报道带来流量和潜在客户，同时也让外界预期快速升高。",
    positive: "喵喵币 +4，后续敌人血量 -5%。",
    negative: "后续敌人攻击 +1。",
    effects: { funds: 4, enemyHpMultiplier: -0.05, enemyAttackDelta: 1 },
  },
  {
    id: "regulationTighten",
    name: "监管口径收紧",
    description: "街区规则突然变严，短期推进变慢，但通过后会形成更强信任壁垒。",
    positive: "后续敌人攻击 -1。",
    negative: "路线时间 -3，后续敌人血量 +6%。",
    effects: { time: -3, enemyAttackDelta: -1, enemyHpMultiplier: 0.06 },
  },
  {
    id: "talentWave",
    name: "人才流动窗口",
    description: "大型企业组织调整带来人才招聘机会，但薪资和管理复杂度同步上升。",
    positive: "出战牌库上限 +1，每场开局行动力上限 +1。",
    negative: "喵喵币 -5。",
    effects: { deckLimitBonus: 1, startEnergyMax: 1, funds: -5 },
  },
];

const cardCatalog = {
  engineer: {
    name: "技术骨干",
    type: "人员",
    art: "attack",
    cost: 1,
    text: "核心工作 -7。",
    play: (state) => advanceWork(state, 7 + state.player.momentum),
  },
  productManager: {
    name: "项目负责人",
    type: "人员",
    art: "attack",
    cost: 1,
    text: "核心工作 -5，抽 1 张牌。",
    play: (state) => {
      advanceWork(state, 5 + state.player.momentum);
      drawCards(state, 1);
    },
  },
  designer: {
    name: "视觉设计师",
    type: "人员",
    art: "skill",
    cost: 1,
    text: "核心工作 -4，时间缓冲 +2。",
    play: (state) => {
      advanceWork(state, 4 + state.player.momentum);
      gainBuffer(state, 2);
    },
  },
  salesPartner: {
    name: "推销高手",
    type: "人员",
    art: "attack",
    cost: 1,
    text: "核心工作 -4，喵喵币 +2。",
    play: (state) => {
      advanceWork(state, 4 + state.player.momentum);
      gainFunds(state, 2);
    },
  },
  supplyExpert: {
    name: "供应链专家",
    type: "人员",
    art: "attack",
    cost: 1,
    text: "核心工作 -6，阻力 -2。",
    play: (state) => {
      state.enemy.block = Math.max(0, state.enemy.block - 2);
      advanceWork(state, 6 + state.player.momentum);
    },
  },
  legalAdvisor: {
    name: "法务顾问",
    type: "人员",
    art: "defense",
    cost: 1,
    text: "时间缓冲 +4，压力 -1。",
    play: (state) => {
      gainBuffer(state, 4);
      state.enemy.power = Math.max(0, state.enemy.power - 1);
      addLog(state, "法务顾问降低了后续风险。");
    },
  },
  techResearch: {
    name: "实验新技术",
    type: "技术",
    art: "skill",
    cost: 1,
    text: "核心工作 -5，后续推进 +1。",
    play: (state) => {
      advanceWork(state, 5 + state.player.momentum);
      state.player.momentum += 1;
      addLog(state, "研发路线更清晰，后续推进效率提升。");
    },
  },
  architecture: {
    name: "建立核心构架",
    type: "技术",
    art: "attack",
    cost: 2,
    text: "核心工作 -10。",
    play: (state) => advanceWork(state, 10 + state.player.momentum),
  },
  dataInsight: {
    name: "用户数据分析",
    type: "技术",
    art: "skill",
    cost: 1,
    text: "抽 2 张牌。",
    play: (state) => {
      drawCards(state, 2);
      addLog(state, "用户数据分析给出了新的行动选择。");
    },
  },
  automation: {
    name: "ai自动化",
    type: "技术",
    art: "skill",
    cost: 1,
    text: "行动力上限 +1，核心工作 -3。",
    play: (state) => {
      state.player.maxEnergy = Math.min(6, state.player.maxEnergy + 1);
      state.player.energy = Math.min(state.player.maxEnergy, state.player.energy + 1);
      advanceWork(state, 3 + state.player.momentum);
    },
  },
  angelFunding: {
    name: "天使投资",
    type: "喵喵币",
    art: "fund",
    cost: 1,
    text: "喵喵币 +6，剩余时间 +2。",
    play: (state) => {
      gainFunds(state, 6);
      gainTime(state, 2);
    },
  },
  leanBudget: {
    name: "精打细算",
    type: "喵喵币",
    art: "fund",
    cost: 0,
    text: "喵喵币 +3，时间缓冲 +2。",
    play: (state) => {
      gainFunds(state, 3);
      gainBuffer(state, 2);
    },
  },
  outsourcing: {
    name: "外包团队",
    type: "管理",
    art: "fund",
    cost: 1,
    fundCost: 5,
    text: "核心工作 -8。",
    play: (state) => {
      spendFunds(state, 5);
      advanceWork(state, 8 + state.player.momentum);
    },
  },
  runway: {
    name: "艰难决定",
    type: "时间",
    art: "defense",
    cost: 1,
    text: "剩余时间 +5。",
    play: (state) => gainTime(state, 5),
  },
  scheduleBuffer: {
    name: "未雨绸缪",
    type: "时间",
    art: "defense",
    cost: 1,
    text: "时间缓冲 +7。",
    play: (state) => gainBuffer(state, 7),
  },
  cutScope: {
    name: "少即是多",
    type: "策略",
    art: "skill",
    cost: 0,
    text: "阻力 -4，核心工作 -3。",
    play: (state) => {
      state.enemy.block = Math.max(0, state.enemy.block - 4);
      advanceWork(state, 3 + state.player.momentum);
      addLog(state, "团队收窄范围，只保留关键事项。");
    },
  },
  mentor: {
    name: "导师背书",
    type: "资源",
    art: "skill",
    cost: 2,
    text: "核心工作 -8，压力 -1。",
    play: (state) => {
      advanceWork(state, 8 + state.player.momentum);
      state.enemy.power = Math.max(0, state.enemy.power - 1);
      addLog(state, "行业导师背书减少了外部阻力。");
    },
  },
  overtime: {
    name: "通宵达旦",
    type: "策略",
    art: "attack",
    cost: 0,
    text: "核心工作 -6，但时间 -2。",
    play: (state) => {
      advanceWork(state, 6 + state.player.momentum);
      loseTime(state, 2, `夜巡冲刺消耗了 ${formatDays(2)} 团队时间。`);
    },
  },
  alignment: {
    name: "整齐划一",
    type: "管理",
    art: "skill",
    cost: 1,
    text: "后续推进核心工作 +1。",
    play: (state) => {
      state.player.momentum += 1;
      addLog(state, "团队完成目标对齐，后续执行效率提升。");
    },
  },
  crowdfunding: {
    name: "产品众筹",
    type: "喵喵币",
    art: "fund",
    cost: 1,
    text: "喵喵币 +4，核心工作 -4。",
    play: (state) => {
      gainFunds(state, 4);
      advanceWork(state, 4 + state.player.momentum);
    },
  },
};

const defaultInitialCardIds = Object.keys(cardCatalog);

const iphoneBaseCards = {
  multiTouchDemo: {
    name: "多点触控原型",
    type: "技术",
    art: "skill",
    cost: 1,
    text: "核心工作 -6，后续推进 +1。",
    play: (state) => {
      advanceWork(state, 6 + state.player.momentum);
      state.player.momentum += 1;
      addLog(state, "多点触控原型验证了手指交互的方向。");
    },
  },
  purpleRoom: {
    name: "保密项目室",
    type: "管理",
    art: "defense",
    cost: 1,
    text: "时间缓冲 +5，压力 -1。",
    play: (state) => {
      gainBuffer(state, 5);
      state.enemy.power = Math.max(0, state.enemy.power - 1);
    },
  },
  osxPort: {
    name: "系统内存优化",
    type: "技术",
    art: "attack",
    cost: 2,
    text: "核心工作 -11。",
    play: (state) => advanceWork(state, 11 + state.player.momentum),
  },
  cingularDeal: {
    name: "运营商合作谈判",
    type: "资源",
    art: "fund",
    cost: 1,
    text: "喵喵币 +5，核心工作 -4。",
    play: (state) => {
      gainFunds(state, 5);
      advanceWork(state, 4 + state.player.momentum);
    },
  },
  visualVoicemail: {
    name: "可视化语音信箱",
    type: "产品",
    art: "skill",
    cost: 1,
    text: "核心工作 -5，阻力 -3。",
    play: (state) => {
      state.enemy.block = Math.max(0, state.enemy.block - 3);
      advanceWork(state, 5 + state.player.momentum);
    },
  },
  glassSurface: {
    name: "光学玻璃面板",
    type: "硬件",
    art: "defense",
    cost: 1,
    text: "时间缓冲 +4，核心工作 -5。",
    play: (state) => {
      gainBuffer(state, 4);
      advanceWork(state, 5 + state.player.momentum);
    },
  },
  batteryBoost: {
    name: "八小时通话",
    type: "硬件",
    art: "defense",
    cost: 1,
    text: "剩余时间 +4。",
    play: (state) => gainTime(state, 4),
  },
  safariBrowser: {
    name: "移动浏览器",
    type: "软件",
    art: "attack",
    cost: 1,
    text: "核心工作 -7。",
    play: (state) => advanceWork(state, 7 + state.player.momentum),
  },
  keynoteRehearsal: {
    name: "发布会彩排",
    type: "运营",
    art: "skill",
    cost: 0,
    text: "核心工作 -4，抽 1 张牌。",
    play: (state) => {
      advanceWork(state, 4 + state.player.momentum);
      drawCards(state, 1);
    },
  },
  goldenPath: {
    name: "黄金演示路径",
    type: "策略",
    art: "attack",
    cost: 1,
    text: "核心工作 -8，但压力 +1。",
    play: (state) => {
      advanceWork(state, 8 + state.player.momentum);
      state.enemy.power += 1;
    },
  },
  fakeDataRig: {
    name: "演示数据布置",
    type: "运营",
    art: "skill",
    cost: 1,
    text: "抽 2 张牌。",
    play: (state) => {
      drawCards(state, 2);
      addLog(state, "演示数据让下一步行动更可控。");
    },
  },
  radioLab: {
    name: "无线信号测试",
    type: "硬件",
    art: "defense",
    cost: 1,
    text: "阻力 -4，时间缓冲 +3。",
    play: (state) => {
      state.enemy.block = Math.max(0, state.enemy.block - 4);
      gainBuffer(state, 3);
    },
  },
  armChipBudget: {
    name: "掌芯预算",
    type: "喵喵币",
    art: "fund",
    cost: 1,
    text: "喵喵币 -2，核心工作 -9。",
    fundCost: 2,
    play: (state) => {
      spendFunds(state, 2);
      advanceWork(state, 9 + state.player.momentum);
    },
  },
  secrecySilos: {
    name: "硬软隔窝协作",
    type: "管理",
    art: "defense",
    cost: 1,
    text: "时间缓冲 +3，阻力 -2。",
    play: (state) => {
      gainBuffer(state, 3);
      state.enemy.block = Math.max(0, state.enemy.block - 2);
    },
  },
  webAppPitch: {
    name: "Web 应用方案",
    type: "生态",
    art: "skill",
    cost: 1,
    text: "核心工作 -5，后续推进 +1。",
    play: (state) => {
      advanceWork(state, 5 + state.player.momentum);
      state.player.momentum += 1;
    },
  },
  itunesSync: {
    name: "音乐同步闭环",
    type: "产品",
    art: "attack",
    cost: 1,
    text: "核心工作 -6，喵喵币 +2。",
    play: (state) => {
      advanceWork(state, 6 + state.player.momentum);
      gainFunds(state, 2);
    },
  },
  retailLaunch: {
    name: "品牌门店首发",
    type: "运营",
    art: "fund",
    cost: 1,
    text: "喵喵币 +3，核心工作 -4。",
    play: (state) => {
      gainFunds(state, 3);
      advanceWork(state, 4 + state.player.momentum);
    },
  },
  reviewSeeding: {
    name: "媒体评测机",
    type: "宣发",
    art: "attack",
    cost: 1,
    text: "核心工作 -6，压力 -1。",
    play: (state) => {
      advanceWork(state, 6 + state.player.momentum);
      state.enemy.power = Math.max(0, state.enemy.power - 1);
    },
  },
  activationPrep: {
    name: "激活流程彩排",
    type: "运营",
    art: "defense",
    cost: 1,
    text: "时间缓冲 +6。",
    play: (state) => gainBuffer(state, 6),
  },
  noManualDesign: {
    name: "无纸卷体验",
    type: "设计",
    art: "skill",
    cost: 0,
    text: "阻力 -3，核心工作 -3。",
    play: (state) => {
      state.enemy.block = Math.max(0, state.enemy.block - 3);
      advanceWork(state, 3 + state.player.momentum);
    },
  },
};

Object.assign(cardCatalog, iphoneBaseCards);

const iphoneInitialCardIds = Object.keys(iphoneBaseCards);
const iphoneStarterDeck = [
  "multiTouchDemo",
  "purpleRoom",
  "osxPort",
  "cingularDeal",
  "visualVoicemail",
  "glassSurface",
  "safariBrowser",
  "keynoteRehearsal",
];
const initialCardIds = defaultInitialCardIds;

const stageRewardIds = [
  ["demoMvp", "demoPrototype", "demoUserInterview"],
  ["investorDeck", "termSheet", "leadInvestor"],
  ["devQa", "devBeta", "devRefactor"],
  ["supplierAudit", "supplierBackup", "supplierCredit"],
  ["massQc", "massLine", "massForecast"],
  ["launchKol", "launchPress", "launchCommunity"],
];

const iphoneStageRewardIds = [
  ["iphoneFingerFirst", "iphoneNoKeyboard", "iphonePurpleSprint"],
  ["iphoneCarrierControl", "iphoneVisualVoicemailDeal", "iphoneRevenueShare"],
  ["iphoneSpringboard", "iphoneTouchKeyboard", "iphoneMemoryDiet"],
  ["iphoneThreeDevices", "iphoneDemoReset", "iphonePressShock"],
  ["iphoneCorningCall", "iphoneBatteryChart", "iphoneRfChamber"],
  ["iphoneSafariSdk", "iphoneWeb2Pitch", "iphoneActivationDryRun"],
];

const rewardCards = {
  demoMvp: {
    name: "最小可行产品切片",
    type: "阶段奖励",
    art: "attack",
    cost: 1,
    text: "核心工作 -8，抽 1 张牌。",
    play: (state) => {
      advanceWork(state, 8 + state.player.momentum);
      drawCards(state, 1);
    },
  },
  demoPrototype: {
    name: "可点击原型",
    type: "阶段奖励",
    art: "skill",
    cost: 0,
    text: "核心工作 -4，推进加成 +1。",
    play: (state) => {
      advanceWork(state, 4 + state.player.momentum);
      state.player.momentum += 1;
      addLog(state, "原型让团队后续推进更顺畅。");
    },
  },
  demoUserInterview: {
    name: "10次用户访谈",
    type: "阶段奖励",
    art: "skill",
    cost: 1,
    text: "阻力 -5，剩余时间 +2。",
    play: (state) => {
      state.enemy.block = Math.max(0, state.enemy.block - 5);
      gainTime(state, 2);
    },
  },
  investorDeck: {
    name: "融资路演材料",
    type: "阶段奖励",
    art: "attack",
    cost: 1,
    text: "核心工作 -7，喵喵币 +2。",
    play: (state) => {
      advanceWork(state, 7 + state.player.momentum);
      gainFunds(state, 2);
    },
  },
  termSheet: {
    name: "投资条款清单",
    type: "阶段奖励",
    art: "defense",
    cost: 1,
    text: "时间缓冲 +6，压力 -1。",
    play: (state) => {
      gainBuffer(state, 6);
      state.enemy.power = Math.max(0, state.enemy.power - 1);
    },
  },
  leadInvestor: {
    name: "领投方背书",
    type: "阶段奖励",
    art: "fund",
    cost: 2,
    text: "喵喵币 +8，核心工作 -4。",
    play: (state) => {
      gainFunds(state, 8);
      advanceWork(state, 4 + state.player.momentum);
    },
  },
  devQa: {
    name: "质量测试矩阵",
    type: "阶段奖励",
    art: "defense",
    cost: 1,
    text: "阻力 -4，时间缓冲 +4。",
    play: (state) => {
      state.enemy.block = Math.max(0, state.enemy.block - 4);
      gainBuffer(state, 4);
    },
  },
  devBeta: {
    name: "内部测试版",
    type: "阶段奖励",
    art: "attack",
    cost: 1,
    text: "核心工作 -9。",
    play: (state) => advanceWork(state, 9 + state.player.momentum),
  },
  devRefactor: {
    name: "模块重构",
    type: "阶段奖励",
    art: "skill",
    cost: 2,
    text: "核心工作 -8，行动力上限 +1。",
    play: (state) => {
      advanceWork(state, 8 + state.player.momentum);
      state.player.maxEnergy = Math.min(6, state.player.maxEnergy + 1);
    },
  },
  supplierAudit: {
    name: "供应商审核清单",
    type: "阶段奖励",
    art: "skill",
    cost: 1,
    text: "阻力 -6，核心工作 -3。",
    play: (state) => {
      state.enemy.block = Math.max(0, state.enemy.block - 6);
      advanceWork(state, 3 + state.player.momentum);
    },
  },
  supplierBackup: {
    name: "备选供应商",
    type: "阶段奖励",
    art: "defense",
    cost: 1,
    text: "时间缓冲 +8。",
    play: (state) => gainBuffer(state, 8),
  },
  supplierCredit: {
    name: "供应商账期谈判",
    type: "阶段奖励",
    art: "fund",
    cost: 1,
    text: "喵喵币 +5，压力 -1。",
    play: (state) => {
      gainFunds(state, 5);
      state.enemy.power = Math.max(0, state.enemy.power - 1);
    },
  },
  massQc: {
    name: "质量检验抽样",
    type: "阶段奖励",
    art: "defense",
    cost: 1,
    text: "阻力 -5，时间缓冲 +3。",
    play: (state) => {
      state.enemy.block = Math.max(0, state.enemy.block - 5);
      gainBuffer(state, 3);
    },
  },
  massLine: {
    name: "生产线爬坡",
    type: "阶段奖励",
    art: "attack",
    cost: 2,
    text: "核心工作 -12。",
    play: (state) => advanceWork(state, 12 + state.player.momentum),
  },
  massForecast: {
    name: "市场需求预测",
    type: "阶段奖励",
    art: "skill",
    cost: 1,
    text: "抽 2 张牌，喵喵币 +2。",
    play: (state) => {
      drawCards(state, 2);
      gainFunds(state, 2);
    },
  },
  launchKol: {
    name: "头部KOL推广",
    type: "阶段奖励",
    art: "attack",
    cost: 1,
    text: "核心工作 -6，抽 1 张牌。",
    play: (state) => {
      advanceWork(state, 6 + state.player.momentum);
      drawCards(state, 1);
    },
  },
  launchPress: {
    name: "媒体发布",
    type: "阶段奖励",
    art: "attack",
    cost: 2,
    text: "核心工作 -10，喵喵币 +2。",
    play: (state) => {
      advanceWork(state, 10 + state.player.momentum);
      gainFunds(state, 2);
    },
  },
  launchCommunity: {
    name: "用户社群裂变",
    type: "阶段奖励",
    art: "skill",
    cost: 1,
    text: "推进加成 +1，时间缓冲 +3。",
    play: (state) => {
      state.player.momentum += 1;
      gainBuffer(state, 3);
    },
  },
  iphoneFingerFirst: {
    name: "手指优先",
    type: "Mphone奖励",
    art: "skill",
    cost: 0,
    text: "核心工作 -4，推进加成 +1。",
    play: (state) => {
      advanceWork(state, 4 + state.player.momentum);
      state.player.momentum += 1;
    },
  },
  iphoneNoKeyboard: {
    name: "取消实体键盘",
    type: "Mphone奖励",
    art: "attack",
    cost: 1,
    text: "核心工作 -8，压力 +1。",
    play: (state) => {
      advanceWork(state, 8 + state.player.momentum);
      state.enemy.power += 1;
    },
  },
  iphonePurpleSprint: {
    name: "紫色计划冲刺",
    type: "Mphone奖励",
    art: "defense",
    cost: 1,
    text: "时间缓冲 +5，抽 1 张牌。",
    play: (state) => {
      gainBuffer(state, 5);
      drawCards(state, 1);
    },
  },
  iphoneCarrierControl: {
    name: "保留产品控制权",
    type: "Mphone奖励",
    art: "skill",
    cost: 1,
    text: "阻力 -5，核心工作 -4。",
    play: (state) => {
      state.enemy.block = Math.max(0, state.enemy.block - 5);
      advanceWork(state, 4 + state.player.momentum);
    },
  },
  iphoneVisualVoicemailDeal: {
    name: "可视化语音信箱协议",
    type: "Mphone奖励",
    art: "attack",
    cost: 1,
    text: "核心工作 -7，压力 -1。",
    play: (state) => {
      advanceWork(state, 7 + state.player.momentum);
      state.enemy.power = Math.max(0, state.enemy.power - 1);
    },
  },
  iphoneRevenueShare: {
    name: "服务收入分成",
    type: "Mphone奖励",
    art: "fund",
    cost: 2,
    text: "喵喵币 +9。",
    play: (state) => gainFunds(state, 9),
  },
  iphoneSpringboard: {
    name: "SpringBoard界面雏形",
    type: "Mphone奖励",
    art: "attack",
    cost: 1,
    text: "核心工作 -8。",
    play: (state) => advanceWork(state, 8 + state.player.momentum),
  },
  iphoneTouchKeyboard: {
    name: "虚拟键盘校准",
    type: "Mphone奖励",
    art: "skill",
    cost: 1,
    text: "核心工作 -5，抽 1 张牌。",
    play: (state) => {
      advanceWork(state, 5 + state.player.momentum);
      drawCards(state, 1);
    },
  },
  iphoneMemoryDiet: {
    name: "内存占用优化",
    type: "Mphone奖励",
    art: "defense",
    cost: 1,
    text: "时间缓冲 +4，阻力 -3。",
    play: (state) => {
      gainBuffer(state, 4);
      state.enemy.block = Math.max(0, state.enemy.block - 3);
    },
  },
  iphoneCorningCall: {
    name: "联系康宁玻璃",
    type: "Mphone奖励",
    art: "defense",
    cost: 1,
    text: "时间缓冲 +6。",
    play: (state) => gainBuffer(state, 6),
  },
  iphoneBatteryChart: {
    name: "续航对比图",
    type: "Mphone奖励",
    art: "skill",
    cost: 1,
    text: "剩余时间 +3，核心工作 -4。",
    play: (state) => {
      gainTime(state, 3);
      advanceWork(state, 4 + state.player.momentum);
    },
  },
  iphoneRfChamber: {
    name: "射频测试暗室",
    type: "Mphone奖励",
    art: "attack",
    cost: 2,
    text: "核心工作 -10，阻力 -2。",
    play: (state) => {
      state.enemy.block = Math.max(0, state.enemy.block - 2);
      advanceWork(state, 10 + state.player.momentum);
    },
  },
  iphoneThreeDevices: {
    name: "三合一产品叙事",
    type: "Mphone奖励",
    art: "attack",
    cost: 1,
    text: "核心工作 -7，喵喵币 +2。",
    play: (state) => {
      advanceWork(state, 7 + state.player.momentum);
      gainFunds(state, 2);
    },
  },
  iphoneDemoReset: {
    name: "演示重置脚本",
    type: "Mphone奖励",
    art: "defense",
    cost: 1,
    text: "时间缓冲 +4，压力 -1。",
    play: (state) => {
      gainBuffer(state, 4);
      state.enemy.power = Math.max(0, state.enemy.power - 1);
    },
  },
  iphonePressShock: {
    name: "媒体发布震动",
    type: "Mphone奖励",
    art: "fund",
    cost: 1,
    text: "喵喵币 +4，核心工作 -5。",
    play: (state) => {
      gainFunds(state, 4);
      advanceWork(state, 5 + state.player.momentum);
    },
  },
  iphoneSafariSdk: {
    name: "Safari应用入口",
    type: "Mphone奖励",
    art: "skill",
    cost: 1,
    text: "核心工作 -5，推进加成 +1。",
    play: (state) => {
      advanceWork(state, 5 + state.player.momentum);
      state.player.momentum += 1;
    },
  },
  iphoneWeb2Pitch: {
    name: "Web 2.0方案",
    type: "Mphone奖励",
    art: "attack",
    cost: 1,
    text: "核心工作 -8。",
    play: (state) => advanceWork(state, 8 + state.player.momentum),
  },
  iphoneActivationDryRun: {
    name: "激活流程彩排",
    type: "Mphone奖励",
    art: "defense",
    cost: 1,
    text: "时间缓冲 +5，抽 1 张牌。",
    play: (state) => {
      gainBuffer(state, 5);
      drawCards(state, 1);
    },
  },
};

Object.assign(cardCatalog, rewardCards);

const deckArtCardIds = new Set(Object.keys(cardCatalog));

function cardArtMarkup(cardId, card) {
  if (!deckArtCardIds.has(cardId)) {
    return `<span class="card-art ${card.art}" aria-hidden="true"></span>`;
  }
  return `<span class="card-art ${card.art} image-card" style="--card-art-url: url('assets/deck-art/${cardId}.png?v=reward-art-mphone-v40-20260717')" aria-hidden="true"></span>`;
}

function visualArtMarkup(className, src, label = "") {
  return `<span class="${className} image-art" style="--image-art-url: url('${src}?v=meow-cartoon-20260709')" aria-hidden="true" ${label ? `title="${escapeHtml(label)}"` : ""}></span>`;
}

function stageArtSrc(index) {
  const stageArtOverrides = {
    0: "assets/scene-art/stage0-demo-progress-v2.png",
    1: "assets/scene-art/stage1-angel-investor-v2.png",
    2: "assets/scene-art/stage2-productization-v2.png",
    3: "assets/scene-art/stage3-logistics-v2.png",
    4: "assets/scene-art/stage4-mass-production-v2.png",
    5: "assets/scene-art/stage5-publicity-v2.png",
    6: "assets/scene-art/stage6-retail-launch-v2.png",
  };
  return stageArtOverrides[index] || `assets/scene-art/stage${index}.png`;
}

function cardThemeClass(card) {
  const type = card?.type || "";
  if (type.includes("人员") || type.includes("管理")) return "card-theme-person";
  if (type.includes("喵喵币") || type.includes("资源") || type.includes("时间")) return "card-theme-fund";
  if (type.includes("宣发") || type.includes("运营") || type.includes("生态") || type.includes("策略")) return "card-theme-market";
  if (type.includes("奖励")) return "card-theme-reward";
  if (type.includes("技术") || type.includes("软件") || type.includes("硬件") || type.includes("产品") || type.includes("设计")) return "card-theme-tech";
  return "card-theme-default";
}

const strategyCardKindOrder = ["person", "tech", "fund", "time", "management", "resource", "default"];

function strategyCardKind(card) {
  const type = card?.type || "";
  if (type.includes("人员")) return "person";
  if (type.includes("技术") || type.includes("软件") || type.includes("硬件") || type.includes("产品") || type.includes("设计")) return "tech";
  if (type.includes("喵喵币")) return "fund";
  if (type.includes("时间")) return "time";
  if (type.includes("策略") || type.includes("管理")) return "management";
  if (type.includes("资源")) return "resource";
  return "default";
}

const startupStoryOpenings = [
  (stage) => `夜色落在办公室的玻璃窗上，团队把零散的灵感摊到同一张桌面。没有成熟的产品，也没有现成的答案，只有一个必须被证明的目标：${stage.target}。这一次，所有人决定先迈出最难的第一步。`,
  (stage) => `第一批回应从市场各处传来，赞许与怀疑混在一起。为了让公司继续运转，团队带着还未褪去的疲惫走进新的会面，尝试用事实说服每一位审慎的决策者。眼前的目标清晰而艰难：${stage.target}。`,
  (stage) => `白板上的箭头越来越密，原本轻盈的创意开始承受真实世界的重量。团队不再只讨论“能不能做”，而是围绕一个更具体的目标重新安排每一份精力：${stage.target}。`,
  (stage) => `办公室的门第一次真正向用户和合作伙伴敞开。需求、质疑与机会同时涌入，团队必须在嘈杂的反馈里辨认方向，让一个承诺经得起现场检验：${stage.target}。`,
  (stage) => `订单的影子已经出现在远方，供应、品质和成本却像三股逆风一同压来。为了完成${stage.target}，团队离开熟悉的白板，走进机器轰鸣、交期紧迫的现实战场。`,
  (stage) => `发布前夜，市场已经开始谈论这款尚未正式亮相的产品。团队知道，真正需要被传递的不只是功能清单，而是一种值得相信的未来。眼前的任务已经无法回避：${stage.target}。`,
  (stage) => `清晨的第一束光照进门店，等候的人群已经在街角排开。过去所有犹豫、返工和坚持，都将在今天接受市场的回答。团队守在最后一道关口，准备把最后的目标变成现实：${stage.target}。`,
];

const startupStoryObjectives = {
  样机剩余工作: "把第一台样机从设想推到可以演示的现实",
  金主疑虑: "让潜在支持者相信这支团队值得押注",
  研发待办: "把原型整理成真正能够交付的产品",
  谈判分歧: "与供应伙伴谈成一份能够长久维持的合作",
  生产风险: "让第一批产品稳定走下流水线",
  声量缺口: "让市场真正听见这项新产品的声音",
  发售待办: "让产品顺利抵达第一批用户手中",
  方向不确定性: "从彼此冲突的设想中确定产品真正的方向",
  谈判阻力: "让运营商接受一套前所未有的合作方式",
  系统待办: "让桌面系统在掌中的新设备上稳定运行",
  演示风险: "让尚未成熟的产品撑过万众瞩目的现场演示",
  硬件风险: "让玻璃面板、续航与整机可靠性同时过关",
  生态缺口: "为即将诞生的移动生态打开第一扇门",
};

const startupStoryTransitions = {
  first: ["开场的方向确定后，", "面对最先暴露的问题，", "很快，"],
  afterPressure: ["压力尚未散去，", "短暂的动荡之后，", "局势逼着大家更快作出回应，"],
  sameThread: ["沿着刚刚找到的线索，", "顺着这股刚建立起来的节奏，", "前一步带来的变化很快显出作用，"],
  newThread: ["与此同时，", "局面稍稍打开后，", "当上一项决定开始见效，", "随后，"],
};

const startupStoryBridges = {
  person: "刚刚形成的分工没有停留在会议室里。",
  tech: "测试留下的结果很快成了下一步判断的依据。",
  fund: "来之不易的喘息立刻被用在最需要它的地方。",
  time: "重新找回的节奏让团队有余力看向下一个缺口。",
  management: "刚刚达成的共识开始在具体工作中发挥作用。",
  resource: "新接通的资源很快带动了另一个停滞的环节。",
  default: "前一步留下的变化仍在团队中延续。",
};

const startupCardStoryLibrary = {
  person: [
    ({ lead, objective }) => `${lead}一位熟悉这类难题的伙伴坐到桌边，没有急着给出答案，而是先把大家忽略的细节一一指出。原本分散的争论有了共同语言，团队也更接近眼前的目标：${objective}。`,
    ({ lead, objective }) => `${lead}团队把最棘手的部分交给真正擅长它的成员。随着责任被稳稳接住，会议室里的焦虑逐渐变成清晰的分工，眼前的目标也不再显得遥远：${objective}。`,
    ({ lead, objective }) => `${lead}新的经验补上了团队一直没有察觉的盲区。几只猫围着草图重新梳理方案，终于找到一种能让所有人继续前进的办法，而目标没有改变：${objective}。`,
  ],
  tech: [
    ({ lead, objective }) => `${lead}团队停止在口头上兜圈，把争论写进原型，把猜测交给测试。屏幕上亮起的结果并不完美，却给${objective}留下了一条能够反复验证的路。`,
    ({ lead, objective }) => `${lead}工作台再次亮了起来。故障被暴露、修复，又重新接受检验；那段曾经摇摆不定的可能，渐渐变成可靠的证据，也让团队离眼前的目标更近一步：${objective}。`,
    ({ lead, objective }) => `${lead}工程猫们把难题拆成几个能够验证的小部分。杂乱的线索被重新连接，“${objective}”不再只是纸面上的愿望，而开始以真实的形态运转。`,
  ],
  fund: [
    ({ lead, objective }) => `${lead}账本上那条绷紧的线终于松开了一点。团队仍谈不上宽裕，却争取到足够的喘息，能够把注意力重新放回眼前的目标：${objective}。`,
    ({ lead, objective }) => `${lead}有限的筹码被重新安排，每一笔投入都有了明确的去处。那些一度被迫搁置的工作重新回到桌面，也为眼前的目标补上了缺失的一环：${objective}。`,
    ({ lead, objective }) => `${lead}一份关键支持在最后时刻落定。它没有让所有困难消失，却给了团队继续承担风险、坚持${objective}的底气。`,
  ],
  time: [
    ({ lead, objective }) => `${lead}团队从拥挤的日程里抢回一段完整时间。大家关掉无关的消息，把难得的安静全部留给眼前的目标：${objective}。`,
    ({ lead, objective }) => `${lead}轻重缓急被重新排开，最重要的事情终于可以先发生。节奏恢复之后，“${objective}”不再被接连不断的琐事打断。`,
    ({ lead, objective }) => `${lead}几只疲惫的猫重新校准了步调。急迫并没有消失，但团队终于能用更从容、更少返工的方式去${objective}。`,
  ],
  management: [
    ({ lead, objective }) => `${lead}模糊的责任被逐一说清，绕远的沟通也被及时截断。所有成员重新朝向同一个方向，团队终于能专心${objective}。`,
    ({ lead, objective }) => `${lead}一场几乎失控的讨论重新有了边界。分歧没有被掩盖，而是被整理成可以执行的决定，扫开内耗之后，团队得以继续${objective}。`,
    ({ lead, objective }) => `${lead}团队重新确认什么值得坚持、什么可以暂时放下。选择变少以后，“${objective}”反而变得清晰而具体。`,
  ],
  resource: [
    ({ lead, objective }) => `${lead}散落在各处的资源被聚到同一个目标下。原本缺口重重的计划重新闭合，团队又有了继续${objective}的条件。`,
    ({ lead, objective }) => `${lead}一条意料之外的通路出现在眼前。团队顺势连接伙伴与工具，越过原先难以跨越的门槛，继续${objective}。`,
    ({ lead, objective }) => `${lead}有限的条件开始彼此补足。一次聪明的组合没有凭空创造奇迹，却为${objective}换来了新的空间。`,
  ],
  default: [
    ({ lead, objective }) => `${lead}团队抓住短暂的窗口，把犹豫变成行动。这并不是解决所有问题的捷径，却让每只猫都离目标更近一步，而目标正是：${objective}。`,
    ({ lead, objective }) => `${lead}一个停滞已久的环节重新运转，团队的气氛也随之改变。大家没有停下来庆祝，而是继续推进眼前的目标：${objective}。`,
    ({ lead, objective }) => `${lead}眼前的线索终于被转化成一次具体行动。变化虽然细小，却恰好接住了前面的努力，也让“${objective}”有了新的可能。`,
  ],
};

function storyChapterTitle(stage) {
  return `章节 · ${stage.title}`;
}

function createStartupStoryOpening(stage, stageIndex) {
  const writer = startupStoryOpenings[stageIndex] || startupStoryOpenings[startupStoryOpenings.length - 1];
  return writer({ ...stage, target: startupStoryObjective(stage) });
}

function addStoryEntry(state, text, kind = "action") {
  if (!state || !text) return;
  if (!Array.isArray(state.storyEntries)) state.storyEntries = [];
  state.storyEntries.push({ kind, text });
}

function startupStoryObjective(stage) {
  return startupStoryObjectives[stage.target] || `把“${stage.title}”这一阶段真正向前推进`;
}

function storyTransition(game, kind, actionCount) {
  const lastEntry = game.storyEntries[game.storyEntries.length - 1];
  let options = startupStoryTransitions.newThread;
  if (actionCount === 0) options = startupStoryTransitions.first;
  else if (lastEntry?.kind === "pressure") options = startupStoryTransitions.afterPressure;
  else if (game.storyThread === kind) options = startupStoryTransitions.sameThread;
  else if (game.storyThread) return startupStoryBridges[game.storyThread] || startupStoryBridges.default;
  return options[actionCount % options.length];
}

async function createCardStory(game, card) {
  const kind = strategyCardKind(card);
  const library = startupCardStoryLibrary[kind] || startupCardStoryLibrary.default;
  const actionCount = game.storyEntries.filter((entry) => entry.kind === "action").length;
  const previousEntry = game.storyEntries[game.storyEntries.length - 1];
  const previousThread = game.storyThread || "";
  const objective = startupStoryObjective(game.stage);
  let story = library[actionCount % library.length]({
    lead: storyTransition(game, kind, actionCount),
    objective,
  });

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 900);
  try {
    const response = await fetch("/api/story/continue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        objective,
        actionCount,
        previousKind: previousEntry?.kind || "opening",
        previousThread,
        previousText: previousEntry?.text || "",
        sameThread: previousThread === kind,
      }),
      signal: controller.signal,
    });
    if (response.ok) {
      const result = await response.json();
      if (typeof result.text === "string" && result.text.trim()) {
        story = result.text.trim();
        game.storyEngine = result.engine || "local";
      }
    }
  } catch (error) {
    if (error?.name !== "AbortError") console.debug("Local story service fallback", error);
  } finally {
    window.clearTimeout(timeoutId);
  }
  game.storyThread = kind;
  return story;
}

function createPressureStory(game, intent) {
  const stage = game.stage;
  const objective = startupStoryObjective(stage);
  if (intent.kind === "attack") {
    return `然而，${stage.enemyName}很快把新的期限压到桌面上，突如其来的催促吞掉了刚刚建立的从容。猫们守住还能守住的时间，仍然没有放弃${objective}。`;
  }
  if (intent.kind === "block") {
    return `${stage.enemyName}带来新的质疑，${stage.blockText}像一道临时筑起的墙挡在前方。团队不得不放慢一步，寻找更有说服力的突破口。`;
  }
  return `${stage.enemyName}持续施压，${stage.powerText}在空气里悄悄累积。团队意识到，接下来的每个决定都必须更果断。`;
}

function createChapterClosing(game) {
  return `此前的每一次选择终于在此刻汇到一起，“${startupStoryObjective(game.stage)}”不再只是任务清单上的一句话，而成了团队共同完成的事实。办公室短暂安静下来，大家收好桌上的草稿，带着这一章留下的经验继续向前。`;
}

function storeStoryChapter(campaign, game) {
  if (!Array.isArray(campaign.storyChapters)) campaign.storyChapters = [];
  const chapter = {
    stageIndex: game.stageIndex,
    title: game.stage.title,
    entries: game.storyEntries.map((entry) => ({ ...entry })),
  };
  const existingIndex = campaign.storyChapters.findIndex((item) => item.stageIndex === game.stageIndex);
  if (existingIndex >= 0) campaign.storyChapters[existingIndex] = chapter;
  else campaign.storyChapters.push(chapter);
}

function compileStartupStory(campaign) {
  const chapters = [...(campaign.storyChapters || [])]
    .sort((a, b) => a.stageIndex - b.stageIndex)
    .map((chapter) => `《${chapter.title}》\n\n${chapter.entries.map((entry) => entry.text).join("\n\n")}`);
  return `《一家创业公司的诞生》\n\n${chapters.join("\n\n—— · ——\n\n")}\n\n【尾声】\n故事在产品发售这一天完成了第一个阶段，却没有真正结束。曾经只存在于讨论中的想法，如今已经进入现实市场；团队也在一次次选择、验证和交付中，建立起继续创造下一段故事的能力。`;
}

function strategyCardDisplayType(card) {
  return strategyCardKind(card) === "management" ? "管理" : card?.type || "卡牌";
}

function orderedInitialCardIds() {
  return currentInitialCardIds()
    .map((id, index) => ({ id, index, kind: strategyCardKind(cardCatalog[id]) }))
    .sort((a, b) => strategyCardKindOrder.indexOf(a.kind) - strategyCardKindOrder.indexOf(b.kind) || a.index - b.index)
    .map((item) => item.id);
}

function cardParamKind(label) {
  if (label.includes("行动力")) return "energy";
  if (label.includes("喵喵币")) return "fund";
  if (label.includes("时间")) return "time";
  if (label.includes("核心工作")) return "work";
  if (label.includes("阻力") || label.includes("压力")) return "risk";
  if (label.includes("抽") || label.includes("牌")) return "draw";
  if (label.includes("推进")) return "momentum";
  return "default";
}

function cardParamsMarkup(card) {
  const params = card.text
    .split(/[，,]/)
    .map((item) => item.trim().replace(/[。.]$/, ""))
    .filter(Boolean);
  if (card.fundCost) params.unshift(`喵喵币 -${formatFundsAmount(card.fundCost)}`);
  return `
    <span class="card-params" aria-label="卡牌参数">
      ${params.map((label) => `<span class="card-param-tag card-param-${cardParamKind(label)}">${label}</span>`).join("")}
    </span>
  `;
}

function cardTypeIconMarkup(card) {
  const type = strategyCardDisplayType(card);
  const kind = strategyCardKind(card);
  let icon = '<path d="M6 5h12v14H6z"></path><path d="M9 9h6M9 13h6"></path>';

  if (kind === "person") {
    icon = '<circle cx="12" cy="8" r="3.2"></circle><path d="M5.5 19c.8-4 3-6 6.5-6s5.7 2 6.5 6"></path>';
  } else if (kind === "tech") {
    icon = '<rect x="6" y="6" width="12" height="12" rx="1"></rect><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4M10 10h4v4h-4z"></path>';
  } else if (kind === "fund") {
    icon = '<circle cx="12" cy="12" r="8"></circle><path d="m9 7 3 5 3-5M9 12h6M9 15h6M12 12v6"></path>';
  } else if (kind === "time") {
    icon = '<circle cx="12" cy="12" r="8"></circle><path d="M12 7v5l3 2"></path>';
  } else if (kind === "management") {
    icon = '<circle cx="12" cy="6" r="2.5"></circle><circle cx="6" cy="17" r="2.5"></circle><circle cx="18" cy="17" r="2.5"></circle><path d="M10.8 8.2 7.2 14.8M13.2 8.2l3.6 6.6M8.5 17h7"></path>';
  } else if (kind === "resource") {
    icon = '<path d="m4 8 8-4 8 4-8 4z"></path><path d="M4 8v8l8 4 8-4V8M12 12v8"></path>';
  }

  return `<span class="card-type-icon card-type-icon-${kind}" aria-label="卡牌类型：${type}" title="${type}"><svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg></span>`;
}

const specialEvents = [
  {
    id: "policy_subsidy",
    name: "喵喵币补助窗口",
    positive: "获得 8 点喵喵币，商店价格永久 -1。",
    negative: "申报材料增加，后续敌人血量 +5%。",
    effect: { funds: 8, shopDiscount: 1, enemyHpPct: 0.05 },
  },
  {
    id: "regulation_shift",
    name: "监管口径变化",
    positive: "街区规则更清晰，后续关卡开始时获得 2 点时间缓冲。",
    negative: "合规喵喵币成本上升，后续敌人攻击 +1。",
    effect: { startBuffer: 2, attackDelta: 1 },
  },
  {
    id: "pandemic_wave",
    name: "公共卫生事件",
    positive: "线上需求增长，关卡难度系数 -0.04。",
    negative: "线下推进受阻，当前剩余时间 -4 天。",
    effect: { difficulty: -0.04, time: -4 },
  },
  {
    id: "supply_shortage",
    name: "关键物料短缺",
    positive: "团队提前建立供应冗余，后续关卡开始时获得 3 点时间缓冲。",
    negative: "采购成本上升，喵喵币 -5。",
    effect: { startBuffer: 3, funds: -5 },
  },
  {
    id: "media_attention",
    name: "媒体突然关注",
    positive: "品牌曝光带来机会，喵喵币 +4，后续阶段喵喵币奖励 +2。",
    negative: "舆论压力提高，后续敌人攻击 +1。",
    effect: { funds: 4, rewardFunds: 2, attackDelta: 1 },
  },
  {
    id: "platform_rule",
    name: "平台规则调整",
    positive: "获客路径更集中，后续敌人血量 -4%。",
    negative: "平台审核更慢，当前最大时间 -2。",
    effect: { enemyHpPct: -0.04, maxTime: -2 },
  },
  {
    id: "talent_wave",
    name: "人才市场松动",
    positive: "招聘更容易，关卡难度系数 -0.03。",
    negative: "薪酬预算增加，喵喵币 -3。",
    effect: { difficulty: -0.03, funds: -3 },
  },
  {
    id: "competitor_launch",
    name: "竞品抢先开摊",
    positive: "市场教育完成，后续敌人血量 -6%。",
    negative: "窗口期缩短，当前剩余时间 -3 天。",
    effect: { enemyHpPct: -0.06, time: -3 },
  },
];

const iphoneSpecialEvents = [
  {
    id: "iphone_apple_inc",
    name: "2007-01-09：公司品牌转型",
    positive: "发布会上，公司以更完整的消费电子品牌形象亮相，外界开始接受它不再只是一家电脑公司。后续阶段喵喵币奖励 +2。",
    negative: "“重新定义手机”的承诺显著抬高公众预期，后续敌人血量 +1%。",
    effect: { rewardFunds: 2, enemyHpPct: 0.01 },
  },
  {
    id: "iphone_cisco_name",
    name: "2007-01-10：产品名称争议",
    positive: "Mphone 这个名字被全行业看见，媒体声量持续升温。喵喵币 +3。",
    negative: "名称争议增加法务与谈判消耗，后续敌人血量 +1%。",
    effect: { funds: 3, enemyHpPct: 0.01 },
  },
  {
    id: "iphone_fcc_approval",
    name: "2007-05-17：监管审批通过",
    positive: "高塔议会审批通过，6 月上市路径更明确，关卡难度系数 -0.03。",
    negative: "硬件规格和上市节奏被进一步锁定，当前最大时间 -1。",
    effect: { difficulty: -0.03, maxTime: -1 },
  },
  {
    id: "iphone_wwdc_webapps",
    name: "2007-06-11：开发者大会 Web 应用",
    positive: "浏览器 Web 应用成为第三方应用入口，后续关卡开始时获得 2 点时间缓冲。",
    negative: "没有原生匠具包的质疑开始出现，后续敌人血量 +1%。",
    effect: { startBuffer: 2, enemyHpPct: 0.01 },
  },
  {
    id: "iphone_glass_battery",
    name: "2007-06-18：玻璃面板与续航",
    positive: "公司公布光学级玻璃面板和更长续航，当前剩余时间 +4。",
    negative: "临近发售改良硬件，供应和验证压力上升，后续敌人血量 +1%。",
    effect: { time: 4, enemyHpPct: 0.01 },
  },
  {
    id: "iphone_launch_eve",
    name: "员工机与首发排队",
    positive: "员工获赠 Mphone，品牌门店首发热度成形。喵喵币 +4，开局缓冲 +2。",
    negative: "合约激活、排队与库存协调进入高压状态，后续敌人血量 +1%。",
    effect: { funds: 4, startBuffer: 2, enemyHpPct: 0.01 },
  },
];

const iphoneProgressReports = [
  "进度说明：产品方向从为便携音乐播放器增加通话功能，转向更具突破性的全触控智能设备。Mphone 项目围绕多点触控、保密协作和关键原型持续推进。",
  "进度说明：运营商合作不再沿用传统定制机模式。Mphone 团队争取到少见的产品与营销控制权，同时承担网络适配、激活流程和独家合作带来的压力。",
  "进度说明：团队把桌面级操作系统的能力压缩到移动设备，围绕主屏界面、触控输入、完整浏览器和核心应用搭建第一代移动系统。",
  "进度说明：2007-01-09，Mphone 在发布会上被定义为音乐播放器、手机和互联网通信设备三合一。演示取得成功，产品也正式进入上市倒计时。",
  "进度说明：发布会后到 6 月上市前，团队继续解决耐刮玻璃、续航、无线信号和批量验证问题。2007-06-18，公司对外确认采用玻璃面板并提升电池续航。",
  "进度说明：2007-06-11 的开发者大会上，公司宣布 Mphone 将支持基于浏览器的 Web 应用。开发者入口由此打开，但原生应用生态仍有待建立。",
  "进度说明：2007-06-29，Mphone 在品牌门店与运营商门店正式发售。排队、合约激活和首批媒体评测共同推动产品进入大众市场。",
];

const iphoneFinalReport =
  "发售成功：2007-06-29，Mphone 正式上市。\n\n市场影响：Mphone 推动手机从由运营商主导的功能清单，转向以触控体验、完整浏览器和软硬件一体化为核心的移动计算平台。运营商开始重新评估与设备厂商之间的合作关系，开发者生态也在随后一年通过 Mphone SDK 与应用商店快速扩张。\n\n公司后续：Mphone 在上市 74 天后售出第 100 万部；2008 年，公司推出后续机型并上线应用商店。Mphone 随后成为公司的核心业务之一，并长期改变智能手机、移动互联网和应用分发生态。";

const currentPagePath = window.location.pathname.toLowerCase();
const demoParams = new URLSearchParams(window.location.search);
const demoView = demoParams.get("view") || "";
const demoUi = demoParams.get("ui") || "";
const isStandalonePersonaTest = demoView === "deck";
const isStandaloneCampaignTest = demoView === "campaign";
const isStandaloneBattleTest = demoView === "battle" || demoUi.startsWith("demo-");
const isStandaloneCampaignFlowTest = isStandaloneCampaignTest || isStandaloneBattleTest;
const isStandaloneRewardDemo = isStandaloneBattleTest
  && demoUi === "demo-reward-persist-v18-20260716";
const isStandaloneFailureDemo = isStandaloneBattleTest
  && demoUi === "demo-stage-failure-v1-20260717";
const isStandaloneEventDemo = isStandaloneBattleTest
  && demoUi === "demo-event-persist-v1-20260717";
const isStandaloneFinaleDemo = isStandaloneBattleTest
  && demoUi === "demo-final-story-v1-20260717";

function createStandaloneCampaignTestState() {
  const activeDeck = defaultInitialCardIds.slice(0, 8);
  const track = tracks.find((item) => item.id === "health");
  return {
    trackId: track.id,
    ownedCards: [...activeDeck],
    activeDeck: [...activeDeck],
    time: track.base.time,
    maxTime: track.base.time + 6,
    funds: track.base.funds * FUND_SCALE,
    difficulty: track.base.difficulty,
    unlockedStage: 0,
    completedStages: [],
    pendingStage: null,
    pendingEvent: null,
    eventMods: createEventMods(),
    eventHistory: [],
    storyChapters: [],
    rewardChoices: [],
    shopOffers: [],
  };
}

const appState = {
  screen: isStandaloneCampaignFlowTest ? "campaign" : isStandalonePersonaTest ? "deck" : "track",
  editorReturnScreen: isStandaloneCampaignFlowTest ? "campaign" : isStandalonePersonaTest ? "deck" : "track",
  trackId: isStandalonePersonaTest || isStandaloneCampaignFlowTest ? "health" : null,
  personas: { core: [null, null], opportunity: [null, null, null, null] },
  selectedDeck: isStandaloneCampaignFlowTest ? defaultInitialCardIds.slice(0, 8) : [],
  campaign: isStandaloneCampaignFlowTest ? createStandaloneCampaignTestState() : null,
  battle: null,
};

const standaloneRewardStateKey = "startup-card-game-demo:standalone-reward:v1";

function syncStandaloneRewardState() {
  if (!isStandaloneBattleTest) return;
  try {
    const hasRewardState = appState.screen === "reward" && appState.campaign?.rewardChoices?.length;
    const hasEventState = appState.screen === "event" && appState.campaign?.pendingEvent;
    if (hasRewardState || hasEventState) {
      localStorage.setItem(
        standaloneRewardStateKey,
        JSON.stringify({
          screen: appState.screen,
          campaign: appState.campaign,
        }),
      );
      return;
    }
    localStorage.removeItem(standaloneRewardStateKey);
  } catch (error) {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
}

function restoreStandaloneRewardState() {
  if (!isStandaloneBattleTest) return false;
  try {
    const saved = JSON.parse(localStorage.getItem(standaloneRewardStateKey) || "null");
    const campaign = saved?.campaign;
    appState.trackId = campaign?.trackId || "health";
    const validStage = Number.isInteger(campaign?.pendingStage) && currentStages()[campaign.pendingStage];
    const validRewards = Array.isArray(campaign?.rewardChoices) && campaign.rewardChoices.some((cardId) => cardCatalog[cardId]);
    const validRewardState = saved?.screen === "reward" && validRewards;
    const validEventState = saved?.screen === "event" && campaign?.pendingEvent?.id;
    if (!validStage || (!validRewardState && !validEventState)) return false;
    campaign.eventMods = { ...createEventMods(), ...(campaign.eventMods || {}) };
    campaign.eventHistory = campaign.eventHistory || [];
    campaign.storyChapters = campaign.storyChapters || [];
    campaign.rewardChoices = (campaign.rewardChoices || []).filter((cardId) => cardCatalog[cardId]);
    appState.selectedDeck = [...(campaign.activeDeck || defaultInitialCardIds.slice(0, 8))];
    appState.campaign = campaign;
    appState.battle = null;
    appState.screen = saved.screen;
    return true;
  } catch (error) {
    localStorage.removeItem(standaloneRewardStateKey);
    return false;
  }
}

function startStandaloneRewardDemo() {
  const campaign = createStandaloneCampaignTestState();
  const requestedRoute = new URLSearchParams(window.location.search).get("route");
  if (requestedRoute === "mphone") {
    const route = tracks.find((track) => track.id === "iphone");
    campaign.trackId = route.id;
    campaign.ownedCards = [...iphoneStarterDeck];
    campaign.activeDeck = [...iphoneStarterDeck];
    campaign.time = route.base.time;
    campaign.maxTime = route.base.time + 6;
    campaign.funds = route.base.funds * FUND_SCALE;
    campaign.difficulty = route.base.difficulty;
    appState.trackId = route.id;
    appState.campaign = campaign;
  }
  const requestedChapter = Number(new URLSearchParams(window.location.search).get("chapter") || 1);
  const lastRewardStage = Math.max(0, currentStageRewardIds().length - 1);
  const stageIndex = Math.min(lastRewardStage, Math.max(0, Math.trunc(requestedChapter) - 1));
  campaign.time = 25;
  campaign.maxTime = 36;
  campaign.funds = 200;
  campaign.completedStages = Array.from({ length: stageIndex + 1 }, (_, index) => index);
  campaign.unlockedStage = Math.min(currentStages().length - 1, stageIndex + 1);
  campaign.pendingStage = stageIndex;
  campaign.rewardChoices = [...(currentStageRewardIds()[stageIndex] || [])];
  appState.trackId = campaign.trackId;
  appState.selectedDeck = [...campaign.activeDeck];
  appState.campaign = campaign;
  appState.battle = null;
  appState.screen = "reward";
  render();
}

function startStandaloneFailureDemo() {
  const campaign = createStandaloneCampaignTestState();
  const requestedChapter = Number(new URLSearchParams(window.location.search).get("chapter") || 1);
  const stageIndex = Math.min(currentStages().length - 1, Math.max(0, Math.trunc(requestedChapter) - 1));
  campaign.time = 9;
  campaign.maxTime = 36;
  campaign.funds = 200;
  campaign.unlockedStage = stageIndex;
  appState.trackId = campaign.trackId;
  appState.selectedDeck = [...campaign.activeDeck];
  appState.campaign = campaign;
  appState.battle = null;
  startStage(stageIndex);

  const game = appState.battle;
  if (!game) return;
  game.round = Math.min(game.stage.rounds, Math.max(2, Math.ceil(game.stage.rounds * 0.7)));
  game.player.hp = 0;
  game.enemy.hp = Math.max(1, Math.round(game.enemy.maxHp * 0.34));
  game.gameOver = true;
  game.phase = "over";
  render();
  showStageFailure(game, "剩余时间归零，团队没能在截止铃响前完成本章目标。");
}

function startStandaloneFinaleDemo() {
  const campaign = createStandaloneCampaignTestState();
  const stageList = currentStages();
  campaign.completedStages = stageList.map((_, index) => index);
  campaign.unlockedStage = stageList.length - 1;
  campaign.pendingStage = stageList.length - 1;
  campaign.storyChapters = stageList.map((stage, stageIndex) => ({
    stageIndex,
    title: stage.title,
    entries: [
      { kind: "opening", text: createStartupStoryOpening(stage, stageIndex) },
      { kind: "closing", text: `团队完成了“${startupStoryObjective(stage)}”，把这一章的经验沉淀为继续前进的能力。` },
    ],
  }));
  appState.trackId = campaign.trackId;
  appState.selectedDeck = [...campaign.activeDeck];
  appState.campaign = campaign;
  appState.screen = "campaign";
  render();
  const completeStory = compileStartupStory(campaign);
  showModal(
    "创业故事汇",
    completeStory,
    `返回${campaignFlowStep(campaign.trackId)}`,
    () => {
      appState.battle = null;
      appState.screen = "campaign";
      render();
    },
    { anthology: true, chapterComplete: true, icon: "✦" },
  );
}

function startStandaloneEventDemo() {
  startStandaloneRewardDemo();
  const rewardId = appState.campaign?.rewardChoices?.[0];
  if (rewardId) chooseReward(rewardId);
  if (appState.campaign) appState.campaign.shopOffers = createShopOffers();
}

let modalAction = null;

function getPersonaPoolScroll() {
  return document.querySelector(".persona-layout .side-panel")?.scrollTop || 0;
}

function restorePersonaPoolScroll(scrollTop) {
  requestAnimationFrame(() => {
    const panel = document.querySelector(".persona-layout .side-panel");
    if (panel) panel.scrollTop = scrollTop;
  });
}

function currentTrack() {
  return tracks.find((track) => track.id === appState.trackId);
}

function isIphoneRoute(trackId = appState.campaign?.trackId || appState.trackId) {
  return trackId === "iphone";
}

function currentStages() {
  return isIphoneRoute() ? iphoneStages : stages;
}

function currentInitialCardIds(trackId = appState.campaign?.trackId || appState.trackId) {
  return trackId === "iphone" ? iphoneInitialCardIds : defaultInitialCardIds;
}

function currentStageRewardIds() {
  return isIphoneRoute() ? iphoneStageRewardIds : stageRewardIds;
}

function currentSpecialEvents() {
  return isIphoneRoute() ? iphoneSpecialEvents : specialEvents;
}

function selectedTraitIds() {
  return [...appState.personas.core, ...appState.personas.opportunity].filter(Boolean);
}

function traitById(id) {
  return currentTrack()?.traits?.find((trait) => trait.id === id);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function tipAttr(text) {
  return `data-tip="${escapeHtml(text)}"`;
}

function formatFundsAmount(value) {
  return `${Number(value) || 0}${FUND_UNIT}`;
}

function formatFundDelta(value) {
  const amount = Number(value) || 0;
  const sign = amount > 0 ? "+" : amount < 0 ? "-" : "";
  return `${sign}${formatFundsAmount(Math.abs(amount))}`;
}

function formatLegacyFundDelta(sign, amount) {
  return `${sign}${formatFundsAmount(Number(amount) * FUND_SCALE)}`;
}

function formatDays(value) {
  const scaledDays = Math.max(0, Math.round(((Number(value) || 0) * TIME_SCALE) / DAYS_PER_WEEK) * DAYS_PER_WEEK);
  return `${scaledDays / DAYS_PER_WEEK}周`;
}

function formatDayDelta(value) {
  const amount = Number(value) || 0;
  const sign = amount > 0 ? "+" : amount < 0 ? "-" : "";
  return `${sign}${formatDays(Math.abs(amount))}`;
}

function formatLegacyDayDelta(sign, amount) {
  return `${sign}${formatDays(Number(amount))}`;
}

function scaleMoneyFields(value) {
  if (Array.isArray(value)) {
    value.forEach(scaleMoneyFields);
    return;
  }

  if (!value || typeof value !== "object") return;

  Object.entries(value).forEach(([key, current]) => {
    if (MONEY_FIELD_NAMES.has(key) && typeof current === "number") {
      value[key] = current * FUND_SCALE;
      return;
    }
    scaleMoneyFields(current);
  });
}

function scaleMoneyText(text) {
  return String(text)
    .replace(/获得\s*(\d+)(?![\d\s]*万)\s*点喵喵币/g, (_, amount) => `获得 ${formatFundsAmount(Number(amount) * FUND_SCALE)}喵喵币`)
    .replace(/阶段喵喵币奖励\s*([+-])\s*(\d+)(?![\d\s]*万)/g, (_, sign, amount) => `阶段喵喵币奖励 ${formatLegacyFundDelta(sign, amount)}`)
    .replace(/喵喵币\s*([+-])\s*(\d+)(?![\d\s]*万)/g, (_, sign, amount) => `喵喵币 ${formatLegacyFundDelta(sign, amount)}`)
    .replace(/商店价格(永久)?\s*([+-])\s*(\d+)(?![\d\s]*万)/g, (_, permanent = "", sign, amount) => `商店价格${permanent} ${formatLegacyFundDelta(sign, amount)}`);
}

function scaleTimeText(text) {
  return String(text)
    .replace(/获得\s*(\d+)\s*点时间缓冲/g, (_, amount) => `获得 ${formatDays(amount)} 时间缓冲`)
    .replace(/(当前剩余时间|当前最大时间|剩余时间|时间缓冲|路线时间|开局缓冲|时间)\s*([+-])\s*(\d+)\s*(?:天|周)/g, (_, label, sign, amount) => `${label} ${formatLegacyDayDelta(sign, amount)}`)
    .replace(/(当前剩余时间|当前最大时间|剩余时间|时间缓冲|路线时间|开局缓冲|时间)\s*([+-])\s*(\d+)(?!\s*(?:天|周))/g, (_, label, sign, amount) => `${label} ${formatLegacyDayDelta(sign, amount)}`);
}

function normalizeMoneyTextFields(value) {
  if (Array.isArray(value)) {
    value.forEach(normalizeMoneyTextFields);
    return;
  }

  if (!value || typeof value !== "object") return;

  Object.entries(value).forEach(([key, current]) => {
    if (MONEY_TEXT_FIELD_NAMES.has(key) && typeof current === "string") {
      value[key] = scaleTimeText(scaleMoneyText(current));
      return;
    }
    normalizeMoneyTextFields(current);
  });
}

function scaleDefaultMoneyData() {
  [tracks, stages, iphoneStages, legacySpecialEvents, specialEvents, iphoneSpecialEvents, cardCatalog].forEach(scaleMoneyFields);
}

function normalizeGameMoneyText() {
  [legacySpecialEvents, specialEvents, iphoneSpecialEvents, cardCatalog].forEach(normalizeMoneyTextFields);
}

function contentStorageKey() {
  return CURRENT_CONTENT_STORAGE_KEY;
}

function legacyContentStorageKeys() {
  return LEGACY_CONTENT_STORAGE_KEYS;
}

function editableRouteId() {
  return appState.campaign?.trackId || appState.trackId || "demo";
}

function editableRouteName(routeId = editableRouteId()) {
  return routeId === "iphone" ? "Mphone 的诞生产品案例路线" : "自由创业路线";
}

function editableStages(routeId = editableRouteId()) {
  return routeId === "iphone" ? iphoneStages : stages;
}

function editableEvents(routeId = editableRouteId()) {
  return routeId === "iphone" ? iphoneSpecialEvents : specialEvents;
}

function serializeStages(stageList) {
  return stageList.map(({ title, short, enemyName, target, hp, attack, rounds, blockText, powerText, intro, rewardFunds, recover }) => ({
    title,
    short,
    enemyName,
    target,
    hp,
    attack,
    rounds,
    blockText,
    powerText,
    intro,
    rewardFunds,
    recover,
  }));
}

function serializeEvents(eventList) {
  return eventList.map(({ id, name, positive, negative, effect }) => ({
    id,
    name,
    positive,
    negative,
    effect: { ...effect },
  }));
}

function editableContentSnapshot(routeId = editableRouteId()) {
  return {
    routeId,
    routeName: editableRouteName(routeId),
    stages: serializeStages(editableStages(routeId)),
    events: serializeEvents(editableEvents(routeId)),
    cards: Object.fromEntries(
      Object.entries(cardCatalog).map(([id, card]) => [
        id,
        {
          name: card.name,
          type: card.type,
          cost: card.cost,
          price: card.price || "",
          text: card.text,
        },
      ]),
    ),
  };
}

function applyStageEdits(stageList, stageEdits) {
  stageEdits?.forEach((stageEdit, index) => {
    if (!stageList[index]) return;
    Object.assign(stageList[index], {
      title: stageEdit.title ?? stageList[index].title,
      short: stageEdit.short ?? stageList[index].short,
      enemyName: stageEdit.enemyName ?? stageList[index].enemyName,
      target: stageEdit.target ?? stageList[index].target,
      hp: Number(stageEdit.hp) || stageList[index].hp,
      attack: Number(stageEdit.attack) || stageList[index].attack,
      rounds: Number(stageEdit.rounds) || stageList[index].rounds,
      blockText: stageEdit.blockText ?? stageList[index].blockText,
      powerText: stageEdit.powerText ?? stageList[index].powerText,
      intro: stageEdit.intro ?? stageList[index].intro,
      rewardFunds: Number(stageEdit.rewardFunds) || 0,
      recover: Number(stageEdit.recover) || 0,
    });
  });
}

function applyEventEdits(eventList, eventEdits) {
  eventEdits?.forEach((eventEdit, index) => {
    if (!eventList[index]) return;
    eventList[index].name = eventEdit.name ?? eventList[index].name;
    eventList[index].positive = eventEdit.positive ?? eventList[index].positive;
    eventList[index].negative = eventEdit.negative ?? eventList[index].negative;
    eventList[index].effect = { ...eventList[index].effect, ...(eventEdit.effect || {}) };
  });
}

function applyContentSnapshot(snapshot) {
  if (snapshot?.routes) {
    applyStageEdits(stages, snapshot.routes.demo?.stages);
    applyEventEdits(specialEvents, snapshot.routes.demo?.events);
    applyStageEdits(iphoneStages, snapshot.routes.iphone?.stages);
    applyEventEdits(iphoneSpecialEvents, snapshot.routes.iphone?.events);
  } else {
    applyStageEdits(stages, snapshot?.stages);
    applyEventEdits(specialEvents, snapshot?.events);
  }

  Object.entries(snapshot?.cards || {}).forEach(([id, cardEdit]) => {
    if (!cardCatalog[id]) return;
    cardCatalog[id].name = cardEdit.name ?? cardCatalog[id].name;
    cardCatalog[id].type = cardEdit.type ?? cardCatalog[id].type;
    cardCatalog[id].cost = Number(cardEdit.cost) || 0;
    cardCatalog[id].price = cardEdit.price === "" ? undefined : Number(cardEdit.price) || undefined;
    cardCatalog[id].text = cardEdit.text ?? cardCatalog[id].text;
  });
}

function loadContentEdits() {
  try {
    const saved = localStorage.getItem(contentStorageKey());
    if (saved) {
      scaleDefaultMoneyData();
      applyContentSnapshot(JSON.parse(saved));
      normalizeGameMoneyText();
      return;
    }
  } catch (error) {
    console.warn("内容编辑器配置读取失败", error);
  }

  try {
    const legacySaved = legacyContentStorageKeys().map((key) => localStorage.getItem(key)).find(Boolean);
    if (legacySaved) applyContentSnapshot(JSON.parse(legacySaved));
  } catch (error) {
    console.warn("旧版内容编辑器配置读取失败", error);
  }

  scaleDefaultMoneyData();
  normalizeGameMoneyText();
}

function saveContentEdits() {
  localStorage.setItem(
    contentStorageKey(),
    JSON.stringify({
      moneyUnitVersion: 2,
      routes: {
        demo: {
          stages: serializeStages(stages),
          events: serializeEvents(specialEvents),
        },
        iphone: {
          stages: serializeStages(iphoneStages),
          events: serializeEvents(iphoneSpecialEvents),
        },
      },
      cards: editableContentSnapshot().cards,
    }),
  );
}

function calculateProfile() {
  const track = currentTrack();
  if (!track) return { time: 0, maxTime: 0, funds: 0, difficulty: 1 };

  let time = track.base.time;
  let funds = track.base.funds;
  let difficulty = track.base.difficulty;

  appState.personas.core.forEach((traitId) => {
    const trait = traitById(traitId);
    if (!trait) return;
    time += trait.effect.time * CORE_PERSONA_MULTIPLIER;
    funds += trait.effect.funds * CORE_PERSONA_MULTIPLIER;
    difficulty += trait.effect.difficulty * CORE_PERSONA_MULTIPLIER;
  });

  appState.personas.opportunity.forEach((traitId) => {
    const trait = traitById(traitId);
    if (!trait) return;
    time += trait.effect.time * OPPORTUNITY_PERSONA_MULTIPLIER;
    funds += trait.effect.funds * OPPORTUNITY_PERSONA_MULTIPLIER;
    difficulty += trait.effect.difficulty * OPPORTUNITY_PERSONA_MULTIPLIER;
  });

  time = clamp(Math.round(time), 18, 34);
  funds = clamp(Math.round(funds), 6 * FUND_SCALE, 32 * FUND_SCALE);
  difficulty = clamp(Number(difficulty.toFixed(2)), 0.78, 1.35);

  return { time, maxTime: Math.max(30, time + 6), funds, difficulty };
}

function stepHeader(activeStep, title, subtitle) {
  const activeSteps = currentFlowSteps();
  return `
    <section class="topbar" aria-label="流程状态">
      <div class="brand">
        <span class="brand-mark" aria-hidden="true"></span>
        <div>
          <h1>${title}</h1>
          <p>${subtitle}</p>
        </div>
      </div>
      <div class="step-row">
        ${activeSteps.map((step) => `<span class="step-pill ${step === activeStep ? "active" : ""}">${step}</span>`).join("")}
      </div>
    </section>
  `;
}

function compactStepNav(activeStep) {
  const activeSteps = currentFlowSteps();
  const activeIndex = activeSteps.indexOf(activeStep);
  return `
    <nav class="compact-step-nav" aria-label="游戏阶段" style="--step-count: ${activeSteps.length}">
      ${activeSteps.map((step, index) => `
        <span class="compact-step ${index < activeIndex ? "completed" : ""} ${step === activeStep ? "active" : ""}" ${step === activeStep ? 'aria-current="step"' : ""}>${step}</span>
      `).join("")}
    </nav>
  `;
}

function adjacentStageTitle(activeStep, offset, trackName = "") {
  const activeSteps = currentFlowSteps();
  const activeIndex = activeSteps.indexOf(activeStep);
  const adjacentStep = activeSteps[activeIndex + offset] || "";
  return adjacentStep === "赛道" ? trackName || adjacentStep : adjacentStep;
}

function currentFlowSteps(trackId = appState.campaign?.trackId || appState.trackId) {
  return isIphoneRoute(trackId) ? historySteps : simulationSteps;
}

function campaignFlowStep(trackId = appState.campaign?.trackId || appState.trackId) {
  return isIphoneRoute(trackId) ? "旅程" : "对战";
}

function backActionButton(action, label = "上一步") {
  return `
    <button class="ghost-action back-action" type="button" data-action="${action}">
      <span aria-hidden="true">←</span>
      ${label}
    </button>
  `;
}

function metricIconMarkup(icon) {
  const icons = {
    clock: '<path d="M9 2h6M12 2v3"></path><circle cx="12" cy="13" r="8"></circle><path d="M12 9v4l3 2"></path>',
    hourglass: '<circle cx="9" cy="14" r="6"></circle><path d="M9 11v3l2.5 1.5"></path><path d="M18 17V5m-3 3 3-3 3 3"></path>',
    coin: '<path d="m7 4 5 7 5-7M12 11v9M8 13h8M8 16h8"></path>',
    target: '<path d="M4 3l8 8M20 3l-8 8"></path><path d="m9.5 13.5-5 5M14.5 13.5l5 5"></path><path d="m3 16 3 3-3 3M21 16l-3 3 3 3"></path>',
  };
  return `<span class="metric-label-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${icons[icon] || ""}</svg></span>`;
}

function profileMetricMarkup({ label, icon, valueText, currentValue, baseValue, min, max, kind, lowerIsBetter = false, tooltip }) {
  const span = Math.max(0.0001, max - min);
  const normalized = (value) => clamp((value - min) / span, 0, 1);
  const currentRatio = lowerIsBetter ? 1 - normalized(currentValue) : normalized(currentValue);
  const baseRatio = lowerIsBetter ? 1 - normalized(baseValue) : normalized(baseValue);

  return `
    <div class="metric" data-metric-kind="${kind}" style="--metric-current: ${(currentRatio * 100).toFixed(1)}%; --metric-base: ${(baseRatio * 100).toFixed(1)}%;" ${tipAttr(tooltip)}>
      <div class="metric-copy">
        <span class="metric-label">${metricIconMarkup(icon)}<span>${label}</span></span>
        <strong>${valueText}</strong>
      </div>
      <div class="metric-data-bar" aria-hidden="true">
        <span class="metric-data-fill"></span>
        <span class="metric-base-marker"></span>
      </div>
    </div>
  `;
}

function profileStrip() {
  const track = currentTrack();
  const profile = calculateProfile();
  const baseProfile = {
    time: track.base.time,
    maxTime: Math.max(30, track.base.time + 6),
    funds: track.base.funds,
    difficulty: track.base.difficulty,
  };
  return `
    <section class="summary-strip" aria-label="喵创初始参数">
      ${profileMetricMarkup({
        label: "初始时间",
        icon: "clock",
        kind: "time",
        valueText: formatDays(profile.time),
        currentValue: profile.time,
        baseValue: baseProfile.time,
        min: 18,
        max: 34,
        tooltip: "进入第一关时拥有的剩余时间。竖线代表赛道初始基准，色条显示喵群选择后的当前水平。",
      })}
      ${profileMetricMarkup({
        label: "时间上限",
        icon: "hourglass",
        kind: "time",
        valueText: formatDays(profile.maxTime),
        currentValue: profile.maxTime,
        baseValue: baseProfile.maxTime,
        min: 30,
        max: 40,
        tooltip: "剩余时间可以通过卡牌恢复，但不能超过这个上限。竖线代表赛道初始基准。",
      })}
      ${profileMetricMarkup({
        label: "喵喵币",
        icon: "coin",
        kind: "funds",
        valueText: formatFundsAmount(profile.funds),
        currentValue: profile.funds,
        baseValue: baseProfile.funds,
        min: 6 * FUND_SCALE,
        max: 32 * FUND_SCALE,
        tooltip: "喵群画像决定的初始喵喵币。竖线代表赛道初始基准，色条会随画像选择实时变化。",
      })}
      ${profileMetricMarkup({
        label: "关卡难度",
        icon: "target",
        kind: "difficulty",
        valueText: `${profile.difficulty}`,
        currentValue: profile.difficulty,
        baseValue: baseProfile.difficulty,
        min: 0.78,
        max: 1.35,
        lowerIsBetter: true,
        tooltip: "影响所有关卡敌人的血量和攻击力。该数据条越长代表整体越轻松，竖线代表赛道初始基准。",
      })}
    </section>
  `;
}

function render() {
  if (appState.screen === "track") renderTrackScreen();
  if (appState.screen === "personas") renderPersonaScreen();
  if (appState.screen === "deck") renderDeckScreen();
  if (appState.screen === "campaign") renderCampaignScreen();
  if (appState.screen === "reward") renderRewardScreen();
  if (appState.screen === "event") renderEventScreen();
  if (appState.screen === "shop") renderShopScreen();
  if (appState.screen === "loadout") renderLoadoutScreen();
  if (appState.screen === "editor") renderEditorScreen();
  if (appState.screen === "battle") renderBattleScreen();
  syncStandaloneRewardState();
}

function renderTrackScreen() {
  const trackArt = {
    health: "assets/scene-art/route-silver-economy.png",
    ai: "assets/scene-art/route-meow-ai.png",
    green: "assets/scene-art/route-green-energy.png",
    iphone: "assets/scene-art/route-mphone-birth-cool-v5.png",
  };
  const trackGroups = [
    {
      id: "simulation",
      title: "喵创模拟",
      description: "人生只有一次，而喵生有九次，快来试一试。",
      cover: "assets/home-art/meow-simulation-vr-cat-timespace-warm-preserve-square.png",
      switchLabel: "选择模拟赛道",
      tracks: tracks.filter((track) => !track.specialRoute),
    },
    {
      id: "history",
      title: "喵星创业史",
      description: "每一段故事都只在喵星发生过，人类请勿对号入座。",
      cover: "assets/home-art/meow-history-cover-earth-cat-square.png",
      switchLabel: "选择创业史",
      tracks: tracks.filter((track) => track.specialRoute),
    },
  ];

  app.innerHTML = `
    <div class="screen home-screen">
      <section class="home-hero" aria-labelledby="home-title">
        <div class="home-title-panel">
          <h1 id="home-title">全喵创业 万喵创新</h1>
          <p class="home-subtitle">生而为喵，就该轰轰烈烈一把</p>
        </div>
      </section>

      <section class="mode-select-grid" aria-label="模式选择">
        ${trackGroups
          .filter((group) => group.tracks.length)
          .map(
            (group) => `
              <article class="mode-card mode-flip-card mode-card-${group.id}" tabindex="0">
                <div class="mode-flip-inner">
                  <div class="mode-face mode-face-front" style="--mode-cover-url: url('${group.cover}')">
                    <div class="mode-cover-title">
                      <h2>${group.title}</h2>
                      <p>${group.description}</p>
                    </div>
                  </div>
                  <div class="mode-face mode-face-back" aria-label="${group.switchLabel}">
                    <div class="mode-track-switch" aria-label="${group.switchLabel}">
                      ${group.tracks
                        .map(
                          (track) => `
                            <button class="mode-track-option" type="button" data-action="select-track" data-track-id="${track.id}">
                              <img class="mode-track-art" src="${trackArt[track.id]}" alt="" aria-hidden="true">
                              <span class="mode-track-copy">
                                <strong>${track.name}</strong>
                                <span>${track.note}</span>
                              </span>
                              <span class="mode-track-meta">
                                <span>${track.specialRoute ? "固定牌库" : formatDays(track.base.time)}</span>
                                <span>${track.specialRoute ? "产品案例" : `${formatFundsAmount(track.base.funds)}喵喵币`}</span>
                              </span>
                            </button>
                          `,
                        )
                        .join("")}
                    </div>
                  </div>
                </div>
              </article>
            `,
          )
          .join("")}
      </section>
      <button class="ghost-action home-editor-action" type="button" data-action="open-editor">
        <svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 17.5V20h2.5L17.1 9.4l-2.5-2.5L4 17.5Z"></path>
          <path d="M16 5.5 18.5 8 20 6.5 17.5 4 16 5.5Z"></path>
          <path d="M4 22h16"></path>
        </svg>
        内容编辑器
      </button>
    </div>
  `;
}

function renderPersonaScreen() {
  const track = currentTrack();
  const previousStageTitle = adjacentStageTitle("喵群", -1, track.name);
  const nextStageTitle = adjacentStageTitle("喵群", 1, track.name);
  app.innerHTML = `
    <div class="screen persona-screen">
      <header class="persona-top-rail flow-stage-rail">
        <span class="persona-track-watermark" aria-hidden="true">${previousStageTitle}</span>
        <button class="persona-stage-arrow persona-stage-arrow-back" type="button" data-action="back-track" aria-label="上一步" title="上一步">
          <svg viewBox="0 0 36 24" aria-hidden="true">
            <path d="m22 4-8 8 8 8"></path>
            <path d="m14 4-8 8 8 8"></path>
          </svg>
        </button>
        ${compactStepNav("喵群")}
        <button class="persona-stage-arrow persona-stage-arrow-next" type="button" data-action="go-deck" aria-label="进入策略" title="进入策略" ${canProceedPersonas() ? "" : "disabled"}>
          <svg viewBox="0 0 36 24" aria-hidden="true">
            <path d="m14 4 8 8-8 8"></path>
            <path d="m22 4 8 8-8 8"></path>
          </svg>
        </button>
        <span class="persona-strategy-label" aria-hidden="true">${nextStageTitle}</span>
      </header>
      <section class="setup-panel">
        <div class="persona-layout">
          ${profileStrip()}
          <div class="persona-groups">
            ${renderPersonaGroup("core", "核心喵群")}
            ${renderPersonaGroup("opportunity", "机会喵群")}
          </div>
          <aside class="side-panel persona-pool-panel">
            <div class="persona-pool-head">
              <h3 aria-label="喵群画像池"><span aria-hidden="true">喵<br>群<br>画<br>像<br>池</span></h3>
            </div>
            <div class="trait-pool">
              ${track.traits.map((trait, index) => renderTraitCard(trait, index, canProceedPersonas())).join("")}
            </div>
          </aside>
        </div>
      </section>
    </div>
  `;
}

function renderPersonaGroup(group, title) {
  return `
    <div class="group-panel group-panel-${group}">
      <div class="group-panel-head">
        <h3>${title}</h3>
      </div>
      <div class="slot-grid">
        ${appState.personas[group]
          .map((traitId, index) => {
            const trait = traitById(traitId);
            if (!trait) {
              return `
                <button class="persona-slot empty" type="button" data-slot-group="${group}" data-slot-index="${index}">
                  <span class="persona-slot-index">0${index + 1}</span>
                  <span class="persona-slot-placeholder" aria-hidden="true">
                    <svg viewBox="0 0 64 64">
                      <path d="M18 15h31v37H18Z"></path>
                      <path d="M24 10h31v37"></path>
                      <path d="M27 28.5c0-4 2.8-6.5 6.8-6.5 4.2 0 7 2.5 7 6.1 0 3.2-1.8 4.8-4.7 6.6-2.4 1.5-3.1 2.8-3.1 5.2"></path>
                      <circle cx="33" cy="45" r="1.2"></circle>
                    </svg>
                  </span>
                </button>
              `;
            }
            const portraitSrc = personaPortraitSrc(trait.id);
            return `
              <button class="persona-slot has-trait" type="button" data-action="remove-trait" data-slot-group="${group}" data-slot-index="${index}">
                ${visualArtMarkup("persona-thumb", portraitSrc, trait.name)}
                <span class="trait-info-shade" aria-hidden="true"></span>
                <span class="persona-selected-content">
                  <span class="persona-selected-info">
                    <strong>${trait.name}</strong>
                    ${renderTraitEffects(trait.effect)}
                  </span>
                  ${group === "core" ? '<span class="persona-gain-multiplier">×120%</span>' : ""}
                </span>
              </button>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function personaPortraitSrc(traitId) {
  return /^[agh](?:[1-9]|1[0-2])$/.test(traitId)
    ? `assets/persona-art/${traitId}-black-bg-v2.png`
    : `assets/persona-art/${traitId}.png`;
}

function renderTraitCard(trait, index = -1, poolLocked = false) {
  const assigned = selectedTraitIds().includes(trait.id);
  const usesBackgroundLayout = true;
  const usesCleanBlackArtwork = /^[agh](?:[1-9]|1[0-2])$/.test(trait.id);
  const portraitSrc = personaPortraitSrc(trait.id);
  return `
    <button class="trait-card ${usesBackgroundLayout ? "layout-preview" : ""} ${usesCleanBlackArtwork ? "" : "framed-source"} ${assigned ? "assigned" : ""} ${poolLocked ? "pool-dimmed" : ""}" type="button" draggable="${assigned || poolLocked ? "false" : "true"}"
      data-action="assign-trait" data-trait-id="${trait.id}" ${poolLocked ? "disabled" : ""}>
      ${visualArtMarkup("persona-art", portraitSrc, trait.name)}
      <span class="trait-info-shade" aria-hidden="true"></span>
      <strong>${trait.name}</strong>
      ${renderTraitEffects(trait.effect)}
      <span class="trait-add-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>
      </span>
    </button>
  `;
}

function renderTraitEffects(effect = {}) {
  const effects = [
    effect.time
      ? { kind: "time", icon: "clock", label: "时间", value: formatDayDelta(effect.time) }
      : null,
    effect.funds
      ? { kind: "funds", icon: "coin", label: "喵喵币", value: formatFundDelta(effect.funds) }
      : null,
    effect.difficulty
      ? { kind: "difficulty", icon: "target", label: "难度", value: `${effect.difficulty > 0 ? "+" : ""}${effect.difficulty}` }
      : null,
  ].filter(Boolean);

  return `
    <span class="trait-effects" aria-label="画像参数">
      ${effects
        .map(
          ({ kind, icon, label, value }) => `
            <span class="trait-effect" data-effect-kind="${kind}" aria-label="${label} ${value}">
              ${metricIconMarkup(icon)}
              <span class="trait-effect-value">${value}</span>
            </span>
          `,
        )
        .join("")}
    </span>
  `;
}

function formatEffect(effect) {
  const parts = [];
  if (effect.time) parts.push(`时间 ${formatDayDelta(effect.time)}`);
  if (effect.funds) parts.push(`喵喵币 ${formatFundDelta(effect.funds)}`);
  if (effect.difficulty) parts.push(`难度 ${effect.difficulty > 0 ? "+" : ""}${effect.difficulty}`);
  return parts.join(" · ") || "稳定";
}

function formatEventEffect(effect = {}) {
  const labels = [];
  if (effect.time) labels.push(`当前时间 ${formatDayDelta(effect.time)}`);
  if (effect.maxTime) labels.push(`时间上限 ${formatDayDelta(effect.maxTime)}`);
  if (effect.funds) labels.push(`喵喵币 ${formatFundDelta(effect.funds)}`);
  if (effect.difficulty) labels.push(`难度 ${effect.difficulty > 0 ? "+" : ""}${effect.difficulty}`);
  if (effect.enemyHpPct) labels.push(`敌人血量 ${effect.enemyHpPct > 0 ? "+" : ""}${Math.round(effect.enemyHpPct * 100)}%`);
  if (effect.attackDelta) labels.push(`敌人攻击 ${formatDayDelta(effect.attackDelta)}`);
  if (effect.shopDiscount) labels.push(`商店价格 -${formatFundsAmount(effect.shopDiscount)}`);
  if (effect.startBuffer) labels.push(`开局缓冲 ${formatDayDelta(effect.startBuffer)}`);
  if (effect.rewardFunds) labels.push(`阶段喵喵币奖励 ${formatFundDelta(effect.rewardFunds)}`);
  return labels.join(" / ") || "仅叙事影响";
}

function canProceedPersonas() {
  return appState.personas.core.every(Boolean) && appState.personas.opportunity.every(Boolean);
}

function renderDeckScreen() {
  const selectedCount = appState.selectedDeck.length;
  const track = currentTrack();
  const previousStageTitle = adjacentStageTitle("策略", -1, track.name);
  const nextStageTitle = adjacentStageTitle("策略", 1, track.name);
  app.innerHTML = `
    <div class="screen persona-screen strategy-screen initial-deck-screen">
      <header class="persona-top-rail flow-stage-rail">
        <span class="persona-track-watermark" aria-hidden="true">${previousStageTitle}</span>
        <button class="persona-stage-arrow persona-stage-arrow-back" type="button" data-action="back-personas" aria-label="返回喵群" title="返回喵群">
          <svg viewBox="0 0 36 24" aria-hidden="true">
            <path d="m22 4-8 8 8 8"></path>
            <path d="m14 4-8 8 8 8"></path>
          </svg>
        </button>
        ${compactStepNav("策略")}
        <button class="persona-stage-arrow persona-stage-arrow-next" type="button" data-action="start-campaign" aria-label="进入旅程" title="进入旅程" ${selectedCount === 8 ? "" : "disabled"}>
          <svg viewBox="0 0 36 24" aria-hidden="true">
            <path d="m14 4 8 8-8 8"></path>
            <path d="m22 4 8 8-8 8"></path>
          </svg>
        </button>
        <span class="persona-strategy-label" aria-hidden="true">${nextStageTitle}</span>
      </header>
      <section class="setup-panel strategy-setup-panel">
        <div class="strategy-layout">
          <section class="strategy-pool-panel">
            <div class="strategy-pool-body">
              <header class="initial-deck-header">
                <div class="initial-deck-copy">
                  <span>初始牌库</span>
                  <h1>选择 8 张出战卡牌</h1>
                  <p>围绕人员、技术、资金、时间与管理搭配卡牌，组成这条创业路线的初始牌库。</p>
                </div>
                <div class="initial-deck-status" aria-label="已选择 ${selectedCount} 张，共需 8 张">
                  <div class="initial-deck-count">
                    <span>当前选择</span>
                    <strong>${selectedCount}</strong>
                    <small>/ 8</small>
                  </div>
                  <span class="initial-deck-track" aria-hidden="true">
                    ${Array.from({ length: 8 }, (_, index) => `<i class="${index < selectedCount ? "filled" : ""}"></i>`).join("")}
                  </span>
                </div>
              </header>
              <div class="catalog-grid strategy-catalog-grid">
                ${orderedInitialCardIds().map((id) => renderDeckCard(id, cardCatalog[id])).join("")}
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  `;
}

function renderDeckCard(id, card) {
  const selected = appState.selectedDeck.includes(id);
  const disabled = !selected && appState.selectedDeck.length >= 8;
  return `
    <button class="deck-card ${cardThemeClass(card)} card-kind-${strategyCardKind(card)} ${selected ? "selected" : ""}" type="button" aria-pressed="${selected}" data-action="toggle-deck-card" data-card-id="${id}" ${disabled ? "disabled" : ""} ${tipAttr("选择 8 张牌作为整条喵创路线的初始牌库。")}>
      <span class="deck-card-top">
        ${cardTypeIconMarkup(card)}
        <span class="card-name">${card.name}</span>
        <span class="card-cost" aria-label="行动力 ${card.cost}" ${tipAttr("打出这张牌需要消耗的行动力。每轮开始会恢复行动力。")}>
          <svg class="action-point-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-7 11h5l-1 9 8-12h-5z"></path></svg>
          <b>${card.cost}</b>
        </span>
      </span>
      ${cardArtMarkup(id, card)}
      ${cardParamsMarkup(card)}
    </button>
  `;
}

function startCampaign() {
  const profile = calculateProfile();
  appState.campaign = {
    trackId: appState.trackId,
    ownedCards: [...appState.selectedDeck],
    activeDeck: [...appState.selectedDeck],
    time: profile.time,
    maxTime: profile.maxTime,
    funds: profile.funds,
    difficulty: profile.difficulty,
    unlockedStage: 0,
    completedStages: [],
    pendingStage: null,
    pendingEvent: null,
    eventMods: createEventMods(),
    eventHistory: [],
    storyChapters: [],
    rewardChoices: [],
    shopOffers: [],
  };
  appState.screen = "campaign";
  render();
}

function deckLimit() {
  return 8 + (appState.campaign?.completedStages.length || 0);
}

function createEventMods() {
  return {
    enemyHpPct: 0,
    attackDelta: 0,
    shopDiscount: 0,
    startBuffer: 0,
    rewardFunds: 0,
  };
}

function canEnterStage() {
  const deckSize = appState.campaign?.activeDeck.length || 0;
  return deckSize >= 8 && deckSize <= deckLimit();
}

function cardPrice(cardId) {
  const discount = appState.campaign?.eventMods?.shopDiscount || 0;
  const card = cardCatalog[cardId];
  const basePrice = card.price || (4 + card.cost) * FUND_SCALE + (card.fundCost || 0);
  return Math.max(FUND_SCALE, basePrice - discount);
}

function createShopOffers() {
  const campaign = appState.campaign;
  const owned = new Set(campaign.ownedCards);
  return currentInitialCardIds(campaign.trackId).filter((cardId) => !owned.has(cardId)).slice(0, 4);
}

function pickSpecialEvent() {
  const campaign = appState.campaign;
  const events = currentSpecialEvents();
  if (isIphoneRoute(campaign.trackId)) {
    return events[Math.max(0, campaign.completedStages.length - 1)] || events[events.length - 1];
  }
  const used = new Set(campaign.eventHistory.map((event) => event.id));
  return events.find((event) => !used.has(event.id)) || events[campaign.completedStages.length % events.length];
}

function applySpecialEvent(event) {
  const campaign = appState.campaign;
  if (!campaign || !event) return;

  const effect = event.effect || {};
  campaign.maxTime = Math.max(8, campaign.maxTime + Number(effect.maxTime || 0));
  campaign.time = clamp(campaign.time + Number(effect.time || 0), 1, campaign.maxTime);
  campaign.funds = Math.max(0, campaign.funds + Number(effect.funds || 0));
  campaign.difficulty = clamp(Number((campaign.difficulty + Number(effect.difficulty || 0)).toFixed(2)), 0.65, 1.5);
  campaign.eventMods.enemyHpPct += Number(effect.enemyHpPct || 0);
  campaign.eventMods.attackDelta += Number(effect.attackDelta || 0);
  campaign.eventMods.shopDiscount += Number(effect.shopDiscount || 0);
  campaign.eventMods.startBuffer += Number(effect.startBuffer || 0);
  campaign.eventMods.rewardFunds += Number(effect.rewardFunds || 0);
  campaign.eventHistory.push({
    id: event.id,
    name: event.name,
    positive: event.positive,
    negative: event.negative,
    effect: { ...effect },
  });
  campaign.pendingEvent = null;
}

function eventById(eventId) {
  const campaignEvent = appState.campaign?.eventHistory.find((event) => event.id === eventId);
  const catalogEvent = [...specialEvents, ...iphoneSpecialEvents].find((event) => event.id === eventId);
  if (!campaignEvent && !catalogEvent) return null;
  return {
    ...(catalogEvent || {}),
    ...(campaignEvent || {}),
    effect: campaignEvent?.effect || catalogEvent?.effect || {},
  };
}

function renderEventChips(events) {
  if (!events?.length) return "";
  return `
    <div class="event-strip" ${tipAttr("点击常驻事件查看它带来的正面、负面和数值效果。")}>
      <span>常驻事件</span>
      ${events
        .map(
          (event) => `
            <button class="event-chip" type="button" data-action="show-event" data-event-id="${event.id}">
              ${escapeHtml(event.name)}
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderCampaignScreen() {
  const campaign = appState.campaign;
  const activeFlowStep = campaignFlowStep(campaign.trackId);
  const previousStageTitle = adjacentStageTitle(activeFlowStep, -1, currentTrack().name);
  app.innerHTML = `
    <div class="screen campaign-screen">
      <header class="persona-top-rail flow-stage-rail campaign-stage-rail">
        <span class="persona-track-watermark" aria-hidden="true">${previousStageTitle}</span>
        <button class="persona-stage-arrow persona-stage-arrow-back" type="button" data-action="back-before-stage" aria-label="返回${previousStageTitle}" title="返回${previousStageTitle}">
          <svg viewBox="0 0 36 24" aria-hidden="true">
            <path d="m22 4-8 8 8 8"></path>
            <path d="m14 4-8 8 8 8"></path>
          </svg>
        </button>
        ${compactStepNav(activeFlowStep)}
        <button class="campaign-stage-restart" type="button" data-action="new-run" aria-label="重开喵创" title="重开喵创">
          <span aria-hidden="true">↻</span>
          <strong>重开喵创</strong>
        </button>
      </header>
      <section class="campaign-resource-board" aria-label="当前资源">
        <div class="campaign-resource-summary">
          <span class="campaign-resource-chip campaign-resource-time" ${tipAttr("当前路线剩余时间。进入关卡后会作为玩家血量，归零则阶段失败。")}> <small>剩余时间</small><b>${formatDays(campaign.time)} <em>/ ${formatDays(campaign.maxTime)}</em></b></span>
          <span class="campaign-resource-chip campaign-resource-funds" ${tipAttr("当前可用喵喵币。部分卡牌需要喵喵币才能打出，也有卡牌能增加喵喵币。")}> <small>喵喵币</small><b>${formatFundsAmount(campaign.funds)}</b></span>
          <span class="campaign-resource-chip campaign-resource-deck" ${tipAttr("当前出战牌库会带入下一场对战。每关结束后可以重新选择。")}> <small>出战牌库</small><b>${campaign.activeDeck.length} <em>/ ${deckLimit()} 张</em></b></span>
          <span class="campaign-resource-chip campaign-resource-difficulty" ${tipAttr("由创业模拟、用户画像和关卡间事件共同决定，影响敌人血量和攻击力。")}> <small>难度系数</small><b>${campaign.difficulty}</b></span>
        </div>
      </section>
      <section class="setup-panel">
        <div class="stage-map">
          ${currentStages().map((stage, index) => renderStageCard(stage, index)).join("")}
        </div>
        ${renderEventChips(campaign.eventHistory)}
      </section>
    </div>
  `;
}

function renderStageCard(stage, index) {
  const campaign = appState.campaign;
  const locked = index > campaign.unlockedStage;
  const deckInvalid = !canEnterStage();
  const completed = campaign.completedStages.includes(index);
  const stateClass = completed ? "completed" : locked ? "locked" : deckInvalid ? "deck-invalid" : "available";
  const stateLabel = completed ? "已完成" : deckInvalid ? "先定策略" : "";
  const enemyHp = Math.round(stage.hp * campaign.difficulty * (1 + campaign.eventMods.enemyHpPct));
  const attack = Math.max(1, Math.round(stage.attack * campaign.difficulty) + campaign.eventMods.attackDelta);
  return `
    <button class="stage-card stage-state-${stateClass} ${completed ? "completed" : ""}" type="button" data-action="start-stage" data-stage-index="${index}" ${locked || deckInvalid || completed ? "disabled" : ""}>
      <div class="stage-card-top">
        <span class="stage-number">${index + 1}</span>
        <h3>${stage.title}</h3>
        ${stateLabel ? `<span class="stage-status">${stateLabel}</span>` : ""}
      </div>
      ${visualArtMarkup("line-art stage-art", stageArtSrc(index), stage.title)}
      <p class="stage-description">${stage.intro}</p>
      <div class="stage-params" aria-label="关卡参数">
        <span class="stage-param stage-param-work" ${tipAttr("进入该阶段后需要清空的敌人血量。清空代表核心工作完成。")}>${stage.target} <b>${enemyHp}</b></span>
        <span class="stage-param stage-param-attack" ${tipAttr("敌人攻击会扣减你的剩余时间。数值已受画像难度影响。")}>压力 <b>${formatDays(attack)}</b></span>
        <span class="stage-param stage-param-round" ${tipAttr("必须在这个轮数内完成阶段核心工作。超过限制会失败。")}>期限 <b>${stage.rounds}轮</b></span>
      </div>
    </button>
  `;
}

function renderRewardScreen() {
  const campaign = appState.campaign;
  const stageIndex = campaign.pendingStage;
  const stage = currentStages()[stageIndex];
  app.innerHTML = `
    <div class="screen persona-screen strategy-screen reward-stage-screen">
      <section class="setup-panel strategy-setup-panel reward-stage-panel">
        <div class="strategy-layout reward-stage-layout">
          <div class="reward-chapter-line" aria-label="第 ${stageIndex + 1} 章 ${stage.title}">
            <span>第 ${String(stageIndex + 1).padStart(2, "0")} 章</span>
            <i aria-hidden="true"></i>
            <strong>${stage.title}</strong>
          </div>
          <section class="reward-resource-board" aria-label="阶段结算资源">
            <div class="reward-resource-summary">
              <span class="reward-resource-chip reward-resource-time"><small>剩余时间</small><b>${formatDays(campaign.time)} <em>/ ${formatDays(campaign.maxTime)}</em></b></span>
              <span class="reward-resource-chip reward-resource-funds"><small>喵喵币</small><b>${formatFundsAmount(campaign.funds)}</b></span>
              <span class="reward-resource-chip reward-resource-owned"><small>拥有卡牌</small><b>${campaign.ownedCards.length} 张</b></span>
              <span class="reward-resource-chip reward-resource-limit"><small>出战上限</small><b>${deckLimit()} 张</b></span>
            </div>
          </section>
          <section class="strategy-pool-panel reward-pool-panel" aria-labelledby="reward-draft-title">
            <header class="reward-draft-header">
              <span class="reward-unlock-sigil" aria-hidden="true">
                <svg viewBox="0 0 48 48"><path d="m24 3 5.2 10.6L41 15.3l-8.5 8.3 2 11.7L24 29.8l-10.5 5.5 2-11.7L7 15.3l11.8-1.7Z"></path><circle cx="24" cy="24" r="6"></circle></svg>
              </span>
              <div class="reward-draft-copy">
                <h1 id="reward-draft-title">选择你的奖励卡</h1>
                <p>选择一张加入拥有牌库，其余两张将留在本章。</p>
              </div>
              <div class="reward-draft-rule" aria-label="三张奖励中选择一张">
                <span>仅可选择</span>
                <strong>1</strong>
                <small>/ 3</small>
              </div>
            </header>
            <div class="strategy-pool-body reward-pool-body">
              <div class="catalog-grid strategy-catalog-grid reward-catalog-grid">
                ${campaign.rewardChoices.map((cardId, index) => renderRewardCard(cardId, index, campaign.rewardChoices.length)).join("")}
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  `;
}

function renderRewardCard(cardId, index = 0, total = 3) {
  const card = cardCatalog[cardId];
  return `
    <article class="reward-card-option">
      <div class="reward-option-label" aria-hidden="true">
        <span><i>✦</i> 奖励候选 ${String(index + 1).padStart(2, "0")}</span>
        <b>${index + 1} / ${total}</b>
      </div>
      <button class="deck-card ${cardThemeClass(card)} card-kind-${strategyCardKind(card)} reward reward-choice-card" type="button" data-action="choose-reward" data-card-id="${cardId}" ${tipAttr("选择后加入拥有牌库，本阶段另外两张奖励会错过。")}>
        <span class="deck-card-top">
          ${cardTypeIconMarkup(card)}
          <span class="card-name">${card.name}</span>
          <span class="card-cost" aria-label="行动力 ${card.cost}" ${tipAttr("打出这张牌需要消耗的行动力。")}>
            <svg class="action-point-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-7 11h5l-1 9 8-12h-5z"></path></svg>
            <b>${card.cost}</b>
          </span>
        </span>
        ${cardArtMarkup(cardId, card)}
        ${cardParamsMarkup(card)}
      </button>
    </article>
  `;
}

function renderEventScreen() {
  const campaign = appState.campaign;
  const event = campaign.pendingEvent;
  app.innerHTML = `
    <div class="screen persona-screen strategy-screen event-stage-screen">
      <section class="setup-panel strategy-setup-panel event-stage-panel">
        <div class="strategy-layout event-stage-layout">
          <section class="strategy-pool-panel event-pool-panel">
            <div class="strategy-pool-body event-pool-body">
              <div class="event-status-rail" aria-label="事件前资源">
                <span class="event-resource-summary" aria-label="事件前资源">
                  <span class="event-resource-chip event-resource-time"><small>剩余时间</small><b>${formatDays(campaign.time)} <em>/ ${formatDays(campaign.maxTime)}</em></b></span>
                  <span class="event-resource-chip event-resource-funds"><small>喵喵币</small><b>${formatFundsAmount(campaign.funds)}</b></span>
                  <span class="event-resource-chip event-resource-difficulty"><small>难度系数</small><b>${campaign.difficulty}</b></span>
                  <span class="event-resource-chip event-resource-history"><small>常驻事件</small><b>${campaign.eventHistory.length} 个</b></span>
                </span>
              </div>
              <article class="event-story-panel">
                <header class="event-story-heading">
                  <span class="event-story-kicker">外部环境变化</span>
                  <h2>${event.name}</h2>
                </header>
                <div class="event-effect-grid">
                  <section class="event-effect-card event-effect-positive">
                    ${visualArtMarkup("event-effect-art", "assets/scene-art/event-positive.png", "正面效果")}
                    <div class="event-effect-copy"><span class="event-effect-index">机会</span><h3>正面效果</h3><p>${event.positive}</p></div>
                  </section>
                  <section class="event-effect-card event-effect-negative">
                    ${visualArtMarkup("event-effect-art", "assets/scene-art/event-negative.png", "负面效果")}
                    <div class="event-effect-copy"><span class="event-effect-index">压力</span><h3>负面效果</h3><p>${event.negative}</p></div>
                  </section>
                  <section class="event-effect-card event-effect-persistent">
                    ${visualArtMarkup("event-effect-art", "assets/scene-art/event-persistent.png", "常驻影响")}
                    <div class="event-effect-copy"><span class="event-effect-index">后续</span><h3>常驻影响</h3><p>${formatEventEffect(event.effect)}</p></div>
                  </section>
                </div>
                <div class="event-action-dock">
                  <button class="primary-action event-accept-button" type="button" data-action="resolve-event">
                    <span class="event-accept-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12h12M13 7l5 5-5 5"></path></svg></span>
                    <span class="event-accept-copy"><strong>接受事件影响</strong><small>继续前往关卡间商店</small></span>
                  </button>
                </div>
              </article>
            </div>
          </section>
        </div>
      </section>
    </div>
  `;
}

function renderShopScreen() {
  const campaign = appState.campaign;
  const offers = campaign.shopOffers;
  app.innerHTML = `
    <div class="screen persona-screen strategy-screen reward-stage-screen shop-stage-screen">
      <section class="setup-panel strategy-setup-panel reward-stage-panel shop-stage-panel">
        <div class="strategy-layout reward-stage-layout shop-stage-layout">
          <section class="reward-resource-board shop-resource-board" aria-label="商店资源">
            <div class="reward-resource-summary shop-resource-summary">
              <span class="reward-resource-chip reward-resource-time"><small>剩余时间</small><b>${formatDays(campaign.time)} <em>/ ${formatDays(campaign.maxTime)}</em></b></span>
              <span class="reward-resource-chip reward-resource-funds"><small>喵喵币</small><b>${formatFundsAmount(campaign.funds)}</b></span>
              <span class="reward-resource-chip reward-resource-owned"><small>拥有卡牌</small><b>${campaign.ownedCards.length} 张</b></span>
              <span class="reward-resource-chip reward-resource-limit"><small>出战上限</small><b>${deckLimit()} 张</b></span>
            </div>
          </section>
          <section class="strategy-pool-panel reward-pool-panel shop-pool-panel" aria-labelledby="shop-title">
            <header class="reward-draft-header shop-draft-header">
              <div class="reward-draft-copy shop-draft-copy">
                <span>关卡补给</span>
                <h1 id="shop-title">关卡间商店</h1>
                <p>用喵喵币购买未拥有的基础卡；完成后重新选择下一关的出战牌库。</p>
              </div>
              <div class="shop-header-actions">
                <div class="reward-draft-rule shop-offer-count" aria-label="当前商店卡牌数量">
                  <span>可选卡牌</span><strong>${offers.length}</strong><small>张</small>
                </div>
                <button class="primary-action shop-finish-button" type="button" data-action="finish-shop">
                  <span aria-hidden="true">→</span>
                  完成买卡
                </button>
              </div>
            </header>
            <div class="strategy-pool-body reward-pool-body shop-pool-body">
              ${offers.length ? `<div class="catalog-grid strategy-catalog-grid reward-catalog-grid shop-catalog-grid">${offers.map((cardId) => renderShopCard(cardId)).join("")}</div>` : `<div class="notice-line">商店暂时没有未拥有的基础卡。</div>`}
            </div>
          </section>
        </div>
      </section>
    </div>
  `;
}

function renderShopCard(cardId) {
  const campaign = appState.campaign;
  const card = cardCatalog[cardId];
  const price = cardPrice(cardId);
  const owned = campaign.ownedCards.includes(cardId);
  const cannotAfford = campaign.funds < price;
  return `
    <article class="shop-card-option">
      <div class="shop-option-label">
        <span>${owned ? "已购买" : cannotAfford ? "喵喵币不足" : "商店卡牌"}</span>
        <b>${formatFundsAmount(price)}</b>
      </div>
      <button class="deck-card ${cardThemeClass(card)} card-kind-${strategyCardKind(card)} shop-choice-card ${owned ? "shop-owned" : ""} ${cannotAfford ? "locked" : ""}" type="button" data-action="buy-card" data-card-id="${cardId}" ${owned || cannotAfford ? "disabled" : ""} ${tipAttr("消耗喵喵币购买这张卡，加入拥有牌库。")}>
        <span class="deck-card-top">
          ${cardTypeIconMarkup(card)}
          <span class="card-name">${card.name}</span>
          <span class="card-cost" aria-label="行动力 ${card.cost}" ${tipAttr("打出这张牌需要消耗的行动力。")}>
            <svg class="action-point-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-7 11h5l-1 9 8-12h-5z"></path></svg>
            <b>${card.cost}</b>
          </span>
        </span>
        ${cardArtMarkup(cardId, card)}
        ${cardParamsMarkup(card)}
      </button>
    </article>
  `;
}

function renderLoadoutScreen() {
  const campaign = appState.campaign;
  const selectedCount = campaign.activeDeck.length;
  const limit = deckLimit();
  const valid = selectedCount >= 8 && selectedCount <= limit;
  app.innerHTML = `
    <div class="screen persona-screen strategy-screen reward-stage-screen loadout-stage-screen">
      <section class="setup-panel strategy-setup-panel reward-stage-panel loadout-stage-panel">
        <div class="strategy-layout reward-stage-layout loadout-stage-layout">
          <section class="reward-resource-board loadout-resource-board" aria-label="出战牌库资源">
            <div class="reward-resource-summary loadout-resource-summary">
              <span class="reward-resource-chip loadout-resource-deck"><small>出战牌库</small><b>${selectedCount} <em>/ ${limit} 张</em></b></span>
              <span class="reward-resource-chip loadout-resource-minimum"><small>最低要求</small><b>8 张</b></span>
              <span class="reward-resource-chip reward-resource-owned"><small>拥有卡牌</small><b>${campaign.ownedCards.length} 张</b></span>
              <span class="reward-resource-chip reward-resource-funds"><small>喵喵币</small><b>${formatFundsAmount(campaign.funds)}</b></span>
            </div>
          </section>
          <section class="strategy-pool-panel reward-pool-panel loadout-pool-panel" aria-labelledby="loadout-title">
            <header class="reward-draft-header loadout-draft-header">
              <div class="reward-draft-copy loadout-draft-copy">
                <span>下一关准备</span>
                <h1 id="loadout-title">选择下一关出战牌库</h1>
                <p>点击卡牌切换出战状态；进入下一关前至少选择 8 张，且不能超过当前上限。</p>
              </div>
              <div class="loadout-header-actions">
                <div class="reward-draft-rule loadout-selection-count" aria-label="当前已选择卡牌数量">
                  <span>当前选择</span><strong>${selectedCount}</strong><small>/ ${limit}</small>
                </div>
                <button class="primary-action loadout-finish-button" type="button" data-action="finish-loadout" ${valid ? "" : "disabled"}>
                  <span aria-hidden="true">→</span>
                  返回${campaignFlowStep(campaign.trackId)}
                </button>
              </div>
            </header>
            <div class="strategy-pool-body reward-pool-body loadout-pool-body">
              <div class="catalog-grid strategy-catalog-grid reward-catalog-grid loadout-catalog-grid">
                ${campaign.ownedCards.map((cardId) => renderLoadoutCard(cardId, limit)).join("")}
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  `;
}

function renderLoadoutCard(cardId, limit) {
  const campaign = appState.campaign;
  const card = cardCatalog[cardId];
  const selected = campaign.activeDeck.includes(cardId);
  const disabled = !selected && campaign.activeDeck.length >= limit;
  return `
    <article class="loadout-card-option ${selected ? "is-selected" : ""}">
      <div class="loadout-option-label">
        <span>${selected ? "出战卡牌" : "备用卡牌"}</span>
        <b>${selected ? "已选择" : disabled ? "已达上限" : "点击选择"}</b>
      </div>
      <button class="deck-card ${cardThemeClass(card)} card-kind-${strategyCardKind(card)} loadout-choice-card ${selected ? "selected" : ""}" type="button" data-action="toggle-loadout-card" data-card-id="${cardId}" ${disabled ? "disabled" : ""} ${tipAttr("点击切换是否带入下一关。")}>
        <span class="deck-card-top">
          ${cardTypeIconMarkup(card)}
          <span class="card-name">${card.name}</span>
          <span class="card-cost" aria-label="行动力 ${card.cost}" ${tipAttr("打出这张牌需要消耗的行动力。")}><svg class="action-point-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-7 11h5l-1 9 8-12h-5z"></path></svg><b>${card.cost}</b></span>
        </span>
        ${cardArtMarkup(cardId, card)}
        ${cardParamsMarkup(card)}
      </button>
    </article>
  `;
}

function renderEditorScreen() {
  const snapshot = editableContentSnapshot();
  app.innerHTML = `
    <div class="screen">
      ${stepHeader(campaignFlowStep(), "内容编辑器", "手动调整游戏内容")}
      <section class="setup-panel">
        <div class="setup-head">
          <div>
            <h2>游戏内容手动编辑器</h2>
            <p class="muted">当前编辑：${snapshot.routeName}。改动会立即作用于本次页面，保存后下次打开继续生效。</p>
          </div>
          <div class="flow-actions">
            <button class="primary-action" type="button" data-action="save-editor">
              <span aria-hidden="true">✓</span>
              保存内容
            </button>
            <button class="ghost-action" type="button" data-action="reset-editor">
              <span aria-hidden="true">↻</span>
              重置内容
            </button>
            <button class="ghost-action" type="button" data-action="close-editor">
              <span aria-hidden="true">←</span>
              返回
            </button>
          </div>
        </div>
      </section>

      <section class="setup-panel">
        <div class="setup-head">
          <div>
            <h2>关卡</h2>
            <p class="muted">调整当前路线的敌人血量、攻击、回合数、奖励喵喵币和恢复时间。时间数值按 1 点等于 1 周显示。</p>
          </div>
        </div>
        <div class="editor-grid">
          ${snapshot.stages.map((stage, index) => renderStageEditorRow(stage, index)).join("")}
        </div>
      </section>

      <section class="setup-panel">
        <div class="setup-head">
          <div>
            <h2>关卡间事件</h2>
            <p class="muted">自由线编辑标准/随机事件；Mphone 的诞生线编辑历史时间线事件。</p>
          </div>
        </div>
        <div class="editor-grid">
          ${snapshot.events.map((event, index) => renderEventEditorRow(event, index)).join("")}
        </div>
      </section>

      <section class="setup-panel">
        <div class="setup-head">
          <div>
            <h2>卡牌</h2>
            <p class="muted">可修改名称、类型、行动力费用、商店价格和描述。牌效逻辑暂时保持固定。</p>
          </div>
        </div>
        <div class="editor-grid">
          ${Object.entries(snapshot.cards).map(([id, card]) => renderCardEditorRow(id, card)).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderStageEditorRow(stage, index) {
  return `
    <div class="editor-row wide">
      ${editorInput("关卡名", "stage", index, "title", stage.title)}
      ${editorInput("短名", "stage", index, "short", stage.short)}
      ${editorInput("敌人名", "stage", index, "enemyName", stage.enemyName)}
      ${editorInput("敌人血条名", "stage", index, "target", stage.target)}
      ${editorInput("血量", "stage", index, "hp", stage.hp, "number")}
      ${editorInput("攻击(1周/点)", "stage", index, "attack", stage.attack, "number")}
      ${editorInput("回合", "stage", index, "rounds", stage.rounds, "number")}
      ${editorInput("奖励喵喵币(万)", "stage", index, "rewardFunds", stage.rewardFunds, "number")}
      ${editorInput("恢复时间(1周/点)", "stage", index, "recover", stage.recover, "number")}
      ${editorInput("阻力名", "stage", index, "blockText", stage.blockText)}
      ${editorInput("压力名", "stage", index, "powerText", stage.powerText)}
      ${editorTextarea("简介", "stage", index, "intro", stage.intro)}
    </div>
  `;
}

function renderEventEditorRow(event, index) {
  const effect = event.effect || {};
  return `
    <div class="editor-row wide">
      ${editorInput("事件名", "event", index, "name", event.name)}
      ${editorTextarea("正面效果", "event", index, "positive", event.positive)}
      ${editorTextarea("负面效果", "event", index, "negative", event.negative)}
      ${editorInput("当前时间(1周/点)", "eventEffect", index, "time", effect.time || 0, "number")}
      ${editorInput("时间上限(1周/点)", "eventEffect", index, "maxTime", effect.maxTime || 0, "number")}
      ${editorInput("喵喵币(万)", "eventEffect", index, "funds", effect.funds || 0, "number")}
      ${editorInput("难度", "eventEffect", index, "difficulty", effect.difficulty || 0, "number", "0.01")}
      ${editorInput("敌人血量%", "eventEffect", index, "enemyHpPct", effect.enemyHpPct || 0, "number", "0.01")}
      ${editorInput("敌人攻击(1周/点)", "eventEffect", index, "attackDelta", effect.attackDelta || 0, "number")}
      ${editorInput("商店折扣(万)", "eventEffect", index, "shopDiscount", effect.shopDiscount || 0, "number")}
      ${editorInput("开局缓冲(1周/点)", "eventEffect", index, "startBuffer", effect.startBuffer || 0, "number")}
      ${editorInput("奖励喵喵币(万)", "eventEffect", index, "rewardFunds", effect.rewardFunds || 0, "number")}
    </div>
  `;
}

function renderCardEditorRow(id, card) {
  return `
    <div class="editor-row">
      <label>卡牌ID<input value="${escapeHtml(id)}" disabled></label>
      ${editorInput("名称", "card", id, "name", card.name)}
      ${editorInput("类型", "card", id, "type", card.type)}
      ${editorInput("费用", "card", id, "cost", card.cost, "number")}
      ${editorInput("价格(万)", "card", id, "price", card.price, "number")}
      ${editorTextarea("描述", "card", id, "text", card.text)}
    </div>
  `;
}

function editorInput(label, kind, key, field, value, type = "text", step = "1") {
  return `<label>${label}<input type="${type}" step="${step}" value="${escapeHtml(value)}" data-edit-kind="${kind}" data-edit-key="${key}" data-edit-field="${field}"></label>`;
}

function editorTextarea(label, kind, key, field, value) {
  return `<label>${label}<textarea data-edit-kind="${kind}" data-edit-key="${key}" data-edit-field="${field}">${escapeHtml(value)}</textarea></label>`;
}

function startStage(index) {
  const campaign = appState.campaign;
  if (!campaign || index > campaign.unlockedStage) return;
  if (campaign.completedStages.includes(index)) return;
  if (!canEnterStage()) return;

  const stage = currentStages()[index];
  const enemyHp = Math.round(stage.hp * campaign.difficulty * (1 + campaign.eventMods.enemyHpPct));
  const attack = Math.max(1, Math.round(stage.attack * campaign.difficulty) + campaign.eventMods.attackDelta);

  const storyOpening = createStartupStoryOpening(stage, index);
  appState.battle = {
    stageIndex: index,
    stage,
    round: 1,
    phase: "player",
    hand: [],
    deck: shuffle(campaign.activeDeck),
    discard: [],
    log: [],
    storyEntries: [{ kind: "opening", text: storyOpening }],
    gameOver: false,
    player: {
      hp: campaign.time,
      maxHp: campaign.maxTime,
      funds: campaign.funds,
      block: Math.max(0, campaign.eventMods.startBuffer),
      energy: 3,
      maxEnergy: 3,
      momentum: 0,
    },
    enemy: {
      hp: enemyHp,
      maxHp: enemyHp,
      block: 0,
      power: 0,
      baseAttack: attack,
      intentIndex: 0,
    },
  };

  addLog(appState.battle, storyOpening);
  if (campaign.eventMods.startBuffer > 0) {
    addLog(appState.battle, `常驻事件提供 ${formatDays(campaign.eventMods.startBuffer)} 开局时间缓冲。`);
    addStoryEntry(appState.battle, "此前积累的信任在关键时刻发挥了作用，为团队争取到一段从容的开场。", "opening");
  }
  drawCards(appState.battle, 5);
  appState.screen = "battle";
  render();
}

function renderBattleScreen() {
  const game = appState.battle;
  const stage = game.stage;
  const intent = currentIntent(game);
  const playerHpRate = Math.max(0, game.player.hp / game.player.maxHp);
  const enemyHpRate = Math.max(0, game.enemy.hp / game.enemy.maxHp);

  app.innerHTML = `
    <div class="battle-screen">
      <aside class="battle-sidebar" aria-label="关卡信息">
        <header class="persona-top-rail flow-stage-rail battle-stage-toolbar" aria-label="对战控制">
          <button class="persona-stage-arrow persona-stage-arrow-back" type="button" data-action="return-campaign" aria-label="返回对战" title="返回对战">
            <svg viewBox="0 0 36 24" aria-hidden="true">
              <path d="m22 4-8 8 8 8"></path>
              <path d="m14 4-8 8 8 8"></path>
            </svg>
          </button>
          <div class="resource-row">
            <div class="meter currency-meter resource-meter resource-funds" data-metric-kind="funds" ${tipAttr("当前阶段可用喵喵币。某些牌会消耗喵喵币，喵喵币不足时不能打出。")}><span><i aria-hidden="true">◆</i>喵喵币</span><strong>${formatFundsAmount(game.player.funds)}</strong></div>
            <div class="meter resource-meter resource-deck" ${tipAttr("当前抽牌堆剩余张数。牌库耗尽时会把弃牌堆洗回牌库。")}><span><i aria-hidden="true">▰</i>牌库</span><strong>${game.deck.length}</strong></div>
            <div class="meter resource-meter resource-discard" ${tipAttr("已经打出或回合结束丢弃的牌。牌库耗尽时会被洗回牌库。")}><span><i aria-hidden="true">⌁</i>弃牌</span><strong>${game.discard.length}</strong></div>
            ${renderEventChips(appState.campaign?.eventHistory || [])}
          </div>
          <button class="campaign-stage-restart" type="button" data-action="new-run" aria-label="重开喵创" title="重开喵创">
            <span aria-hidden="true">↻</span>
            <strong>重开喵创</strong>
          </button>
        </header>
        <section class="status-card stage-story-card" aria-label="创业故事">
          <div class="status-header">
            <h2>创业故事</h2>
            <span class="story-chapter-label">${storyChapterTitle(stage)}</span>
          </div>
          <div class="combat-log story-manuscript">${game.storyEntries.map((entry) => `<p class="story-entry story-entry-${entry.kind}">${escapeHtml(entry.text)}</p>`).join("")}</div>
        </section>
      </aside>

      <main class="battle-board">

      <section class="arena" aria-label="喵创阶段对战">
        <article class="combatant player-panel" aria-label="喵创团队">
          ${visualArtMarkup("portrait battle-portrait", "assets/scene-art/startupTeam.png", "startup team")}
          <div class="combatant-info">
            <div class="name-row">
              <h2>喵创团队</h2>
              <span class="energy-pill" ${tipAttr("行动力用于打牌。左侧是当前行动力，右侧是每轮恢复的上限。")}>${game.player.energy}/${game.player.maxEnergy} 行动力</span>
            </div>
            <div class="bar-wrap" aria-label="剩余时间" ${tipAttr("玩家血量，也代表喵创团队剩余时间。敌人攻击会扣减时间，时间归零则阶段失败。")}>
              <span class="bar hp" style="width:${playerHpRate * 100}%"></span>
              <strong>${formatDays(game.player.hp)} / ${formatDays(game.player.maxHp)}</strong>
            </div>
            <div class="stat-row">
              <span class="tag shield" ${tipAttr("时间缓冲会先抵消敌人造成的时间扣减，本轮结束后会清零。")}>时间缓冲 ${formatDays(game.player.block)}</span>
              <span class="tag draw" ${tipAttr("推进加成会提高后续处理核心工作的效果。")}>推进加成 ${game.player.momentum}</span>
            </div>
          </div>
        </article>

        <div class="duel-line" aria-hidden="true">
          <span></span>
          <b>${stage.short}</b>
          <span></span>
        </div>

        <article class="combatant enemy-panel" aria-label="${stage.enemyName}">
          <div class="combatant-info">
            <div class="name-row">
              <h2>${stage.enemyName}</h2>
              <span class="intent-pill" ${tipAttr("敌人下一次行动。攻击会扣减时间，阻力会抵消你的推进效果，压力会提高后续攻击。")}>${intent.label}</span>
            </div>
            <div class="bar-wrap" aria-label="${stage.target}" ${tipAttr("敌人血量，也代表本阶段核心工作剩余量。清空后阶段胜利。")}>
              <span class="bar hp enemy" style="width:${enemyHpRate * 100}%"></span>
              <strong>${game.enemy.hp} / ${game.enemy.maxHp}</strong>
            </div>
            <div class="stat-row">
              <span class="tag shield" ${tipAttr("阻力会优先抵消你对核心工作的推进。每轮开始会自然下降一部分。")}>${stage.blockText} ${game.enemy.block}</span>
              <span class="tag power" ${tipAttr("压力会提高敌人后续攻击，导致更多时间损失。")}>${stage.powerText} ${game.enemy.power}</span>
            </div>
          </div>
          ${visualArtMarkup("portrait enemy battle-portrait", stageArtSrc(game.stageIndex), stage.enemyName)}
        </article>
      </section>

      <section class="table" aria-label="行动区">
        <div class="hand-area">
          <div class="card-zone-label" aria-hidden="true"><span>HAND</span><b>选择卡牌并打出</b></div>
          <div class="hand" aria-label="手牌">
            ${game.hand.map((cardId, index) => renderHandCard(cardId, index, game)).join("")}
          </div>
        </div>
        <div class="battle-turn-dock">
        <button class="battle-end-turn-button" type="button" data-action="end-turn" aria-label="结束本轮" ${game.phase !== "player" || game.gameOver || game.storyPending ? "disabled" : ""}>
          <span class="turn-paw-icon" aria-hidden="true">
            <!-- Font Awesome Free "paw" icon, CC BY 4.0: https://fontawesome.com/icons/paw -->
            <svg viewBox="0 0 512 512">
              <defs>
                <linearGradient id="turnPawGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#f08a50"></stop>
                  <stop offset="0.58" stop-color="#c84e2d"></stop>
                  <stop offset="1" stop-color="#7d281b"></stop>
                </linearGradient>
              </defs>
              <path class="turn-paw-shape" d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7.9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"></path>
            </svg>
          </span>
          <span class="turn-paw-copy"><strong>结束</strong><small>本轮</small></span>
        </button>
        </div>
      </section>
      </main>
    </div>
  `;
}

function renderHandCard(cardId, index, game) {
  const card = cardCatalog[cardId];
  const disabled = game.phase !== "player" || game.player.energy < card.cost || game.player.funds < (card.fundCost || 0) || game.gameOver || game.storyPending;
  return `
    <button class="card-button ${cardThemeClass(card)} card-kind-${strategyCardKind(card)}" type="button" data-action="play-card" data-card-index="${index}" ${disabled ? "disabled" : ""} ${tipAttr("点击打出这张牌。若行动力或喵喵币不足，卡牌会变灰。")}>
      <span class="battle-card-top">
        ${cardTypeIconMarkup(card)}
        <span class="card-name">${card.name}</span>
        <span class="card-cost" aria-label="行动力 ${card.cost}" ${tipAttr("打出这张牌需要消耗的行动力。")}>
          <svg class="action-point-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-7 11h5l-1 9 8-12h-5z"></path></svg>
          <b>${card.cost}</b>
        </span>
      </span>
      ${cardArtMarkup(cardId, card)}
      ${cardParamsMarkup(card)}
    </button>
  `;
}

function battleMessage(game) {
  if (game.gameOver) return "阶段已结束。";
  if (game.phase !== "player") return "项目压力处理中。";
  return `用手牌处理「${game.stage.target}」，或争取时间和喵喵币。`;
}

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function addLog(state, text) {
  state.log.unshift(text);
  state.log = state.log.slice(0, 8);
}

function drawCards(state, count) {
  for (let i = 0; i < count; i += 1) {
    if (state.deck.length === 0) {
      if (state.discard.length === 0) return;
      state.deck = shuffle(state.discard);
      state.discard = [];
      addLog(state, "弃牌堆洗回牌库。");
    }
    state.hand.push(state.deck.pop());
  }
}

function gainBuffer(state, amount) {
  state.player.block += amount;
  addLog(state, `团队建立了 ${formatDays(amount)} 时间缓冲。`);
}

function gainTime(state, amount) {
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + amount);
  addLog(state, `剩余时间增加 ${formatDays(amount)}。`);
}

function gainFunds(state, amount) {
  const funds = amount * FUND_SCALE;
  state.player.funds += funds;
  addLog(state, `喵喵币增加 ${formatFundsAmount(funds)}。`);
}

function spendFunds(state, amount) {
  const funds = amount * FUND_SCALE;
  state.player.funds = Math.max(0, state.player.funds - funds);
  addLog(state, `喵喵币支出 ${formatFundsAmount(funds)}。`);
}

function loseTime(state, amount, message) {
  const buffered = Math.min(state.player.block, amount);
  const timeLost = amount - buffered;
  state.player.block -= buffered;
  state.player.hp = Math.max(0, state.player.hp - timeLost);
  addLog(state, message || `项目压力原本会扣减 ${formatDays(amount)}，实际扣减 ${formatDays(timeLost)}。`);
  if (buffered > 0) addLog(state, `时间缓冲抵消了 ${formatDays(buffered)}。`);
  checkGameOver(state);
}

function advanceWork(state, amount) {
  const blocked = Math.min(state.enemy.block, amount);
  const progress = amount - blocked;
  state.enemy.block -= blocked;
  state.enemy.hp = Math.max(0, state.enemy.hp - progress);
  addLog(state, `${state.stage.target}减少 ${progress}。`);
  checkGameOver(state);
}

function currentIntent(state) {
  const base = state.enemy.baseAttack + state.enemy.power;
  const intents = [
    { kind: "attack", label: `关键压力：将扣减 ${formatDays(base)}`, value: base },
    { kind: "block", label: `${state.stage.blockText} +7`, value: 7 },
    { kind: "attack", label: `突发问题：将扣减 ${formatDays(Math.max(1, base - 1))}`, value: Math.max(1, base - 1) },
    { kind: "power", label: `${state.stage.powerText} +2`, value: 2 },
    { kind: "attack", label: `最终催办：将扣减 ${formatDays(base + 2)}`, value: base + 2 },
  ];
  return intents[state.enemy.intentIndex % intents.length];
}

let battleCardAnimationLocked = false;

function playCardWithAnimation(cardButton, index) {
  const game = appState.battle;
  const cardId = game?.hand[index];
  const card = cardCatalog[cardId];
  if (
    battleCardAnimationLocked ||
    !game ||
    game.gameOver ||
    game.phase !== "player" ||
    !card ||
    game.player.energy < card.cost ||
    game.player.funds < (card.fundCost || 0)
  ) return;

  const battleScreen = cardButton?.closest(".battle-screen");
  const resolveTarget = battleScreen?.querySelector(".duel-line b") || battleScreen?.querySelector(".arena");
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!cardButton || !battleScreen || !resolveTarget || reduceMotion || typeof cardButton.animate !== "function") {
    playCard(index);
    return;
  }

  battleCardAnimationLocked = true;
  const sourceRect = cardButton.getBoundingClientRect();
  const targetRect = resolveTarget.getBoundingClientRect();
  const flightCard = cardButton.cloneNode(true);
  flightCard.classList.add("battle-card-flight");
  flightCard.classList.remove("card-committed");
  flightCard.removeAttribute("data-action");
  flightCard.removeAttribute("data-card-index");
  flightCard.removeAttribute("disabled");
  flightCard.style.left = `${sourceRect.left}px`;
  flightCard.style.top = `${sourceRect.top}px`;
  flightCard.style.width = `${sourceRect.width}px`;
  flightCard.style.height = `${sourceRect.height}px`;
  battleScreen.appendChild(flightCard);
  cardButton.classList.add("card-committed");

  const targetX = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
  const targetY = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);
  const animation = flightCard.animate(
    [
      { transform: "translate3d(0, 0, 0) rotate(0deg) scale(1)", opacity: 1 },
      { transform: `translate3d(${targetX * 0.5}px, ${targetY * 0.42 - 42}px, 0) rotate(-3deg) scale(1.08)`, opacity: 1, offset: 0.52 },
      { transform: `translate3d(${targetX}px, ${targetY}px, 0) rotate(1deg) scale(0.34)`, opacity: 0.18 },
    ],
    { duration: 460, easing: "cubic-bezier(.2,.82,.24,1)", fill: "forwards" },
  );

  let resolved = false;
  const resolveCard = () => {
    if (resolved) return;
    resolved = true;
    flightCard.remove();
    playCard(index);
    window.requestAnimationFrame(() => {
      const arena = document.querySelector(".battle-screen .arena");
      if (!arena) {
        battleCardAnimationLocked = false;
        return;
      }
      arena.classList.add("card-resolve-flash");
      const callout = document.createElement("div");
      callout.className = "battle-card-callout";
      callout.textContent = `打出「${card.name}」`;
      arena.appendChild(callout);
      window.setTimeout(() => {
        callout.remove();
        arena.classList.remove("card-resolve-flash");
        battleCardAnimationLocked = false;
      }, 760);
    });
  };

  animation.addEventListener("finish", resolveCard, { once: true });
  animation.addEventListener("cancel", resolveCard, { once: true });
}

async function playCard(index) {
  const game = appState.battle;
  if (!game || game.gameOver || game.phase !== "player") return;

  const cardId = game.hand[index];
  const card = cardCatalog[cardId];
  if (!card || game.player.energy < card.cost || game.player.funds < (card.fundCost || 0)) return;

  game.storyPending = true;
  render();
  const storyText = await createCardStory(game, card);
  if (appState.battle !== game || game.gameOver || game.phase !== "player" || game.hand[index] !== cardId) {
    game.storyPending = false;
    if (appState.battle === game) render();
    return;
  }
  game.storyPending = false;

  game.player.energy -= card.cost;
  game.hand.splice(index, 1);
  game.discard.push(cardId);
  addStoryEntry(game, storyText, "action");
  addLog(game, `打出「${card.name}」。`);
  card.play(game);
  render();
}

function endTurn() {
  const game = appState.battle;
  if (!game || game.gameOver || game.phase !== "player") return;
  game.phase = "enemy";
  game.discard.push(...game.hand);
  game.hand = [];
  render();

  window.setTimeout(() => {
    if (game.gameOver) return;
    resolveEnemyTurn(game);
    if (!game.gameOver) startPlayerTurn(game);
    render();
  }, 420);
}

function resolveEnemyTurn(game) {
  const intent = currentIntent(game);
  addStoryEntry(game, createPressureStory(game, intent), "pressure");

  if (intent.kind === "attack") {
    loseTime(game, intent.value, `${game.stage.title}原本会扣减 ${formatDays(intent.value)}，实际扣减 ${formatDays(Math.max(0, intent.value - game.player.block))}。`);
  }

  if (intent.kind === "block") {
    game.enemy.block += intent.value;
    addLog(game, `${game.stage.blockText}上升。`);
  }

  if (intent.kind === "power") {
    game.enemy.power += intent.value;
    addLog(game, `${game.stage.powerText}上升。`);
  }

  game.enemy.intentIndex += 1;
}

function startPlayerTurn(game) {
  game.round += 1;

  if (game.round > game.stage.rounds) {
    game.gameOver = true;
    game.phase = "over";
    showStageFailure(game, `${game.stage.title}超过回合限制，核心工作仍未完成。`);
    return;
  }

  game.phase = "player";
  game.player.block = 0;
  game.enemy.block = Math.max(0, game.enemy.block - 2);
  game.player.energy = game.player.maxEnergy;
  drawCards(game, 2);
}

function checkGameOver(game) {
  if (game.enemy.hp <= 0) {
    game.gameOver = true;
    game.phase = "over";
    finishStage(game);
  }

  if (game.player.hp <= 0) {
    game.gameOver = true;
    game.phase = "over";
    showStageFailure(game, "剩余时间归零，团队没能在截止铃响前完成本章目标。");
  }
}

function showStageFailure(game, reason) {
  const completedProgress = Math.max(0, Math.min(1, 1 - (game.enemy.hp / game.enemy.maxHp)));
  const chapterNumber = String(game.stageIndex + 1).padStart(2, "0");
  showModal(
    "阶段未完成",
    reason,
    "重新挑战本章",
    () => startStage(game.stageIndex),
    {
      stageFailure: true,
      icon: "↻",
      failure: {
        chapter: `第 ${chapterNumber} 章 · ${game.stage.title}`,
        time: `${formatDays(Math.max(0, game.player.hp))} / ${formatDays(game.player.maxHp)}`,
        progress: `${Math.round(completedProgress * 100)}%`,
        rounds: `${Math.min(game.round, game.stage.rounds)} / ${game.stage.rounds}`,
        funds: formatFundsAmount(game.player.funds),
      },
    },
  );
}

function finishStage(game) {
  const campaign = appState.campaign;
  const stageIndex = game.stageIndex;
  if (!campaign.completedStages.includes(stageIndex)) {
    campaign.completedStages.push(stageIndex);
  }
  campaign.unlockedStage = Math.max(campaign.unlockedStage, Math.min(currentStages().length - 1, stageIndex + 1));
  campaign.time = Math.min(campaign.maxTime, game.player.hp + game.stage.recover);
  const totalRewardFunds = Math.max(0, game.stage.rewardFunds + campaign.eventMods.rewardFunds);
  campaign.funds = game.player.funds + totalRewardFunds;
  campaign.pendingStage = stageIndex;
  campaign.rewardChoices = currentStageRewardIds()[stageIndex] || [];
  campaign.shopOffers = createShopOffers();

  addStoryEntry(game, createChapterClosing(game), "closing");
  storeStoryChapter(campaign, game);

  const finalStage = stageIndex === currentStages().length - 1;
  const progressReport = isIphoneRoute(campaign.trackId) ? iphoneProgressReports[stageIndex] : "";
  const normalCompleteText = `${createChapterClosing(game)}\n\n本章收获：喵喵币 ${formatFundDelta(totalRewardFunds)}，时间恢复 ${formatDays(game.stage.recover)}。${progressReport ? `\n\n${progressReport}\n\n` : ""}接下来选择阶段奖励。`;
  const completeStory = compileStartupStory(campaign);
  showModal(
    finalStage ? "创业故事汇" : game.stage.title,
    finalStage
      ? isIphoneRoute(campaign.trackId)
        ? `${completeStory}\n\n【史实后记】\n${iphoneFinalReport}`
        : completeStory
      : normalCompleteText,
    finalStage ? `返回${campaignFlowStep(campaign.trackId)}` : "选择奖励",
    () => {
      appState.battle = null;
      appState.screen = finalStage ? "campaign" : "reward";
      render();
    },
    { anthology: finalStage, chapterComplete: true, icon: finalStage ? "✦" : "➜" },
  );
}

function showModal(title, text, actionLabel, action, options = {}) {
  modalTitle.textContent = title;
  if (options.stageFailure && options.failure) {
    const failure = options.failure;
    modalPanel.dataset.failureChapter = failure.chapter;
    modalText.innerHTML = `
      <span class="stage-failure-kicker">创业故事 · 阶段结算</span>
      <span class="stage-failure-reason"><small>失败原因</small><strong>${escapeHtml(text)}</strong></span>
      <span class="stage-failure-metrics" aria-label="本次挑战数据">
        <span class="stage-failure-metric stage-failure-time"><small>剩余时间</small><strong>${escapeHtml(failure.time)}</strong></span>
        <span class="stage-failure-metric"><small>目标进度</small><strong>${escapeHtml(failure.progress)}</strong></span>
        <span class="stage-failure-metric"><small>挑战轮次</small><strong>${escapeHtml(failure.rounds)}</strong></span>
        <span class="stage-failure-metric"><small>喵喵币</small><strong>${escapeHtml(failure.funds)}</strong></span>
      </span>
      <span class="stage-failure-note">复盘卡组与出牌顺序，再次推进本章目标</span>
    `;
  } else if (options.eventDetail && options.event) {
    const event = options.event;
    modalPanel.removeAttribute("data-failure-chapter");
    modalText.innerHTML = `
      <span class="event-detail-kicker">历史事件 · 常驻影响</span>
      <span class="event-detail-section event-detail-positive">
        <small>正面效果</small>
        <strong>${escapeHtml(event.positive)}</strong>
      </span>
      <span class="event-detail-section event-detail-negative">
        <small>负面效果</small>
        <strong>${escapeHtml(event.negative)}</strong>
      </span>
      <span class="event-detail-section event-detail-persistent">
        <small>常驻影响</small>
        <strong>${escapeHtml(formatEventEffect(event.effect))}</strong>
      </span>
    `;
  } else {
    modalPanel.removeAttribute("data-failure-chapter");
    modalText.textContent = text;
  }
  modalActionBtn.lastChild.textContent = actionLabel;
  const actionIcon = modalActionBtn.querySelector("span");
  if (actionIcon) actionIcon.textContent = options.icon || "↻";
  modalGlyph.innerHTML = options.anthology
    ? `<svg class="finale-trophy" viewBox="0 0 120 120" aria-hidden="true">
        <path class="finale-laurel finale-laurel-left" d="M31 82C18 70 14 51 21 34M25 67l-10-3m12-9-11-7m17-3-8-10"></path>
        <path class="finale-laurel finale-laurel-right" d="M89 82c13-12 17-31 10-48m-4 33 10-3m-12-9 11-7m-17-3 8-10"></path>
        <path class="finale-cup" d="M39 28h42v15c0 20-8 34-21 34S39 63 39 43V28Z"></path>
        <path class="finale-handle" d="M39 35H27v9c0 11 6 18 17 19M81 35h12v9c0 11-6 18-17 19"></path>
        <path class="finale-base" d="M60 77v12m-15 0h30m-38 10h46"></path>
        <path class="finale-star" d="m60 36 4 8 9 1-7 6 2 9-8-4-8 4 2-9-7-6 9-1Z"></path>
      </svg>`
    : "";
  modal.classList.toggle("story-anthology-modal", Boolean(options.anthology));
  modal.classList.toggle("chapter-complete-overlay", Boolean(options.chapterComplete));
  modal.classList.toggle("stage-failure-overlay", Boolean(options.stageFailure));
  modal.classList.toggle("event-detail-overlay", Boolean(options.eventDetail));
  modal.classList.remove("hidden");
  window.requestAnimationFrame(syncModalScrollHint);
  modalAction = action;
}

function syncModalScrollHint() {
  const anthologyOpen = modal.classList.contains("story-anthology-modal") && !modal.classList.contains("hidden");
  const scrollable = modalText.scrollHeight > modalText.clientHeight + 8;
  modalScrollHint.hidden = !anthologyOpen || !scrollable;
  if (modalScrollHint.hidden) return;
  const atEnd = modalText.scrollTop + modalText.clientHeight >= modalText.scrollHeight - 12;
  modalScrollHint.classList.toggle("is-at-end", atEnd);
  modalScrollHint.querySelector("strong").textContent = atEnd ? "已到结尾 · 点击返回顶部" : "向下滑动继续阅读";
}

modalText.addEventListener("scroll", syncModalScrollHint);
modalScrollHint.addEventListener("click", () => {
  const atEnd = modalScrollHint.classList.contains("is-at-end");
  modalText.scrollTo({
    top: atEnd ? 0 : Math.min(modalText.scrollHeight, modalText.scrollTop + modalText.clientHeight * 0.78),
    behavior: "smooth",
  });
});

function showEventDetail(eventId) {
  const event = eventById(eventId);
  if (!event) return;

  showModal(event.name, "", "关闭", null, { eventDetail: true, event, icon: "×" });
}

function hideModal() {
  modal.classList.add("hidden");
  modal.classList.remove("story-anthology-modal", "chapter-complete-overlay", "stage-failure-overlay", "event-detail-overlay");
  modalPanel.removeAttribute("data-failure-chapter");
  modalAction = null;
}

function assignTrait(traitId, group, index) {
  if (!traitById(traitId) || selectedTraitIds().includes(traitId)) return;
  const poolScrollTop = getPersonaPoolScroll();

  if (group && Number.isInteger(index)) {
    if (!appState.personas[group][index]) {
      appState.personas[group][index] = traitId;
    }
    render();
    restorePersonaPoolScroll(poolScrollTop);
    return;
  }

  const groups = ["core", "opportunity"];
  for (const groupName of groups) {
    const emptyIndex = appState.personas[groupName].findIndex((item) => !item);
    if (emptyIndex !== -1) {
      appState.personas[groupName][emptyIndex] = traitId;
      render();
      restorePersonaPoolScroll(poolScrollTop);
      return;
    }
  }
}

function removeTrait(group, index) {
  const poolScrollTop = getPersonaPoolScroll();
  appState.personas[group][index] = null;
  render();
  restorePersonaPoolScroll(poolScrollTop);
}

function resetRun() {
  appState.screen = "track";
  appState.trackId = null;
  appState.personas = { core: [null, null], opportunity: [null, null, null, null] };
  appState.selectedDeck = [];
  appState.campaign = null;
  appState.battle = null;
  render();
}

function chooseReward(cardId) {
  const campaign = appState.campaign;
  if (!campaign || !campaign.rewardChoices.includes(cardId)) return;
  if (!campaign.ownedCards.includes(cardId)) {
    campaign.ownedCards.push(cardId);
  }
  if (campaign.activeDeck.length < deckLimit()) {
    campaign.activeDeck.push(cardId);
  }
  campaign.rewardChoices = [];
  campaign.pendingEvent = pickSpecialEvent();
  appState.screen = "event";
  render();
}

function resolveEvent() {
  const campaign = appState.campaign;
  if (!campaign || !campaign.pendingEvent) return;
  applySpecialEvent(campaign.pendingEvent);
  appState.screen = "shop";
  render();
}

function buyCard(cardId) {
  const campaign = appState.campaign;
  if (!campaign || campaign.ownedCards.includes(cardId) || !campaign.shopOffers.includes(cardId)) return;

  const price = cardPrice(cardId);
  if (campaign.funds < price) return;

  campaign.funds -= price;
  campaign.ownedCards.push(cardId);
  campaign.shopOffers = campaign.shopOffers.filter((id) => id !== cardId);
  render();
}

function finishShop() {
  const campaign = appState.campaign;
  if (!campaign) return;
  campaign.activeDeck = campaign.activeDeck.filter((cardId) => campaign.ownedCards.includes(cardId));
  while (campaign.activeDeck.length < 8 && campaign.activeDeck.length < campaign.ownedCards.length) {
    const candidate = campaign.ownedCards.find((cardId) => !campaign.activeDeck.includes(cardId));
    if (!candidate) break;
    campaign.activeDeck.push(candidate);
  }
  appState.screen = "loadout";
  render();
}

function toggleLoadoutCard(cardId) {
  const campaign = appState.campaign;
  if (!campaign || !campaign.ownedCards.includes(cardId)) return;

  if (campaign.activeDeck.includes(cardId)) {
    campaign.activeDeck = campaign.activeDeck.filter((id) => id !== cardId);
  } else if (campaign.activeDeck.length < deckLimit()) {
    campaign.activeDeck.push(cardId);
  }
  render();
}

function finishLoadout() {
  if (!canEnterStage()) return;
  appState.screen = "campaign";
  render();
}

function openEditor() {
  appState.editorReturnScreen = appState.screen === "editor" ? "track" : appState.screen;
  appState.screen = "editor";
  render();
}

function closeEditor() {
  appState.screen = appState.editorReturnScreen || "track";
  render();
}

function updateEditorValue(target) {
  const { editKind, editKey, editField } = target.dataset;
  const rawValue = target.value;
  const numeric = target.type === "number";
  const value = numeric ? Number(rawValue) : rawValue;
  const stageList = editableStages();
  const eventList = editableEvents();

  if (editKind === "stage" && stageList[Number(editKey)]) {
    stageList[Number(editKey)][editField] = numeric ? value : rawValue;
  }

  if (editKind === "event" && eventList[Number(editKey)]) {
    eventList[Number(editKey)][editField] = rawValue;
  }

  if (editKind === "eventEffect" && eventList[Number(editKey)]) {
    eventList[Number(editKey)].effect[editField] = value;
  }

  if (editKind === "card" && cardCatalog[editKey]) {
    if (editField === "price" && rawValue === "") {
      delete cardCatalog[editKey].price;
    } else {
      cardCatalog[editKey][editField] = numeric ? value : rawValue;
    }
  }
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  if (action === "select-track") {
    appState.trackId = target.dataset.trackId;
    appState.personas = { core: [null, null], opportunity: [null, null, null, null] };
    appState.selectedDeck = [];
    if (isIphoneRoute(appState.trackId)) {
      appState.selectedDeck = [...iphoneStarterDeck];
      startCampaign();
    } else {
      appState.screen = "personas";
      render();
    }
  }

  if (action === "open-editor") openEditor();
  if (action === "close-editor") closeEditor();
  if (action === "save-editor") {
    saveContentEdits();
    closeEditor();
  }
  if (action === "reset-editor") {
    localStorage.removeItem(contentStorageKey());
    legacyContentStorageKeys().forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  }

  if (action === "assign-trait") assignTrait(target.dataset.traitId);
  if (action === "remove-trait") removeTrait(target.dataset.slotGroup, Number(target.dataset.slotIndex));

  if (action === "back-track") {
    appState.screen = "track";
    render();
  }

  if (action === "back-personas") {
    appState.screen = "personas";
    render();
  }

  if (action === "go-deck" && canProceedPersonas()) {
    appState.screen = "deck";
    render();
  }

  if (action === "toggle-deck-card") {
    const cardId = target.dataset.cardId;
    if (appState.selectedDeck.includes(cardId)) {
      appState.selectedDeck = appState.selectedDeck.filter((id) => id !== cardId);
    } else if (appState.selectedDeck.length < 8) {
      appState.selectedDeck.push(cardId);
    }
    render();
  }

  if (action === "start-campaign" && appState.selectedDeck.length === 8) startCampaign();
  if (action === "start-stage") startStage(Number(target.dataset.stageIndex));
  if (action === "choose-reward") chooseReward(target.dataset.cardId);
  if (action === "resolve-event") resolveEvent();
  if (action === "show-event") showEventDetail(target.dataset.eventId);
  if (action === "buy-card") buyCard(target.dataset.cardId);
  if (action === "finish-shop") finishShop();
  if (action === "toggle-loadout-card") toggleLoadoutCard(target.dataset.cardId);
  if (action === "finish-loadout") finishLoadout();
  if (action === "new-run") resetRun();
  if (action === "back-before-stage") {
    const campaign = appState.campaign;
    if (!campaign) return;
    if (campaign.completedStages.length > 0) {
      appState.screen = "loadout";
    } else if (isIphoneRoute(campaign.trackId)) {
      appState.campaign = null;
      appState.selectedDeck = [];
      appState.screen = "track";
    } else {
      appState.campaign = null;
      appState.screen = "deck";
    }
    render();
  }
  if (action === "return-campaign") {
    appState.screen = "campaign";
    appState.battle = null;
    render();
  }
  if (action === "play-card") playCardWithAnimation(target, Number(target.dataset.cardIndex));
  if (action === "end-turn") endTurn();
});

app.addEventListener("dragstart", (event) => {
  const trait = event.target.closest("[data-trait-id]");
  if (!trait || trait.classList.contains("assigned")) return;
  event.dataTransfer.setData("text/plain", trait.dataset.traitId);
});

app.addEventListener("dragover", (event) => {
  if (event.target.closest("[data-slot-group]")) event.preventDefault();
});

app.addEventListener("drop", (event) => {
  const slot = event.target.closest("[data-slot-group]");
  if (!slot) return;
  event.preventDefault();
  assignTrait(event.dataTransfer.getData("text/plain"), slot.dataset.slotGroup, Number(slot.dataset.slotIndex));
});

app.addEventListener("input", (event) => {
  const target = event.target.closest("[data-edit-kind]");
  if (!target) return;
  updateEditorValue(target);
});

modalActionBtn.addEventListener("click", () => {
  const action = modalAction;
  hideModal();
  if (action) action();
});

let tooltipTimer = null;
let tooltipTarget = null;
let lastPointer = { x: 0, y: 0 };
const tooltipEl = document.createElement("div");
tooltipEl.className = "hover-tooltip";
tooltipEl.hidden = true;
document.body.appendChild(tooltipEl);

function placeTooltip() {
  const offset = 14;
  const rect = tooltipEl.getBoundingClientRect();
  let left = lastPointer.x + offset;
  let top = lastPointer.y + offset;

  if (left + rect.width > window.innerWidth - 8) {
    left = window.innerWidth - rect.width - 8;
  }

  if (top + rect.height > window.innerHeight - 8) {
    top = lastPointer.y - rect.height - offset;
  }

  tooltipEl.style.left = `${Math.max(8, left)}px`;
  tooltipEl.style.top = `${Math.max(8, top)}px`;
}

function hideTooltip() {
  window.clearTimeout(tooltipTimer);
  tooltipTimer = null;
  tooltipTarget = null;
  tooltipEl.hidden = true;
}

document.addEventListener("mousemove", (event) => {
  lastPointer = { x: event.clientX, y: event.clientY };
  if (!tooltipEl.hidden) placeTooltip();
});

document.addEventListener("mouseover", (event) => {
  const target = event.target.closest("[data-tip]");
  if (!target || target === tooltipTarget) return;

  window.clearTimeout(tooltipTimer);
  tooltipTarget = target;
  tooltipEl.hidden = true;
  tooltipTimer = window.setTimeout(() => {
    if (!tooltipTarget || !document.body.contains(tooltipTarget)) return;
    tooltipEl.textContent = tooltipTarget.dataset.tip;
    tooltipEl.hidden = false;
    placeTooltip();
  }, 1000);
});

document.addEventListener("mouseout", (event) => {
  const target = event.target.closest("[data-tip]");
  if (!target) return;
  const next = event.relatedTarget;
  if (next instanceof Element && target.contains(next)) return;
  if (target === tooltipTarget) hideTooltip();
});

document.addEventListener("scroll", hideTooltip, true);

loadContentEdits();
if (isStandaloneBattleTest) {
  if (isStandaloneFinaleDemo) startStandaloneFinaleDemo();
  else if (isStandaloneEventDemo) startStandaloneEventDemo();
  else if (isStandaloneFailureDemo) startStandaloneFailureDemo();
  else if (isStandaloneRewardDemo && new URLSearchParams(window.location.search).has("chapter")) startStandaloneRewardDemo();
  else if (restoreStandaloneRewardState()) render();
  else if (isStandaloneRewardDemo) startStandaloneRewardDemo();
  else startStage(0);
} else {
  render();
}

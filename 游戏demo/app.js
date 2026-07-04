const app = document.querySelector("#app");
const modal = document.querySelector("#gameOverModal");
const modalTitle = document.querySelector("#modalTitle");
const modalText = document.querySelector("#modalText");
const modalActionBtn = document.querySelector("#modalActionBtn");

const steps = ["赛道", "画像", "组牌", "路线", "对战"];

const tracks = [
  {
    id: "health",
    name: "银发健康",
    note: "照护、康复、慢病管理与家庭协同。",
    base: { time: 30, funds: 14, difficulty: 0.94 },
    traits: [
      { id: "h1", name: "慢病老人", tag: "高频刚需", effect: { time: 3, funds: 0, difficulty: -0.05 } },
      { id: "h2", name: "子女照护者", tag: "付费决策", effect: { time: 1, funds: 3, difficulty: -0.03 } },
      { id: "h3", name: "社区医生", tag: "专业入口", effect: { time: 0, funds: 2, difficulty: -0.04 } },
      { id: "h4", name: "康复机构", tag: "渠道伙伴", effect: { time: -1, funds: 4, difficulty: 0.02 } },
      { id: "h5", name: "活跃退休者", tag: "增长人群", effect: { time: 2, funds: 1, difficulty: -0.01 } },
      { id: "h6", name: "保险顾问", tag: "商业合作", effect: { time: -1, funds: 5, difficulty: 0.04 } },
      { id: "h7", name: "护理站长", tag: "交付约束", effect: { time: 1, funds: 2, difficulty: 0.01 } },
      { id: "h8", name: "空巢老人", tag: "触达困难", effect: { time: 4, funds: -1, difficulty: 0.04 } },
      { id: "h9", name: "药房店员", tag: "线下触点", effect: { time: 1, funds: 1, difficulty: -0.02 } },
      { id: "h10", name: "养老院采购", tag: "大单机会", effect: { time: -2, funds: 6, difficulty: 0.07 } },
      { id: "h11", name: "康复教练", tag: "专业内容", effect: { time: 0, funds: 2, difficulty: -0.01 } },
      { id: "h12", name: "家庭护士", tag: "服务闭环", effect: { time: 1, funds: 2, difficulty: 0.02 } },
    ],
  },
  {
    id: "ai",
    name: "AI效率工具",
    note: "面向企业、创作者与专业岗位的流程提效。",
    base: { time: 28, funds: 17, difficulty: 0.98 },
    traits: [
      { id: "a1", name: "独立开发者", tag: "早期拥护", effect: { time: 2, funds: 0, difficulty: -0.04 } },
      { id: "a2", name: "中小老板", tag: "预算明确", effect: { time: -1, funds: 5, difficulty: 0.03 } },
      { id: "a3", name: "一线运营", tag: "流程痛点", effect: { time: 2, funds: 1, difficulty: -0.03 } },
      { id: "a4", name: "内容团队", tag: "增长人群", effect: { time: 1, funds: 2, difficulty: -0.01 } },
      { id: "a5", name: "数据分析师", tag: "专业门槛", effect: { time: -1, funds: 3, difficulty: 0.04 } },
      { id: "a6", name: "外包团队", tag: "交付生态", effect: { time: 0, funds: 4, difficulty: 0.03 } },
      { id: "a7", name: "销售主管", tag: "付费线索", effect: { time: -1, funds: 4, difficulty: 0.02 } },
      { id: "a8", name: "法务经理", tag: "合规压力", effect: { time: -2, funds: 3, difficulty: 0.07 } },
      { id: "a9", name: "设计师", tag: "轻量场景", effect: { time: 2, funds: 1, difficulty: -0.02 } },
      { id: "a10", name: "客服团队", tag: "批量需求", effect: { time: 0, funds: 4, difficulty: 0.01 } },
      { id: "a11", name: "咨询顾问", tag: "高客单价", effect: { time: -1, funds: 6, difficulty: 0.05 } },
      { id: "a12", name: "学生社群", tag: "传播扩散", effect: { time: 3, funds: -1, difficulty: -0.01 } },
    ],
  },
  {
    id: "green",
    name: "绿色消费",
    note: "可持续材料、低碳生活方式与新渠道消费。",
    base: { time: 29, funds: 15, difficulty: 0.96 },
    traits: [
      { id: "g1", name: "新锐白领", tag: "愿意尝鲜", effect: { time: 2, funds: 2, difficulty: -0.03 } },
      { id: "g2", name: "精致妈妈", tag: "品质决策", effect: { time: 0, funds: 4, difficulty: 0.02 } },
      { id: "g3", name: "户外爱好者", tag: "场景清晰", effect: { time: 2, funds: 1, difficulty: -0.02 } },
      { id: "g4", name: "社区团长", tag: "渠道杠杆", effect: { time: -1, funds: 4, difficulty: 0.03 } },
      { id: "g5", name: "礼品采购", tag: "订单机会", effect: { time: -2, funds: 6, difficulty: 0.05 } },
      { id: "g6", name: "环保达人", tag: "传播节点", effect: { time: 3, funds: 0, difficulty: -0.02 } },
      { id: "g7", name: "便利店店主", tag: "线下测试", effect: { time: 1, funds: 2, difficulty: 0.01 } },
      { id: "g8", name: "校园社群", tag: "低成本扩散", effect: { time: 3, funds: -1, difficulty: -0.01 } },
      { id: "g9", name: "企业行政", tag: "团购入口", effect: { time: -1, funds: 5, difficulty: 0.04 } },
      { id: "g10", name: "材料供应商", tag: "供应约束", effect: { time: -2, funds: 4, difficulty: 0.06 } },
      { id: "g11", name: "直播买手", tag: "爆发渠道", effect: { time: -1, funds: 5, difficulty: 0.05 } },
      { id: "g12", name: "设计集合店", tag: "品牌背书", effect: { time: 0, funds: 3, difficulty: 0.02 } },
    ],
  },
  {
    id: "iphone",
    name: "初代 iPhone",
    note: "真实产品故事线：Project Purple 从秘密立项到 2007-06-29 发售。",
    base: { time: 34, funds: 20, difficulty: 0.96 },
    specialRoute: true,
  },
];

const stages = [
  {
    title: "立项做DEMO",
    short: "DEMO",
    enemyName: "核心工作：可演示 Demo",
    target: "Demo剩余工作",
    hp: 42,
    attack: 5,
    rounds: 8,
    blockText: "评审阻力",
    powerText: "Deadline压力",
    intro: "先做出能说明核心价值的 Demo。",
    rewardFunds: 4,
    recover: 4,
  },
  {
    title: "说服投资人",
    short: "融资",
    enemyName: "核心工作：投资人疑虑",
    target: "投资人疑虑",
    hp: 48,
    attack: 5,
    rounds: 8,
    blockText: "质疑点",
    powerText: "追问压力",
    intro: "把市场、团队、模型和路线讲清楚。",
    rewardFunds: 10,
    recover: 4,
  },
  {
    title: "产品研发",
    short: "研发",
    enemyName: "核心工作：研发待办",
    target: "研发待办",
    hp: 58,
    attack: 5,
    rounds: 9,
    blockText: "技术债",
    powerText: "返工压力",
    intro: "把 Demo 打磨成可用产品。",
    rewardFunds: 6,
    recover: 5,
  },
  {
    title: "供应商谈判",
    short: "供应",
    enemyName: "核心工作：供应商分歧",
    target: "谈判分歧",
    hp: 48,
    attack: 5,
    rounds: 9,
    blockText: "合同障碍",
    powerText: "议价压力",
    intro: "确定成本、交期、质量和账期。",
    rewardFunds: 7,
    recover: 5,
  },
  {
    title: "量产生产期",
    short: "量产",
    enemyName: "核心工作：生产风险",
    target: "生产风险",
    hp: 56,
    attack: 5,
    rounds: 9,
    blockText: "良率问题",
    powerText: "交付压力",
    intro: "把样品变成稳定批量交付。",
    rewardFunds: 8,
    recover: 5,
  },
  {
    title: "宣发",
    short: "宣发",
    enemyName: "核心工作：市场声量缺口",
    target: "声量缺口",
    hp: 50,
    attack: 5,
    rounds: 9,
    blockText: "传播噪音",
    powerText: "热度压力",
    intro: "用有限预算打出发售前关注。",
    rewardFunds: 5,
    recover: 5,
  },
  {
    title: "最后发售结束",
    short: "发售",
    enemyName: "核心工作：发售关键事项",
    target: "发售待办",
    hp: 54,
    attack: 5,
    rounds: 10,
    blockText: "现场问题",
    powerText: "舆情压力",
    intro: "完成最终发售和收尾复盘。",
    rewardFunds: 0,
    recover: 0,
  },
];

const iphoneStages = [
  {
    title: "Project Purple立项",
    short: "立项",
    enemyName: "核心工作：多点触控方向决策",
    target: "方向不确定性",
    hp: 44,
    attack: 5,
    rounds: 8,
    blockText: "键盘惯性",
    powerText: "保密压力",
    intro: "从 iPod、手机和互联网终端的交叉点里，押注全触控设备。",
    rewardFunds: 5,
    recover: 3,
  },
  {
    title: "运营商谈判",
    short: "AT&T",
    enemyName: "核心工作：运营商控制权",
    target: "谈判阻力",
    hp: 52,
    attack: 6,
    rounds: 8,
    blockText: "渠道条款",
    powerText: "网络顾虑",
    intro: "争取罕见的硬件、软件和营销自主权，同时承受独家合作压力。",
    rewardFunds: 10,
    recover: 2,
  },
  {
    title: "OS X触控移植",
    short: "系统",
    enemyName: "核心工作：手机级 OS X",
    target: "系统待办",
    hp: 60,
    attack: 6,
    rounds: 9,
    blockText: "内存约束",
    powerText: "崩溃压力",
    intro: "把桌面级系统重写成能在手机芯片、触控和电池限制里运行的版本。",
    rewardFunds: 6,
    recover: 3,
  },
  {
    title: "Macworld发布演示",
    short: "发布",
    enemyName: "核心工作：现场演示风险",
    target: "演示风险",
    hp: 66,
    attack: 6,
    rounds: 9,
    blockText: "Demo故障",
    powerText: "舆论压力",
    intro: "在 2007-01-09 的发布会上证明：它是一台 iPod、一部电话和一个互联网通讯器。",
    rewardFunds: 9,
    recover: 5,
  },
  {
    title: "玻璃与续航冲刺",
    short: "硬件",
    enemyName: "核心工作：耐用玻璃与电池",
    target: "硬件风险",
    hp: 52,
    attack: 5,
    rounds: 9,
    blockText: "刮痕问题",
    powerText: "续航焦虑",
    intro: "在发售前把塑料表面换成抗刮玻璃，并提升通话和媒体续航。",
    rewardFunds: 7,
    recover: 4,
  },
  {
    title: "Web App生态准备",
    short: "生态",
    enemyName: "核心工作：第三方应用路径",
    target: "生态缺口",
    hp: 52,
    attack: 5,
    rounds: 9,
    blockText: "开发者疑虑",
    powerText: "平台压力",
    intro: "用 Safari Web 2.0 应用先打开第三方生态入口，为发售前补足软件故事。",
    rewardFunds: 6,
    recover: 4,
  },
  {
    title: "2007-06-29发售",
    short: "上市",
    enemyName: "核心工作：首发上市执行",
    target: "发售待办",
    hp: 54,
    attack: 5,
    rounds: 12,
    blockText: "激活排队",
    powerText: "缺货压力",
    intro: "完成门店排队、合约激活、媒体评测和首批用户交付。",
    rewardFunds: 0,
    recover: 0,
  },
];

const legacySpecialEvents = [
  {
    id: "policyPilot",
    name: "政策试点窗口",
    description: "地方政府开放试点申报，项目获得背书机会，但合规材料显著增多。",
    positive: "资金 +6，后续商店价格 -1。",
    negative: "后续敌人血量 +8%。",
    effects: { funds: 6, shopDiscount: 1, enemyHpMultiplier: 0.08 },
  },
  {
    id: "pandemicShock",
    name: "突发疫情冲击",
    description: "线下推进受阻，团队节奏被打乱，但远程协作和线上渠道被迫成熟。",
    positive: "每场开局推进加成 +1。",
    negative: "路线时间 -4，后续敌人攻击 +1。",
    effects: { time: -4, startMomentum: 1, enemyAttackDelta: 1 },
  },
  {
    id: "supplyShortage",
    name: "关键物料短缺",
    description: "供应链波动导致成本和交付压力上升，但团队提前建立备选方案。",
    positive: "每场开局时间缓冲 +4。",
    negative: "资金 -4，后续敌人攻击 +1。",
    effects: { funds: -4, startBuffer: 4, enemyAttackDelta: 1 },
  },
  {
    id: "mediaBoost",
    name: "媒体意外曝光",
    description: "一次报道带来流量和潜在客户，同时也让外界预期快速升高。",
    positive: "资金 +4，后续敌人血量 -5%。",
    negative: "后续敌人攻击 +1。",
    effects: { funds: 4, enemyHpMultiplier: -0.05, enemyAttackDelta: 1 },
  },
  {
    id: "regulationTighten",
    name: "监管口径收紧",
    description: "行业规则突然变严，短期推进变慢，但通过后会形成更强信任壁垒。",
    positive: "后续敌人攻击 -1。",
    negative: "路线时间 -3，后续敌人血量 +6%。",
    effects: { time: -3, enemyAttackDelta: -1, enemyHpMultiplier: 0.06 },
  },
  {
    id: "talentWave",
    name: "人才流动窗口",
    description: "大厂调整带来招人机会，但薪资和管理复杂度同步上升。",
    positive: "出战牌库上限 +1，每场开局行动力上限 +1。",
    negative: "资金 -5。",
    effects: { deckLimitBonus: 1, startEnergyMax: 1, funds: -5 },
  },
];

const cardCatalog = {
  engineer: {
    name: "招募工程师",
    type: "人员",
    art: "attack",
    cost: 1,
    text: "核心工作 -7。",
    play: (state) => advanceWork(state, 7 + state.player.momentum),
  },
  productManager: {
    name: "产品经理",
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
    name: "UI设计师",
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
    name: "销售合伙人",
    type: "人员",
    art: "attack",
    cost: 1,
    text: "核心工作 -4，资金 +2。",
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
      addLog(state, "法务顾问压低了后续风险。");
    },
  },
  techResearch: {
    name: "技术预研",
    type: "技术",
    art: "skill",
    cost: 1,
    text: "核心工作 -5，后续推进 +1。",
    play: (state) => {
      advanceWork(state, 5 + state.player.momentum);
      state.player.momentum += 1;
      addLog(state, "技术路线更清晰，后续推进效率提升。");
    },
  },
  architecture: {
    name: "架构重构",
    type: "技术",
    art: "attack",
    cost: 2,
    text: "核心工作 -10。",
    play: (state) => advanceWork(state, 10 + state.player.momentum),
  },
  dataInsight: {
    name: "数据分析",
    type: "技术",
    art: "skill",
    cost: 1,
    text: "抽 2 张牌。",
    play: (state) => {
      drawCards(state, 2);
      addLog(state, "数据分析给出了新的行动选择。");
    },
  },
  automation: {
    name: "自动化工具",
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
    name: "天使资金",
    type: "资金",
    art: "fund",
    cost: 1,
    text: "资金 +6，剩余时间 +2。",
    play: (state) => {
      gainFunds(state, 6);
      gainTime(state, 2);
    },
  },
  leanBudget: {
    name: "精打细算",
    type: "资金",
    art: "fund",
    cost: 0,
    text: "资金 +3，时间缓冲 +2。",
    play: (state) => {
      gainFunds(state, 3);
      gainBuffer(state, 2);
    },
  },
  outsourcing: {
    name: "外包开发",
    type: "资金",
    art: "fund",
    cost: 1,
    fundCost: 3,
    text: "资金 -3，核心工作 -8。",
    play: (state) => {
      spendFunds(state, 3);
      advanceWork(state, 8 + state.player.momentum);
    },
  },
  runway: {
    name: "争取时间",
    type: "时间",
    art: "defense",
    cost: 1,
    text: "剩余时间 +5。",
    play: (state) => gainTime(state, 5),
  },
  scheduleBuffer: {
    name: "排期缓冲",
    type: "时间",
    art: "defense",
    cost: 1,
    text: "时间缓冲 +7。",
    play: (state) => gainBuffer(state, 7),
  },
  cutScope: {
    name: "砍掉非核心",
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
      addLog(state, "导师背书减少了外部阻力。");
    },
  },
  overtime: {
    name: "通宵冲刺",
    type: "人员",
    art: "attack",
    cost: 0,
    text: "核心工作 -6，但时间 -2。",
    play: (state) => {
      advanceWork(state, 6 + state.player.momentum);
      loseTime(state, 2, "通宵冲刺消耗了 2 天团队时间。");
    },
  },
  alignment: {
    name: "团队对齐",
    type: "管理",
    art: "skill",
    cost: 1,
    text: "后续推进核心工作 +1。",
    play: (state) => {
      state.player.momentum += 1;
      addLog(state, "团队对齐，后续执行效率提升。");
    },
  },
  crowdfunding: {
    name: "众筹预热",
    type: "资金",
    art: "fund",
    cost: 1,
    text: "资金 +4，核心工作 -4。",
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
      addLog(state, "多点触控原型证明了手指交互的方向。");
    },
  },
  purpleRoom: {
    name: "Purple保密室",
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
    name: "OS X瘦身",
    type: "技术",
    art: "attack",
    cost: 2,
    text: "核心工作 -11。",
    play: (state) => advanceWork(state, 11 + state.player.momentum),
  },
  cingularDeal: {
    name: "Cingular谈判",
    type: "资源",
    art: "fund",
    cost: 1,
    text: "资金 +5，核心工作 -4。",
    play: (state) => {
      gainFunds(state, 5);
      advanceWork(state, 4 + state.player.momentum);
    },
  },
  visualVoicemail: {
    name: "可视语音信箱",
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
    name: "光学玻璃表面",
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
    name: "移动Safari",
    type: "软件",
    art: "attack",
    cost: 1,
    text: "核心工作 -7。",
    play: (state) => advanceWork(state, 7 + state.player.momentum),
  },
  keynoteRehearsal: {
    name: "发布会走台",
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
    name: "射频测试室",
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
    name: "ARM芯片预算",
    type: "资金",
    art: "fund",
    cost: 1,
    text: "资金 -2，核心工作 -9。",
    fundCost: 2,
    play: (state) => {
      spendFunds(state, 2);
      advanceWork(state, 9 + state.player.momentum);
    },
  },
  secrecySilos: {
    name: "硬软隔离协作",
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
    name: "Web App方案",
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
    name: "iTunes同步闭环",
    type: "产品",
    art: "attack",
    cost: 1,
    text: "核心工作 -6，资金 +2。",
    play: (state) => {
      advanceWork(state, 6 + state.player.momentum);
      gainFunds(state, 2);
    },
  },
  retailLaunch: {
    name: "门店首发排队",
    type: "运营",
    art: "fund",
    cost: 1,
    text: "资金 +3，核心工作 -4。",
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
    name: "激活流程预案",
    type: "运营",
    art: "defense",
    cost: 1,
    text: "时间缓冲 +6。",
    play: (state) => gainBuffer(state, 6),
  },
  noManualDesign: {
    name: "无说明书体验",
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
    name: "MVP切片",
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
      addLog(state, "原型让团队后续推进更顺。");
    },
  },
  demoUserInterview: {
    name: "10次访谈",
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
    name: "融资BP",
    type: "阶段奖励",
    art: "attack",
    cost: 1,
    text: "核心工作 -7，资金 +2。",
    play: (state) => {
      advanceWork(state, 7 + state.player.momentum);
      gainFunds(state, 2);
    },
  },
  termSheet: {
    name: "条款清单",
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
    name: "领投背书",
    type: "阶段奖励",
    art: "fund",
    cost: 2,
    text: "资金 +8，核心工作 -4。",
    play: (state) => {
      gainFunds(state, 8);
      advanceWork(state, 4 + state.player.momentum);
    },
  },
  devQa: {
    name: "测试矩阵",
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
    name: "内测版本",
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
    name: "验厂清单",
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
    name: "账期谈判",
    type: "阶段奖励",
    art: "fund",
    cost: 1,
    text: "资金 +5，压力 -1。",
    play: (state) => {
      gainFunds(state, 5);
      state.enemy.power = Math.max(0, state.enemy.power - 1);
    },
  },
  massQc: {
    name: "质检抽样",
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
    name: "产线爬坡",
    type: "阶段奖励",
    art: "attack",
    cost: 2,
    text: "核心工作 -12。",
    play: (state) => advanceWork(state, 12 + state.player.momentum),
  },
  massForecast: {
    name: "需求预测",
    type: "阶段奖励",
    art: "skill",
    cost: 1,
    text: "抽 2 张牌，资金 +2。",
    play: (state) => {
      drawCards(state, 2);
      gainFunds(state, 2);
    },
  },
  launchKol: {
    name: "KOL种草",
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
    text: "核心工作 -10，资金 +2。",
    play: (state) => {
      advanceWork(state, 10 + state.player.momentum);
      gainFunds(state, 2);
    },
  },
  launchCommunity: {
    name: "社群裂变",
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
    type: "iPhone奖励",
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
    type: "iPhone奖励",
    art: "attack",
    cost: 1,
    text: "核心工作 -8，压力 +1。",
    play: (state) => {
      advanceWork(state, 8 + state.player.momentum);
      state.enemy.power += 1;
    },
  },
  iphonePurpleSprint: {
    name: "Purple冲刺",
    type: "iPhone奖励",
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
    type: "iPhone奖励",
    art: "skill",
    cost: 1,
    text: "阻力 -5，核心工作 -4。",
    play: (state) => {
      state.enemy.block = Math.max(0, state.enemy.block - 5);
      advanceWork(state, 4 + state.player.momentum);
    },
  },
  iphoneVisualVoicemailDeal: {
    name: "语音信箱让步",
    type: "iPhone奖励",
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
    type: "iPhone奖励",
    art: "fund",
    cost: 2,
    text: "资金 +9。",
    play: (state) => gainFunds(state, 9),
  },
  iphoneSpringboard: {
    name: "SpringBoard雏形",
    type: "iPhone奖励",
    art: "attack",
    cost: 1,
    text: "核心工作 -8。",
    play: (state) => advanceWork(state, 8 + state.player.momentum),
  },
  iphoneTouchKeyboard: {
    name: "软键盘校准",
    type: "iPhone奖励",
    art: "skill",
    cost: 1,
    text: "核心工作 -5，抽 1 张牌。",
    play: (state) => {
      advanceWork(state, 5 + state.player.momentum);
      drawCards(state, 1);
    },
  },
  iphoneMemoryDiet: {
    name: "内存瘦身表",
    type: "iPhone奖励",
    art: "defense",
    cost: 1,
    text: "时间缓冲 +4，阻力 -3。",
    play: (state) => {
      gainBuffer(state, 4);
      state.enemy.block = Math.max(0, state.enemy.block - 3);
    },
  },
  iphoneCorningCall: {
    name: "致电康宁",
    type: "iPhone奖励",
    art: "defense",
    cost: 1,
    text: "时间缓冲 +6。",
    play: (state) => gainBuffer(state, 6),
  },
  iphoneBatteryChart: {
    name: "续航对比图",
    type: "iPhone奖励",
    art: "skill",
    cost: 1,
    text: "剩余时间 +3，核心工作 -4。",
    play: (state) => {
      gainTime(state, 3);
      advanceWork(state, 4 + state.player.momentum);
    },
  },
  iphoneRfChamber: {
    name: "射频模拟器",
    type: "iPhone奖励",
    art: "attack",
    cost: 2,
    text: "核心工作 -10，阻力 -2。",
    play: (state) => {
      state.enemy.block = Math.max(0, state.enemy.block - 2);
      advanceWork(state, 10 + state.player.momentum);
    },
  },
  iphoneThreeDevices: {
    name: "三合一叙事",
    type: "iPhone奖励",
    art: "attack",
    cost: 1,
    text: "核心工作 -7，资金 +2。",
    play: (state) => {
      advanceWork(state, 7 + state.player.momentum);
      gainFunds(state, 2);
    },
  },
  iphoneDemoReset: {
    name: "演示重置脚本",
    type: "iPhone奖励",
    art: "defense",
    cost: 1,
    text: "时间缓冲 +4，压力 -1。",
    play: (state) => {
      gainBuffer(state, 4);
      state.enemy.power = Math.max(0, state.enemy.power - 1);
    },
  },
  iphonePressShock: {
    name: "媒体震动",
    type: "iPhone奖励",
    art: "fund",
    cost: 1,
    text: "资金 +4，核心工作 -5。",
    play: (state) => {
      gainFunds(state, 4);
      advanceWork(state, 5 + state.player.momentum);
    },
  },
  iphoneSafariSdk: {
    name: "Safari应用入口",
    type: "iPhone奖励",
    art: "skill",
    cost: 1,
    text: "核心工作 -5，推进加成 +1。",
    play: (state) => {
      advanceWork(state, 5 + state.player.momentum);
      state.player.momentum += 1;
    },
  },
  iphoneWeb2Pitch: {
    name: "Web 2.0说法",
    type: "iPhone奖励",
    art: "attack",
    cost: 1,
    text: "核心工作 -8。",
    play: (state) => advanceWork(state, 8 + state.player.momentum),
  },
  iphoneActivationDryRun: {
    name: "激活彩排",
    type: "iPhone奖励",
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
  return `<span class="card-art ${card.art} image-card" style="--card-art-url: url('assets/deck-art/${cardId}.png?v=all-ai-art-20260704')" aria-hidden="true"></span>`;
}

function visualArtMarkup(className, src, label = "") {
  return `<span class="${className} image-art" style="--image-art-url: url('${src}?v=all-ai-art-20260704')" aria-hidden="true" ${label ? `title="${escapeHtml(label)}"` : ""}></span>`;
}

function cardThemeClass(card) {
  const type = card?.type || "";
  if (type.includes("人员") || type.includes("管理")) return "card-theme-person";
  if (type.includes("资金") || type.includes("资源") || type.includes("时间")) return "card-theme-fund";
  if (type.includes("宣发") || type.includes("运营") || type.includes("生态") || type.includes("策略")) return "card-theme-market";
  if (type.includes("奖励")) return "card-theme-reward";
  if (type.includes("技术") || type.includes("软件") || type.includes("硬件") || type.includes("产品") || type.includes("设计")) return "card-theme-tech";
  return "card-theme-default";
}

const specialEvents = [
  {
    id: "policy_subsidy",
    name: "政策补贴窗口",
    positive: "获得 8 点资金，商店价格永久 -1。",
    negative: "申报材料变多，后续敌人血量 +5%。",
    effect: { funds: 8, shopDiscount: 1, enemyHpPct: 0.05 },
  },
  {
    id: "regulation_shift",
    name: "监管口径变化",
    positive: "行业规则更清晰，后续关卡开始时获得 2 点时间缓冲。",
    negative: "合规成本上升，后续敌人攻击 +1。",
    effect: { startBuffer: 2, attackDelta: 1 },
  },
  {
    id: "pandemic_wave",
    name: "疫情反复",
    positive: "线上需求增长，关卡难度系数 -0.04。",
    negative: "线下推进受阻，当前剩余时间 -4 天。",
    effect: { difficulty: -0.04, time: -4 },
  },
  {
    id: "supply_shortage",
    name: "关键物料短缺",
    positive: "团队提前建立供应冗余，后续关卡开始时获得 3 点时间缓冲。",
    negative: "采购成本上升，资金 -5。",
    effect: { startBuffer: 3, funds: -5 },
  },
  {
    id: "media_attention",
    name: "媒体突然关注",
    positive: "品牌曝光带来机会，资金 +4，后续阶段奖励资金 +2。",
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
    negative: "薪酬预算增加，资金 -3。",
    effect: { difficulty: -0.03, funds: -3 },
  },
  {
    id: "competitor_launch",
    name: "竞品抢先发布",
    positive: "市场教育完成，后续敌人血量 -6%。",
    negative: "窗口期缩短，当前剩余时间 -3 天。",
    effect: { enemyHpPct: -0.06, time: -3 },
  },
];

const iphoneSpecialEvents = [
  {
    id: "iphone_apple_inc",
    name: "2007-01-09：Apple Inc.登场",
    positive: "发布会上，Apple Computer 更名为 Apple Inc.，外界开始接受它不再只是电脑公司。后续阶段奖励资金 +2。",
    negative: "“重新发明手机”的承诺把公众预期拉高，后续敌人血量 +1%。",
    effect: { rewardFunds: 2, enemyHpPct: 0.01 },
  },
  {
    id: "iphone_cisco_name",
    name: "2007-01-10：Cisco商标诉讼",
    positive: "iPhone 这个名字被全行业看见，媒体声量持续升温。资金 +3。",
    negative: "商标纠纷增加法务与谈判消耗，后续敌人血量 +1%。",
    effect: { funds: 3, enemyHpPct: 0.01 },
  },
  {
    id: "iphone_fcc_approval",
    name: "2007-05-17：FCC批准",
    positive: "监管审批通过，6 月上市路径更明确，关卡难度系数 -0.03。",
    negative: "硬件规格和上市节奏被进一步锁定，当前最大时间 -1。",
    effect: { difficulty: -0.03, maxTime: -1 },
  },
  {
    id: "iphone_wwdc_webapps",
    name: "2007-06-11：WWDC Web 2.0应用",
    positive: "Safari Web App 成为第三方应用入口，后续关卡开始时获得 2 点时间缓冲。",
    negative: "没有原生 SDK 的质疑开始出现，后续敌人血量 +1%。",
    effect: { startBuffer: 2, enemyHpPct: 0.01 },
  },
  {
    id: "iphone_glass_battery",
    name: "2007-06-18：玻璃与8小时通话",
    positive: "Apple 公布光学级玻璃表面和更长续航，当前剩余时间 +4。",
    negative: "临近发售改良硬件，供应和验证压力上升，后续敌人血量 +1%。",
    effect: { time: 4, enemyHpPct: 0.01 },
  },
  {
    id: "iphone_launch_eve",
    name: "2007-06-28：员工机与首发排队",
    positive: "员工获赠 iPhone，门店首发热度成形。资金 +4，开局缓冲 +2。",
    negative: "合约激活、排队与库存协调进入高压状态，后续敌人血量 +1%。",
    effect: { funds: 4, startBuffer: 2, enemyHpPct: 0.01 },
  },
];

const iphoneProgressReports = [
  "进度说明：方向从“给 iPod 加电话”转向更激进的全触控计算设备。项目开始围绕多点触控、保密协作和少数关键原型推进。",
  "进度说明：运营商合作不再是传统定制机模式。Apple 争取到罕见的产品控制权，也把网络、激活和独家合作压力带进项目。",
  "进度说明：团队把 OS X 的能力压缩进手机，围绕 SpringBoard、触控输入、Safari 和核心应用搭起第一代 iPhone OS 的骨架。",
  "进度说明：2007-01-09，Jobs 在 Macworld 把 iPhone 定义成 iPod、电话和互联网通讯器三合一。发布成功，但上市倒计时真正开始。",
  "进度说明：发布后到 6 月上市前，团队继续处理刮痕、续航、射频和量产验证。6 月 18 日，Apple 对外确认玻璃表面和更长续航。",
  "进度说明：2007-06-11 的 WWDC 上，Apple 宣布 iPhone 将支持基于 Safari 的 Web 2.0 应用。生态入口打开，但原生应用问题还没有解决。",
  "进度说明：2007-06-29，iPhone 在美国 Apple Store 与 AT&T 门店发售。排队、合约激活和首批评测一起把产品推上市场。",
];

const iphoneFinalReport =
  "发售成功：2007-06-29，初代 iPhone 正式上市。\n\n行业影响：它把手机从运营商主导的功能清单，推向由触控体验、完整浏览器和软硬件一体化驱动的移动计算平台。运营商开始重新评估与设备厂商的权力关系，开发者生态也在随后一年通过 iPhone SDK 与 App Store 爆发。\n\n公司后续：Apple 在 74 天内售出第 100 万部 iPhone；2008 年推出 iPhone 3G 和 App Store，iPhone 逐渐成为 Apple 最核心的业务之一，并长期重塑智能手机、移动互联网和应用分发生态。";

const appState = {
  screen: "track",
  editorReturnScreen: "track",
  trackId: null,
  personas: { core: [null, null, null], opportunity: [null, null, null] },
  selectedDeck: [],
  campaign: null,
  battle: null,
};

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

function contentStorageKey() {
  return "startupCardGameContentV2";
}

function editableRouteId() {
  return appState.campaign?.trackId || appState.trackId || "demo";
}

function editableRouteName(routeId = editableRouteId()) {
  return routeId === "iphone" ? "初代 iPhone 真实故事线" : "模拟创业路线";
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
    if (saved) applyContentSnapshot(JSON.parse(saved));
  } catch (error) {
    console.warn("内容编辑器配置读取失败", error);
  }
}

function saveContentEdits() {
  localStorage.setItem(
    contentStorageKey(),
    JSON.stringify({
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
    time += trait.effect.time;
    funds += trait.effect.funds;
    difficulty += trait.effect.difficulty;
  });

  appState.personas.opportunity.forEach((traitId) => {
    const trait = traitById(traitId);
    if (!trait) return;
    time += Math.round(trait.effect.time * 0.7);
    funds += Math.round(trait.effect.funds * 0.7);
    difficulty += trait.effect.difficulty * 0.7;
  });

  time = clamp(Math.round(time), 18, 34);
  funds = clamp(Math.round(funds), 6, 32);
  difficulty = clamp(Number(difficulty.toFixed(2)), 0.78, 1.35);

  return { time, maxTime: Math.max(30, time + 6), funds, difficulty };
}

function stepHeader(activeStep, title, subtitle) {
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
        ${steps.map((step) => `<span class="step-pill ${step === activeStep ? "active" : ""}">${step}</span>`).join("")}
      </div>
    </section>
  `;
}

function backActionButton(action, label = "上一步") {
  return `
    <button class="ghost-action back-action" type="button" data-action="${action}">
      <span aria-hidden="true">←</span>
      ${label}
    </button>
  `;
}

function profileStrip() {
  const profile = calculateProfile();
  const difficultyText = profile.difficulty <= 0.94 ? "偏易" : profile.difficulty >= 1.12 ? "偏难" : "标准";
  return `
    <section class="summary-strip" aria-label="创业初始参数">
      <div class="metric" ${tipAttr("进入第一关时拥有的剩余时间。时间归零会导致阶段失败。")}><span>初始时间</span><strong>${profile.time} 天</strong></div>
      <div class="metric" ${tipAttr("剩余时间可以通过卡牌恢复，但不能超过这个上限。")}><span>时间上限</span><strong>${profile.maxTime} 天</strong></div>
      <div class="metric" ${tipAttr("局外画像决定的初始资金。部分卡牌会消耗或增加资金。")}><span>玩家资金</span><strong>${profile.funds}</strong></div>
      <div class="metric" ${tipAttr("影响所有关卡敌人的血量和攻击力。低于 1 更容易，高于 1 更困难。")}><span>关卡难度</span><strong>${difficultyText} · ${profile.difficulty}</strong></div>
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
}

function renderTrackScreen() {
  app.innerHTML = `
    <div class="screen">
      ${stepHeader("赛道", "创业故事", "选择行业赛道")}
      <section class="setup-panel">
        <div class="setup-head">
          <div>
            <h2>选择一个行业赛道</h2>
            <p class="muted">赛道决定画像池、基础时间、基础资金和初始难度。</p>
          </div>
          <button class="ghost-action" type="button" data-action="open-editor">
            <span aria-hidden="true">✎</span>
            内容编辑器
          </button>
        </div>
        <div class="choice-grid">
          ${tracks
            .map(
              (track) => `
                <button class="choice-card" type="button" data-action="select-track" data-track-id="${track.id}">
                  ${visualArtMarkup("line-art route-art", `assets/scene-art/route-${track.id}.png`, track.name)}
                  <h3>${track.name}</h3>
                  <p class="muted">${track.note}</p>
                  <div class="trait-meta">
                    <span class="tiny-badge">${track.specialRoute ? "真实故事线" : `时间 ${track.base.time}`}</span>
                    <span class="tiny-badge">资金 ${track.base.funds}</span>
                    <span class="tiny-badge">难度 ${track.base.difficulty}</span>
                  </div>
                </button>
              `,
            )
            .join("")}
        </div>
      </section>
    </div>
  `;
}

function renderPersonaScreen() {
  const track = currentTrack();
  app.innerHTML = `
    <div class="screen">
      ${stepHeader("画像", track.name, "搭建核心人群与机会人群")}
      ${profileStrip()}
      <section class="setup-panel">
        <div class="setup-head">
          <div>
            <h2>用户画像选择</h2>
            <p class="muted">每组 3 个画像特征。核心人群影响更强，机会人群影响较轻。</p>
          </div>
          <div class="flow-actions">
            ${backActionButton("back-track")}
            <button class="primary-action" type="button" data-action="go-deck" ${canProceedPersonas() ? "" : "disabled"}>
            <span aria-hidden="true">→</span>
            进入组牌
            </button>
          </div>
        </div>
        <div class="persona-layout">
          <div class="persona-groups">
            ${renderPersonaGroup("core", "核心人群")}
            ${renderPersonaGroup("opportunity", "机会人群")}
          </div>
          <aside class="side-panel">
            <h3>画像池</h3>
            <div class="trait-pool">
              ${track.traits.map((trait) => renderTraitCard(trait)).join("")}
            </div>
          </aside>
        </div>
      </section>
    </div>
  `;
}

function renderPersonaGroup(group, title) {
  return `
    <div class="group-panel">
      <h3>${title}</h3>
      <div class="slot-grid">
        ${appState.personas[group]
          .map((traitId, index) => {
            const trait = traitById(traitId);
            if (!trait) {
              return `
                <button class="persona-slot empty" type="button" data-slot-group="${group}" data-slot-index="${index}">
                  空画像槽 ${index + 1}
                </button>
              `;
            }
            return `
              <button class="persona-slot" type="button" data-action="remove-trait" data-slot-group="${group}" data-slot-index="${index}">
                ${visualArtMarkup("persona-thumb", `assets/persona-art/${trait.id}.png`, trait.name)}
                <strong>${trait.name}</strong>
                <span class="muted">${trait.tag}</span>
                <span class="tiny-badge" ${tipAttr("该画像对初始时间、资金和关卡难度的影响。核心人群影响完整，机会人群影响较轻。")}>${formatEffect(trait.effect)}</span>
              </button>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderTraitCard(trait) {
  const assigned = selectedTraitIds().includes(trait.id);
  return `
    <button class="trait-card ${assigned ? "assigned" : ""}" type="button" draggable="${assigned ? "false" : "true"}"
      data-action="assign-trait" data-trait-id="${trait.id}">
      ${visualArtMarkup("persona-art", `assets/persona-art/${trait.id}.png`, trait.name)}
      <strong>${trait.name}</strong>
      <span class="muted">${trait.tag}</span>
      <span class="tiny-badge" ${tipAttr("该画像对初始时间、资金和关卡难度的影响。核心人群影响完整，机会人群影响较轻。")}>${formatEffect(trait.effect)}</span>
    </button>
  `;
}

function formatEffect(effect) {
  const parts = [];
  if (effect.time) parts.push(`时间 ${effect.time > 0 ? "+" : ""}${effect.time}`);
  if (effect.funds) parts.push(`资金 ${effect.funds > 0 ? "+" : ""}${effect.funds}`);
  if (effect.difficulty) parts.push(`难度 ${effect.difficulty > 0 ? "+" : ""}${effect.difficulty}`);
  return parts.join(" · ") || "稳定";
}

function formatEventEffect(effect = {}) {
  const labels = [];
  if (effect.time) labels.push(`当前时间 ${effect.time > 0 ? "+" : ""}${effect.time}`);
  if (effect.maxTime) labels.push(`时间上限 ${effect.maxTime > 0 ? "+" : ""}${effect.maxTime}`);
  if (effect.funds) labels.push(`资金 ${effect.funds > 0 ? "+" : ""}${effect.funds}`);
  if (effect.difficulty) labels.push(`难度 ${effect.difficulty > 0 ? "+" : ""}${effect.difficulty}`);
  if (effect.enemyHpPct) labels.push(`敌人血量 ${effect.enemyHpPct > 0 ? "+" : ""}${Math.round(effect.enemyHpPct * 100)}%`);
  if (effect.attackDelta) labels.push(`敌人攻击 ${effect.attackDelta > 0 ? "+" : ""}${effect.attackDelta}`);
  if (effect.shopDiscount) labels.push(`商店价格 -${effect.shopDiscount}`);
  if (effect.startBuffer) labels.push(`开局缓冲 +${effect.startBuffer}`);
  if (effect.rewardFunds) labels.push(`阶段资金奖励 +${effect.rewardFunds}`);
  return labels.join(" / ") || "仅叙事影响";
}

function canProceedPersonas() {
  return appState.personas.core.every(Boolean) && appState.personas.opportunity.every(Boolean);
}

function renderDeckScreen() {
  const selectedCount = appState.selectedDeck.length;
  app.innerHTML = `
    <div class="screen">
      ${stepHeader("组牌", currentTrack().name, "选择 8 张初始牌库")}
      ${profileStrip()}
      <section class="setup-panel">
        <div class="setup-head">
          <div>
            <h2>初始牌库</h2>
            <p class="muted">从 20 张创业要素牌中选择 8 张，进入所有阶段关卡。</p>
          </div>
          <div class="flow-actions">
            ${backActionButton("back-personas")}
            <button class="primary-action" type="button" data-action="start-campaign" ${selectedCount === 8 ? "" : "disabled"}>
            <span aria-hidden="true">→</span>
            开始路线 ${selectedCount}/8
            </button>
          </div>
        </div>
        <div class="catalog-grid">
          ${currentInitialCardIds().map((id) => renderDeckCard(id, cardCatalog[id])).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderDeckCard(id, card) {
  const selected = appState.selectedDeck.includes(id);
  const disabled = !selected && appState.selectedDeck.length >= 8;
  const fundText = card.fundCost ? ` · 资金-${card.fundCost}` : "";
  return `
    <button class="deck-card ${cardThemeClass(card)} ${selected ? "selected" : ""}" type="button" data-action="toggle-deck-card" data-card-id="${id}" ${disabled ? "disabled" : ""} ${tipAttr("选择 8 张牌作为整条创业路线的初始牌库。")}>
      <span class="deck-card-top">
        <span class="card-name">${card.name}</span>
        <span class="card-cost" ${tipAttr("打出这张牌需要消耗的行动力。每轮开始会恢复行动力。")}>${card.cost}</span>
      </span>
      ${cardArtMarkup(id, card)}
      <span class="card-bottom">
        <span class="card-type">${card.type}${fundText}</span>
        <span class="tiny-badge" ${tipAttr("当前是否已经加入你的 8 张初始牌库。")}>${selected ? "已选" : "可选"}</span>
      </span>
      <span class="card-text">${card.text}</span>
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
  return Math.max(1, (card.price || 4 + card.cost + (card.fundCost || 0)) - discount);
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
  app.innerHTML = `
    <div class="screen">
      ${stepHeader("路线", currentTrack().name, "创业阶段路线")}
      <section class="summary-strip" aria-label="当前资源">
        <div class="metric" ${tipAttr("当前路线剩余时间。进入关卡后会作为玩家血量，归零则阶段失败。")}><span>剩余时间</span><strong>${campaign.time} / ${campaign.maxTime} 天</strong></div>
        <div class="metric" ${tipAttr("当前可用资金。部分卡牌需要资金才能打出，也有卡牌能增加资金。")}><span>玩家资金</span><strong>${campaign.funds}</strong></div>
        <div class="metric" ${tipAttr("当前出战牌库会带入下一场对战。每关结束后可以重新选择。")}><span>出战牌库</span><strong>${campaign.activeDeck.length} / ${deckLimit()} 张</strong></div>
        <div class="metric" ${tipAttr("由赛道、画像和关卡间事件共同决定，影响敌人血量和攻击力。")}><span>难度系数</span><strong>${campaign.difficulty}</strong></div>
      </section>
      <section class="setup-panel">
        <div class="setup-head">
          <div>
            <h2>阶段关卡</h2>
            <p class="muted">每个阶段都以“项目核心要解决的工作”为敌人。关卡之间可拿奖励、买卡并重组出战牌库。</p>
          </div>
          <div class="flow-actions">
            ${backActionButton("back-before-stage", campaign.completedStages.length ? "重组牌库" : "上一步")}
            <button class="ghost-action" type="button" data-action="new-run">
            <span aria-hidden="true">↻</span>
            重开创业
          </button>
            <button class="ghost-action" type="button" data-action="open-editor">
            <span aria-hidden="true">✎</span>
            内容编辑器
            </button>
          </div>
        </div>
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
  const enemyHp = Math.round(stage.hp * campaign.difficulty * (1 + campaign.eventMods.enemyHpPct));
  const attack = Math.max(1, Math.round(stage.attack * campaign.difficulty) + campaign.eventMods.attackDelta);
  return `
    <button class="stage-card ${completed ? "completed" : ""}" type="button" data-action="start-stage" data-stage-index="${index}" ${locked || deckInvalid || completed ? "disabled" : ""}>
      <div class="stage-meta">
        <span class="stage-number">${index + 1}</span>
        <span class="tiny-badge">${completed ? "已完成" : locked ? "未解锁" : deckInvalid ? "先组牌" : "可进入"}</span>
      </div>
      ${visualArtMarkup("line-art stage-art", `assets/scene-art/stage${index}.png`, stage.title)}
      <h3>${stage.title}</h3>
      <p class="muted">${stage.intro}</p>
      <div class="trait-meta">
        <span class="tiny-badge" ${tipAttr("进入该阶段后需要清空的敌人血量。清空代表核心工作完成。")}>${stage.target} ${enemyHp}</span>
        <span class="tiny-badge" ${tipAttr("敌人攻击会扣减你的剩余时间。数值已受画像难度影响。")}>攻击 ${attack}</span>
        <span class="tiny-badge" ${tipAttr("必须在这个轮数内完成阶段核心工作。超过限制会失败。")}>${stage.rounds} 轮</span>
      </div>
    </button>
  `;
}

function renderRewardScreen() {
  const campaign = appState.campaign;
  const stage = currentStages()[campaign.pendingStage];
  app.innerHTML = `
    <div class="screen">
      ${stepHeader("路线", stage.title, "阶段卡牌奖励")}
      <section class="summary-strip" aria-label="奖励后资源">
        <div class="metric" ${tipAttr("阶段胜利后保留的路线时间。")}><span>剩余时间</span><strong>${campaign.time} / ${campaign.maxTime} 天</strong></div>
        <div class="metric" ${tipAttr("阶段胜利和战斗中累计后的资金。商店会消耗资金。")}><span>玩家资金</span><strong>${campaign.funds}</strong></div>
        <div class="metric" ${tipAttr("当前拥有的总卡牌数量。奖励会加入这里。")}><span>拥有卡牌</span><strong>${campaign.ownedCards.length} 张</strong></div>
        <div class="metric" ${tipAttr("每完成一个关卡，下一关出战牌库上限 +1。")}><span>出战上限</span><strong>${deckLimit()} 张</strong></div>
      </section>
      <section class="setup-panel">
        <div class="setup-head">
          <div>
            <h2>选择 1 张阶段奖励</h2>
            <p class="muted">前 6 个关卡各有 3 张独特奖励卡，只能从本阶段奖励中选择 1 张加入拥有牌库。</p>
          </div>
        </div>
        <div class="catalog-grid">
          ${campaign.rewardChoices.map((cardId) => renderRewardCard(cardId)).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderRewardCard(cardId) {
  const card = cardCatalog[cardId];
  return `
    <button class="deck-card ${cardThemeClass(card)} reward" type="button" data-action="choose-reward" data-card-id="${cardId}" ${tipAttr("选择后加入拥有牌库，本阶段另外两张奖励会错过。")}>
      <span class="deck-card-top">
        <span class="card-name">${card.name}</span>
        <span class="card-cost" ${tipAttr("打出这张牌需要消耗的行动力。")}>${card.cost}</span>
      </span>
      ${cardArtMarkup(cardId, card)}
      <span class="card-bottom">
        <span class="card-type">${card.type}</span>
        <span class="tiny-badge">奖励</span>
      </span>
      <span class="card-text">${card.text}</span>
    </button>
  `;
}

function renderEventScreen() {
  const campaign = appState.campaign;
  const event = campaign.pendingEvent;
  const timelineCopy = isIphoneRoute(campaign.trackId)
    ? "这是 iPhone 真实时间线中的外部节点，会把 2007 年发布到发售期间的机会和压力转成常驻效果。"
    : "关卡之间的外部事件会带来正负两面的常驻影响。";
  app.innerHTML = `
    <div class="screen">
      ${stepHeader("路线", isIphoneRoute(campaign.trackId) ? "2007时间线事件" : "关卡间事件", "外部环境变化")}
      <section class="summary-strip" aria-label="事件前资源">
        <div class="metric" ${tipAttr("事件生效前的当前路线时间。")}><span>剩余时间</span><strong>${campaign.time} / ${campaign.maxTime} 天</strong></div>
        <div class="metric" ${tipAttr("事件可能增加或减少资金。")}><span>玩家资金</span><strong>${campaign.funds}</strong></div>
        <div class="metric" ${tipAttr("事件可能改变后续敌人强度。")}><span>难度系数</span><strong>${campaign.difficulty}</strong></div>
        <div class="metric" ${tipAttr("已经持续生效的事件数量。")}><span>常驻事件</span><strong>${campaign.eventHistory.length} 个</strong></div>
      </section>
      <section class="setup-panel">
        <div class="setup-head">
          <div>
            <h2>${event.name}</h2>
            <p class="muted">${timelineCopy}</p>
          </div>
          <button class="primary-action" type="button" data-action="resolve-event">
            <span aria-hidden="true">→</span>
            接受事件影响
          </button>
        </div>
        <div class="choice-grid">
          <article class="choice-card">
            ${visualArtMarkup("line-art event-art", "assets/scene-art/event-positive.png", "positive event")}
            <h3>正面效果</h3>
            <p class="muted">${event.positive}</p>
          </article>
          <article class="choice-card">
            ${visualArtMarkup("line-art event-art", "assets/scene-art/event-negative.png", "negative event")}
            <h3>负面效果</h3>
            <p class="muted">${event.negative}</p>
          </article>
          <article class="choice-card">
            ${visualArtMarkup("line-art event-art", "assets/scene-art/event-persistent.png", "persistent event")}
            <h3>常驻影响</h3>
            <p class="muted">${formatEventEffect(event.effect)}</p>
          </article>
        </div>
      </section>
    </div>
  `;
}

function renderShopScreen() {
  const campaign = appState.campaign;
  const offers = campaign.shopOffers;
  app.innerHTML = `
    <div class="screen">
      ${stepHeader("路线", "卡牌商店", "消耗资金购买新卡")}
      <section class="summary-strip" aria-label="商店资源">
        <div class="metric" ${tipAttr("购买卡牌会消耗资金。")}><span>玩家资金</span><strong>${campaign.funds}</strong></div>
        <div class="metric" ${tipAttr("当前拥有的总卡牌数量。")}><span>拥有卡牌</span><strong>${campaign.ownedCards.length} 张</strong></div>
        <div class="metric" ${tipAttr("下一关可以选择的出战牌库上限。")}><span>出战上限</span><strong>${deckLimit()} 张</strong></div>
        <div class="metric" ${tipAttr("商店只出售初始 20 张中尚未拥有的卡牌。")}><span>商店卡牌</span><strong>${offers.length} 张</strong></div>
      </section>
      <section class="setup-panel">
        <div class="setup-head">
          <div>
            <h2>关卡间商店</h2>
            <p class="muted">用资金购买未拥有的基础卡。买完或跳过后，需要重新选择下一关出战牌库。</p>
          </div>
          <button class="primary-action" type="button" data-action="finish-shop">
            <span aria-hidden="true">→</span>
            完成买卡
          </button>
        </div>
        ${offers.length ? `<div class="catalog-grid">${offers.map((cardId) => renderShopCard(cardId)).join("")}</div>` : `<div class="notice-line">商店暂时没有未拥有的基础卡。</div>`}
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
    <button class="deck-card ${cardThemeClass(card)} ${owned ? "shop-owned" : ""} ${cannotAfford ? "locked" : ""}" type="button" data-action="buy-card" data-card-id="${cardId}" ${owned || cannotAfford ? "disabled" : ""} ${tipAttr("消耗资金购买这张卡，加入拥有牌库。")}>
      <span class="deck-card-top">
        <span class="card-name">${card.name}</span>
        <span class="card-cost" ${tipAttr("打出这张牌需要消耗的行动力。")}>${card.cost}</span>
      </span>
      ${cardArtMarkup(cardId, card)}
      <span class="card-bottom">
        <span class="card-type">${card.type}</span>
        <span class="tiny-badge price-badge" ${tipAttr("购买价格，会从玩家资金中扣除。")}>价格 ${price}</span>
      </span>
      <span class="card-text">${card.text}</span>
    </button>
  `;
}

function renderLoadoutScreen() {
  const campaign = appState.campaign;
  const selectedCount = campaign.activeDeck.length;
  const limit = deckLimit();
  const valid = selectedCount >= 8 && selectedCount <= limit;
  app.innerHTML = `
    <div class="screen">
      ${stepHeader("路线", "重组出战牌库", "开始下一关前选择手牌")}
      <section class="summary-strip" aria-label="出战牌库资源">
        <div class="metric" ${tipAttr("下一关会从这些卡牌中洗牌和抽牌。")}><span>出战牌库</span><strong>${selectedCount} / ${limit} 张</strong></div>
        <div class="metric" ${tipAttr("进入关卡至少选择 8 张卡牌。")}><span>最低要求</span><strong>8 张</strong></div>
        <div class="metric" ${tipAttr("已拥有的卡牌总数。")}><span>拥有卡牌</span><strong>${campaign.ownedCards.length} 张</strong></div>
        <div class="metric" ${tipAttr("当前路线剩余资金。")}><span>玩家资金</span><strong>${campaign.funds}</strong></div>
      </section>
      <section class="setup-panel">
        <div class="setup-head">
          <div>
            <h2>选择下一关出战牌库</h2>
            <p class="muted">每完成一个关卡，出战牌库上限 +1。进入关卡前至少选择 8 张。</p>
          </div>
          <button class="primary-action" type="button" data-action="finish-loadout" ${valid ? "" : "disabled"}>
            <span aria-hidden="true">→</span>
            返回路线 ${selectedCount}/${limit}
          </button>
        </div>
        <div class="catalog-grid">
          ${campaign.ownedCards.map((cardId) => renderLoadoutCard(cardId, limit)).join("")}
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
  const fundText = card.fundCost ? ` · 资金-${card.fundCost}` : "";
  return `
    <button class="deck-card ${cardThemeClass(card)} ${selected ? "selected" : ""}" type="button" data-action="toggle-loadout-card" data-card-id="${cardId}" ${disabled ? "disabled" : ""} ${tipAttr("点击切换是否带入下一关。")}>
      <span class="deck-card-top">
        <span class="card-name">${card.name}</span>
        <span class="card-cost" ${tipAttr("打出这张牌需要消耗的行动力。")}>${card.cost}</span>
      </span>
      ${cardArtMarkup(cardId, card)}
      <span class="card-bottom">
        <span class="card-type">${card.type}${fundText}</span>
        <span class="tiny-badge">${selected ? "出战" : "备用"}</span>
      </span>
      <span class="card-text">${card.text}</span>
    </button>
  `;
}

function renderEditorScreen() {
  const snapshot = editableContentSnapshot();
  app.innerHTML = `
    <div class="screen">
      ${stepHeader("路线", "内容编辑器", "手动调整游戏内容")}
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
            <p class="muted">调整当前路线的敌人血量、攻击、回合数、奖励资金和恢复时间。</p>
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
            <p class="muted">模拟线编辑标准/随机事件；iPhone 线编辑 2007 历史时间线事件。</p>
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
      ${editorInput("攻击", "stage", index, "attack", stage.attack, "number")}
      ${editorInput("回合", "stage", index, "rounds", stage.rounds, "number")}
      ${editorInput("奖励资金", "stage", index, "rewardFunds", stage.rewardFunds, "number")}
      ${editorInput("恢复时间", "stage", index, "recover", stage.recover, "number")}
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
      ${editorInput("当前时间", "eventEffect", index, "time", effect.time || 0, "number")}
      ${editorInput("时间上限", "eventEffect", index, "maxTime", effect.maxTime || 0, "number")}
      ${editorInput("资金", "eventEffect", index, "funds", effect.funds || 0, "number")}
      ${editorInput("难度", "eventEffect", index, "difficulty", effect.difficulty || 0, "number", "0.01")}
      ${editorInput("敌人血量%", "eventEffect", index, "enemyHpPct", effect.enemyHpPct || 0, "number", "0.01")}
      ${editorInput("敌人攻击", "eventEffect", index, "attackDelta", effect.attackDelta || 0, "number")}
      ${editorInput("商店折扣", "eventEffect", index, "shopDiscount", effect.shopDiscount || 0, "number")}
      ${editorInput("开局缓冲", "eventEffect", index, "startBuffer", effect.startBuffer || 0, "number")}
      ${editorInput("奖励资金", "eventEffect", index, "rewardFunds", effect.rewardFunds || 0, "number")}
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
      ${editorInput("价格", "card", id, "price", card.price, "number")}
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

  appState.battle = {
    stageIndex: index,
    stage,
    round: 1,
    phase: "player",
    hand: [],
    deck: shuffle(campaign.activeDeck),
    discard: [],
    log: [],
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

  addLog(appState.battle, `${stage.title}开始：${stage.intro}`);
  if (campaign.eventMods.startBuffer > 0) {
    addLog(appState.battle, `常驻事件提供 ${campaign.eventMods.startBuffer} 点开局时间缓冲。`);
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
      <section class="topbar" aria-label="阶段状态">
        <div class="brand">
          <span class="brand-mark" aria-hidden="true"></span>
          <div>
            <h1>${stage.title}</h1>
            <p>第 ${Math.min(game.round, stage.rounds)} / ${stage.rounds} 轮 · ${currentTrack().name}</p>
          </div>
        </div>
        <div class="resource-row">
          <div class="meter" ${tipAttr("当前阶段可用资金。某些牌会消耗资金，资金不足时不能打出。")}><span>资金</span><strong>${game.player.funds}</strong></div>
          <div class="meter" ${tipAttr("当前抽牌堆剩余张数。牌库耗尽时会把弃牌堆洗回牌库。")}><span>牌库</span><strong>${game.deck.length}</strong></div>
          <div class="meter" ${tipAttr("已经打出或回合结束丢弃的牌。牌库耗尽时会被洗回牌库。")}><span>弃牌</span><strong>${game.discard.length}</strong></div>
          ${renderEventChips(appState.campaign?.eventHistory || [])}
          <button class="icon-button" type="button" title="返回路线" aria-label="返回路线" data-action="return-campaign">
            <span aria-hidden="true">↩</span>
          </button>
        </div>
      </section>

      <section class="arena" aria-label="创业阶段对战">
        <article class="combatant player-panel" aria-label="创业团队">
          ${visualArtMarkup("portrait battle-portrait", "assets/scene-art/startupTeam.png", "startup team")}
          <div class="combatant-info">
            <div class="name-row">
              <h2>创业团队</h2>
              <span class="energy-pill" ${tipAttr("行动力用于打牌。左侧是当前行动力，右侧是每轮恢复的上限。")}>${game.player.energy}/${game.player.maxEnergy} 行动力</span>
            </div>
            <div class="bar-wrap" aria-label="剩余时间" ${tipAttr("玩家血量，也代表创业团队剩余时间。敌人攻击会扣减时间，时间归零则阶段失败。")}>
              <span class="bar hp" style="width:${playerHpRate * 100}%"></span>
              <strong>${game.player.hp} / ${game.player.maxHp} 天</strong>
            </div>
            <div class="stat-row">
              <span class="tag shield" ${tipAttr("时间缓冲会先抵消敌人造成的时间扣减，本轮结束后会清零。")}>时间缓冲 ${game.player.block}</span>
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
          ${visualArtMarkup("portrait enemy battle-portrait", `assets/scene-art/stage${game.stageIndex}.png`, stage.enemyName)}
        </article>
      </section>

      <section class="table" aria-label="行动区">
        <div class="status-card">
          <div class="status-header">
            <h2>阶段事件</h2>
            <span>${game.phase === "player" ? "你的回合" : "项目压力"}</span>
          </div>
          <ol class="combat-log">${game.log.map((item) => `<li ${tipAttr("阶段事件记录会按最新事件在最上方排列，帮助你回看刚刚发生的数值变化。")}>${item}</li>`).join("")}</ol>
        </div>
        <div class="hand-area">
          <div class="hand" aria-label="手牌">
            ${game.hand.map((cardId, index) => renderHandCard(cardId, index, game)).join("")}
          </div>
          <div class="actions">
            <div class="message" role="status">${battleMessage(game)}</div>
            <button class="primary-action" type="button" data-action="end-turn" ${game.phase !== "player" || game.gameOver ? "disabled" : ""}>
              <span aria-hidden="true">⏭</span>
              结束本轮
            </button>
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderHandCard(cardId, index, game) {
  const card = cardCatalog[cardId];
  const disabled = game.phase !== "player" || game.player.energy < card.cost || game.player.funds < (card.fundCost || 0) || game.gameOver;
  const fundText = card.fundCost ? ` · 资金-${card.fundCost}` : "";
  return `
    <button class="card-button ${cardThemeClass(card)}" type="button" data-action="play-card" data-card-index="${index}" ${disabled ? "disabled" : ""} ${tipAttr("点击打出这张牌。若行动力或资金不足，卡牌会变灰。")}>
      <span class="card-top">
        <span class="card-name">${card.name}</span>
        <span class="card-cost" ${tipAttr("打出这张牌需要消耗的行动力。")}>${card.cost}</span>
      </span>
      ${cardArtMarkup(cardId, card)}
      <span class="card-bottom">
        <span class="card-type" ${tipAttr(card.fundCost ? "这张牌除了行动力，还会消耗资金。" : "这张牌的创业要素类型。")}>${card.type}${fundText}</span>
      </span>
      <span class="card-text" ${tipAttr("卡牌效果。核心工作减少相当于攻击敌人血条，时间与资金会影响阶段续航。")}>${card.text}</span>
    </button>
  `;
}

function battleMessage(game) {
  if (game.gameOver) return "阶段已结束。";
  if (game.phase !== "player") return "项目压力处理中。";
  return `用手牌处理「${game.stage.target}」，或争取时间和资金。`;
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
  addLog(state, `团队建立了 ${amount} 点时间缓冲。`);
}

function gainTime(state, amount) {
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + amount);
  addLog(state, `剩余时间增加 ${amount} 天。`);
}

function gainFunds(state, amount) {
  state.player.funds += amount;
  addLog(state, `资金增加 ${amount}。`);
}

function spendFunds(state, amount) {
  state.player.funds = Math.max(0, state.player.funds - amount);
  addLog(state, `资金支出 ${amount}。`);
}

function loseTime(state, amount, message) {
  const buffered = Math.min(state.player.block, amount);
  const timeLost = amount - buffered;
  state.player.block -= buffered;
  state.player.hp = Math.max(0, state.player.hp - timeLost);
  addLog(state, message || `项目压力原本会扣减 ${amount} 天，实际扣减 ${timeLost} 天。`);
  if (buffered > 0) addLog(state, `时间缓冲抵消了 ${buffered} 天。`);
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
    { kind: "attack", label: `关键压力：将扣减 ${base} 天`, value: base },
    { kind: "block", label: `${state.stage.blockText} +7`, value: 7 },
    { kind: "attack", label: `突发问题：将扣减 ${Math.max(1, base - 1)} 天`, value: Math.max(1, base - 1) },
    { kind: "power", label: `${state.stage.powerText} +2`, value: 2 },
    { kind: "attack", label: `最终催办：将扣减 ${base + 2} 天`, value: base + 2 },
  ];
  return intents[state.enemy.intentIndex % intents.length];
}

function playCard(index) {
  const game = appState.battle;
  if (!game || game.gameOver || game.phase !== "player") return;

  const cardId = game.hand[index];
  const card = cardCatalog[cardId];
  if (!card || game.player.energy < card.cost || game.player.funds < (card.fundCost || 0)) return;

  game.player.energy -= card.cost;
  game.hand.splice(index, 1);
  game.discard.push(cardId);
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

  if (intent.kind === "attack") {
    loseTime(game, intent.value, `${game.stage.title}原本会扣减 ${intent.value} 天，实际扣减 ${Math.max(0, intent.value - game.player.block)} 天。`);
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
    showModal("阶段失败", `${game.stage.title}超过回合限制，核心工作没有完成。`, "返回路线", () => {
      appState.screen = "campaign";
      appState.battle = null;
      render();
    });
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
    showModal("阶段失败", "剩余时间归零，创业节奏被 deadline 击穿。", "返回路线", () => {
      appState.screen = "campaign";
      appState.battle = null;
      render();
    });
  }
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

  const finalStage = stageIndex === currentStages().length - 1;
  const progressReport = isIphoneRoute(campaign.trackId) ? iphoneProgressReports[stageIndex] : "";
  const normalCompleteText = `${game.stage.title}完成。资金 +${totalRewardFunds}，时间恢复 ${game.stage.recover} 天。${progressReport ? `\n\n${progressReport}\n\n` : ""}接下来选择阶段奖励。`;
  showModal(
    finalStage && isIphoneRoute(campaign.trackId) ? "发售成功：初代 iPhone" : finalStage ? "发售结束" : "阶段完成",
    finalStage
      ? isIphoneRoute(campaign.trackId)
        ? iphoneFinalReport
        : "产品完成发售，创业故事第一条路线收官。"
      : normalCompleteText,
    finalStage ? "返回路线" : "选择奖励",
    () => {
      appState.battle = null;
      appState.screen = finalStage ? "campaign" : "reward";
      render();
    },
  );
}

function showModal(title, text, actionLabel, action) {
  modalTitle.textContent = title;
  modalText.textContent = text;
  modalActionBtn.lastChild.textContent = actionLabel;
  modal.classList.remove("hidden");
  modalAction = action;
}

function showEventDetail(eventId) {
  const event = eventById(eventId);
  if (!event) return;

  showModal(
    event.name,
    `正面效果：${event.positive}
负面效果：${event.negative}
常驻影响：${formatEventEffect(event.effect)}`,
    "关闭",
    null,
  );
}

function hideModal() {
  modal.classList.add("hidden");
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
  appState.personas = { core: [null, null, null], opportunity: [null, null, null] };
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
    appState.personas = { core: [null, null, null], opportunity: [null, null, null] };
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
    localStorage.removeItem("startupCardGameContentV1");
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
  if (action === "play-card") playCard(Number(target.dataset.cardIndex));
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
render();

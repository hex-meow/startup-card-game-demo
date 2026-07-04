$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$outDir = Join-Path $root "outputs"
$renderDir = Join-Path $outDir "pptx_redesign_render"
$pptxPath = Join-Path $outDir "创业故事卡牌_项目介绍与玩法说明_重新设计版.pptx"

New-Item -ItemType Directory -Force -Path $outDir | Out-Null
New-Item -ItemType Directory -Force -Path $renderDir | Out-Null

function RgbColor([int]$r, [int]$g, [int]$b) {
  return $r + ($g * 256) + ($b * 65536)
}

$font = "Microsoft YaHei"
$ink = RgbColor 24 28 35
$muted = RgbColor 88 96 110
$soft = RgbColor 246 247 249
$panel = RgbColor 235 238 242
$line = RgbColor 196 202 212
$accent = RgbColor 42 111 201
$accent2 = RgbColor 244 122 54
$green = RgbColor 50 145 98
$purple = RgbColor 120 86 180

function Add-Text($slide, [string]$text, [double]$x, [double]$y, [double]$w, [double]$h, [int]$size = 18, [bool]$bold = $false, [int]$color = $ink, [int]$align = 1) {
  $shape = $slide.Shapes.AddTextbox(1, $x, $y, $w, $h)
  $shape.TextFrame2.TextRange.Text = $text
  $shape.TextFrame2.MarginLeft = 0
  $shape.TextFrame2.MarginRight = 0
  $shape.TextFrame2.MarginTop = 0
  $shape.TextFrame2.MarginBottom = 0
  $shape.TextFrame2.TextRange.Font.NameFarEast = $font
  $shape.TextFrame2.TextRange.Font.Name = $font
  $shape.TextFrame2.TextRange.Font.Size = $size
  $shape.TextFrame2.TextRange.Font.Bold = $(if ($bold) { -1 } else { 0 })
  $shape.TextFrame2.TextRange.Font.Fill.ForeColor.RGB = $color
  $shape.TextFrame2.TextRange.ParagraphFormat.Alignment = $align
  return $shape
}

function Add-Box($slide, [double]$x, [double]$y, [double]$w, [double]$h, [int]$fill = $panel, [int]$stroke = $line, [double]$strokeWidth = 1) {
  $shape = $slide.Shapes.AddShape(1, $x, $y, $w, $h)
  $shape.Fill.ForeColor.RGB = $fill
  if ($strokeWidth -le 0) {
    $shape.Line.Visible = 0
  } else {
    $shape.Line.Visible = -1
    $shape.Line.ForeColor.RGB = $stroke
    $shape.Line.Weight = $strokeWidth
  }
  return $shape
}

function Add-RoundBox($slide, [double]$x, [double]$y, [double]$w, [double]$h, [int]$fill = $panel, [int]$stroke = $line) {
  $shape = $slide.Shapes.AddShape(5, $x, $y, $w, $h)
  $shape.Fill.ForeColor.RGB = $fill
  $shape.Line.ForeColor.RGB = $stroke
  $shape.Line.Weight = 1
  return $shape
}

function Add-Line($slide, [double]$x1, [double]$y1, [double]$x2, [double]$y2, [int]$color = $line, [double]$weight = 1.5) {
  $shape = $slide.Shapes.AddLine($x1, $y1, $x2, $y2)
  $shape.Line.ForeColor.RGB = $color
  $shape.Line.Weight = $weight
  return $shape
}

function Add-Arrow($slide, [double]$x1, [double]$y1, [double]$x2, [double]$y2, [int]$color = $line, [double]$weight = 1.5) {
  $shape = Add-Line $slide $x1 $y1 $x2 $y2 $color $weight
  $shape.Line.EndArrowheadStyle = 3
  return $shape
}

function Add-Header($slide, [string]$title, [int]$page) {
  Add-Text $slide "创业故事卡牌" 34 24 180 20 11 $true $muted | Out-Null
  Add-Text $slide $title 34 54 760 46 27 $true $ink | Out-Null
  Add-Line $slide 34 112 926 112 $line 1.4 | Out-Null
  Add-Text $slide ($page.ToString("00")) 900 490 40 20 11 $false $muted 3 | Out-Null
}

function Add-Card($slide, [string]$title, [string]$body, [double]$x, [double]$y, [double]$w, [double]$h, [int]$tagColor = $accent) {
  Add-RoundBox $slide $x $y $w $h $soft $line | Out-Null
  Add-Box $slide ($x + 16) ($y + 18) 5 28 $tagColor $tagColor 0 | Out-Null
  Add-Text $slide $title ($x + 30) ($y + 16) ($w - 44) 28 17 $true $ink | Out-Null
  Add-Text $slide $body ($x + 30) ($y + 54) ($w - 44) ($h - 66) 12 $false $muted | Out-Null
}

function Add-Step($slide, [int]$n, [string]$title, [string]$body, [double]$x, [double]$y, [double]$w, [int]$color = $accent) {
  Add-RoundBox $slide $x $y $w 108 $soft $line | Out-Null
  Add-Text $slide ($n.ToString("00")) ($x + 14) ($y + 12) 42 20 12 $true $color | Out-Null
  Add-Text $slide $title ($x + 14) ($y + 38) ($w - 28) 24 15 $true $ink | Out-Null
  Add-Text $slide $body ($x + 14) ($y + 68) ($w - 28) 32 10 $false $muted | Out-Null
}

function Add-FlowNode($slide, [string]$title, [string]$body, [double]$x, [double]$y, [double]$w, [double]$h, [int]$color = $accent, [int]$fill = $soft) {
  Add-RoundBox $slide $x $y $w $h $fill $line | Out-Null
  Add-Box $slide ($x + 12) ($y + 12) 5 26 $color $color 0 | Out-Null
  Add-Text $slide $title ($x + 26) ($y + 10) ($w - 38) 24 13 $true $ink | Out-Null
  Add-Text $slide $body ($x + 26) ($y + 40) ($w - 38) ($h - 48) 9 $false $muted | Out-Null
}

function Add-Table($slide, $headers, $rows, [double]$x, [double]$y, [double]$w, [double]$rowH, [int]$fontSize = 10) {
  $cols = $headers.Count
  $colW = $w / $cols
  for ($c = 0; $c -lt $cols; $c++) {
    Add-Box $slide ($x + $c * $colW) $y $colW $rowH $accent $accent 0 | Out-Null
    Add-Text $slide $headers[$c] ($x + $c * $colW + 8) ($y + 8) ($colW - 16) ($rowH - 10) $fontSize $true (RgbColor 255 255 255) | Out-Null
  }
  for ($r = 0; $r -lt $rows.Count; $r++) {
    $fill = $(if ($r % 2 -eq 0) { $soft } else { RgbColor 255 255 255 })
    for ($c = 0; $c -lt $cols; $c++) {
      Add-Box $slide ($x + $c * $colW) ($y + ($r + 1) * $rowH) $colW $rowH $fill $line 0.8 | Out-Null
      Add-Text $slide $rows[$r][$c] ($x + $c * $colW + 8) ($y + ($r + 1) * $rowH + 7) ($colW - 16) ($rowH - 10) $fontSize $false $ink | Out-Null
    }
  }
}

$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = -1
$presentation = $ppt.Presentations.Add()
$presentation.PageSetup.SlideWidth = 960
$presentation.PageSetup.SlideHeight = 540

try {
  # 1 Cover
  $slide = $presentation.Slides.Add(1, 12)
  $slide.Background.Fill.ForeColor.RGB = RgbColor 255 255 255
  Add-Text $slide "创业故事卡牌" 44 58 520 62 42 $true $ink | Out-Null
  Add-Text $slide "项目介绍与玩法说明｜重新设计版" 48 130 520 32 19 $false $muted | Out-Null
  Add-Text $slide "用卡牌对战表达创业从立项、资源调度、阶段交付到最终发售的完整过程。" 48 184 520 62 20 $false $ink | Out-Null
  Add-Box $slide 620 52 260 360 $panel $panel 0 | Out-Null
  Add-Text $slide "路线" 654 92 70 26 19 $true $accent | Out-Null
  Add-Text $slide "选牌" 768 92 70 26 19 $true $green | Out-Null
  Add-Text $slide "对战" 654 214 70 26 19 $true $accent2 | Out-Null
  Add-Text $slide "事件" 768 214 70 26 19 $true $purple | Out-Null
  Add-Text $slide "发售" 696 330 120 42 30 $true $ink 2 | Out-Null
  Add-Text $slide "模拟创业 × 真实公司故事线" 48 430 500 30 18 $true $accent | Out-Null
  Add-Text $slide "2026.07" 812 490 70 18 11 $false $muted 3 | Out-Null

  # 2 Game positioning
  $slide = $presentation.Slides.Add(2, 12)
  Add-Header $slide "项目定位：把创业不确定性做成可玩的决策系统" 2
  Add-Card $slide "玩家体验" "选择路线、配置起点、构筑牌库、进入阶段关卡，在不断变化的事件和资源限制下完成发售。" 48 150 260 190 $accent
  Add-Card $slide "系统表达" "时间是血量，资金是资源，敌人血条是阶段核心工作，关卡间事件代表外部环境变化。" 350 150 260 190 $accent2
  Add-Card $slide "学习目标" "理解模拟创业的基本流程、常见问题，以及真实企业案例中的关键决策与实战故事。" 652 150 260 190 $green
  Add-Box $slide 48 390 864 58 (RgbColor 255 249 241) (RgbColor 244 202 160) 1 | Out-Null
  Add-Text $slide "核心目标：用卡牌对战表达资源调度、时间压力、团队能力、外部事件和阶段性交付。" 68 407 824 26 16 $true $ink | Out-Null

  # 3 Out-of-stage flow
  $slide = $presentation.Slides.Add(3, 12)
  Add-Header $slide "完整流程图 1：关卡外成长与路线推进" 3
  Add-Box $slide 42 126 876 42 (RgbColor 247 248 250) $line 0.8 | Out-Null
  Add-Text $slide "开局分支" 58 138 120 18 12 $true $accent | Out-Null
  Add-Text $slide "路线循环：每完成一关后，奖励、事件、商店和重组会改变下一关的可用策略。" 172 138 660 18 12 $false $ink | Out-Null

  Add-FlowNode $slide "路线选择" "模拟创业 / 真实公司故事线" 52 192 126 62 $accent (RgbColor 236 244 255)
  Add-FlowNode $slide "模拟线起点" "选身份、行业、产品用户画像`n生成时间 / 资金 / 难度" 220 154 156 72 $green (RgbColor 238 248 243)
  Add-FlowNode $slide "真实线起点" "案例锁定初始条件`n按历史时间线推进" 220 246 156 72 $accent2 (RgbColor 255 239 230)
  Add-FlowNode $slide "初始牌库" "模拟线：基础卡牌 8 张`n真实线：基础 + 专属卡" 416 200 146 70 $purple (RgbColor 244 240 252)
  Add-FlowNode $slide "路线地图" "查看阶段、事件、资金、牌库`n选择已解锁关卡" 604 200 146 70 $accent (RgbColor 236 244 255)
  Add-FlowNode $slide "进入关卡" "带入出战牌库`n进入关卡内对战流程" 792 200 126 70 $accent2 (RgbColor 255 239 230)

  Add-FlowNode $slide "阶段失败" "时间归零或超回合`n返回路线地图，可重试" 792 322 126 70 $accent2 (RgbColor 255 239 230)
  Add-FlowNode $slide "阶段胜利" "保留剩余时间 / 资金`n发放关卡奖励资金" 604 322 146 70 $green (RgbColor 238 248 243)
  Add-FlowNode $slide "奖励选牌" "3 选 1 阶段奖励卡`n加入拥有牌库" 416 322 146 70 $green (RgbColor 238 248 243)
  Add-FlowNode $slide "关卡间事件" "模拟线：标准/随机事件`n真实线：历史时间线事件" 220 338 156 70 $purple (RgbColor 244 240 252)
  Add-FlowNode $slide "商店购买" "用资金购买未拥有基础卡`n补充路线成长" 52 338 126 70 $purple (RgbColor 244 240 252)
  Add-FlowNode $slide "重组牌库" "出战上限随进度提高`n至少 8 张，确认后回地图" 52 440 156 62 $accent (RgbColor 236 244 255)
  Add-FlowNode $slide "最终关完成" "进入路线收官`n输出案例总结 / 发售结果" 416 438 170 62 $green (RgbColor 238 248 243)

  Add-Arrow $slide 178 223 220 190 $line 1.3 | Out-Null
  Add-Arrow $slide 178 223 220 282 $line 1.3 | Out-Null
  Add-Arrow $slide 376 190 416 226 $line 1.3 | Out-Null
  Add-Arrow $slide 376 282 416 236 $line 1.3 | Out-Null
  Add-Arrow $slide 562 235 604 235 $line 1.3 | Out-Null
  Add-Arrow $slide 750 235 792 235 $line 1.3 | Out-Null
  Add-Arrow $slide 850 270 850 322 $line 1.3 | Out-Null
  Add-Arrow $slide 792 270 750 322 $green 1.4 | Out-Null
  Add-Arrow $slide 792 345 750 270 $accent2 1.3 | Out-Null
  Add-Arrow $slide 604 357 562 357 $line 1.3 | Out-Null
  Add-Arrow $slide 416 357 376 373 $line 1.3 | Out-Null
  Add-Arrow $slide 220 373 178 373 $line 1.3 | Out-Null
  Add-Arrow $slide 115 408 115 440 $line 1.3 | Out-Null
  Add-Arrow $slide 208 471 604 270 $line 1.3 | Out-Null
  Add-Arrow $slide 677 392 501 438 $green 1.4 | Out-Null
  Add-Text $slide "普通关胜利继续循环；最终关胜利进入路线收官。" 620 452 250 20 12 $true $ink | Out-Null

  # 4 Route comparison
  $slide = $presentation.Slides.Add(4, 12)
  Add-Header $slide "两类路线共用成长结构，但内容来源不同" 4
  $headers = @("环节", "模拟创业路线", "真实公司故事线")
  $rows = @(
    @("开局条件", "选择创业者身份、行业、产品用户画像", "使用案例锁定的初始条件"),
    @("牌库准备", "从基础卡牌池中组建初始牌库", "基础卡牌 + 案例专属卡牌"),
    @("关卡来源", "通用创业推进流程", "真实项目关键阶段拆解"),
    @("事件系统", "标准时间线事件 + 随机意外事件", "按照历史时间线发生"),
    @("体验目标", "理解早期创业流程和常见取舍", "体验企业真实决策与产品落地")
  )
  Add-Table $slide $headers $rows 48 150 864 50 10

  # 5 Battle flow
  $slide = $presentation.Slides.Add(5, 12)
  Add-Header $slide "完整流程图 2：关卡内对战回合循环" 5
  Add-FlowNode $slide "进入阶段" "读取阶段参数：敌人血条、攻击、回合限制`n读取玩家：时间、资金、出战牌库" 46 154 160 76 $accent (RgbColor 236 244 255)
  Add-FlowNode $slide "初始化战斗" "洗牌、抽 5 张`n行动力上限 3，回合 = 1" 246 154 142 76 $accent (RgbColor 236 244 255)
  Add-FlowNode $slide "玩家回合开始" "行动力回满`n抽牌到手牌" 428 154 130 76 $green (RgbColor 238 248 243)
  Add-FlowNode $slide "选择并打出卡牌" "支付行动力 / 资金`n结算推进、缓冲、资金、抽牌等效果" 598 144 152 86 $green (RgbColor 238 248 243)
  Add-FlowNode $slide "胜利判断" "敌人血条归零？`n是：阶段胜利" 790 154 126 76 $green (RgbColor 238 248 243)

  Add-FlowNode $slide "结束本轮" "没有可打卡或主动结束`n弃掉剩余手牌" 598 282 152 70 $purple (RgbColor 244 240 252)
  Add-FlowNode $slide "敌人意图" "攻击扣时间 / 增加阻力`n增加压力 / 最终催办" 428 282 130 82 $accent2 (RgbColor 255 239 230)
  Add-FlowNode $slide "敌人结算" "时间缓冲先抵消伤害`n阻力和压力进入后续回合" 246 282 142 82 $accent2 (RgbColor 255 239 230)
  Add-FlowNode $slide "失败判断" "时间归零？阶段失败`n回合超过限制？阶段失败" 46 282 160 82 $accent2 (RgbColor 255 239 230)

  Add-FlowNode $slide "下一回合" "回合数 +1`n未失败则回到玩家回合" 246 426 142 60 $accent (RgbColor 236 244 255)
  Add-FlowNode $slide "阶段胜利结算" "保留剩余时间和资金`n进入关卡外奖励 / 事件 / 商店 / 重组" 720 404 196 70 $green (RgbColor 238 248 243)

  Add-Arrow $slide 206 192 246 192 $line 1.4 | Out-Null
  Add-Arrow $slide 388 192 428 192 $line 1.4 | Out-Null
  Add-Arrow $slide 558 192 598 187 $line 1.4 | Out-Null
  Add-Arrow $slide 750 187 790 192 $line 1.4 | Out-Null
  Add-Arrow $slide 852 230 818 404 $green 1.6 | Out-Null
  Add-Arrow $slide 790 192 750 317 $line 1.4 | Out-Null
  Add-Arrow $slide 598 317 558 323 $line 1.4 | Out-Null
  Add-Arrow $slide 428 323 388 323 $line 1.4 | Out-Null
  Add-Arrow $slide 246 323 206 323 $line 1.4 | Out-Null
  Add-Arrow $slide 126 364 246 456 $line 1.4 | Out-Null
  Add-Arrow $slide 317 426 493 230 $line 1.4 | Out-Null
  Add-Text $slide "卡牌效果内部会同时处理：核心工作推进、阻力抵消、时间缓冲、资金变化、抽牌、推进加成、压力变化。" 58 502 790 18 12 $true $ink | Out-Null

  # 6 Combat values
  $slide = $presentation.Slides.Add(6, 12)
  Add-Header $slide "核心数值：把创业压力转成战斗资源" 6
  Add-Card $slide "玩家时间" "玩家血量。敌人攻击会扣减时间，归零则阶段失败。" 48 150 200 130 $accent
  Add-Card $slide "资金" "用于打出部分卡牌，也用于关卡外商店买牌。" 270 150 200 130 $green
  Add-Card $slide "敌人血条" "阶段核心工作剩余量，清空即阶段胜利。" 492 150 200 130 $accent2
  Add-Card $slide "回合限制" "超过限制仍未完成核心工作则失败。" 714 150 200 130 $purple
  Add-Box $slide 48 342 864 88 (RgbColor 247 248 250) $line 1 | Out-Null
  Add-Text $slide "动态状态" 72 360 120 26 18 $true $accent | Out-Null
  Add-Text $slide "时间缓冲抵消伤害；推进加成提高后续输出；阻力抵消推进；压力提高敌人后续攻击。" 200 362 660 28 15 $false $ink | Out-Null

  # 7 Content editor
  $slide = $presentation.Slides.Add(7, 12)
  Add-Header $slide "内容编辑器：把外部专业故事转换成可玩的战役" 7
  Add-Card $slide "故事转关卡" "从第三方资料、真实企业案例或行业故事中提取关键阶段，转换成路线、关卡和事件。" 48 150 260 190 $accent
  Add-Card $slide "参数调难度" "调整初始资源、敌人强度、事件影响、卡牌效果和商店价格，控制节奏与挑战。" 350 150 260 190 $accent2
  Add-Card $slide "开源扩展基础" "外部创作者可补充创业赛道、真实案例、历史事件和卡牌内容，形成可共创故事库。" 652 150 260 190 $green
  Add-Box $slide 48 390 864 54 (RgbColor 255 249 241) (RgbColor 244 202 160) 1 | Out-Null
  Add-Text $slide "配套文件：内容编辑器必要参数表.md｜内容编辑器实际Demo表格.xlsx" 72 408 800 20 14 $true $ink | Out-Null

  # 8 Demo content
  $slide = $presentation.Slides.Add(8, 12)
  Add-Header $slide "当前 Demo 内容：模拟创业 + 初代 iPhone 案例" 8
  Add-Card $slide "模拟创业赛道" "银发健康、AI效率工具、绿色消费。玩家选择核心人群和机会人群，再从 20 张通用创业要素牌中选 8 张。" 48 150 400 150 $accent
  Add-Card $slide "初代 iPhone 故事线" "Project Purple、运营商谈判、OS X触控移植、Macworld发布、硬件冲刺、Web App生态、2007-06-29发售。" 512 150 400 150 $accent2
  Add-Box $slide 48 350 864 74 (RgbColor 247 248 250) $line 1 | Out-Null
  Add-Text $slide "实际 Demo 表格已预填：4 条路线/案例、36 个画像、14 个关卡、76 张卡牌、14 个事件。" 72 372 800 24 16 $true $ink | Out-Null

  # 9 Deliverables
  $slide = $presentation.Slides.Add(9, 12)
  Add-Header $slide "交付结构：游戏 Demo 与说明文档分离维护" 9
  Add-Card $slide "游戏demo 文件夹" "index.html、styles.css、app.js、内容编辑器实际Demo表格.xlsx、项目文件试玩与Demo明细.md。" 48 150 400 170 $accent
  Add-Card $slide "项目介绍与玩法说明" "主文档聚焦背景、关卡外流程、关卡内对战和内容编辑器定位；参数表独立维护。" 512 150 400 170 $purple
  Add-Box $slide 48 370 864 54 (RgbColor 247 248 250) $line 1 | Out-Null
  Add-Text $slide "运行方式：直接打开游戏demo/index.html；如本地策略限制脚本，再启动本地静态服务。" 72 388 780 20 14 $true $ink | Out-Null

  # 10 Expansion path
  $slide = $presentation.Slides.Add(10, 12)
  Add-Header $slide "下一步：让真实故事持续变成可玩的创业战役" 10
  $pipeline = @(
    @("收集故事", "企业案例、专业访谈、行业资料"),
    @("拆解阶段", "提取目标、冲突、资源、时间线"),
    @("填写参数", "路线、关卡、事件、卡牌、敌人"),
    @("试玩调参", "平衡时间、资金、血量和奖励"),
    @("发布共享", "形成第三方可扩展内容包")
  )
  for ($i = 0; $i -lt $pipeline.Count; $i++) {
    $x = 48 + $i * 174
    Add-Step $slide ($i + 1) $pipeline[$i][0] $pipeline[$i][1] $x 185 150 $(if ($i % 2 -eq 0) { $accent } else { $green })
    if ($i -lt $pipeline.Count - 1) { Add-Line $slide ($x + 150) 239 ($x + 166) 239 $line 1.2 | Out-Null }
  }
  Add-Text $slide "目标：从单个原型，扩展成可由第三方共同维护的创业故事卡牌系统。" 48 420 760 30 18 $true $ink | Out-Null

  $presentation.SaveAs($pptxPath)

  for ($i = 1; $i -le $presentation.Slides.Count; $i++) {
    $png = Join-Path $renderDir ("slide-" + $i.ToString("00") + ".png")
    $presentation.Slides.Item($i).Export($png, "PNG", 1280, 720) | Out-Null
  }
}
finally {
  if ($presentation) { $presentation.Close() }
  if ($ppt) { $ppt.Quit() }
}

Write-Output $pptxPath

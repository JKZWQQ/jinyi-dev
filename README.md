# 今翊科技 · 官网（AI 赋能开发小程序）

**线上地址：<https://jkzwqq.github.io/jinyi-dev/>**
仓库：<https://github.com/JKZWQQ/jinyi-dev>（公开）

对标 shanyufeng.cn 的结构与视觉语言重做，品牌、文案、配色全部换成今翊科技。纯静态站，零依赖、无后端，双击 `index.html` 就能本地预览。

---

## 页面

| 文件 | 内容 |
|---|---|
| `index.html` | 首页：Hero + 需求清单工作台 + 流程 4 步 + 为什么需要真人把关 + AI 模型墙 + CTA |
| `pricing.html` | 报价方式：展示类 / 小程序 / 网页系统 / 平台型 四档，讲各自包含什么，不标价 |
| `cases.html` | 案例：1 个真实上线案例（3 张脱敏截图）+ 3 个行业效果示意 + 6 个擅长方向 |
| `guide.html` | 开发流程：6 步时间轴 + 交付物清单 + 8 条 FAQ |
| `contact.html` | 联系我们：联系方式 + 合作前商务说明 |
| `assets/css/style.css` | 设计系统（配色/间距/圆角都在文件顶部 `:root`）|
| `assets/js/main.js` | 交互：tab 切换、端多选、图片预览、需求清单生成、弹窗、FAQ 折叠 |

---

## 当前状态：页面不标价

按你的要求，**全站没有任何具体价格数字**。

客户在工作台选类型、勾需要的端、写想法，点「生成需求清单」后会看到：

- 预计工期（15–30 个工作日，按类型给）
- 报价方式：**按功能清单评估后报价**
- 包含什么（前端 / 后端 / 管理后台 / 源码 / 部署文档）
- 一句「分阶段付款：确认后付定金开工，验收通过再付尾款」

然后点「把这个需求发给工程师」→ 填联系方式 → 生成一段格式化需求单，客户复制发你微信。

**以后要标价的话**：改 `index.html` 里每个 chip 的 `data-name`，给需要的档位加 `data-base`（基准价）、`data-deposit`（定金），再在 `main.js` 的 `renderSummary()` 里把「报价方式」那行换成价格行即可。

---

## 联系方式

全站统一用 **13202868751**（微信同号），出现位置：

- 每个 HTML 文件底部的 `<script>window.JY = { contact: { wechat: "13202868751", phone: "13202868751" } };</script>`
- `contact.html` 里的电话一行
- 页脚「联系小管家」的微信号（由 JS 注入，改上面那行即可全站生效）

**还没做的一步**：二维码。现在页脚和联系页是灰色占位块。把你的微信二维码图片存成 `assets/img/qrcode.png`，然后把这两处替换掉：

```html
<!-- 页脚，各页面都有 -->
<div class="footer-cs-qr">二维码位<br><small>待替换</small></div>
<!-- 换成 -->
<img src="assets/img/qrcode.png" alt="客服微信" style="width:118px;border-radius:13px">

<!-- contact.html 里 -->
<div class="qr-box">...</div>
<!-- 换成 -->
<img src="assets/img/qrcode.png" alt="客服微信" style="width:168px;border-radius:16px">
```

---

## 配色

主色已对齐公司宣讲 PPT / 开业 PPT 的 **`#1E63E8`**。改 `assets/css/style.css` 顶部这几行，全站跟着变：

```css
--brand: #1e63e8;      /* 主色（公司品牌蓝） */
--brand-deep: #0e2a5c; /* 深色标题 */
--brand-soft: #eaf0fa; /* 浅色底 */
--violet: #2e8bf0;     /* 渐变副色（浅蓝） */
--accent: #0d7fd1;     /* 强调色（青蓝） */
```

> 首页 AI 模型卡片里 6 个方块用的是各模型自己的品牌色（DeepSeek 蓝、Claude 橙等），故意不跟主色统一 —— 它们代表被调用的模型，不是今翊 VI。

---

## 部署（已上线，改了内容怎么更新）

站托管在 GitHub Pages，**免备案、免费、支持 HTTPS**。

改完文件后，在 `官网` 目录执行：

```bash
git add -A
git commit -m "更新说明"
git push
```

约 1 分钟自动生效，刷新线上地址即可。不用做别的。

**如果以后要换域名**：在 GitHub 仓库 Settings → Pages → Custom domain 填域名，然后在域名服务商加一条 CNAME 指向 `jkzwqq.github.io`。

---

## 素材说明（哪些能用、哪些不能用）

| 文件 | 性质 | 能否对外 |
|---|---|---|
| `assets/img/case-grocery-order.png` | 真实上线截图（生鲜代买用户端首页） | ✅ 已上线使用 |
| `assets/img/case-grocery-cart.png` | 真实上线截图（确认下单页） | ✅ 已上线使用 |
| `assets/img/case-grocery-admin_safe.png` | 真实上线截图**脱敏版** | ✅ 已上线使用 |
| `assets/img/mock-glasses.png` / `mock-tonic.png` / `mock-grain.png` | 行业效果示意（非交付案例） | ✅ 页面已标「效果示意」 |

**两张已移出部署范围的图**（在 `桌面\今翊科技路演\_未采用素材\`）：

1. `case-grocery-admin_未脱敏原始版.png` —— 原来那行配送信息含真实房号 `B栋1802` 和手机号。现已用实心色块做了不可逆遮挡并另存 `_safe` 版，页面只引用 `_safe` 版。脱敏做了像素级校验（遮挡区为单一颜色，物理上不含文字）。
2. `case-house-list_房源经营界面.png` —— 整张图是房源经营界面（含「物业费 150 元/月」「押一付一」「地铁5号线步行4分钟」），属于你的收租业务，不适合放在对外官网，**未被网站采用**。想用得重截一张不含经营信息的纯展示版。

内部文档（PPT 结合清单、素材说明）已移到 `桌面\今翊科技路演\_项目文档\`，不进公开仓库。

---

## 验证记录（无头浏览器 + CDP 实测，非目测）

| 项 | 结果 |
|---|---|
| 5 个页面 × 1440px / 390px | 零横向溢出、零元素错位 |
| 报价工作台 / tab 切换 / 端多选 / 图片预览 / FAQ 折叠 / 移动端汉堡菜单 | 全部通过 |
| 线上站端到端（真实浏览器访问 GitHub Pages） | 5 页 HTTP 200，案例页 6 张图全部加载，交互正常 |
| 图片资源连续 6 次请求 | 6/6 返回 200，字节数与本地文件完全一致 |
| 全站价格数字扫描 | 0 处 |

开发过程中实测发现并修掉的问题：弹窗遮罩一直显示（CSS `display:grid` 盖过 `hidden` 属性）、「需要的端」多选退化成单选、需求描述抓取为空。

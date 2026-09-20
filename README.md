# 今翊科技 · 官网（AI 赋能开发小程序）

对标 shanyufeng.cn 的结构与视觉语言重做，品牌、文案、配色全部换成今翊科技。纯静态站，无后端、无依赖，双击即可看。

## 文件结构

```
官网/
├── index.html          首页（Hero + 报价工作台 + 流程 + 能力 + CTA）
├── pricing.html        价格说明（4 档：网站 / 小程序 / 系统 / 平台型）
├── cases.html          开发案例（已交付示例 + 擅长方向）
├── guide.html          开发流程（6 步时间轴 + 交付物 + 8 条 FAQ）
├── contact.html        联系我们（联系方式 + 商务说明）
├── assets/css/style.css    设计系统（全部配色/间距/圆角都在文件顶部 :root）
├── assets/js/main.js       交互（tab 切换 / 多选 / 图片预览 / 报价计算 / 需求单）
└── assets/img/             图片目录（放 logo、二维码）
```

本地预览：直接双击 `index.html`。

## 你需要改的 4 个地方

### 1. 联系方式（每个页面底部）

每个 html 文件底部都有一行：

```html
<script>window.JY = { contact: { wechat: "JY-AI-Dev", phone: "待填写", email: "待填写" } };</script>
```

把 `JY-AI-Dev` 换成真实客服微信号。`contact.html` 里的电话/邮箱也要手改（搜"待填写"）。

### 2. 客服二维码

把二维码图片放到 `assets/img/`，然后替换三个位置：
- 页脚：`<div class="footer-cs-qr">二维码位...</div>` → `<img src="assets/img/qrcode.png" alt="客服微信" style="width:118px;border-radius:13px">`
- `contact.html` 的 `<div class="qr-box">` 同样替换

### 3. 价格（首页 index.html 底部）

报价工作台的价格写在每个 chip 的 `data-base`（基准价）和 `data-deposit`（定金）上：

```html
<button class="chip active" data-name="展示/房源类" data-base="5999" data-deposit="800">展示 · 房源</button>
```

调价规则在 `window.JY.quote`：

```js
quote: {
  extraPlatform: 2500,   // 每多一个端（H5/抖音）加价
  backendAdd: 1800,      // 网站加管理后台加价
  rangeUp: 1.35          // 报价区间上限系数（上限 = 基准 × 1.35）
}
```

`pricing.html` 的价格是纯文字，直接改数字即可。

> **当前价格是我按市场行情填的占位值，务必按你的实际成本和报价习惯改。**

### 4. 配色（想要别的色系时）

改 `assets/css/style.css` 顶部这几行，全站跟着变：

```css
--brand: #1e63e8;      /* 主色（公司品牌蓝，与宣讲 PPT / 开业 PPT 一致） */
--violet: #2e8bf0;     /* 渐变副色（浅蓝） */
--accent: #0d7fd1;     /* 强调色（青蓝） */
--gold: #c47f16;       /* 定金/高亮金 */
```

> 首页 AI 模型卡片里 6 个 logo 方块用的是各模型自己的品牌色（DeepSeek 蓝、Claude 橙等），故意不跟主色统一 —— 它们代表的是被调用的模型，不是今翊 VI。

## 案例素材（重要）

`assets/img/` 里现有素材分两类：

| 文件 | 性质 | 能否对外 |
|---|---|---|
| `case-grocery-order.png` / `case-grocery-cart.png` | 真实上线截图（社区生鲜代买用户端） | ✅ 可对外 |
| `case-grocery-admin_safe.png` | 真实上线截图的**脱敏版** | ✅ 可对外 |
| `mock-glasses.png` / `mock-tonic.png` / `mock-grain.png` | 行业效果示意（非交付案例） | ✅ 但页面必须标"效果示意" |
| `case-grocery-admin.png` | **原始未脱敏版** | ❌ 不要用 |
| `case-house-list.png` | 房源列表（含物业费/押一付一等经营信息） | ❌ 不要用 |

**关于两张不能对外用的图：**

1. `case-grocery-admin.png` 原图里有一行配送信息含真实房号（`B栋1802`）和手机号。我用实心色块做了不可逆遮挡，另存为 `case-grocery-admin_safe.png`，页面只用 `_safe` 版。已做像素级校验（该区域为单一颜色，物理上不含文字信息）。
2. `case-house-list.png` 整张图就是房源经营界面（含"物业费 150 元/月""押一付一""地铁5号线步行4分钟"），属于**你的收租业务**，不适合放在对外官网。因此案例页没有采用它 —— 需要的话建议重新截一张不含经营信息的纯展示版，或干脆不用。原图我保留在 img 目录里没有删除。

## 客户提交流程（当前设计）

客户在首页选类型 → 填想法 → 点「获取开发报价」→ 本地算出价格区间和定金 → 点「把这个需求发给工程师」→ 填联系方式 → **生成一段格式化的需求单**，客户复制后发你微信。

因为是纯静态站，不走服务器。如果你想改成"客户点击提交就直接推到你企业微信"，需要加一个轻后端（方案 B），随时可以做。

## 部署（推荐 Cloudflare Pages，免备案）

1. 注册 Cloudflare 账号 → Workers & Pages → Create → Pages → Upload assets
2. 把这个 `官网` 文件夹里所有文件拖进去上传
3. 得到一个 `xxx.pages.dev` 的免费域名，全球可访问，**不需要备案**
4. 有自己的域名可以在 Pages 里绑定，改 DNS 即可

其他选择：
- **腾讯云/阿里云静态托管**：国内速度快，但绑定域名需要 ICP 备案（约 2-3 周）
- **微信里直接发 HTML 文件**：不行，微信不打开本地 html，必须部署到网上给链接

## 已验证项（无头浏览器实测）

- 5 个页面在 1440px 和 390px 下均无横向溢出、无元素错位
- 报价计算：小程序三端（微信+H5+抖音）= ¥10,999，与公式一致
- 「需要的端」多选、tab 切换、图片上传预览、FAQ 折叠、移动端汉堡菜单全部实测通过
- 需求单生成的文本格式完整，含开发类型/方向/端数/需求描述/联系方式

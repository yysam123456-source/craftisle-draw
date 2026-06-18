# Google Analytics 4 设置指南

## 步骤 1: 创建 GA4 属性

1. 访问 [Google Analytics](https://analytics.google.com)
2. 点击"管理" → "创建属性"
3. 输入属性名称：`Craftisle Draw`
4. 选择时区：`GMT+08:00`（中国时间）
5. 选择货币：`CNY - 人民币`
6. 点击"下一步"
7. 选择业务目标：`获取基准`（或其他适合的选项）
8. 点击"创建"

## 步骤 2: 获取 Measurement ID

1. 在 GA4 属性中，点击"管理" → "数据流"
2. 点击"创建数据流" → 选择"Web"
3. 输入网站名称：`Craftisle Draw`
4. 输入网站 URL：`https://draw.craftisle.com`
5. 点击"创建数据流"
6. 复制 **Measurement ID**（格式：`G-XXXXXXXX`）

## 步骤 3: 添加到项目

1. 打开 `.env.local` 文件
2. 添加以下行：
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX
   ```
   （将 `G-XXXXXXXX` 替换为你的实际 Measurement ID）

3. 提交并部署：
   ```bash
   git add .env.local
   git commit -m "feat: Add Google Analytics 4 Measurement ID"
   git push origin main
   ```

## 步骤 4: 验证安装

1. 部署后，访问 `https://draw.craftisle.com`
2. 打开浏览器开发者工具（F12）
3. 查看"网络"标签
4. 刷新页面
5. 应该看到 `gtag.js` 或 `analytics.js` 请求
6. 在 Google Analytics 中查看"实时"报告，应该能看到你的访问

---

# Google Search Console 设置指南

## 步骤 1: 添加资源

1. 访问 [Google Search Console](https://search.google.com/search-console)
2. 点击"添加资源"
3. 选择"网域"或"网址前缀"
   - 推荐：选择"网址前缀" → 输入 `https://draw.craftisle.com`
4. 点击"继续"

## 步骤 2: 验证所有权

### 方法 1: HTML 标签（推荐）

1. 在 Search Console 中选择"HTML 标签"验证方法
2. 复制 meta 标签内容（格式：`<meta name="google-site-verification" content="XXXXXXXX" />`）
3. 复制 `content` 属性的值（`XXXXXXXX` 部分）
4. 打开 `src/app/layout.tsx`
5. 找到 `verification` 字段
6. 将 `PLACEHOLDER_VERIFICATION_CODE` 替换为你的验证代码
7. 提交并部署

### 方法 2: HTML 文件上传

1. 下载 Search Console 提供的 HTML 文件
2. 将文件放到 `public/` 目录
3. 提交并部署
4. 在 Search Console 中点击"验证"

## 步骤 3: 提交 Sitemap

1. 在 Search Console 中，选择你的资源
2. 在左侧菜单中点击"站点地图"
3. 输入站点地图 URL：`https://draw.craftisle.com/sitemap.xml`
4. 点击"提交"

## 步骤 4: 验证收录

1. 在 Search Console 中，点击"网址检查"
2. 输入 `https://draw.craftisle.com`
3. 点击"测试实际网址"
4. 如果显示"网址已显示在 Google 搜索结果中"，则表示已收录

---

# Bing Webmaster Tools 设置指南

## 步骤 1: 添加网站

1. 访问 [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. 点击"添加网站"
3. 输入网站 URL：`https://draw.craftisle.com`
4. 点击"添加"

## 步骤 2: 验证所有权

### 方法 1: Meta 标签（推荐）

1. 选择"Meta 标签"验证方法
2. 复制 meta 标签内容
3. 复制 `content` 属性的值
4. 打开 `src/app/layout.tsx`
5. 找到 `verification` 字段
6. 将 `BING_VERIFICATION_CODE` 替换为你的验证代码
7. 提交并部署

## 步骤 3: 提交 Sitemap

1. 在 Bing Webmaster Tools 中，选择你的网站
2. 点击"站点地图"
3. 输入站点地图 URL：`https://draw.craftisle.com/sitemap.xml`
4. 点击"提交"

---

# 社交媒体分享预览验证

## Facebook

1. 访问 [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. 输入网址：`https://draw.craftisle.com`
3. 点击"调试"
4. 检查预览是否正确显示：
   - 标题：`Free Online Whiteboard | Craftisle Draw`
   - 描述：`Create hand-drawn diagrams, flowcharts, and collaborative boards with Craftisle Draw.`
   - 图片：`https://draw.craftisle.com/og-image.png`

## Twitter

1. 访问 [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. 输入网址：`https://draw.craftisle.com`
3. 点击"预览卡片"
4. 检查预览是否正确显示

## LinkedIn

1. 访问 [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
2. 输入网址：`https://draw.craftisle.com`
3. 点击"检查"
4. 检查预览是否正确显示

---

# 检查清单

- [ ] Google Analytics 4 Measurement ID 已添加
- [ ] Google Search Console 已验证
- [ ] Bing Webmaster Tools 已验证
- [ ] Sitemap 已提交到 Google Search Console
- [ ] Sitemap 已提交到 Bing Webmaster Tools
- [ ] 社交媒体分享预览已验证
- [ ] OG 图片已优化（文件大小 < 1MB）
- [ ] 所有页面已收录到 Google 搜索结果中

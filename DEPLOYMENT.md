# 全球风能锂电人才搜索雷达 - 部署指南

## 🚀 快速部署到 Vercel（推荐）

### 方法一：通过 Vercel 网站部署（最简单）

#### 第一步：上传代码到 GitHub

1. **访问 GitHub**：https://github.com 并登录
2. **创建新仓库**：
   - 点击右上角 `+` → `New repository`
   - 仓库名：`global-talent-radar`
   - 选择 `Public`（或 Private）
   - ✅ 勾选 `Add a README file`
   - 点击 `Create repository`

3. **上传代码**：
   ```bash
   # 在项目目录打开终端
   cd "D:\WORKBUDDY工作文件夹\2026-05-29-01-08-25\global-talent-radar"
   
   # 初始化 Git（如果还没做）
   git init
   git branch -M main
   
   # 添加所有文件
   git add .
   
   # 提交
   git commit -m "初始提交：全球风能锂电人才搜索雷达 v0.1.0"
   
   # 关联 GitHub 仓库（替换 YOUR_USERNAME）
   git remote add origin https://github.com/YOUR_USERNAME/global-talent-radar.git
   
   # 推送代码
   git push -u origin main
   ```

#### 第二步：部署到 Vercel

1. **访问 Vercel**：https://vercel.com
2. **登录**：使用 GitHub 账号登录
3. **导入项目**：
   - 点击 `Add New...` → `Project`
   - 选择 `Import Git Repository`
   - 找到 `global-talent-radar` 仓库
   - 点击 `Import`

4. **配置项目**：
   - **Project Name**：`global-talent-radar`（或自定义）
   - **Framework Preset**：自动检测为 `Next.js`
   - **Root Directory**：`./`（默认）
   - **Build Command**：`npm run build`（默认）
   - **Output Directory**：`.next`（默认）
   - **Install Command**：`npm install`（默认）

5. **环境变量（重要！）**：
   点击 `Environment Variables` 添加以下变量：
   
   | 变量名 | 值 | 说明 |
   |--------|-----|------|
   | `DATABASE_URL` | `file:./dev.db` | 使用 SQLite（简单）|
   | `NEXTAUTH_SECRET` | `your-secret-key-12345` | 任意随机字符串 |
   | `NEXTAUTH_URL` | `https://your-app.vercel.app` | 部署后替换 |
   | `JWT_SECRET` | `your-jwt-secret-67890` | 任意随机字符串 |
   | `AI_PROVIDER` | `mock` | 使用 Mock AI（无需 Key）|
   | `PAYMENT_MODE` | `mock` | 使用 Mock 支付 |

6. **点击 `Deploy`**：
   - Vercel 会自动构建和部署
   - 等待 2-5 分钟
   - 获得公网 URL：`https://your-app.vercel.app`

---

### 方法二：通过 Vercel CLI 部署（更快）

如果你有 Vercel 账号和 Token，可以直接用命令行部署：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署（按照提示操作）
vercel --prod
```

---

## 🌐 其他部署平台

### Netlify

1. 访问 https://app.netlify.com
2. `Add new site` → `Import an existing project`
3. 选择 GitHub 仓库
4. 配置：
   - **Build command**：`npm run build`
   - **Publish directory**：`.next`
5. 部署

### Render

1. 访问 https://render.com
2. `New +` → `Web Service`
3. 连接 GitHub 仓库
4. 配置：
   - **Environment**：`Node`
   - **Build Command**：`npm install && npm run build`
   - **Start Command**：`npm start`
5. 部署

---

## ⚙️ 部署前检查清单

### ✅ 必须检查的项目

- [x] `npm run build` 成功（89/89 页面）
- [x] `.gitignore` 包含 `.env`（防止密钥泄露）
- [x] `package.json` 包含 `build` 和 `start` 脚本
- [x] 所有动态路由正常工作
- [x] API 路由返回正确响应
- [x] 静态资源（图片、字体）正确加载
- [x] 移动端响应式正常

### 🔒 安全配置

1. **数据库**：
   - 生产环境建议使用 PostgreSQL（Vercel Postgres / Supabase）
   - 或修改 `DATABASE_URL` 为云端数据库地址

2. **环境变量**：
   - 不要在代码中硬编码密钥
   - 所有敏感信息通过 Vercel 环境变量配置

3. **API 限制**：
   - 已配置 Middleware 保护后台路由
   - 建议添加 Rate Limiting

---

## 🎯 部署后验证

部署成功后，访问公网 URL 并检查：

1. **首页**：`https://your-app.vercel.app/`
2. **登录页**：`https://your-app.vercel.app/login`
3. **注册页**：`https://your-app.vercel.app/register`
4. **Dashboard**：`https://your-app.vercel.app/dashboard`（需登录）
5. **搜索页**：`https://your-app.vercel.app/searches`（需登录）

---

## 📝 给老师的访问说明

部署完成后，你可以这样告诉老师：

```
老师您好，

我已成功部署「全球风能锂电人才搜索雷达」项目到公网，您可以通过以下地址访问：

🔗 公网访问地址：https://your-app.vercel.app

📋 使用说明：
1. 首页：查看平台介绍和功能概览
2. 注册/登录：创建账号或使用演示账号
3. Dashboard：查看数据概览和统计
4. 人才搜索：搜索全球风能锂电领域人才
5. 候选人管理：查看和管理候选人信息

⚠️ 注意：
- 当前为演示版本，所有数据均为 Mock 数据
- AI 功能使用模拟提供商（无需 API Key）
- 支付功能为模拟模式

如有任何问题，欢迎随时联系我。
```

---

## 🆘 常见报错解决

### 1. Build 失败：`Prisma Client not found`

**解决**：在 Vercel 环境变量中添加：
```
PRISMA_GENERATE_DATAPROXY=true
```

或在 `package.json` 中修改：
```json
"build": "prisma generate && next build"
```

### 2. 部署后页面 404

**原因**：动态路由未正确生成
**解决**：确保 `app/api/*/route.ts` 文件存在且导出正确的 HTTP 方法

### 3. 环境变量不生效

**解决**：
- 在 Vercel 项目设置中重新部署
- 确保变量名拼写正确
- 某些变量需要重新部署才能生效

### 4. 图片/字体加载失败

**解决**：检查 `next.config.js` 中的 `images.domains` 配置

---

## 📞 需要帮助？

如果遇到任何部署问题，请：
1. 查看 Vercel 部署日志
2. 检查浏览器控制台错误
3. 联系我提供详细的错误信息

---

**祝部署顺利！🎉**

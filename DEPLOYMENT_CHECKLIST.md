# 全球风能锂电人才搜索雷达 — 上线部署清单 v1.0.0

> 本文件为项目发布到生产环境的完整检查清单。
> 每完成一项，请勾选 `[x]`。

---

## 阶段一：代码清理 ✅

- [x] TypeScript 编译零错误 (`npx tsc --noEmit`)
- [x] 删除所有 `console.log` / `console.error` 调试代码（开发环境除外）
- [x] 删除未使用的 import 语句
- [x] 删除未使用的变量和函数
- [x] 删除重复组件（`demo-guide.tsx` 和 `demo-flow-guide.tsx` 分别保留，非重复）
- [x] 清理注释掉的代码块
- [x] 统一品牌名称（sidebar / layout / manifest 一致）

---

## 阶段二：环境变量 ⚙️

### 基础配置

- [ ] `NEXT_PUBLIC_APP_URL` — 设置为生产域名（如 `https://wle-radar.com`）
- [ ] `NODE_ENV` — 设置为 `production`

### 数据库

- [ ] `DATABASE_URL` — 使用生产 PostgreSQL 连接字符串
- [ ] 确认 `prisma/schema.prisma` 已 migrate 到生产库
- [ ] 执行 `npx prisma migrate deploy`（而非 `db push`）

### 认证

- [ ] `NEXTAUTH_SECRET` — 生成强随机密钥（`openssl rand -base64 32`）
- [ ] `NEXTAUTH_URL` — 设置为生产域名

### AI 服务

- [ ] `AI_FALLBACK_MOCK` — 生产环境设为 `false`
- [ ] `OPENAI_API_KEY` — 填入真实 API Key
- [ ] `ANTHROPIC_API_KEY` — 填入真实 API Key（可选）

### 支付网关

- [ ] `PAYMENT_MODE` — 生产环境设为 `live`
- [ ] `STRIPE_SECRET_KEY` — 填入真实 Key
- [ ] `PADDLE_VENDOR_ID` — 填入真实 ID
- [ ] `ALIPAY_APP_ID` — 填入真实 App ID
- [ ] `WECHAT_PAY_MCH_ID` — 填入真实商户号

### 邮件服务

- [ ] `SMTP_HOST` — 填入 SMTP 服务器地址
- [ ] `SMTP_PORT` — 一般为 587（STARTTLS）或 465（SSL）
- [ ] `SMTP_USER` — 填入发件邮箱
- [ ] `SMTP_PASS` — 填入邮箱密码或授权码

### 安全

- [ ] 确认 `.env` 文件已加入 `.gitignore`，不会提交到 Git
- [ ] 所有 API Key 和 Secret 不在代码中硬编码
- [ ] 演示账号（`admin@demo.com` 等）已删除或密码已更改

---

## 阶段三：数据库 🛢

- [ ] 生产数据库已创建（PostgreSQL ≥ 14）
- [ ] 已执行 `npx prisma migrate deploy` 应用所有迁移
- [ ] 已执行 `npx prisma generate` 生成最新 Client
- [ ] 数据库备份策略已配置（每日自动备份）
- [ ] 数据库连接池配置合理（PostgreSQL 默认 10 连接）
- [ ] 敏感字段（邮箱、电话）已加密存储
- [ ] 审计日志表（`AuditLog`）正常工作

---

## 阶段四：域名和 HTTPS 🌍

- [ ] 域名已注册（建议：`wle-radar.com` 或类似）
- [ ] DNS A 记录已指向服务器 IP
- [ ] DNS CNAME 记录已配置（如 `www.wle-radar.com`）
- [ ] SSL 证书已安装（Let's Encrypt 免费证书）
- [ ] HTTPS 强制跳转（HTTP → HTTPS 301 重定向）
- [ ] HSTS 已启用（`Strict-Transport-Security` header）
- [ ] SSL Labs 测试评分为 A 或以上

### Nginx HTTPS 配置示例

```nginx
server {
    listen 443 ssl http2;
    server_name wle-radar.com www.wle-radar.com;

    ssl_certificate /etc/letsencrypt/live/wle-radar.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wle-radar.com/privkey.pem;

    add_header Strict-Transport-Security "max-age=31536000" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# HTTP → HTTPS 重定向
server {
    listen 80;
    server_name wle-radar.com www.wle-radar.com;
    return 301 https://$host$request_uri;
}
```

---

## 阶段五：隐私政策和用户协议 ⚖️

- [ ] 隐私政策页面已创建（`/privacy`）
- [ ] 用户协议页面已创建（`/terms`）
- [ ] 注册页面显示「我已阅读并同意《用户协议》和《隐私政策》勾选框
- [ ] Cookie 使用说明已添加
- [ ] GDPR 合规（欧盟用户数据导出/删除权利）
- [ ] 数据存储位置说明（如：服务器位于中国/新加坡）
- [ ] 联系人信息已在隐私政策中提供

### 隐私政策最低要求

隐私政策应包含以下章节：

1. **信息收集** — 收集哪些数据、如何收集
2. **信息使用** — 数据用途说明
3. **信息共享** — 是否与第三方共享、共享范围
4. **数据存储** — 存储位置、保留期限
5. **数据安全** — 加密措施、访问控制
6. **用户权利** — 查看、更正、删除数据的途径
7. **Cookie 使用** — Cookie 类型和用途
8. **儿童隐私** — 不向 16 岁以下提供服务
9. **政策更新** — 如何通知用户政策变更
10. **联系方式** — 隐私问题联系邮箱

---

## 阶段六：管理员账号 🔑

- [ ] 生产环境已创建管理员账号（不同于演示账号）
- [ ] 管理员密码为强密码（≥ 12 位，含大小写+数字+符号）
- [ ] 已禁用或删除所有演示账号（`admin@demo.com`、`hr@demo.com` 等）
- [ ] 管理员操作开启二次验证（2FA，推荐）
- [ ] 管理员操作日志（`AuditLog`）正常记录

### 创建生产管理员账号

```bash
# 使用 Prisma Studio 创建
npx prisma studio
# 或直接使用 SQL
psql -U username -d wle_radar -c "
INSERT INTO User (id, email, passwordHash, role, createdAt, updatedAt)
VALUES (
  'admin_prod_001',
  'admin@yourdomain.com',
  '$(openssl passwd -5 "StrongPass123!")',
  'admin',
  NOW(),
  NOW()
);
"
```

---

## 阶段七：Seed 数据 🌱

- [ ] 生产环境 Seed 数据已审核，不含测试/虚假数据
- [ ] 演示数据（如 `data-service.ts` 中的 Mock 候选人）已在生产环境禁用
- [ ] `GET /api/demo/init` 端点已在生产环境禁用或删除
- [ ] 生产环境使用真实数据库，不依赖前端 Mock 数据

### 禁用演示数据初始化接口

在 `app/api/demo/init/route.ts` 开头添加：

```typescript
if (process.env.NODE_ENV === "production") {
  return NextResponse.json(
    { error: "Demo init not available in production" },
    { status: 403 }
  )
}
```

---

## 阶段八：日志和监控 📊

- [ ] 已接入错误监控服务（推荐：Sentry）
- [ ] 已接入性能监控（推荐：Vercel Analytics / DataDog）
- [ ] 已接入访问日志（Nginx access log → 日志服务）
- [ ] 数据库慢查询日志已开启
- [ ] 异常告警已配置（邮件/Slack 通知）
- [ ] 日志保留策略已制定（一般 30-90 天）

### Sentry 配置示例

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://your-sentry-dsn@o12345.ingest.sentry.io/67890",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

---

## 阶段九：备份策略 💾

- [ ] 数据库每日自动备份（推荐：pg_dump + cron）
- [ ] 备份文件加密存储（GPG 加密）
- [ ] 备份文件异地存储（云存储：AWS S3 / 阿里云 OSS）
- [ ] 备份恢复演练已完成（至少每季度一次）
- [ ] 备份保留期限已设定（推荐：30 天每日备份 + 12 个月月末备份）
- [ ] 上传文件备份（如用户头像、简历附件 — 如有）

### 数据库备份脚本示例

```bash
#!/bin/bash
# /opt/backups/backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/postgres"
FILENAME="wle_radar_$DATE.sql.gz"

mkdir -p $BACKUP_DIR

pg_dump -U $PGUSER -h $PGHOST $PGDB | gzip > $BACKUP_DIR/$FILENAME

# 删除 30 天前的备份
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# 上传到云存储（可选）
# aws s3 cp $BACKUP_DIR/$FILENAME s3://your-bucket/backups/
```

```bash
# 添加到 crontab（每日凌晨 2 点备份）
0 2 * * * /opt/backups/backup-db.sh >> /var/log/backup.log 2>&1
```

---

## 阶段十：性能优化 ⚡

- [ ] 已执行 `npm run build` 并确认无构建错误
- [ ] 已启用 Next.js 内置缓存（`fetch` 请求自动缓存）
- [ ] 数据库索引已优化（针对常用查询字段）
- [ ] 静态资源已配置 CDN（推荐：Vercel Edge / Cloudflare）
- [ ] 图片已优化（使用 Next.js `next/image` 组件）
- [ ] 已执行 Lighthouse 性能测试（评分 ≥ 80）

---

## 阶段十一：最后检查 ✅

### 构建检查

```bash
npm run build 2>&1 | tee build.log
# 确认无 ERROR 级别输出
```

### 运行时检查

```bash
npm run start -- -p 3000 &
sleep 5

# 检查关键页面
curl -s http://localhost:3000 | head -20     # 首页
curl -s http://localhost:3000/login          # 登录页
curl -s http://localhost:3000/dashboard     # 仪表盘（需认证）

# 检查 API
curl -s http://localhost:3000/api/health   # 健康检查（如有）
```

### 浏览器检查

- [ ] 在 Chrome 中测试（桌面 + 移动端模拟）
- [ ] 在 Safari 中测试（桌面 + iOS）
- [ ] 在 Firefox 中测试
- [ ] 在 Edge 中测试
- [ ] 测试 PWA 安装流程（Chrome → 安装应用）
- [ ] 测试离线页面（`/offline.html`）

---

## 阶段十二：回滚计划 🔄

如果上线后出现问题，需快速回滚：

- [ ] 保留上一版本构建产物（`/.next/versions/`）
- [ ] 数据库迁移脚本包含 `down` 迁移（回滚脚本）
- [ ] 记录回滚步骤文档
- [ ] 准备快速切换 DNS 到旧版本的方案

### 回滚步骤

```bash
# 1. 回滚代码
git checkout v0.9.0  # 或上一个稳定版本

# 2. 回滚数据库迁移
npx prisma migrate resolve --applied "202xxxxx_add_new_table"
npx prisma migrate deploy

# 3. 重新构建和启动
npm run build
pm2 restart wle-radar

# 4. 验证
curl -s http://localhost:3000 | grep "全球风能锂电"
```

---

## 上线后监控（前 48 小时）👀

- [ ] 每 2 小时检查一次错误日志
- [ ] 监控服务器 CPU / 内存使用率
- [ ] 监控数据库连接池使用情况
- [ ] 检查关键页面加载时间（Real User Monitoring）
- [ ] 确认支付流程正常（测试订单）
- [ ] 确认邮件发送正常（测试邮件）
- [ ] 确认 AI 功能正常（测试评估接口）

---

## 发布通告模板 ✉️

上线后，可向内部团队或早期用户发送通告：

**主题**：「全球风能锂电人才搜索雷达」v1.0.0 正式上线

**正文**：

> 尊敬的用户/同事：
>
> 「全球风能锂电人才搜索雷达」v1.0.0 已于 [日期] 正式上线。
>
> **新版本包含：**
> - 完整招聘流程管理（搜索→邀请→面试→评估→谈判→Offer）
> - AI 智能助手（简历评估、面试问题、薪酬分析）
> - SaaS 订阅管理（6 种套餐）
> - 运营数据分析（用户增长、招聘转化、商业收入）
> - 产品演示和融资路演页面
>
> **访问地址**：https://wle-radar.com
>
> **演示账号**：[如有保留，填写此处；否则删除本行]
>
> 如有任何问题，请联系：support@wle-radar.com
>
> — 全球风能锂电人才搜索雷达 团队

---

## 版本记录

| 版本 | 日期 | 检查人 | 状态 |
|------|------|--------|------|
| v1.0.0 | 2026-05-30 | 待填写 | 准备中 |

---

*本清单由 AI 助手在 v1.0.0 发布准备阶段自动生成。*

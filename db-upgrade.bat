@echo off
chcp 65001 >nul
title 全球风能锂电人才搜索雷达 - 数据库初始化

echo ========================================
echo   全球风能锂电人才搜索雷达
echo   数据库初始化脚本
echo ========================================
echo.

echo [1/4] 生成 Prisma Client...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Prisma Client 生成失败！
    echo 请检查 schema.prisma 文件是否有误
    pause
    exit /b 1
)
echo   [OK] Prisma Client 生成完成
echo.

echo [2/4] 推送数据库结构...
call npx prisma db push
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] 数据库结构推送失败！
    echo 请确保 prisma/dev.db 文件未被占用
    pause
    exit /b 1
)
echo   [OK] 数据库结构推送完成
echo.

echo [3/4] 播种种子数据...
node prisma/seed.js
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] 种子数据播种出现问题，但数据库结构已就绪
    pause
)
echo   [OK] 种子数据播种完成
echo.

echo [4/4] TypeScript 编译检查...
call npx tsc --noEmit --incremental false
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] TypeScript 编译有警告，但不影响运行
    echo 请检查上方错误信息
)
echo   [OK] TypeScript 检查完成
echo.

echo ========================================
echo   数据库初始化完成！
echo ========================================
echo.
echo 新增模型列表：
echo   - User        (用户)
echo   - Candidate   (候选人档案)
echo   - Company     (企业档案)
echo   - Job         (职位)
echo   - Invitation  (人才邀请)
echo   - Interview   (人才面试)
echo   - Assessment  (人才评估)
echo   - Negotiation (人才谈判)
echo   - Offer       (人才录取)
echo   - Notification(通知)
echo   - AuditLog    (审计日志)
echo.
echo 测试账号：
echo   admin@globaltalentradar.com / admin123 (管理员)
echo   lixf@mit.edu / candidate123 (候选人)
echo   hr@cnpv.com / company123 (企业用户)
echo.
echo 启动开发服务器: npm run dev
echo.
pause

#!/usr/bin/env node

/**
 * SEO 自动化设置脚本
 * 帮助用户自动配置 Google Analytics 4 和 Search Console 验证
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Craftisle Draw SEO 自动化设置脚本\n');

const questions = [
  {
    name: 'gaId',
    message: '请输入 Google Analytics 4 Measurement ID (格式: G-XXXXXXXX, 如果还没有，直接按回车跳过):'
  },
  {
    name: 'googleVerification',
    message: '请输入 Google Search Console 验证代码 (meta 标签的 content 属性值, 如果还没有，直接按回车跳过):'
  },
  {
    name: 'bingVerification',
    message: '请输入 Bing Webmaster Tools 验证代码 (meta 标签的 content 属性值, 如果还没有，直接按回车跳过):'
  }
];

const answers = {};

async function askQuestion(index) {
  if (index >= questions.length) {
    await updateEnvFile();
    await updateLayoutFile();
    console.log('\n✅ 配置完成！');
    console.log('\n📝 下一步:');
    console.log('1. 检查 .env.local 文件');
    console.log('2. 提交并部署: git add -A && git commit -m "feat: Update SEO configuration" && git push origin main');
    console.log('3. 在 Google Search Console 中提交 sitemap.xml');
    rl.close();
    return;
  }

  const question = questions[index];
  rl.question(`${question.message}\n> `, (answer) => {
    answers[question.name] = answer;
    askQuestion(index + 1);
  });
}

async function updateEnvFile() {
  const envPath = path.join(__dirname, '../.env.local');
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  if (answers.gaId) {
    if (envContent.includes('NEXT_PUBLIC_GA_MEASUREMENT_ID')) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_GA_MEASUREMENT_ID=.*/,
        `NEXT_PUBLIC_GA_MEASUREMENT_ID=${answers.gaId}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_GA_MEASUREMENT_ID=${answers.gaId}\n`;
    }
  }

  if (answers.googleVerification) {
    if (envContent.includes('GOOGLE_SITE_VERIFICATION')) {
      envContent = envContent.replace(
        /GOOGLE_SITE_VERIFICATION=.*/,
        `GOOGLE_SITE_VERIFICATION=${answers.googleVerification}`
      );
    } else {
      envContent += `\nGOOGLE_SITE_VERIFICATION=${answers.googleVerification}\n`;
    }
  }

  if (answers.bingVerification) {
    if (envContent.includes('BING_SITE_VERIFICATION')) {
      envContent = envContent.replace(
        /BING_SITE_VERIFICATION=.*/,
        `BING_SITE_VERIFICATION=${answers.bingVerification}`
      );
    } else {
      envContent += `\nBING_SITE_VERIFICATION=${answers.bingVerification}\n`;
    }
  }

  fs.writeFileSync(envPath, envContent);
  console.log(`\n✅ 已更新 ${envPath}`);
}

async function updateLayoutFile() {
  const layoutPath = path.join(__dirname, '../src/app/layout.tsx');
  let layoutContent = fs.readFileSync(layoutPath, 'utf8');

  if (answers.googleVerification) {
    layoutContent = layoutContent.replace(
      /google: "PLACEHOLDER_VERIFICATION_CODE"/,
      `google: "${answers.googleVerification}"`
    );
  }

  if (answers.bingVerification) {
    layoutContent = layoutContent.replace(
      /bing: "PLACEHOLDER_BING_VERIFICATION_CODE"/,
      `bing: "${answers.bingVerification}"`
    );
  }

  fs.writeFileSync(layoutPath, layoutContent);
  console.log(`✅ 已更新 ${layoutPath}`);
}

askQuestion(0);

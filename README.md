# Aprivity Lisan

Aprivity Lisan 是一个面向离散数学期末复习的刷题平台，使用 Next.js 15、TypeScript、Tailwind CSS 和 App Router 构建。

线上域名：<https://lisan.aprivity.xyz>

## 功能

- 章节练习：按集合、关系、函数与映射、命题逻辑、谓词逻辑、量词逻辑、组合数学、图论、树、代数结构等章节刷题。
- 多题型支持：判断题、单选题、简答题。
- 知识点页面：按章节展示复习内容和题目入口。
- 模拟考试：支持按知识点、题型数量、总题数和考试时长自定义组卷。
- 考试恢复：试卷、答案和倒计时使用 `localStorage` 保存，刷新或重新打开页面后可继续考试。
- 考试结果：提交后展示总题数、已作答、自动判分题数、正确率、用时、答案和解析。
- 学习统计：记录每次答题行为，展示总刷题数、正确率、错题数、连续学习天数和章节掌握情况。
- 错题本：汇总练习和模拟考试中答错的客观题。
- Mock 登录：使用本地 `localStorage` 保存用户和当前登录状态。
- 主题适配：支持奶油白白天模式和深色模式。

## 技术栈

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- App Router
- localStorage 本地数据持久化

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

指定 3004 端口启动：

```bash
npm run dev -- -p 3004
```

打开：

```text
http://localhost:3004
```

## 构建

```bash
npm run build
```

生产启动：

```bash
npm run start
```

代码检查：

```bash
npm run lint
```

## 数据说明

当前第一版不接数据库，核心数据保存在浏览器 `localStorage` 中：

- `lisan_users`：mock 用户列表
- `lisan_current_user`：当前登录用户
- `lisan_study_records`：学习答题记录
- `lisan_exam_papers`：模拟考试试卷、答案、状态和结果

未登录时会使用 `guest` 作为本地用户 id。不同登录用户的数据会按 `userId` 隔离。

## 目录结构

```text
app/
  exam/             模拟考试页面和试卷详情页
  practice/         章节练习和知识点页面
  stats/            学习统计页面
  mistakes/         错题本页面
components/
  exam/             模拟考试相关组件
  stats/            统计展示组件
data/
  questions.ts      题库数据
  knowledge.ts      知识点数据
lib/
  auth.ts           mock 登录注册逻辑
  study-records.ts  学习记录 localStorage 封装
  exam-generator.ts 模拟考试抽题逻辑
  exam-storage.ts   试卷 localStorage 封装
types/
  user.ts           用户类型
  study.ts          学习记录类型
  exam.ts           试卷类型
```

## 后续计划

- 接入 Supabase 或后端数据库，迁移用户、学习记录和试卷数据。
- 为简答题增加自评或半自动评分流程。
- 增强错题复习计划和按章节筛选。
- 增加更完整的考试成绩趋势分析。


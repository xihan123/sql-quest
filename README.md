![sql-quest](https://socialify.git.ci/xihan123/sql-quest/image?description=1&language=1&name=1&owner=1&pattern=Solid&theme=Auto)

![React](https://img.shields.io/badge/React-19-149ECA.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg)
![SQLite](https://img.shields.io/badge/SQLite-WASM-003B57.svg)
![Node.js](https://img.shields.io/badge/Node.js-24-5FA04E.svg)

# SQL Quest

一个在浏览器里练习 SQL 的小站，用 React 和 TypeScript 编写。读题、看数据、写查询，点击「运行」就能检查答案。SQL 由 SQLite WASM 在本地执行，草稿和学习记录也保存在当前浏览器，不需要账号。

## 功能

- 图书、商品、校园选课三个主题，从选列和筛选开始，逐步练习排序、聚合与关联查询
- SQL 编辑器支持高亮、关键字和表字段补全，可用 `Ctrl+Space` 或「补全」按钮打开候选
- 按查询结果判题，不要求 SQL 和参考答案写得一样；全部用例通过后自动记录
- 三层提示和参考答案，部分关卡提供教学流程图和 SQL 卡片拼图
- 按关卡版本保存草稿、通过状态和复习标记，支持分卷备份与导入
- 桌面三栏布局，手机可切换题目、数据、SQL 和结果

当前课程共 60 关：

| 主题     | 章节 | 关卡 |
| -------- | ---- | ---- |
| 图书目录 | 6    | 23   |
| 商品目录 | 6    | 24   |
| 校园选课 | 6    | 13   |

课程目录由 `content/course.json` 管理，新增主题或关卡只需更新 JSON，不用修改页面代码。

## 本地运行

需要 Node.js 24 和 npm。在仓库目录执行：

```sh
npm ci
npm run dev
```

打开终端显示的本地地址即可。启动时会检查课程内容，并生成到 `public/content/`。

## 使用说明

### 做题

1. 选择主题和关卡，阅读题目及输出要求
2. 在「数据」中查看表结构和示例数据
3. 编写 SQL，点击「运行」检查全部用例
4. 结果不符时对照实际与参考结果，需要帮助再展开提示

只支持 SQLite 的单条只读查询，不能修改表或数据。先修关卡是学习建议，可以跳关或重复练习。

查看答案不会改动草稿，点击「填入答案」才会确认替换。「恢复默认」直接恢复当前文本 SQL 的起始模板，可以撤销，不清除通过记录或其他草稿。

### 流程图与拼图

提供辅助内容的关卡会显示对应入口。教学流程图讲解一条固定示例，不是你当前 SQL 的真实执行计划。

拼图可以拖拽，也可以用添加、前移、后移和移除按钮调整。预览显示实际拼出的 SQL，运行时仍按查询结果判题。文本和拼图各自保存草稿，切换不会互相覆盖。

### 备份学习记录

在「学习记录」中选择备份、导入或清除。备份包含历史版本和本页未保存的合法草稿；每卷 JSON 最多 5 MiB，导入时一次选齐整组文件。

导入会替换现有记录，先预览、再确认。取消不会改动数据；有重要草稿时建议先导出。

记录属于当前站点来源，换域名、协议或端口后不会自动迁移。浏览器清理站点数据也会删除记录，不要只依赖自动保存。

## 构建与预览

```sh
npm run build
npm run preview
```

构建输出在 `dist/`，可交给静态托管服务。应用支持子路径部署，具体配置见[维护说明](docs/development.md#部署与内容更新)。这些命令只处理本地文件，不会上传或部署。

仓库提供 GitHub Pages 工作流，推送到 `master` 或在 Actions 中手动运行 `Publish GitHub Pages` 后，会检查并构建静态站点，发布到 `gh-pages`。首次运行成功后，在仓库 **Settings → Pages** 中选择 **Deploy from a branch**，分支设为 `gh-pages`、目录设为 `/(root)`。发布与历史资源规则见[维护说明](docs/development.md#github-pages-工作流)。

课程入口默认为 `./content/course.json`。如需改用内容 API，可通过 `VITE_CONTENT_ROOT_URL` 指定同源根地址；API 只返回课程 JSON，不接收 SQL 或学习记录。

## 开发

| 命令                     | 用途                             |
| ------------------------ | -------------------------------- |
| `npm run typecheck`      | TypeScript 类型检查              |
| `npm run lint`           | ESLint 检查                      |
| `npm run format:check`   | Prettier 格式检查                |
| `npm test`               | 内容、引擎客户端和记录等单元测试 |
| `npm run test:browser`   | Chromium 中的 WASM 和交互测试    |
| `npm run content:build`  | 检查并生成本地课程文件           |
| `npm run generate`       | 从 Schema 生成类型和校验器       |
| `npm run generate:check` | 检查生成文件是否与 Schema 一致   |

浏览器测试需要 Playwright 对应的 Chromium，缺少时运行 `npx playwright install chromium`。

```text
content/        课程目录、关卡和数据夹具
schemas/        JSON 契约
src/
  app/          练习页面
  components/   编辑器、表格、流程图和拼图
  content/      内容获取、校验和夹具编译
  engine/       SQLite Worker 与结果比较
  storage/      学习记录和备份
scripts/        契约生成与本地内容发布准备
tests/          单元测试和浏览器测试
```

- [维护说明](docs/development.md)：内容版本、部署配置、模块职责和测试范围
- [项目设计](docs/design.md)：产品范围、数据契约和判题规则
- [开发约定](AGENTS.md)：代码、界面和数据保护要求
- [关卡制作 Skill](skills/sql-course-author/SKILL.md)：新增或审核教学内容

## 常见问题

### 修改课程 JSON 后没有变化？

修改 `content/` 中的源文件，按版本规则更新后运行 `npm run content:build`，再刷新页面。不要直接编辑 `public/content/`。正在打开的页面使用固定课程快照，不会自动切换到新版。

### 查询结果看起来正确，为什么没通过？

「运行」检查的是全部用例，不只是数据区的预览。还要核对列名、列顺序、重复次数，以及题目要求的排序和 NULL 处理。页面最多展示 100 行，判题比较完整结果。

### 能离线使用吗？

课程和引擎资源加载完成后，练习不再请求内容 API。但项目没有 Service Worker，不能保证首次离线打开或离线刷新可用。

### 自动保存失败怎么办？

页面会保留本次打开期间的多关草稿，先导出再处理存储错误或多标签页冲突。存储无法读取时，导出仅包含本页保留的记录，界面会注明它不是完整备份。关闭页面前的最后一次编辑不一定已保存。

## 致谢

- [React](https://react.dev/) 和 [Vite](https://vite.dev/)
- [CodeMirror](https://codemirror.net/)：SQL 编辑与补全
- [SQLite WASM](https://sqlite.org/wasm/)：浏览器内执行 SQL
- [Ajv](https://ajv.js.org/)：JSON Schema 校验
- [Noto Sans SC](https://fonts.google.com/noto/specimen/Noto+Sans+SC) 和 [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono)：界面与代码字体，许可证保留在 `public/fonts/`

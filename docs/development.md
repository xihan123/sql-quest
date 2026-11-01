# SQL Quest 维护说明

运行与练习方法见 [README](../README.md)，产品规则见[项目设计](design.md)。本文说明现有实现和维护操作，JSON 字段仍以 `schemas/contracts.schema.json` 为准。

## 常用命令

在仓库根目录执行，使用 Node.js 24 和 npm。

| 命令                                    | 用途                                                       |
| --------------------------------------- | ---------------------------------------------------------- |
| `npm ci`                                | 按 `package-lock.json` 安装依赖                            |
| `npm run dev`                           | 生成本地内容后启动 Vite                                    |
| `npm run generate`                      | 生成类型与 Ajv standalone 校验器                           |
| `npm run generate:check`                | 在内存中重新生成并核对，不写文件                           |
| `npm run content:build`                 | 校验结构与语义，生成版本资源并原子替换本地根               |
| `npm run content:build -- dist/content` | 向已有本地生产副本生成内容，保留并检查历史版本，不构建前端 |
| `npm run typecheck`                     | 检查应用、脚本、测试和工具配置的类型                       |
| `npm test`                              | 单元测试，禁用从字符串生成 JavaScript                      |
| `npm run test:browser`                  | 真实 Chromium 中的 WASM、Worker 和交互测试                 |
| `npm run lint`                          | ESLint，含类型断言、eval 和 new Function 的限制            |
| `npm run format:check`                  | 检查维护文件格式                                           |
| `npm run format`                        | 格式化维护文件；设计、AGENTS、Skill 和生成文件在忽略列表中 |
| `npm run build`                         | 核对生成文件、类型检查、生成本地内容并构建到 `dist/`       |
| `npm run preview`                       | 本机预览 `dist/`                                           |

## 修改课程内容

唯一入口是 `content/course.json`。主题、章节、关卡顺序、知识点和数据引用都在根配置中登记；`path: null` 表示未开放，未登记文件不会发布。

```text
content/
  course.json
  themes/
    library/
      first-query/
        book-list.json
        ...
      fixtures/
        library-basic-v1.json
        ...
    products/
      ...
    campus/
      ...
```

关卡路径为 `themes/<主题 ID>/<章节 ID>/<关卡 ID>.json`。主题下的 `fixtures/` 存放跨章节共用的数据，关卡不另存表结构或预览行。

1. 修改源 JSON，新增关卡时在根配置登记
2. 按题意和数据独立核对预期结果，再执行参考解法和典型错误
3. 更新版本，运行相关内容检查
4. 执行 `npm run content:build`，刷新页面读取新快照

内容审核复用 `tests/content.test.ts` 和 `tests/browser/content.spec.ts`，检查结构、引用、参考解法、可执行错误解法、教学示例和参考拼法。生成器只检查结构与语义，不代替 SQL 执行及人工教学审核；不能用参考 SQL 同时生成预期结果并证明其正确。

### 版本规则

- 当前课程 ID 为 `sql-quest-v1`，初始根及 60 个开放关卡的 revision 均为 1，夹具各自使用 v1。它不继承旧 `sql-quest` 的学习状态；旧记录仍保留并可导出。
- 后续更新保持 courseId、themeId、lessonId 稳定。改名或换路径不是新身份。
- 根清单或引用内容变化时递增根 revision；关卡正文变化时递增关卡 revision；已发布共享夹具变化时使用新夹具 ID。
- 资源生成到 `public/content/releases/r<根 revision>/`，保留源目录结构。生成器只复制登记文档，为非空路径添加该版本前缀。
- 每版 `_root.json` 保存发布根用于不可变检查，不是客户端自动发现入口。重复生成同一版本必须内容一致，失败不改现有根；生成器拒绝覆盖较新的根。
- 不直接编辑生成文件，也不删除旧版本来绕过检查。回滚应切换完整旧根及对应资源，不混用版本。

## 部署与内容更新

### 完整构建

本地发布准备：

```sh
npm run generate:check
npm run typecheck
npm run lint
npm run format:check
npm test
npm run test:browser
npm run build
npm run preview -- --base=/sql-quest/ --port=4177 --strictPort
```

最后一条在 `http://127.0.0.1:4177/sql-quest/` 预览生产目录。命令只处理本地文件，上传和部署由托管方完成；项目不提供发布后台或上传脚本。

Vite 使用相对资产路径。`VITE_CONTENT_ROOT_URL` 默认是 `./content/course.json`，相对于应用部署基路径解析；部署到 `/sql-quest/` 时读取 `/sql-quest/content/course.json`。也可指定同源 `/api/sql-quest/course.json`，API 直接返回相同 JSON，不包 `{ code, data }`，路径不要求与 ID 同名。

托管服务需要配置：

| 项目         | 要求                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------- |
| 协议与 MIME  | 生产使用 HTTPS，正确返回 JS、WASM 和字体媒体类型                                         |
| 根缓存       | 重验证缓存，例如 `Cache-Control: no-cache` 配合 ETag                                     |
| 版本资源缓存 | 长期 immutable 缓存，发布后的地址不再改写                                                |
| 更新顺序     | 先上传并核对版本资源，最后原子更新根，保留旧资源                                         |
| CSP 脚本     | SQLite WASM 需要 `script-src 'self' 'wasm-unsafe-eval'`，不需要 JavaScript `unsafe-eval` |
| CSP 样式     | CodeMirror 使用动态样式，需相应 `style-src` 授权；本地验收采用 `'self' 'unsafe-inline'`  |
| 字体         | 本地文件，不内联为 data URL，可用 `font-src 'self'`，许可证随构建复制                    |

一页会话固定一份完整课程快照，刷新或重新打开才加载新版。没有持久内容缓存或 Service Worker，课程和引擎都加载完成后才能离线执行，不能保证首次离线打开。

### GitHub Pages 工作流

`.github/workflows/pages.yml` 在推送到 `master` 时运行，也可在 Actions 中选择 `master` 手动运行 `Publish GitHub Pages`。流程使用 Node.js 24 和锁文件安装依赖，执行 ESLint、单元测试、内容及生产子路径浏览器测试，再通过 `npm run build` 生成静态站点；任一检查失败都不会发布。

工作流使用仓库自带的 `GITHUB_TOKEN`，只授予仓库内容写入权限，不需要个人访问令牌。首次运行成功后，在仓库 **Settings → Pages** 中将 Source 设为 **Deploy from a branch**，选择 `gh-pages` 分支和 `/(root)` 目录。工作流将 `dist/` 发布为该分支的完整站点，并生成 `.nojekyll`；Pages 从该提交部署，不能将 Source 设为 GitHub Actions。

每次构建先从已有 `gh-pages` 恢复 `content/`，交给现有生成器检查根、关卡和夹具版本。发布保留旧版本 JSON 和旧哈希资产，避免干净构建丢失历史资源，也让打开的旧页面仍能加载原 Worker、WASM 和字体。远端读取、历史恢复或不可变检查失败都会中止，不回退为空历史；不要删除 `gh-pages` 来绕过检查。迁移已有站点时，应先把已发布的完整 `content/` 放入该分支。

Vite 的相对资产路径和默认内容入口无需为仓库名另行配置，可用于项目子路径或自定义域名。Pages 的缓存头及 CSP 由平台控制，本工作流不能自定义；需要严格控制这些响应头时应选择支持该配置的静态托管服务。这里只配置自动发布，执行本地构建命令仍不会上传。

### 只更新课程

审核源内容并更新版本后，对**保留旧发布目录的本地生产副本**执行：

```sh
npm run content:build -- dist/content
```

该命令不构建 JS，也不改变已打开页面的课程快照。不要为内容单独更新运行 `npm run build`，它会重新生成生产目录。空目录中生成成功不代表检查过远端历史，部署时仍需遵守资源先于根的更新顺序。

初始本地包只有新课程的 `releases/r1/`。如果旧课程已经上线，新课程应使用新的部署路径，避免复用旧 r1 的缓存。

## 内容加载

| 模块                       | 职责                                                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/content/http.ts`      | GET、JSON Accept、不带 Cookie、拒绝重定向；先限时限量读取，再解码                                     |
| `src/content/urls.ts`      | 检查同源、HTTPS（本机 HTTP 除外）、路径、目录边界、重复地址、根自身引用和发布前缀；开发预览也不豁免   |
| `src/content/semantics.ts` | 检查 ID、身份、先修、概念引入、登记、预览用例、可读表兼容、预期和预算；教学辅助另查引用、环与词法边界 |
| `src/content/loader.ts`    | 全部校验后启用深冻结快照；失败取消其余请求，重试、取消或销毁使旧响应失效；不操作学习记录              |
| `src/content/fixture.ts`   | 将校验后的 JSON 编译为初始化 SQL，供内容审核与 Worker 共用                                            |

网络预算：每个请求含正文读取 10 秒，完整加载 60 秒，并发最多 4。根和关卡各 1 MiB，单夹具 2 MiB，总正文 32 MiB；按实际解压流字节计量，不只看 Content-Length。非空地址缺失或内容错误会使整套加载失败，不跳过坏文件；错误页仍可通过独立存储层导出记录。

夹具编译检查精确类型、NULL、数值下界、单列主键、同类型外键和索引。新库先建全部表再装入数据，延迟外键在事务提交时检查。字符串按数据编码并转义，NUL 用 UTF-8 十六进制 TEXT 表达；夹具最多 5,000 行，初始化 SQL 最多 1 MiB。

Schema 是唯一机器契约。生成器不联网解析引用；运行时使用生成的 ESM 校验器，不编译 Schema、不转换输入类型、不补默认值、不删除未知字段。生产代码通过 Fetch 获取内容，不将课程全集打进 JS。标题仅用于显示，不参与身份校验。

## SQL 执行与判题

生产依赖锁定 `@sqlite.org/sqlite-wasm@3.54.1-build1`。每个请求创建模块 Worker，每个用例重建并关闭 `:memory:` 数据库；禁用 OPFS、KV 持久化 VFS，不使用 SQLite 自带的另一套 Worker 消息 API。

- `src/engine/sqlite.ts` 使用 `sqlite3_prepare_v3` 完整处理 SQL 尾部，执行前确认只有一个查询。授权回调仅放行 SELECT、递归查询、当前可读表和显式纯计算函数；另查 readonly，拒绝 EXPLAIN、未绑定参数、虚表、写入、DDL、事务、PRAGMA、ATTACH、扩展及文件或宿主函数。
- `src/engine/compare.ts` 比较完整列名、列顺序和结果。无序行保留重复次数；指定数值列的容差采用一一匹配，不贪心配对。NULL、空串、文本 NULL、数字和数字文本分别处理。
- `src/engine/protocol.ts` 复用正式 Schema，校验身份、夹具的精确闭包、可读表和预算。内部 `run` 只带预览夹具，`submit` 带全部用例夹具；界面的「运行」调用 `submit`，不发送课程全集、内容 URL 或记录元数据。
- `src/engine/client.ts` 提供 `createExecutionRequest`、`ExecutionClient.start`、`getState`、`subscribe`、`cancel` 和 `dispose`。15 秒准备期限从创建 Worker 前开始；收到有效 `ready` 后按顺序派发 `run-case`，每个用例独立限时 3 秒，包含建库、执行、读取、比较和清理。接收响应时再次检查单调时钟，取消或超时直接终止 Worker，下次重建。

调用方从已校验 `ContentSnapshot` 创建不可变请求。客户端另行捕获记录代次，核对 Worker 实例、完整请求身份、阶段和用例顺序；旧消息、迟到和重复消息不推进状态，也不改变当前定时器。切题、切主题和确认记录冲突处理时取消旧执行，代次失效也会取消在途请求，销毁时调用 `dispose()`。

全部用例通过才返回 `passed` 并记录；内部预览返回 `executed`，不记录通过。通过时保留预览用例的真实输出，失败时显示不符用例，不用最后一个用例替代预览。执行中继续编辑不改变 SQL 请求快照，通过只更新通过字段，不覆盖新草稿。`recordGeneration: null` 表示元数据不可用，仍可练习，但不能据此保存通过记录。

SQL 最多 20,000 字符，结果最多 1,000 行、100 列，单值或行最多 1 MiB，单用例文本结果合计 4 MiB。超限直接失败，不截断后判通过；UI 只展示前 100 行。int64 先用 BigInt 核对安全范围再转 Number；拒绝 BLOB、非有限值和无效 UTF-8，保留文本 NUL。资源预算和 Worker 终止不能保证任意查询都不耗尽内存。

## 编辑器与教学辅助

CodeMirror 的 SQLite 补全只使用只读关键字，以及当前 `readableTables` 对应的预览夹具结构。表、字段、类型和说明不从答案或数据行提取，也不请求 API。支持单表、常规 JOIN、有或无 AS 的别名和光标后的表引用；同名字段插入可消歧前缀，标识符中间接受候选会替换完整后缀，必要时引用标识符。不推断子查询、CTE 或复合查询等不可靠作用域的字段。

前缀和点号可触发候选，也可用 Ctrl+Space 或按钮。上下键选择、Enter 接受、Escape 关闭，支持触屏；Tab / Shift+Tab 保持焦点导航。字符串、注释和组合输入期间抑制补全，编辑、替换、切题、记录重置或销毁会使旧候选失效。一次接受可独立撤销，不自动执行 SQL。手机标签支持方向键及 Home / End，确认弹窗支持 Escape 和焦点返回。

教学流程图讲解固定示例，使用应用组件渲染，并提供文字替代。拼图首次排列为空，共享 `joinPuzzle` 按所选顺序以一个 ASCII 空格连接原始片段，预览与执行使用同一 SQL。按钮和拖拽均可调整排列，保留最近 100 步撤销；清空、填入参考拼法和填入编辑器先确认。

文本与拼图草稿及撤销互不覆盖，切换关闭补全和旧拖拽，切题或确认记录替换销毁旧操作上下文。拼图使用相同 Worker 和结果比较，不按参考排列判题。恢复时只核对精确 revision；配置缺失、未知卡片或 SQL 快照不一致时退回文本入口，原排列与 SQL 保留供查看和导出，不执行历史快照。

## 学习记录

`src/storage/database.ts` 使用 IndexedDB 数据库 `sql-quest-learning`。数据库版本 2 新增隔离导入临时区，保留版本 1 的记录与计数器。记录按 courseId / themeId / lessonId / revision 分槽，不保存查询结果或练习数据库。

### 保存与冲突

- 每个写入任务捕获记录代次，事务内同时核对代次与记录集版本。普通保存只合并变更字段，通过状态不回退。
- `src/storage/session.ts` 保留本页多关修改，防抖后串行保存。保存失败或跨页冲突暂停覆盖；广播用于及时提示，漏掉广播仍由事务检查拦截。
- 元数据不可读时允许练习，不伪造代次或保存成功。恢复存储后先读取已有记录并处理冲突，不把旧任务自动绑定到新代次。
- 冲突处理先读取已存快照，再逐字段选择本页或已存内容，确认合并或舍弃。拼图排列与 SQL 快照一起选择；预览后任一页面发生变化会中止操作。
- 历史版本包含未保存草稿，可查看并确认复制，原槽保留。查看答案不改 SQL，填入答案或历史草稿先确认；恢复默认只重置当前文本模板，可撤销，不清除其他学习状态。

### 备份与替换

导出使用正式 `BackupPart` 格式，固定快照，每卷最多 5 MiB，包含历史版本、未知课程和本页合法修改。冲突字段先选择；存储不可读时仅提供标明范围的本页记录导出，不称为完整备份。关闭导出窗口回收对象 URL。

导入一次选择整组 JSON，总量可以超过 5 MiB。先检查大小与总量，再逐卷严格解码、Schema 校验，核对共同元数据、连续卷号和重复版本槽。校验结果写入隔离临时区，不合并为无界数组，也不修改正式记录版本；备份 SQL 只作为数据恢复，不执行。

整组校验后预览替换范围，确认前不取消练习。导入与清除共用流程：暂停交互，取消防抖和 Worker，使旧回调失效，等待已开始的保存结束；然后在一个事务中核对预览计数器、替换全部记录并递增代次。成功后才清理旧草稿，失败保留正式数据和本页修改，不重放旧队列。临时区通过游标复制，容量不足会整笔回滚，不部分恢复。

取消、失败或完成后清理本次临时区。异常关页残留区不会自动启用，下次导入时清理超过 24 小时的临时数据；过期或预览后发生其他写入需要重新预览。

记录按站点来源保存，换域名、协议或端口需手动备份迁移。浏览器可能回收数据，离页提示也不能保证最后一次编辑在关页前落盘。

## 测试范围

浏览器测试使用 Playwright Chromium，缺少时运行 `npx playwright install chromium`。测试占用 4175、4176 端口，使用独立上下文，不读取或清除日常浏览器的记录。

- 引擎验收使用 `src/engine/worker.ts` 和真实 SQLite WASM；客户端单元测试的假传输只验证消息与定时器。测试端点、能力探针及夹具审核 Worker 位于 `tests/browser/`，不进入应用构建。
- 引擎测试入口另打包到 `test-results/engine-build/`，检查部署子路径及不含 JavaScript `unsafe-eval` 的 CSP。
- 生产 SPA 使用同一 Vite 配置生成 `test-results/release-build/`，在本机 4176 端口的 `/sql-quest/` 预览。逐关运行后，仅更新副本 JSON，检查新主题加载、旧会话快照固定、前端资产 SHA-256 不变，以及 Worker、WASM、字体和许可证的同源路径。合成主题只存在于临时目录。

截图、隔离构建和其他测试产物在忽略目录 `test-results/`，生产构建在 `dist/`。字体 Noto Sans SC 与 IBM Plex Mono 的许可证位于 `public/fonts/`，随生产构建复制。

自动检查不能替代真实中文输入法、移动软键盘、读屏或低端设备体验，也不能验证托管方的 HTTPS、缓存头和原子更新配置。题意、难度和提示是否合适仍需人工审核。

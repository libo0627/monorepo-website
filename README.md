<<<<<<< HEAD

# Monorepo Demo

Vue 3 + Express 5 全栈 Monorepo，用 pnpm workspace + turbo 编排。

## 技术栈

- **前端**：Vue 3.5 + Vite 8 + TypeScript
- **后端**：Express 5 + TypeScript，使用 pino / helmet / cors
- **契约**：`@mono/shared` 里的 zod schema，前后端共用一份定义，零代码生成
- **测试**：vitest 4（前后端共用一套）
- **构建**：turbo 2（任务编排 + 远程缓存）+ tsup（后端打包）
- **规范**：ESLint flat config + Prettier + commitlint + husky + lint-staged

## 目录结构

```
apps/
  web/          Vue3 + Vite 前端
  server/       Express 5 + tsup 后端
packages/
  shared/       前后端共享的 zod schema、类型、常量
  config/       共享 tsconfig（base / node / web）
deploy/
  Dockerfile.web  Dockerfile.server  docker-compose.yml
```

## 常用命令

| 命令             | 说明                                    |
| ---------------- | --------------------------------------- |
| `pnpm dev`       | 并行启动前后端（turbo 编排）            |
| `pnpm build`     | 构建全仓（web 用 Vite，server 用 tsup） |
| `pnpm test`      | 跑所有测试（shared + server + web）     |
| `pnpm typecheck` | 全仓类型检查                            |
| `pnpm lint`      | ESLint                                  |
| `pnpm format`    | Prettier 格式化                         |

## 第一次使用

```bash
corepack enable                # 本项目 packageManager 锁定了 pnpm@11.25.0
pnpm install
pnpm dev                       # 前端 http://localhost:5173  后端 :3001
```

> 后端默认 `:3001`，前端 Vite dev server 通过 `/api` 代理转发到后端，避免跨域。

## 前后端契约怎么工作

`packages/shared/src/schemas/user.ts` 是「唯一的事实源」：

- 后端 `middlewares/validate.ts` 用它对 `req.body / req.query` 做运行时校验
- 前端 `App.vue` 用它做表单字段校验
- 两端通过 `z.infer` 派生一致的 TS 类型

改一处 schema → 前后端同时感知，类型不匹配直接编译失败。
=======

# monorepo-website

monorepo项目

> > > > > > > 730930081b6b2e1ad58bb50739f79e2c54e236af

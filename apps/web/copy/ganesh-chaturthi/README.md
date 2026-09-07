# 榜单活动换皮指南

> 这是一个 **「换 UI 不换结构」** 的榜单活动模板实例。
> 出新活动 = **改 `config.ts` + 换图片 `resources.ts` + 换文案 `locales.js`**，不需要改任何模板代码。

## 页面结构（固定，不用改）

页面从上到下共 4 块，顺序和交互都已固定：

```
┌─────────────────────────────┐
│  Banner：标题图 / 规则按钮 / 倒计时  │
├─────────────────────────────┤
│  活动礼物区（EventGift）         │
├─────────────────────────────┤
│  顶部 Tab：挑战榜奖励 | 排行榜        │
├─────────────────────────────┤
│  榜单内容（左右滑动切换）          │
│  每个榜单内还有「魅力 / 财富」子 Tab │
└─────────────────────────────┘
```

## 模板位置

所有通用代码（页面结构、组件、Store、接口、工具函数）都已抽到：

```
src/views/activity/template-activity/
```

`ganesh-chaturthi/` 只是模板的首个实例，**不要改 `template-activity/` 以外的结构代码**。

## ❗️❗️❗️换皮只动 3 个文件

| 改什么          | 文件           | 说明                                                      |
| --------------- | -------------- | --------------------------------------------------------- |
| 活动 KEY + 主题 | `config.ts`    | 改 `actKey`、主题色、Tab 文案 key、规则条数、榜单数值 key |
| 图片            | `resources.ts` | 所有图片的唯一入口，字段名保持和模板约定一致              |
| 文案            | `locales.js`   | 所有文字（多语言），按 key 替换                           |

其余文件 **一律不用动**：

- `index.vue` 只是 3 行 wrapper；
- `template-activity/` 是模板本体，只负责结构和交互。

## 操作步骤

### 1. 复制目录

```bash
cp -r src/views/activity/ganesh-chaturthi src/views/activity/新活动名
```

### 2. 改活动 KEY 和主题

打开 `config.ts`：

```ts
const config: ActivityConfig = {
  actKey: '新活动标识', // 接口 KEY
  resources,
  theme: {
    '--activity-bg': '#e8dafc', // 页面背景
    '--activity-primary': '#8651b7', // Tab 默认色
    '--activity-active': '#643204', // Tab 选中色
    // ... 按需覆盖
  },
  mainTabs: [
    { key: 'challenge', localeKey: '挑战榜' },
    { key: 'rank', localeKey: '排行榜' },
  ],
  subTabs: [
    { key: 'charm', localeKey: '魅力榜' },
    { key: 'wealth', localeKey: '财富榜' },
  ],
  scoreLabelKey: '祝福值', // 榜单数值文案 key
  ruleCount: 4, // 规则弹窗条数
};
```

### 3. 替换图片

切图放在 `src/assets/img/activity/新活动名/` 下，**文件夹和页面区块一一对应**：

| 文件夹       | 放什么                                                               |
| ------------ | -------------------------------------------------------------------- |
| `common/`    | 通用图：Banner 背景、图标（返回/音乐/规则/金币）、各类边框、Tab 底图 |
| `title/`     | 各语言标题图（如 `en_title`、`hi_title`）                            |
| `challenge/` | 挑战榜奖励 Top1/2/3 的边框和礼物底座                                 |
| `rank/`      | 排行榜 Top1/2/3 头像框、魅力值/财富值图标                            |

打开 `resources.ts`：

- 把 `@/assets/img/activity/ganesh-chaturthi/...` 改成新目录；
- **保持导出字段名不变**，模板才能正确读取。

最省事的方式：**新切图沿用原文件名直接覆盖**，则 `resources.ts` 只需改路径前缀。

### 4. 替换文案

打开 `locales.js`，按 key 替换各语言文案：

- `规则N标题` + `规则N内容` 成对出现，条数由 `config.ts` 的 `ruleCount` 控制；
- `scoreLabelKey` 对应的 key（默认 `祝福值`）决定榜单数值标签文案。

### 5. 接入入口

在 `src/router/routes.js` 新增路由，指向新目录的 `index.vue`：

```js
{
  path: '/activity/新活动名',
  name: '新活动名',
  meta: { title: '新活动标题' },
  component: () => import('@/views/activity/新活动名/index.vue'),
}
```

## 注意事项

- **不要改 `template-activity/` 里的布局和样式结构**，除非新设计稿明确调整了区块结构。
- **不要在组件里写死图片路径或文字**，统一走 `resources.ts` / `locales.js` / `config.ts`。
- **RTL（阿语）**：页面已自动镜像；若某张图片需要翻转，在引用处加 `v-arClass:transform-rotateY-180`。
- **Store 隔离**：模板按 `actKey` 生成唯一 Pinia store id，多个榜单活动同时存在也不会状态串扰。

## 目录结构

```
src/views/activity/
├── template-activity/          # 模板本体（一次写好，长期不变）
│   ├── index.vue               # 页面入口：编排、外层 Swiper、音频、倒计时、规则弹窗
│   ├── store.ts                # Pinia store 工厂
│   ├── http.ts                 # 接口工厂
│   ├── helper.js               # 纯函数工具
│   ├── type.ts                 # TS 类型
│   ├── config.type.ts          # 活动配置协议
│   ├── composables/useCountdown.ts
│   ├── sections/               # 页面区块
│   │   ├── event-gift.vue
│   │   ├── challenge.vue
│   │   └── rank.vue
│   └── components/rules-model.vue
│
└── ganesh-chaturthi/           # 模板实例（换皮只动这里）
    ├── index.vue               # 3 行 wrapper
    ├── config.ts               # 活动 KEY + 主题 + 资源配置
    ├── resources.ts            # 图片资源
    ├── locales.js              # 多语言文案
    └── README.md               # 本文件
```

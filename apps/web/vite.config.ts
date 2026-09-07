import { fileURLToPath, URL } from 'node:url';
import pxtorem from 'postcss-pxtorem';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const API_PREFIX = '/api';
const DEFAULT_PORT = 3001;
const backendPort = Number(process.env.SERVER_PORT ?? DEFAULT_PORT);

/**
 * 移动端适配：设计稿 750px 宽。
 *
 * 三处数字必须严格对应，改一个就要改另外两个：
 *   1. rootValue = 100 —— CSS 里的 px 除以它得到 rem
 *   2. 设计稿宽度 750
 *   3. index.html 的 flexible 脚本：rem = 视口宽 / (750 / 100) = 视口宽 / 7.5
 *
 * 例：设计稿 100px → 编译成 1rem → 375 屏幕上 1rem = 50px → 实际渲染 50px。
 *     即 100 / 750 * 375 = 50，换算正确。
 */
const ROOT_VALUE = 100;

/** 业务代码：750 设计稿 */
const loaderPxtorem = pxtorem({
  rootValue: ROOT_VALUE,
  propList: ['*'],
  minPixelValue: 0,
  // 第三方 UI 库走自己的设计稿宽度，见下方 uiLibPxtorem
  exclude: /node_modules\/(vant|antd-mobile)/i,
});

/**
 * UI 库（Vant）：375 设计稿，rootValue 50。
 *
 * rootValue 必须满足 rootValue × 7.5 = 设计稿宽度（7.5 来自 flexible 脚本）：
 *   - 业务代码 750 设计稿 → rootValue 100
 *   - Vant 样式 375 设计稿 → rootValue 50
 *
 * 用 37.5 会让 Vant 所有元素放大 1.33 倍（50 / 37.5）。
 * （37.5 是 amfe-flexible 的 rem=视口宽/10 方案的值，hoby 里那段是
 *   给 antd-mobile 的死配置——它根本没装 antd-mobile，所以从没暴露过。）
 *
 * 两条规则靠 exclude 正则互斥：
 *   - loaderPxtorem  排除 node_modules 里的 UI 库
 *   - uiLibPxtorem   反向排除，只处理 node_modules 里的 UI 库
 */
const uiLibPxtorem = pxtorem({
  rootValue: 50,
  propList: ['*'],
  minPixelValue: 0,
  exclude: /^(?!.*node_modules\/(vant|antd-mobile))/i,
});

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [loaderPxtorem, uiLibPxtorem],
    },
    preprocessorOptions: {
      // turkish-wheel 等组件用 less 写的，开启内联 JS 支持
      less: {
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // 开发期把 /api 转发到后端，避免跨域
    proxy: {
      [API_PREFIX]: {
        target: `http://127.0.0.1:${backendPort}`,
        changeOrigin: true,
      },
    },
    // 允许 Vite 读取工作区里其它包（@mono/shared）的源码
    fs: {
      allow: [fileURLToPath(new URL('../..', import.meta.url))],
    },
  },
  // @mono/shared 是工作区里的 TS 源码，交给 Vite 直接编译，不做依赖预构建
  optimizeDeps: {
    exclude: ['@mono/shared'],
  },
});

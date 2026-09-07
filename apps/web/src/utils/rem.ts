/**
 * 把「750 设计稿 px」转成 rem 字符串，专门用于 JS 里拼的 inline style。
 *
 * 为什么需要它：
 *   postcss-pxtorem 只处理 CSS 文本（.vue 的 <style>、.css、.less）。
 *   运行时用 :style 拼出来的 inline style 它完全碰不到，
 *   所以凡是动态算出来的尺寸，必须手动用这个函数转成 rem。
 *
 * 数值与下面两处严格对应，改一处要同步改另外两处：
 *   1. vite.config.ts 里 postcss-pxtorem 的 rootValue = 100
 *   2. index.html 里 flexible 脚本的 rem = 视口宽 / 7.5
 *
 * 例：designPx(726) === '7.26rem'，在 375 屏幕上渲染成 363px。
 */
const ROOT_VALUE = 100;

export function designPx(px: number): string {
  return `${px / ROOT_VALUE}rem`;
}

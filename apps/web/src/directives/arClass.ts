import type { Directive } from 'vue';

/** v-arClass 指令：阿拉伯语 RTL 适配（非阿拉伯语时无效果） */
function isArabic() {
  const lang = localStorage.getItem('language') || 'en';
  return lang === 'ar_SA' || lang === 'ar';
}

export const arClass: Directive<HTMLElement, unknown> = {
  mounted(el, binding) {
    if (!isArabic() || !binding.arg) return;
    if (binding.arg === 'rtl') {
      el.classList.add('rtl');
    } else if (binding.arg === 'transform-rotateY-180') {
      el.style.transform = 'rotateY(180deg)';
    }
  },
};

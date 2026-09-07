import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

/**
 * 全局基础信息。
 * 榜单活动模板只用到了 isRtl（阿语等 RTL 语言下页面镜像）。
 */
export const useBaseStore = defineStore('base', () => {
  const language = ref<string>('en_US');

  /** 需要 RTL 布局的语言 */
  const RTL_LANGUAGES = ['ar', 'ar_SA', 'fa', 'he', 'ur'];

  const isRtl = computed(() => {
    const base = language.value.split('_')[0];
    return RTL_LANGUAGES.includes(base ?? '');
  });

  function setLanguage(lang: string) {
    language.value = lang;
  }

  return { language, isRtl, setLanguage };
});

export default useBaseStore;

import { defineStore } from 'pinia';
import { ref } from 'vue';

/** 简化版音频 store（原项目 @/stores/audio 的桩实现） */
export const useAudioStore = defineStore('audio', () => {
  const play = ref(false);

  function onTogglePlay(value: boolean) {
    play.value = value;
  }

  return { play, onTogglePlay };
});

export default useAudioStore;

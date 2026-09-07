<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

/**
 * 背景音乐播放器。
 * 浏览器要求用户交互后才能播放，所以首次交互时再尝试 play()。
 */
const props = defineProps<{
  src?: string;
  autoplay?: boolean;
}>();

const audioRef = ref<HTMLAudioElement | null>(null);
const playing = ref(false);

function bindFirstInteraction() {
  const handler = () => {
    if (props.autoplay !== false) void tryPlay();
    document.removeEventListener('touchstart', handler);
    document.removeEventListener('click', handler);
  };
  document.addEventListener('touchstart', handler, { once: true });
  document.addEventListener('click', handler, { once: true });
}

async function tryPlay() {
  const el = audioRef.value;
  if (!el || !props.src) return;
  try {
    await el.play();
    playing.value = true;
  } catch {
    playing.value = false;
  }
}

watch(
  () => props.src,
  () => {
    playing.value = false;
  },
);

onMounted(bindFirstInteraction);
onUnmounted(() => {
  audioRef.value?.pause();
});
</script>

<template>
  <audio v-if="src" ref="audioRef" :src="src" loop preload="none" />
</template>

<script setup lang="ts">
defineProps<{
  ICON_BACK?: string;
  ICON_MUSIC?: string;
  ICON_MUSIC_CLOSE?: string;
  isMusicPlaying?: boolean;
  showLogo?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'toggle-music'): void;
}>();
</script>

<template>
  <div class="header-bar">
    <img v-if="ICON_BACK" class="hb-icon" :src="ICON_BACK" alt="back" @click="emit('close')" />

    <div class="hb-spacer" />

    <img
      v-if="ICON_MUSIC"
      class="hb-icon"
      :src="isMusicPlaying ? ICON_MUSIC : ICON_MUSIC_CLOSE || ICON_MUSIC"
      alt="music"
      @click="emit('toggle-music')"
    />
  </div>
</template>

<style scoped>
/* 尺寸按 750 设计稿书写，由 postcss-pxtorem 转 rem */
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88px;
  padding: 0 24px;
}

.hb-spacer {
  flex: 1;
}

.hb-icon {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  cursor: pointer;
}
</style>

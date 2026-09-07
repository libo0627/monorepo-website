<script setup lang="ts">
/** 用户头像：没有头像时渲染占位块，避免裂图 */
defineProps<{
  avatar?: string;
}>();
</script>

<template>
  <img v-if="avatar" class="avatar" :src="avatar" alt="" />
  <div v-else class="avatar avatar--empty" />
</template>

<style scoped>
/* 尺寸按 750 设计稿书写，由 postcss-pxtorem 转 rem */
.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.avatar--empty {
  background: linear-gradient(180deg, #d8c8f0 0%, #b9a3dd 100%);
}
</style>

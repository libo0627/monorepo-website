<script setup lang="ts">
import { designPx } from '@/utils/rem';

defineProps<{
  width?: number;
  topImage?: string;
  topHeight?: number;
  middleImage?: string;
  bottomImage?: string;
  bottomHeight?: number;
  middlePadding?: number;
  contentPaddingTop?: number;
  contentPaddingBottom?: number;
}>();
</script>

<template>
  <!--
    尺寸一律走 designPx() 转 rem。
    这里不能用裸 px：inline style 不会被 postcss-pxtorem 处理，
    写 750px 就真的是 750 物理像素，在 375 的屏幕上会放大一倍直接溢出。
    传入的 props 数值按「750 设计稿 px」理解。
  -->
  <div class="section-border" :style="{ width: designPx(width ?? 750) }">
    <img
      v-if="topImage"
      class="sb-top"
      :src="topImage"
      :style="{ height: designPx(topHeight ?? 0) }"
    />
    <div
      class="sb-middle"
      :style="{
        backgroundImage: middleImage ? `url(${middleImage})` : 'none',
        backgroundRepeat: 'repeat-y',
        backgroundSize: '100% auto',
        paddingLeft: designPx(middlePadding ?? 0),
        paddingRight: designPx(middlePadding ?? 0),
      }"
    >
      <div
        :style="{
          paddingTop: designPx(contentPaddingTop ?? 0),
          paddingBottom: designPx(contentPaddingBottom ?? 0),
        }"
      >
        <slot />
      </div>
    </div>
    <img
      v-if="bottomImage"
      class="sb-bottom"
      :src="bottomImage"
      :style="{ height: designPx(bottomHeight ?? 0) }"
    />
  </div>
</template>

<style scoped>
.section-border {
  position: relative;
  margin: 0 auto;
}

.sb-top,
.sb-bottom {
  display: block;
  width: 100%;
  object-fit: fill;
}

.sb-middle {
  width: 100%;
  box-sizing: border-box;
}
</style>

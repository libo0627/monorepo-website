<!-- 规则弹窗 -->
<template>
  <div>
    <van-popup v-model:show="visible" position="bottom" close-on-click-overlay @close="onClose">
      <div class="rules-popup">
        <div class="close-btn" @click="onClose">×</div>
        <SectionBorder
          :width="724"
          :top-image="BORDER_TOP"
          :top-height="348"
          :middle-image="BORDER_MIDDLE"
          :bottom-image="BORDER_BOTTOM"
          :bottom-height="264"
          :middle-padding="60"
          :content-padding-top="200"
          :content-padding-bottom="160"
        >
          <div class="rules-content" v-arClass:rtl>
            <div class="rules-title">{{ locales['规则'] }}</div>
            <div class="rules-body">
              <div v-for="(section, i) in ruleSections" :key="i" class="rules-section">
                <div class="rules-section-title">{{ section.title }}</div>
                <p v-for="(item, j) in section.items" :key="j" class="rules-section-item">
                  {{ j + 1 }}. {{ item }}
                </p>
              </div>
            </div>
          </div>
        </SectionBorder>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { computed, inject, ref, watch } from 'vue';
import SectionBorder from '@/components/section-border/index.vue';
import { BORDER_TOP, BORDER_MIDDLE, BORDER_BOTTOM } from '../resources';

const locales = inject('locales') || {};
const props = defineProps(['isShow']);
const emit = defineEmits(['onToggle']);
const visible = ref(false);

const ruleSections = computed(() => [
  {
    title: locales['祝福方式说明'],
    items: [locales['祝福规则1'], locales['祝福规则2'], locales['祝福规则3']],
  },
  {
    title: locales['玩法说明'],
    items: [locales['玩法规则1'], locales['玩法规则2'], locales['玩法规则3']],
  },
  {
    title: locales['榜单规则说明'],
    items: [locales['榜单规则1'], locales['榜单规则2']],
  },
  {
    title: locales['补充说明'],
    items: [locales['补充规则1']],
  },
]);

watch(
  () => props.isShow,
  (v) => {
    visible.value = v;
  },
  { immediate: true },
);

const onClose = () => emit('onToggle', false);
</script>

<style scoped lang="less">
:deep(.van-popup) {
  background: transparent !important;
  overflow: visible !important;
}

:deep(.van-popup--bottom) {
  background: transparent !important;
  overflow: visible !important;
}

:deep(.van-popup__container) {
  overflow: visible !important;
}

.rules-popup {
  position: relative;
  width: 750px;
  height: 1000px;
  margin: 0 auto;
  padding-bottom: 50px;
  overflow: visible;

  .section-border {
    height: 100%;
  }
}

.close-btn {
  position: absolute;
  top: -80px;
  right: 20px;
  width: 64px;
  height: 64px;
  line-height: 60px;
  text-align: center;
  border: 2px solid #f8e1b5;
  border-radius: 50%;
  font-size: 40px;
  color: #f8e1b5;
  z-index: 10;
}

.rules-content {
  height: 648px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding-top: 40px;
}

.rules-title {
  font-size: 36px;
  font-weight: 700;
  line-height: 44px;
  color: #ffdb85;
  text-align: center;
  margin-bottom: 30px;
}

.rules-section {
  margin-bottom: 30px;

  .rules-section-title {
    display: inline-block;
    font-size: 26px;
    font-weight: 700;
    line-height: 34px;
    color: #e4b0ad;
    margin-bottom: 12px;
    padding: 9px 20px;
    background: linear-gradient(
      90deg,
      rgba(112, 23, 19, 0.95) 0%,
      rgba(112, 23, 19, 0.6) 60%,
      rgba(112, 23, 19, 0) 100%
    );
    border-radius: 8px;
  }

  .rules-section-item {
    font-size: 22px;
    line-height: 32px;
    color: #ffabab;
    margin: 0 0 10px;
  }
}

.turkish-wheel-page.rtl {
  .rules-section-title {
    background: linear-gradient(
      270deg,
      rgba(112, 23, 19, 0.95) 0%,
      rgba(112, 23, 19, 0.6) 60%,
      rgba(112, 23, 19, 0) 100%
    );
  }
}
</style>

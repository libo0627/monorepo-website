<!-- 达标弹窗 -->
<template>
  <div>
    <Dialog
      v-model:show="visible"
      :show-confirm-button="false"
      :show-cancel-button="false"
      close-on-click-overlay
      @close="onClose"
    >
      <div class="milestone-dialog-wrap">
        <div class="close-btn" @click="onClose">×</div>
        <SectionBorder
          :width="726"
          :top-image="RECORD_BORDER_TOP"
          :top-height="326"
          :middle-image="RECORD_BORDER_MIDDLE"
          :bottom-image="RECORD_BORDER_BOTTOM"
          :bottom-height="154"
          :middle-padding="0"
        >
          <div class="milestone-dialog-content">
            <div class="dialog-title flex flex-center">
              <img class="title-icon" :src="TITLE_LEFT" />
              <span class="title-text">
                {{ locales['恭喜'] || 'CONGRATULATIONS' }}
              </span>
              <img class="title-icon" :src="TITLE_RIGHT" />
            </div>
            <div class="dialog-message">
              <p>
                {{ locales['获得抽奖机会'] || "You've earned a chance to spin the wheel" }}
              </p>
              <p>{{ locales['是否抽奖'] || 'Would you like to spin it?' }}</p>
            </div>
            <div class="btn-group">
              <div
                class="dialog-btn on"
                :style="{ backgroundImage: `url(${BORDER_BTN_ON})` }"
                @click="onClose"
              >
                ON
              </div>
              <div
                class="dialog-btn ok"
                :style="{ backgroundImage: `url(${BORDER_BTN_OK})` }"
                @click="onClose"
              >
                OK
              </div>
            </div>
          </div>
        </SectionBorder>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue';
import { Dialog } from 'vant';
import SectionBorder from '@/components/section-border/index.vue';
import {
  RECORD_BORDER_TOP,
  RECORD_BORDER_MIDDLE,
  RECORD_BORDER_BOTTOM,
  BORDER_BTN_OK,
  BORDER_BTN_ON,
  TITLE_LEFT,
  TITLE_RIGHT,
} from '../resources';

const locales = inject('locales') || {};
const props = defineProps(['isShow']);
const emit = defineEmits(['onToggle']);

const visible = computed({
  get: () => props.isShow,
  set: (v) => emit('onToggle', v),
});

const onClose = () => emit('onToggle', false);
</script>

<style scoped lang="less">
:deep(.van-dialog) {
  width: 750px;
  background: transparent !important;
  overflow: visible;
  margin-left: 10px;
  direction: ltr;
}

:deep(.van-dialog__content) {
  padding: 0;
}

.milestone-dialog-wrap {
  position: relative;
  width: 726px;
  margin: 0 auto;
}

.close-btn {
  position: absolute;
  top: -30px;
  right: 0;
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

.milestone-dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 30px 0;
}

.dialog-title {
  margin-bottom: 40px;

  .title-icon {
    width: 24px;
    height: 54px;
    object-fit: contain;
    margin: 0 12px;
  }

  .title-text {
    font-size: 36px;
    font-weight: 700;
    line-height: 44px;
    color: #ffdb85;
  }
}

.dialog-message {
  font-size: 26px;
  line-height: 40px;
  color: #ffabab;
  text-align: center;
  margin-bottom: 40px;

  p {
    margin: 0;
  }
}

.btn-group {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
}

.dialog-btn {
  width: 262px;
  height: 88px;
  line-height: 88px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  text-align: center;
}
</style>

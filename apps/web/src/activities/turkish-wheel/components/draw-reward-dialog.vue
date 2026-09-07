<!-- 抽奖奖励弹窗 1 10抽 -->
<template>
  <div>
    <Dialog
      v-model:show="visible"
      :show-confirm-button="false"
      :show-cancel-button="false"
      close-on-click-overlay
      @close="onClose"
    >
      <div class="reward-dialog-wrap">
        <div class="close-btn" @click="onClose">×</div>
        <SectionBorder
          :width="726"
          :top-image="RECORD_BORDER_TOP"
          :top-height="326"
          :middle-image="RECORD_BORDER_MIDDLE"
          :bottom-image="RECORD_BORDER_BOTTOM"
          :bottom-height="154"
          :middle-padding="0"
          :content-padding-top="220"
          :content-padding-bottom="120"
        >
          <div class="reward-dialog-content">
            <div class="dialog-title flex flex-center">
              <img class="title-icon" :src="TITLE_LEFT" />
              <span class="title-text">
                {{ locales['恭喜获得奖励'] || 'CONGRATULATIONS' }}
              </span>
              <img class="title-icon" :src="TITLE_RIGHT" />
            </div>
            <div class="dialog-subtitle">
              {{ locales['获得以下奖品'] || 'Win the following prizes' }}
            </div>
            <div
              class="reward-list"
              :class="{
                single: props.list.length === 1,
                multiple: props.list.length > 1,
              }"
            >
              <div
                v-for="(item, index) in props.list"
                :key="index"
                class="reward-item"
                :style="{ backgroundImage: `url(${CHAMPION_REWARD_BG})` }"
              >
                <img class="reward-img" :src="item.image" />
                <span class="reward-name">{{ item.name }}</span>
              </div>
            </div>
            <div
              class="ok-btn"
              :style="{ backgroundImage: `url(${BORDER_BTN_OK})` }"
              @click="onClose"
            >
              OK
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
  CHAMPION_REWARD_BG,
  TITLE_LEFT,
  TITLE_RIGHT,
} from '../resources';

const locales = inject('locales') || {};
const props = defineProps(['isShow', 'list']);
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

.reward-dialog-wrap {
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

.reward-dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 30px 0px;
}

.dialog-title {
  margin-bottom: 12px;

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

.dialog-subtitle {
  font-size: 24px;
  line-height: 32px;
  color: #ffabab;
  text-align: center;
  margin-bottom: 40px;
}

.reward-list {
  width: 100%;

  &.single {
    display: flex;
    justify-content: center;

    .reward-item {
      width: 154px;
      height: 154px;
    }
  }

  &.multiple {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;

    .reward-item {
      width: 140px;
      height: 154px;
    }
  }
}

.reward-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;

  .reward-img {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }

  .reward-name {
    margin-top: 8px;
    font-size: 22px;
    line-height: 28px;
    color: #ffdb85;
    text-align: center;
  }
}

.ok-btn {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
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

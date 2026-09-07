<template>
  <div
    class="event-gift-section"
    :style="{ backgroundImage: `url(${resources.EVENT_GIFT_BORDER})` }"
  >
    <div class="event-gift-title">{{ locales['活动礼物'] }}</div>
    <div class="event-gift-main" v-arClass:rtl>
      <div v-for="gift in eventGiftMainList" :key="gift.id" class="event-gift-card">
        <div class="gift-avatar-wrap" @click="onGiftPreview(gift)">
          <van-image class="gift-avatar" fit="cover" round :src="gift.avatar" />
          <img v-if="gift.animationUrl" class="gift-preview-icon" :src="previewIcon" />
        </div>
        <div
          class="gift-platform"
          :style="{ backgroundImage: `url(${resources.GIFT_PLATFORM})` }"
        ></div>
        <div class="gift-value">
          <img class="value-icon" :src="resources.ICON_GOLD" />
          <span>{{ gift.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import { webviewFun } from '@/utils';
import previewIcon from '@/assets/img/icon_preview@2x.webp';

const { toAppShow } = webviewFun;
const locales = inject('locales') || {};
const store = inject('activityStore');
const resources = inject('activityResources') || {};

const eventGiftMainList = computed(() => store.eventGiftMainList);

const onGiftPreview = (gift) => {
  if (gift.animationUrl) {
    toAppShow(gift);
  }
};
</script>

<style scoped lang="less">
.event-gift-section {
  position: relative;
  margin-top: -60px;
  z-index: 1;
  width: 750px;
  height: 502px;
  padding: 62px 80px 60px;
  box-sizing: border-box;
  background: no-repeat center / 100% 100%;

  .event-gift-title {
    margin: 0 auto 24px;
    width: fit-content;
    font-size: 26px;
    font-weight: 700;
    line-height: 46px;
    background: linear-gradient(
      90deg,
      var(--activity-active, #643204) 0%,
      #a15f23 50%,
      var(--activity-active, #643204) 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .event-gift-main {
    display: flex;
    align-items: flex-end;
    gap: 16px;
    padding: 10px 0px 20px;
    overflow-x: auto;
    overflow-y: hidden;

    &::-webkit-scrollbar {
      display: none;
    }

    .event-gift-card {
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 170px;

      .gift-avatar-wrap {
        position: relative;
        width: 130px;
        height: 130px;
        margin-bottom: -30px;
        z-index: 2;

        .gift-avatar {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          overflow: hidden;
        }

        .gift-preview-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 42px;
          height: 42px;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
      }

      .gift-platform {
        width: 170px;
        height: 100px;
        background: no-repeat center / 100% 100%;
      }

      .gift-value {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 28px;
        color: var(--activity-text-main, #31144c);

        .value-icon {
          width: 32px;
          height: 32px;
        }
      }
    }
  }
}
</style>

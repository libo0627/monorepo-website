<template>
  <div class="challenge-page" v-arClass:rtl>
    <!-- 子 Tab -->
    <div class="challenge-tabs">
      <div
        class="challenge-tabs-track"
        :style="{ backgroundImage: `url(${resources.CHARM_WEALTH_TAB})` }"
      >
        <div
          class="challenge-tabs-slider"
          :style="{
            backgroundImage: `url(${resources.CHARM_WEALTH_TAB_ACTIVE})`,
            transform: `translateX(${
              isRtl ? (activeSubTab === 0 ? '50%' : '-20%') : activeSubTab === 0 ? '-20%' : '46%'
            }) translateY(-60%)`,
          }"
        ></div>
        <div
          v-for="(tab, i) in subTabs"
          :key="tab.key"
          class="challenge-tab"
          :class="{ active: activeSubTab === i }"
          @click="activeSubTab = i"
        >
          {{ tab.label }}
        </div>
      </div>
    </div>

    <!-- 内层 Swiper -->
    <Swiper
      class="challenge-swiper"
      :slides-per-view="1"
      :space-between="0"
      :initial-slide="activeIndex"
      :dir="isRtl ? 'rtl' : 'ltr'"
      :auto-height="true"
      :nested="true"
      :observer="true"
      :observe-parents="true"
      @swiper="onSwiper"
      @slide-change="onSlideChange"
    >
      <SwiperSlide v-for="tab in subTabs" :key="tab.key">
        <div class="challenge-slide">
          <div
            v-for="rewardSection in rewardList"
            :key="rewardSection.key"
            class="reward-section"
            :class="rewardSection.className"
            :style="{ backgroundImage: `url(${rewardSection.border})` }"
          >
            <!-- 第一部分：title -->
            <div class="reward-title">{{ rewardSection.title }}</div>
            <!-- 第二部分：奖励布局区域（3列纵向滚动，一屏两排6个） -->
            <div class="reward-body" v-arClass:rtl>
              <div v-for="reward in rewardSection.rewards" :key="reward.id" class="reward-item">
                <!-- 上边：礼物展示 -->
                <div class="reward-gift-wrap" @click="onRewardPreview(reward)">
                  <van-image class="reward-gift" fit="cover" round :src="reward.url" />
                  <img v-if="reward.animationUrl" class="reward-preview-icon" :src="previewIcon" />
                </div>
                <!-- 中间：台子 -->
                <div
                  class="reward-platform"
                  :style="{
                    backgroundImage: `url(${rewardSection.platform})`,
                  }"
                ></div>
                <!-- 下边：金币 icon + 数量 或 天数 -->
                <div class="reward-value">
                  <img
                    v-if="formatRewardLabel(reward, locales).isGold"
                    class="value-icon"
                    :src="resources.ICON_GOLD"
                  />
                  <span>{{ formatRewardLabel(reward, locales).text }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch, onUnmounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import useBaseStore from '@/stores/base';
import { webviewFun } from '@/utils';
import previewIcon from '@/assets/img/icon_preview@2x.webp';
import { formatRewardLabel } from '../helper';

const props = defineProps({
  isActive: { type: Boolean, default: false },
});

const locales = inject('locales') || {};
const store = inject('activityStore');
const resources = inject('activityResources') || {};
const config = inject('activityConfig') || {};
const outerSwiper = inject('outerSwiper', null);

const { toAppShow } = webviewFun;
const baseStore = useBaseStore();
const isRtl = computed(() => baseStore.isRtl);

const onRewardPreview = (reward) => {
  if (reward.animationUrl) {
    toAppShow(reward);
  }
};

// 子 Tab：默认取配置，未配置则回退到 charm / wealth
const swiperRef = ref(null);
let heightObserver = null;
const activeSubTab = ref(0);
const subTabs = computed(() => {
  const tabs = config.subTabs || [
    { key: 'charm', localeKey: '魅力榜' },
    { key: 'wealth', localeKey: '财富榜' },
  ];
  return tabs.map((tab) => ({
    key: tab.key,
    label: locales[tab.localeKey],
  }));
});
const activeIndex = computed(() => activeSubTab.value);

const onSwiper = (swiper) => {
  swiperRef.value = swiper;
  // 内层 swiper 高度变化后，直接调用外层 swiper 的 updateAutoHeight
  heightObserver = new ResizeObserver(() => {
    outerSwiper?.value?.updateAutoHeight();
  });
  heightObserver.observe(swiper.el);
};

onUnmounted(() => {
  heightObserver?.disconnect();
});

const onSlideChange = (swiper) => {
  activeSubTab.value = swiper.activeIndex;
};

watch(activeSubTab, (val) => {
  swiperRef.value?.slideTo(val);
});

// 当前子 Tab 对应的 rank_type
const currentRankType = computed(() => subTabs.value[activeSubTab.value]?.key || 'charm');

// 挑战榜奖励数据：按 charm / wealth 分别拉取
const sectionConfig = [
  {
    className: 'top1',
    border: resources.TOP1_CHALLENGE_BORDER,
    platform: resources.TOP1_CHALLENGE_GIFT_PLATFORM,
  },
  {
    className: 'top2',
    border: resources.TOP2_CHALLENGE_BORDER,
    platform: resources.TOP2_CHALLENGE_GIFT_PLATFORM,
  },
  {
    className: 'top3',
    border: resources.TOP3_CHALLENGE_BORDER,
    platform: resources.TOP3_CHALLENGE_GIFT_PLATFORM,
  },
];
const rewardList = computed(() => {
  const data = store.rankRewardsMap[currentRankType.value] || [];
  const sections = store.mapChallengeRewards(data);
  // 无数据时也保留 top1/top2/top3 三个布局
  return sectionConfig.map((config, index) => ({
    key: config.className,
    rank: sections[index]?.rank || [index + 1],
    title: sections[index]?.title || `TOP${index + 1}`,
    rewards: sections[index]?.rewards || [],
    ...config,
  }));
});

// 一级 tab 为 challenge 且切换子 tab 时请求对应接口
watch(
  [() => props.isActive, currentRankType],
  ([active]) => {
    if (active) {
      store.fetchRankRewards(currentRankType.value);
    }
  },
  { immediate: true },
);
</script>

<style scoped lang="less">
.challenge-page {
  position: relative;
  width: 750px;
  margin: 0 auto;
}

// 子 Tab
.challenge-tabs {
  display: flex;
  justify-content: center;
  padding-top: 16px;

  .challenge-tabs-track {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 354px;
    height: 56px;
    margin: 20px auto 0;
    background: no-repeat center / 100% 100%;

    .challenge-tabs-slider {
      position: absolute;
      top: 50%;
      left: 0;
      width: 274px;
      height: 96px;
      background: no-repeat center / 100% 100%;
      transition: transform 0.3s ease;
      pointer-events: none;
      will-change: transform;
    }
  }

  .challenge-tab {
    position: relative;
    z-index: 1;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 56px;
    font-size: 22px;
    font-weight: 700;
    color: var(--activity-primary, #8651b7);
    cursor: pointer;

    &.active {
      color: var(--activity-active, #643204);
    }
  }
}

.challenge-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24px 0px;

  .reward-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 750px;
    padding: 130px 24px 32px;
    box-sizing: border-box;
    background: no-repeat top center / 100% 100%;

    &.top1 {
      height: 1014px;
      padding: 150px 24px 32px;
    }

    &.top2 {
      height: 984px;
      margin-top: -50px;
    }

    &.top3 {
      height: 858px;
      padding: 80px 24px 32px;
      margin-top: -50px;
    }

    .reward-title {
      margin-bottom: 24px;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 2px;
      background: linear-gradient(
        0deg,
        var(--activity-active, #643204) 0%,
        #a15f23 50%,
        var(--activity-active, #643204) 100%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .reward-body {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: 16px;
      row-gap: 24px;
      align-content: start;
      width: 100%;
      max-height: 560px;
      padding: 16px 64px;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      box-sizing: border-box;
      margin-top: 24px;

      &::-webkit-scrollbar {
        display: none;
      }

      .reward-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;

        .reward-gift-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;

          .reward-gift {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            overflow: hidden;
          }

          .reward-preview-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 42px;
            height: 42px;
            transform: translate(-50%, -50%);
            pointer-events: none;
          }
        }

        .reward-platform {
          width: 180px;
          height: 100px;
          margin-top: -20px;
          background: no-repeat center / 100% 100%;
        }

        .reward-value {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 12px;
          font-size: 28px;
          color: var(--activity-text-main, #5b3100);

          .value-icon {
            width: 32px;
            height: 32px;
          }
        }
      }
    }
  }
}
</style>

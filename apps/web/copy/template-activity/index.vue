<!--
  榜单活动模板入口
  通过 config 驱动，新活动只需提供 config/resources/locales
-->
<template>
  <div class="activity-rank-page" :style="themeStyle" v-arClass:rtl>
    <!-- Banner -->
    <div class="banner-section" :style="{ backgroundImage: `url(${resources.BANNER})` }">
      <HeaderBar
        :ICON_BACK="resources.ICON_BACK"
        :ICON_MUSIC="resources.ICON_MUSIC"
        :ICON_MUSIC_CLOSE="resources.ICON_MUSIC_CLOSE"
        :is-music-playing="isMusicPlaying"
        :show-logo="false"
        @close="closeWebViewPage"
        @toggle-music="togglePlay"
      />

      <img class="banner-title" :src="titleImage" />

      <div
        class="rules-btn"
        @click="isShow = true"
        :style="{ backgroundImage: `url(${resources.ICON_RULE})` }"
      >
        {{ locales['规则'] }}
      </div>

      <!-- 倒计时 -->
      <div class="countdown">
        <div v-for="item in countdownList" :key="item.label" class="countdown-item">
          <div
            class="countdown-num-wrap"
            :style="{ backgroundImage: `url(${resources.COUNT_DOWN_BORDER})` }"
          >
            <div class="countdown-num">{{ item.value }}</div>
          </div>
          <div class="countdown-label">{{ item.label }}</div>
        </div>
      </div>
    </div>

    <!-- Event Gift -->
    <EventGift />

    <!-- Tabs -->
    <div class="tabs-section">
      <div class="main-tabs" v-arClass:rtl>
        <div
          v-for="(tab, i) in mainTabs"
          :key="tab.key"
          class="main-tab"
          :class="{ active: activeTab === i }"
          :style="{
            backgroundImage: `url(${activeTab === i ? resources.CHALLENGE_TASK_TAB_ACTIVE : resources.CHALLENGE_TASK_TAB})`,
          }"
          @click="onMainTabClick(i)"
        >
          {{ tab.label }}
        </div>
      </div>
    </div>

    <!-- Rank Content -->
    <div class="rank-content">
      <Swiper
        :slides-per-view="1"
        :space-between="0"
        :initial-slide="activeTab"
        :dir="isRtl ? 'rtl' : 'ltr'"
        :auto-height="true"
        :observer="true"
        :observe-parents="true"
        @swiper="onSwiper"
        @slide-change="onSlideChange"
      >
        <SwiperSlide>
          <Challenge :is-active="activeTab === 0" />
        </SwiperSlide>
        <SwiperSlide>
          <RankPage :is-active="activeTab === 1" />
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Rules Popup -->
    <rulesModel :is-show="isShow" @onToggle="isShow = false" />

    <!-- Background Music -->
    <cfAudio :src="props.config.audioSrc || ''" />
  </div>
</template>

<script setup>
import { ref, onMounted, provide, computed, watch } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { utils, webviewFun } from '@/utils';
import HeaderBar from '@/components/HeaderBar/index.vue';
import rulesModel from './components/rules-model.vue';
import RankPage from './sections/rank.vue';
import Challenge from './sections/challenge.vue';
import EventGift from './sections/event-gift.vue';
import cfAudio from '@/components/cf-audio.vue';
import useAudioStore from '@/stores/audio';
import useBaseStore from '@/stores/base';
import { createActivityStore } from './store';
import { useCountdown } from './composables/useCountdown';

import 'swiper/css';

const props = defineProps({
  /** 活动配置：actKey / resources / theme / tabs / ruleCount / scoreLabelKey */
  config: {
    type: Object,
    required: true,
  },
  /** 多语言文案对象（原始 key -> 多语言 map） */
  localesMap: {
    type: Object,
    required: true,
  },
});

const { transformLocales } = utils;
const { closeWebViewPage, hiddenBackButton } = webviewFun;

const language = window.localStorage.getItem('language') || 'en';
const locales = transformLocales(language, props.localesMap);
const isShow = ref(false);

const baseStore = useBaseStore();
const audioStore = useAudioStore();
const isMusicPlaying = ref(audioStore.play);
const isRtl = computed(() => baseStore.isRtl);

// 按活动 KEY 生成并实例化独立 store，避免多活动状态串扰
const activityStore = createActivityStore(props.config.actKey)();
const resources = computed(() => props.config.resources);

const togglePlay = () => {
  isMusicPlaying.value = !isMusicPlaying.value;
  audioStore.onTogglePlay(isMusicPlaying.value);
};

watch(
  () => audioStore.play,
  (value) => {
    isMusicPlaying.value = value;
  },
  { immediate: true },
);

// 标题图：优先取当前语言，fallback 到 en
const titleImage = computed(() => {
  const map = props.config.resources.TITLE_MAP || {};
  return map[language] || map.en || '';
});

// 主题变量注入根节点
const themeStyle = computed(() => props.config.theme || {});

provide('locales', locales);
provide('language', language);
provide('activityStore', activityStore);
provide('activityConfig', props.config);
provide('activityResources', props.config.resources);

// Countdown：默认展示未来第 3 天，store 拉取配置后自动覆盖为真实倒计时
const { countdownParts } = useCountdown(() => activityStore.countdown);
const countdownList = computed(() => [
  { label: locales['天'], value: countdownParts.value.days },
  { label: locales['时'], value: countdownParts.value.hours },
  { label: locales['分'], value: countdownParts.value.minutes },
  { label: locales['秒'], value: countdownParts.value.seconds },
]);

// Tabs
const activeTab = ref(0);
const mainTabs = computed(() =>
  (props.config.mainTabs || []).map((tab) => ({
    key: tab.key,
    label: locales[tab.localeKey],
  })),
);

const swiperRef = ref(null);
// 提供给内层 Rank 组件：内层 swiper 高度变化后，直接调用外层 swiper 的 updateAutoHeight
provide('outerSwiper', swiperRef);

const onSwiper = (swiper) => {
  swiperRef.value = swiper;
};
const onSlideChange = (swiper) => {
  activeTab.value = swiper.activeIndex;
};
const onMainTabClick = (index) => {
  activeTab.value = index;
  swiperRef.value?.slideTo(index);
};

onMounted(async () => {
  hiddenBackButton(0);
  setTimeout(() => audioStore.onTogglePlay(true), 100);

  await activityStore.fetchConfig();
});
</script>

<style scoped lang="less">
.activity-rank-page {
  width: 750px;
  margin: 0 auto;
  padding-bottom: 200px;
  background: var(--activity-bg, #e8dafc);
  overflow: hidden;
}

.banner-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: 1484px;
  padding: 92px 22px 184px;
  box-sizing: border-box;
  background: no-repeat center / 100% 100%;

  .header-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }

  .banner-title {
    position: absolute;
    top: 12%;
    width: 494px;
    height: 298px;
    object-fit: contain;
  }

  .rules-btn {
    position: absolute;
    top: 30%;
    left: 0;
    display: flex;
    justify-content: center;
    width: 110px;
    height: 116px;
    padding-top: 75px;

    box-sizing: border-box;
    background: no-repeat center / 100% 100%;
    font-size: 24px;
    color: #fff;
    text-align: center;
  }

  .countdown {
    position: absolute;
    top: 85%;
    left: 50%;
    transform: translate(-50%);
    display: flex;
    align-items: flex-start;
    gap: 40px;

    .countdown-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      width: 96px;

      .countdown-num-wrap {
        position: relative;
        width: 96px;
        height: 98px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: no-repeat center / 100% 100%;

        .countdown-num {
          font-size: 32px;
          font-weight: 600;
          line-height: 1;
          background: linear-gradient(180deg, #d7c5f4 0%, #f0e8ff 50%, #d2c0f2 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }

      .countdown-label {
        margin-top: 16px;
        font-size: 24px;
        color: var(--activity-text-main, #3b285d);
      }
    }
  }
}

.tabs-section {
  position: relative;
  z-index: 2;
  width: 750px;
  .main-tabs {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;

    .main-tab {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 366px;
      height: 134px;
      background: no-repeat center / 100% 100%;
      font-size: 28px;
      font-weight: 700;
      color: var(--activity-primary, #8651b7);
      padding-top: 22px;
      box-sizing: border-box;

      &.active {
        color: var(--activity-active, #643204);
      }
    }
  }
}

.rank-content {
  position: relative;
  z-index: 1;
}

.activity-rank-page.rtl {
  .banner-section {
    align-items: flex-end;
  }
}
</style>

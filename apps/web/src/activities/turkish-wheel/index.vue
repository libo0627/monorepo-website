<!--
  活动名称：土耳其16宫格
  已接入后端 API + MongoDB，全链路 CRUD
-->
<template>
  <div class="turkish-wheel-page" v-arClass:rtl>
    <!-- 顶部导航 -->
    <div class="header-bar">
      <img
        class="icon-back"
        v-arClass:transform-rotateY-180
        :src="ICON_BACK"
        @click="closeWebViewPage"
      />
    </div>

    <!-- Banner -->
    <div class="banner" :style="{ backgroundImage: `url(${BANNER_BG})` }">
      <img class="banner-title" :src="BANNER_TITLE" />
      <div
        class="rule-btn"
        v-arClass:transform-rotateY-180
        :style="{ backgroundImage: `url(${RULE_BTN})` }"
        @click="isShow = true"
      />
    </div>

    <!-- 内容区 -->
    <div class="content" :style="{ backgroundImage: `url(${CONTENT_BG})` }">
      <!-- 中奖滚动播报 -->
      <div class="win-notice">
        <div class="notice-track" :style="{ transform: `translateX(${-noticeIndex * 100}%)` }">
          <div v-for="(notice, i) in winNoticeList" :key="i" class="notice-item ep">
            <span class="user">{{ notice.user }}</span>
            <span class="text">{{ locales['抽中了'] }}</span>
            <span class="user">{{ notice.reward }}</span>
            <span class="text">{{ notice.unit }}</span>
          </div>
        </div>
      </div>

      <!-- 转盘奖励网格 -->
      <div class="reward-grid">
        <div
          v-for="(item, index) in rewardList"
          :key="index"
          class="reward-item"
          :class="{ active: index === activeIndex }"
          :style="{
            backgroundImage: `url(${index === activeIndex ? REWARD_BOX_BG_3 : REWARD_BOX_BG_1})`,
          }"
        >
          <span class="reward-rate">{{ item.rate }}</span>
          <div class="reward-stack">
            <img class="reward-img" :src="item.image" />
            <span class="reward-name">{{ item.name }}</span>
          </div>
        </div>
      </div>

      <!-- 抽奖按钮 -->
      <div class="draw-btn-group">
        <div
          class="draw-btn once"
          :style="{ backgroundImage: `url(${DRAW_BTN_1})` }"
          @click="onDraw(1)"
        >
          <span class="draw-btn-text">{{ locales['1Time'] }}</span>
        </div>
        <div
          class="draw-btn ten"
          :style="{ backgroundImage: `url(${DRAW_BTN_10})` }"
          @click="onDraw(10)"
        >
          <span class="draw-btn-text">{{ locales['10Time'] }}</span>
        </div>
      </div>

      <!-- 剩余抽奖次数 -->
      <div class="draw-count">
        <span class="draw-count-label">{{ locales['抽奖次数'] }}:</span>
        <span class="draw-count-value">{{ spinCount }}</span>
        <img class="draw-count-icon" :src="COIN_ICON" />
        <span class="record-link" @click="showLotteryRecord = true">{{ locales['抽奖记录'] }}</span>
      </div>

      <!-- Tab 导航 -->
      <div class="tab-nav">
        <div class="tab-item" :style="{ backgroundImage: `url(${TAB_TASK})` }">
          <span class="tab-text">{{ locales['Task'] }}</span>
        </div>
      </div>

      <!-- 任务提示条 -->
      <div class="task-tip" :style="{ backgroundImage: `url(${TASK_TIP_BG})` }">
        <span class="task-tip-text">{{ locales['任务提示'] }}</span>
      </div>

      <div class="task-list">
        <div
          v-for="task in taskList"
          :key="task.id"
          class="task-item"
          :class="task.status"
          :style="{ backgroundImage: `url(${NEW_TASK_BORDER})` }"
        >
          <div v-if="task.status === 'done'" class="task-mask"></div>
          <div class="task-main">
            <div class="task-info">
              <div class="task-title" v-html="formatTaskTitle(task)"></div>
              <div class="task-progress">
                <div class="task-progress-text">
                  <span class="current">{{ task.current }}</span>
                  <span class="total">/{{ task.total }}</span>
                </div>
                <div class="task-progress-track">
                  <div
                    class="task-progress-fill"
                    :style="{
                      width: `${Math.min((task.current / task.total) * 100, 100)}%`,
                    }"
                  />
                </div>
              </div>
            </div>
            <template v-if="task.status === 'done'">
              <img class="task-check" :src="TASK_ICON_CHECK" />
            </template>
            <template v-else>
              <div
                class="task-action"
                :class="task.status"
                :style="{
                  backgroundImage: `url(${task.status === 'get' ? TASK_BTN_GET : TASK_ICON_GO})`,
                }"
                @click="onTaskClick(task)"
              >
                <span class="task-action-text">
                  {{ task.status === 'get' ? locales['GET'] : locales['GO'] }}
                </span>
              </div>
            </template>
          </div>
          <div class="task-reward-list">
            <div
              v-for="(reward, rIndex) in task.rewards"
              :key="rIndex"
              class="task-reward-item"
              :style="{ backgroundImage: `url(${REWARD_BOX_BG_1})` }"
            >
              <span class="task-reward-day">{{ reward.day }}</span>
              <img class="task-reward-img" :src="reward.image" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 规则弹窗 -->
    <rulesModel :is-show="isShow" @onToggle="isShow = false" />

    <!-- 抽奖奖励弹窗 -->
    <drawRewardDialog
      :is-show="showRewardDialog"
      :list="rewardResult"
      @onToggle="showRewardDialog = false"
    />

    <!-- 达标弹窗 -->
    <milestoneDialog :is-show="showMilestoneDialog" @onToggle="showMilestoneDialog = false" />

    <!-- 抽奖记录弹窗 -->
    <lotteryRecordPopup :is-show="showLotteryRecord" @onToggle="showLotteryRecord = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, provide, watch } from 'vue';
import { utils, webviewFun } from '@/utils';
import rulesModel from './components/rules-model.vue';
import drawRewardDialog from './components/draw-reward-dialog.vue';
import milestoneDialog from './components/milestone-dialog.vue';
import lotteryRecordPopup from './components/lottery-record-popup.vue';
import useAudioStore from '@/stores/audio';
import localesList from './locales';
import { activityApi, resolvePrizeImage } from './api';
import {
  CHAMPION_REWARD_1,
  CHAMPION_REWARD_2,
  CHAMPION_REWARD_3,
  CHAMPION_REWARD_4,
} from './resources';
import {
  ICON_BACK,
  BANNER_BG,
  BANNER_TITLE,
  RULE_BTN,
  CONTENT_BG,
  REWARD_BOX_BG_1,
  REWARD_BOX_BG_3,
  DRAW_BTN_1,
  DRAW_BTN_10,
  COIN_ICON,
  TAB_TASK,
  TASK_TIP_BG,
  NEW_TASK_BORDER,
  TASK_ICON_CHECK,
  TASK_ICON_GO,
  TASK_BTN_GET,
} from './resources';

const { transformLocales } = utils;
const { closeWebViewPage, hiddenBackButton } = webviewFun;

const language = window.localStorage.getItem('language') || 'en';
const locales = transformLocales(language, localesList);
const isShow = ref(false);
const showRewardDialog = ref(false);
const showMilestoneDialog = ref(false);
const showLotteryRecord = ref(false);
const rewardResult = ref([]);
const spinCount = ref(0);
const noticeIndex = ref(0);
let noticeTimer = null;
const activeIndex = ref(-1);
const isSpinning = ref(false);

// 从 API 加载的数据
const rewardList = ref([]);
const taskList = ref([]);
const winNoticeList = ref([]);

const taskRewards = [
  { day: '5 Days', image: CHAMPION_REWARD_1 },
  { day: '5 Days', image: CHAMPION_REWARD_2 },
  { day: '5 Days', image: CHAMPION_REWARD_3 },
  { day: '5 Days', image: CHAMPION_REWARD_4 },
];

const audioStore = useAudioStore();
const isMusicPlaying = ref(audioStore.play);

const togglePlay = () => {
  isMusicPlaying.value = !isMusicPlaying.value;
  audioStore.onTogglePlay(isMusicPlaying.value);
};

watch(
  () => audioStore.play,
  (v) => {
    isMusicPlaying.value = v;
  },
  { immediate: true },
);

provide('locales', locales);
provide('language', language);

// 4x4 从外往内顺时针螺旋滚动顺序
const SPIRAL_ORDER = [0, 1, 2, 3, 7, 11, 15, 14, 13, 12, 8, 4, 5, 6, 10, 9];

const startSpin = () => {
  return new Promise((resolve) => {
    if (isSpinning.value) return;
    isSpinning.value = true;

    const targetIndex = Math.floor(Math.random() * rewardList.value.length);
    const targetSpiralIndex = SPIRAL_ORDER.indexOf(targetIndex);
    const rounds = 3;
    const totalSteps = rounds * SPIRAL_ORDER.length + targetSpiralIndex;
    let currentStep = 0;
    let currentSpiralPos = 0;
    activeIndex.value = SPIRAL_ORDER[0];

    const scheduleNext = () => {
      if (currentStep >= totalSteps) {
        isSpinning.value = false;
        activeIndex.value = -1;
        resolve(targetIndex);
        return;
      }
      const progress = currentStep / totalSteps;
      const delay = 60 + 180 * (progress * progress);
      setTimeout(() => {
        currentStep += 1;
        currentSpiralPos = (currentSpiralPos + 1) % SPIRAL_ORDER.length;
        activeIndex.value = SPIRAL_ORDER[currentSpiralPos];
        scheduleNext();
      }, delay);
    };

    scheduleNext();
  });
};

const onDraw = async (times) => {
  if (isSpinning.value) return;
  if (spinCount.value < times) {
    alert('抽奖次数不足');
    return;
  }

  await startSpin();

  try {
    const result = await activityApi.draw(times === 1 ? 1 : 2);
    rewardResult.value = result.prizes.map((p) => ({
      name: p.name,
      image: resolvePrizeImage(p.image),
      count: p.count,
    }));
    showRewardDialog.value = true;
    // 刷新首页数据（更新剩余次数等）
    await loadHome();
  } catch (e) {
    console.error('draw failed:', e);
    alert(e.message || '抽奖失败');
  }
};

const onTaskClick = async (task) => {
  if (task.status === 'get') {
    try {
      const result = await activityApi.claimTask(task.taskType);
      spinCount.value = result.drawCount;
      await loadHome();
    } catch (e) {
      console.error('claimTask failed:', e);
      alert(e.message || '领取失败');
    }
  }
};

const formatTaskTitle = (task) => {
  const tpl = locales['任务标题'] || '';
  return tpl
    .replace('{n}', task.type)
    .replace('{v}', `<span class="highlight">${task.reward}</span>`);
};

// ──────────────────────────────────────────────
// 从后端 API 加载首页数据
// ──────────────────────────────────────────────

async function loadHome() {
  try {
    const home = await activityApi.getHome();
    spinCount.value = home.drawCount;
    rewardList.value = home.prizeList.map((p) => ({
      ...p,
      image: resolvePrizeImage(p.imageKey),
    }));
    taskList.value = home.taskList.map((t) => ({
      id: t.id,
      taskType: t.taskType,
      reward: `${t.drawReward}${locales['1Time'] || '次'}`,
      type: t.taskDesc,
      current: t.currentValue,
      total: t.taskValue,
      status: t.status === 0 ? 'go' : t.status === 1 ? 'get' : 'done',
      rewards: taskRewards,
    }));
    winNoticeList.value = home.marqueeList.map((m) => ({
      user: m.nickname,
      reward: String(m.gold),
      unit: locales['金币'],
    }));
  } catch (e) {
    console.error('loadHome failed:', e);
  }
}

onMounted(async () => {
  hiddenBackButton();
  await loadHome();
  noticeTimer = setInterval(() => {
    if (winNoticeList.value.length > 0) {
      noticeIndex.value = (noticeIndex.value + 1) % winNoticeList.value.length;
    }
  }, 3000);
});

onUnmounted(() => {
  if (noticeTimer) {
    clearInterval(noticeTimer);
    noticeTimer = null;
  }
});
</script>

<style scoped lang="less">
.turkish-wheel-page {
  width: 750px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #100000;
  position: relative;
}

.header-bar {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  width: 750px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 32px 24px;
  box-sizing: border-box;

  .icon-back {
    width: 88px;
    height: 88px;
    display: block;
    pointer-events: auto;
  }
}

.banner {
  position: relative;
  z-index: 1;
  width: 750px;
  height: 858px;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .banner-title {
    width: 590px;
    height: 340px;
    margin: 76px 0 0 80px;
    object-fit: contain;
  }

  .rule-btn {
    position: absolute;
    top: 200px;
    right: 0;
    z-index: 2;
    width: 192px;
    height: 96px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}

.content {
  position: relative;
  z-index: 2;
  width: 750px;
  height: 1592px;
  margin-top: -536px;
  padding-top: 340px;
  padding-bottom: 120px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
}

.win-notice {
  width: 428px;
  height: 28px;
  margin: 0 0 0 162px;
  overflow: hidden;
  font-size: 24px;
  line-height: 24px;

  .notice-track {
    display: flex;
    height: 100%;
    transition: transform 0.5s ease;
  }

  .notice-item {
    flex-shrink: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  }

  .user {
    font-weight: 700;
    color: #ffabab;
  }

  .text {
    color: #ffabab;
  }
}

.reward-grid {
  width: 506px;
  margin: 26px 0 0 124px;
  display: flex;
  flex-wrap: wrap;

  .reward-item {
    position: relative;
    width: 120px;
    height: 146px;
    margin: 0 8px 4px 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;

    &:nth-child(4n) {
      margin-right: 0;
    }

    .reward-rate {
      margin-top: 10px;
      font-size: 18px;
      line-height: 18px;
      color: #e2c472;
      white-space: nowrap;
    }

    .reward-stack {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .reward-img {
        max-width: 108px;
        max-height: 84px;
        object-fit: contain;
      }

      .reward-name {
        margin-top: 4px;
        font-size: 18px;
        line-height: 18px;
        color: #e2c472;
        white-space: nowrap;
      }
    }

    &.active {
      .reward-rate,
      .reward-name {
        color: #301d00;
      }
    }
  }
}

.draw-btn-group {
  width: 476px;
  margin: 36px auto 0;
  display: flex;
  justify-content: space-between;

  .draw-btn {
    width: 218px;
    height: 118px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .draw-btn-text {
      font-size: 36px;
      font-weight: 700;
      line-height: 36px;
      margin-bottom: 50px;
      background-image: linear-gradient(270deg, #592200 0, #9e5608 46.634614%, #592200 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}

.draw-count {
  width: 302px;
  height: 30px;
  margin: 34px auto 0;
  display: flex;
  align-items: center;

  .draw-count-label {
    font-size: 24px;
    line-height: 24px;
    color: #ffabab;
    white-space: nowrap;
  }

  .draw-count-value {
    margin-left: 10px;
    font-size: 24px;
    font-weight: 700;
    line-height: 24px;
    color: #ffabab;
    white-space: nowrap;
  }

  .draw-count-icon {
    width: 30px;
    height: 30px;
    margin-left: 8px;
  }

  .record-link {
    margin-left: 20px;
    font-size: 22px;
    line-height: 24px;
    color: #ffdb85;
    text-decoration: underline;
    white-space: nowrap;
    cursor: pointer;
  }
}

.tab-nav {
  width: 732px;
  height: 170px;
  margin: 118px auto 0;
  display: flex;
  justify-content: center;

  .tab-item {
    width: 360px;
    height: 166px;
    margin-top: 4px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .tab-text {
      font-size: 36px;
      font-weight: 700;
      line-height: 36px;
      color: #b27471;
    }
  }
}

.task-tip {
  width: 750px;
  height: 40px;
  margin-top: 14px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .task-tip-text {
    font-size: 24px;
    line-height: 24px;
    color: #ffabab;
    white-space: nowrap;
  }
}

.task-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 120px;

  .task-item {
    position: relative;
    width: 730px;
    height: 392px;
    margin: 0 auto;
    padding: 76px 50px 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    .task-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.55);
      z-index: 1;
      pointer-events: none;
    }

    .task-main {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .task-info {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .task-title {
        font-size: 24px;
        line-height: 30px;
        color: #ffabab;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        .highlight {
          font-weight: 700;
        }
      }

      .task-progress {
        display: flex;
        align-items: center;
        gap: 12px;

        .task-progress-text {
          width: 84px;
          font-size: 24px;
          line-height: 28px;
          white-space: nowrap;

          .current {
            font-weight: 700;
            color: #ffdb85;
          }

          .total {
            color: #ffabab;
          }
        }

        .task-progress-track {
          width: 330px;
          height: 28px;
          background-color: #240101;
          border: 1px solid #b45555;
          border-radius: 90px;
          overflow: hidden;
          box-sizing: border-box;
          display: flex;
          align-items: center;

          .task-progress-fill {
            height: 95%;
            background-image: linear-gradient(90deg, #ca9d55 0, #ffe799 100%);
            border-radius: 90px;
          }
        }
      }
    }

    .task-check {
      width: 62px;
      height: 62px;
      margin-right: 24px;
      flex-shrink: 0;
      position: relative;
      z-index: 2;
    }

    .task-action {
      width: 130px;
      height: 50px;
      margin-right: 24px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
      z-index: 2;
      cursor: pointer;

      .task-action-text {
        font-size: 16px;
        font-weight: 700;
        line-height: 16px;
        background-image: linear-gradient(270deg, #592200 0, #9e5608 46.634614%, #592200 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      &.get .task-action-text {
        background-image: linear-gradient(270deg, #65100b 0, #bb3e36 46.634614%, #65100b 100%);
      }
    }

    .task-reward-list {
      display: flex;
      justify-content: space-between;
      width: 540px;
      margin-top: 10px;

      .task-reward-item {
        width: 120px;
        height: 146px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 10px;

        .task-reward-day {
          font-size: 18px;
          line-height: 18px;
          color: #e2c472;
          white-space: nowrap;
        }

        .task-reward-img {
          width: 88px;
          height: 82px;
          margin-top: 20px;
          object-fit: contain;
        }
      }
    }

    &.done {
      .task-progress-fill {
        background-image: linear-gradient(90deg, #8a8a8a 0, #d0d0d0 100%);
      }
    }
  }
}

.ep {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rtl {
  .banner {
    .banner-title {
      margin-left: 0;
      margin-right: 80px;
    }

    .rule-btn {
      right: auto;
      left: 0;
    }
  }

  .win-notice {
    margin-left: auto;
    margin-right: 162px;
    direction: ltr;
  }

  .reward-grid {
    margin-left: auto;
    margin-right: 124px;

    .reward-item {
      margin-right: 0;
      margin-left: 8px;

      &:nth-child(4n) {
        margin-left: 0;
      }
    }
  }

  .draw-count {
    .draw-count-value {
      margin-left: 0;
      margin-right: 10px;
    }

    .draw-count-icon {
      margin-left: 0;
      margin-right: 8px;
    }
  }

  .task-list {
    .task-item {
      .task-info {
        align-items: flex-end;

        .task-title,
        .task-progress-text {
          text-align: right;
        }
      }

      .task-progress-track {
        transform: scaleX(-1);
      }

      .task-check {
        margin-right: 0;
        margin-left: 24px;
      }

      .task-action {
        margin-right: 0;
        margin-left: 24px;
      }
    }
  }
}
</style>

<style lang="less">
body {
  background-color: #100000;
}
</style>

<template>
  <div class="rank-page" v-arClass:rtl>
    <!-- 子 Tab -->
    <div class="rank-tabs">
      <div
        class="rank-tabs-track"
        :style="{ backgroundImage: `url(${resources.CHARM_WEALTH_TAB})` }"
      >
        <div
          class="rank-tabs-slider"
          :style="{
            backgroundImage: `url(${resources.CHARM_WEALTH_TAB_ACTIVE})`,
            transform: `translateX(${
              isRtl ? (activeSubTab === 0 ? '46%' : '-20%') : activeSubTab === 0 ? '-20%' : '46%'
            }) translateY(-60%)`,
          }"
        ></div>
        <div
          v-for="(tab, i) in subTabs"
          :key="tab.key"
          class="rank-tab"
          :class="{ active: activeSubTab === i }"
          @click="activeSubTab = i"
        >
          {{ tab.label }}
        </div>
      </div>
    </div>

    <!-- 内层 Swiper -->
    <Swiper
      class="rank-swiper"
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
        <div class="rank-slide">
          <!-- 场景背景（领奖台区域） -->
          <div class="rank-body" :style="{ backgroundImage: `url(${resources.SCENE_BG})` }">
            <!-- 领奖台 -->
            <div class="podium" :class="{ charm: isCharm, wealth: !isCharm }">
              <div
                v-for="item in podiumList"
                :key="item.key"
                class="podium-item"
                :class="item.className"
              >
                <!-- 上 -->
                <div class="podium-avatar-wrap">
                  <!-- 头像在下层（盖在头像框底下），用户头像是正圆 -->
                  <Avatar class="podium-avatar" :avatar="item.user.avatar" />
                  <!-- 头像框在上层（盖上去） -->
                  <img class="podium-frame" :src="item.frame" />
                </div>
                <!-- 下 -->
                <div
                  class="podium-info"
                  :style="{
                    backgroundImage: `url(${resources.AVATAR_TOP_INFO_BORDER})`,
                  }"
                >
                  <div class="ep podium-name">{{ item.user.name }}</div>
                  <div class="podium-value">
                    <img class="value-icon" :src="valueIcon" />
                    <span>{{ numberThumbnail(Number(item.user.value)) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 排行列表（场景背景外层，文档流接在后面） -->
          <div class="rank-list">
            <div
              v-for="(item, i) in rankList"
              :key="item.id"
              class="rank-item"
              :style="{ backgroundImage: `url(${resources.RANK_ITEM_BORDER})` }"
            >
              <div class="rank-avatar-wrap">
                <Avatar class="rank-avatar" :avatar="item.avatar" />
              </div>
              <div class="rank-info">
                <div
                  class="rank-name-bg"
                  :style="{
                    backgroundImage: `url(${resources.RANK_ITEM_NAME_BG})`,
                  }"
                >
                  <div class="ep rank-name">{{ item.name }}</div>
                </div>
                <!-- 下排：榜单数值 | 分隔线 | 落后 -->
                <div class="rank-bottom">
                  <div class="rank-value">
                    <img class="value-icon" :src="valueIcon" />
                    <div class="rank-value-text">
                      <span class="label">
                        {{ scoreLabel }}
                      </span>
                      <span class="num">
                        {{ numberThumbnail(Number(item.value)) }}
                      </span>
                    </div>
                  </div>
                  <div class="rank-divider"></div>
                  <div class="rank-backward">
                    <span class="label">
                      {{ locales['落后'] || 'Backwards' }}
                    </span>
                    <span class="num">
                      {{ numberThumbnail(getRankGap(rankList, i, topUsers)) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="rank-num">{{ item.rank }}</div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- 我的排名 -->
    <Teleport to="body">
      <div
        v-show="props.isActive"
        class="my-rank-fixed"
        v-arClass:rtl
        :style="{ backgroundImage: `url(${resources.MY_RANK_BORDER})` }"
      >
        <!-- 头像 114*114（金色圆环） -->
        <div class="my-rank-avatar-wrap">
          <Avatar class="my-rank-avatar" :avatar="myRank.avatar" />
        </div>

        <!-- 中间：上昵称 下（榜单数值 | 落后） -->
        <div class="my-rank-center">
          <div
            class="my-rank-name-bg"
            :style="{ backgroundImage: `url(${resources.MY_RANK_NAME_BG})` }"
          >
            <div class="ep my-rank-name">{{ myRank.name }}</div>
          </div>

          <!-- 下排：榜单数值 | 分隔线 | 落后 -->
          <div class="my-rank-bottom">
            <div class="my-rank-value">
              <img class="value-icon" :src="valueIcon" />
              <div class="my-rank-value-text">
                <span class="label">
                  {{ scoreLabel }}
                </span>
                <span class="num">
                  {{ numberThumbnail(Number(myRank.value)) }}
                </span>
              </div>
            </div>

            <div class="my-rank-divider"></div>

            <div class="my-rank-backward">
              <span class="label">{{ locales['落后'] || 'Backwards' }}</span>
              <span class="num">{{ numberThumbnail(myRankBackward) }}</span>
            </div>
          </div>
        </div>

        <!-- 右侧：排名 -->
        <div class="my-rank-rank">{{ myRank.rank }}</div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, inject, watch, onUnmounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import Avatar from '@/components/Avatar/index.vue';
import useBaseStore from '@/stores/base';
import { utils } from '@/utils';
import { getRankGap } from '../helper';

const { numberThumbnail } = utils;
const locales = inject('locales') || {};
const store = inject('activityStore');
const resources = inject('activityResources') || {};
const config = inject('activityConfig') || {};
const outerSwiper = inject('outerSwiper', null);

const props = defineProps({
  isActive: {
    type: Boolean,
    default: true,
  },
});

const baseStore = useBaseStore();
const isRtl = computed(() => baseStore.isRtl);

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
const currentRankType = computed(() => subTabs.value[activeSubTab.value]?.key || 'charm');

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

const isCharm = computed(() => activeSubTab.value === 0);
const valueIcon = computed(() =>
  isCharm.value ? resources.CHARM_VALUE_ICON : resources.WEALTH_VALUE_ICON,
);

const scoreLabel = computed(() => locales[config.scoreLabelKey || '祝福值'] || 'Blessing Value');

const frameMap = {
  charm: [resources.CHARM_AVATAR_TOP1, resources.CHARM_AVATAR_TOP2, resources.CHARM_AVATAR_TOP3],
  wealth: [
    resources.WEALTH_AVATAR_TOP1,
    resources.WEALTH_AVATAR_TOP2,
    resources.WEALTH_AVATAR_TOP3,
  ],
};

const rankData = computed(() => store.mapRankData(currentRankType.value));
const rankList = computed(() => rankData.value.rankList);
const myRank = computed(() => rankData.value.myRank);
const topUsers = computed(() => rankData.value.topUsers);

const podiumList = computed(() => {
  const frames = isCharm.value ? frameMap.charm : frameMap.wealth;
  const users = topUsers.value;
  return [
    {
      key: 'top1',
      className: 'top1',
      frame: frames[0],
      user: users[0] || {},
    },
    {
      key: 'top2',
      className: 'top2',
      frame: frames[1],
      user: users[1] || {},
    },
    {
      key: 'top3',
      className: 'top3',
      frame: frames[2],
      user: users[2] || {},
    },
  ];
});

// 我的排名落后值：与榜单最后一名对比
const myRankBackward = computed(() => {
  const list = rankList.value;
  if (!list.length) return 0;
  return getRankGap([...list, myRank.value], list.length, topUsers.value);
});

// 一级 tab 为 rank 且切换子 tab 时请求榜单接口
watch(
  [() => props.isActive, currentRankType],
  ([active]) => {
    if (active) {
      store.fetchRankInfo(currentRankType.value);
    }
  },
  { immediate: true },
);
</script>

<style scoped lang="less">
.rank-page {
  position: relative;
  width: 750px;
  margin: 0 auto;
  padding-bottom: 80px;
  margin-top: -200px;
}

// 子 Tab
.rank-tabs {
  position: relative;
  z-index: 999;
  top: 200px;
  display: flex;
  justify-content: center;
  padding-top: 16px;

  .rank-tabs-track {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 354px;
    height: 56px;
    margin: 20px auto 0;
    background: no-repeat center / 100% 100%;

    .rank-tabs-slider {
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

  .rank-tab {
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

// 内层 Swiper
.rank-swiper {
  margin-top: 16px;
}

.rank-body {
  position: relative;
  padding: 0px 24px 48px;
  background: no-repeat top center / 100% 100%;
  height: 1514px;
}

.podium {
  position: relative;
  width: 100%;
  height: 1514px;
  top: -30px;

  .podium-item {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;

    .podium-avatar-wrap {
      position: relative;

      // 头像在下层（头像框盖在头像上）
      .podium-avatar {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        // 正圆（长宽相同）
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        overflow: hidden;
        z-index: 0;
      }

      // 头像框在上层
      .podium-frame {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        z-index: 1;
        pointer-events: none;
      }
    }

    .podium-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: no-repeat center / 100% 100%;

      .podium-name {
        max-width: 90%;
        font-size: 26px;
        color: #fff;
        text-align: center;
      }

      .podium-value {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 4px;
        font-size: 24px;
        background: linear-gradient(91deg, #ffdb8c 0%, #fffbf0 50%, #ffdb8c 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;

        .value-icon {
          width: 26px;
          height: 26px;
        }
      }
    }
  }

  // ========== 财富榜（wealth）每项独立：位置 / 头像框 / info / 头像大小 ==========
  &.wealth {
    // Top1
    .podium-item.top1 {
      left: -3%;
      top: 250px;

      .podium-avatar-wrap {
        width: 534px;
        height: 410px;
      }
      .podium-avatar {
        width: 240px;
        height: 240px;
      }
      .podium-info {
        width: 360px;
        height: 96px;
        margin-top: -30px;
      }
    }
    // Top2
    .podium-item.top2 {
      right: 10px;
      top: 600px;

      .podium-avatar-wrap {
        width: 338px;
        height: 288px;
      }
      .podium-avatar {
        margin-left: 5px;
        width: 170px;
        height: 170px;
      }
      .podium-info {
        width: 300px;
        height: 80px;
        margin-top: -10px;
      }
    }
    // Top3
    .podium-item.top3 {
      left: 10px;
      top: 830px;

      .podium-avatar-wrap {
        width: 320px;
        height: 274px;
      }
      .podium-avatar {
        width: 140px;
        height: 140px;
      }
      .podium-info {
        width: 300px;
        height: 80px;
        margin-top: -6px;
      }
    }
  }

  // ========== 魅力榜（charm）每项独立：位置 / 头像框 / info / 头像大小 ==========
  &.charm {
    // Top1
    .podium-item.top1 {
      left: -3%;
      top: 220px;

      .podium-avatar-wrap {
        width: 546px;
        height: 472px;
      }
      .podium-avatar {
        width: 260px;
        height: 260px;
      }
      .podium-info {
        width: 360px;
        height: 96px;
        margin-top: -20px;
      }
    }
    // Top2
    .podium-item.top2 {
      right: 10px;
      top: 640px;

      .podium-avatar-wrap {
        width: 338px;
        height: 288px;
      }
      .podium-avatar {
        width: 170px;
        height: 170px;
      }
      .podium-info {
        width: 300px;
        height: 80px;
        margin-top: 6px;
      }
    }
    // Top3
    .podium-item.top3 {
      left: 10px;
      top: 850px;

      .podium-avatar-wrap {
        width: 330px;
        height: 252px;
      }
      .podium-avatar {
        width: 138px;
        height: 138px;
      }
      .podium-info {
        width: 300px;
        height: 80px;
        margin-top: 6px;
      }
    }
  }
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 200px;
  padding: 0 24px 24px;
  margin-top: -220px;
  box-sizing: border-box;

  .rank-item {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 206px;
    padding: 0 32px;
    box-sizing: border-box;
    background: no-repeat center / 100% 100%;

    // 头像（金色圆环）
    .rank-avatar-wrap {
      flex: 0 0 auto;
      width: 108px;
      height: 108px;
      margin-right: 24px;
      padding: 6px;
      box-sizing: border-box;
      border-radius: 50%;
      background: linear-gradient(180deg, #f7dfa0 0%, #caa24a 100%);

      .rank-avatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid #fff8e0;
        box-sizing: border-box;
      }
    }

    .rank-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 10px;
      flex: 1;
      min-width: 0;

      .rank-name-bg {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 232px;
        height: 48px;
        background: no-repeat center / 100% 100%;

        .rank-name {
          max-width: 90%;
          font-size: 26px;
          color: #fff;
        }
      }

      // 下排：榜单数值 | 分隔线 | 落后
      .rank-bottom {
        display: flex;
        align-items: center;

        .rank-value {
          display: flex;
          align-items: center;
          gap: 10px;

          .value-icon {
            width: 44px;
            height: 44px;
          }

          .rank-value-text {
            display: flex;
            flex-direction: column;

            .label {
              font-size: 24px;
              color: var(--activity-text-sub, #4b3a6e);
            }

            .num {
              font-size: 34px;
              font-weight: 600;
              line-height: 1.15;
              color: var(--activity-text-main, #3a2456);
            }
          }
        }

        // 竖分隔线
        .rank-divider {
          flex: 0 0 auto;
          width: 2px;
          height: 76px;
          margin: 0 28px;
          background: rgba(90, 58, 130, 0.3);
        }

        .rank-backward {
          display: flex;
          flex-direction: column;
          align-items: center;

          .label {
            font-size: 24px;
            color: var(--activity-text-sub, #4b3a6e);
          }

          .num {
            font-size: 34px;
            font-weight: 600;
            line-height: 1.15;
            color: var(--activity-text-main, #3a2456);
          }
        }
      }
    }

    // 右侧：排名
    .rank-num {
      flex: 0 0 auto;
      width: 80px;
      font-size: 44px;
      font-weight: 700;
      text-align: center;
      color: var(--activity-rank-num, #43297c);
    }
  }
}

.my-rank-fixed {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  z-index: 200;
  width: 750px;
  height: 230px;
  display: flex;
  align-items: center;
  padding: 35px 48px 0;
  box-sizing: border-box;
  background: no-repeat center / 100% 100%;

  // 头像 114*114（金色圆环）
  .my-rank-avatar-wrap {
    flex: 0 0 auto;
    width: 114px;
    height: 114px;
    margin-right: 28px;
    padding: 6px;
    box-sizing: border-box;
    border-radius: 50%;
    background: linear-gradient(180deg, #f7dfa0 0%, #caa24a 100%);

    .my-rank-avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid #fff8e0;
      box-sizing: border-box;
    }
  }

  // 中间：上下结构（上昵称，下：榜单数值 | 落后）
  .my-rank-center {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .my-rank-name-bg {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 260px;
      height: 52px;
      background: no-repeat center / 100% 100%;

      .my-rank-name {
        max-width: 90%;
        font-size: 28px;
        color: #fff;
      }
    }

    // 下排：榜单数值 | 分隔线 | 落后
    .my-rank-bottom {
      display: flex;
      align-items: center;

      .my-rank-value {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding-left: 8px;

        .value-icon {
          width: 34px;
          height: 34px;
          margin-top: 4px;
        }

        .my-rank-value-text {
          display: flex;
          flex-direction: column;

          .label {
            font-size: 24px;
            color: var(--activity-my-rank, #5b3100);
          }

          .num {
            font-size: 36px;
            font-weight: 600;
            line-height: 1.15;
            color: var(--activity-my-rank, #5b3100);
          }
        }
      }

      // 竖分隔线
      .my-rank-divider {
        flex: 0 0 auto;
        width: 2px;
        height: 84px;
        margin: 0 32px;
        background: rgba(160, 110, 40, 0.35);
      }

      .my-rank-backward {
        display: flex;
        flex-direction: column;

        .label {
          font-size: 24px;
          color: var(--activity-my-rank, #5b3100);
        }

        .num {
          font-size: 36px;
          font-weight: 600;
          line-height: 1.15;
          color: var(--activity-my-rank, #5b3100);
        }
      }
    }
  }

  // 右侧：排名
  .my-rank-rank {
    margin-left: auto;
    font-size: 48px;
    font-weight: 700;
    font-style: italic;
    background: linear-gradient(180deg, var(--activity-my-rank, #5b3100) 0%, #c16800 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.ep {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-page.rtl {
  .rank-item {
    .rank-avatar-wrap {
      margin-right: 0;
      margin-left: 24px;
    }
  }
}

.my-rank-fixed.rtl {
  .my-rank-avatar-wrap {
    margin-right: 0;
    margin-left: 28px;
  }
  .my-rank-rank {
    margin-left: 0;
    margin-right: auto;
  }
}
</style>

<!-- 抽奖记录弹窗 -->
<template>
  <div>
    <van-popup v-model:show="visible" position="bottom" close-on-click-overlay @close="onClose">
      <div class="lottery-popup direction-ltr">
        <div class="close-btn" @click="onClose">×</div>
        <SectionBorder
          :width="750"
          :top-image="WHEEL_RECORD_TOP"
          :top-height="416"
          :middle-image="WHEEL_RECORD_MIDDLE"
          :bottom-image="WHEEL_RECORD_BOTTOM"
          :bottom-height="100"
          :middle-padding="0"
          :content-padding-top="280"
          :content-padding-bottom="60"
        >
          <div class="lottery-content flex flex-column">
            <div class="lottery-title flex flex-center">
              <img class="title-icon" :src="TITLE_LEFT" />
              <span class="title-text">{{ locales['抽奖记录'] }}</span>
              <img class="title-icon" :src="TITLE_RIGHT" />
            </div>
            <div class="lottery-stats flex flex-space-between flex-align-center">
              <div class="stats-left flex flex-align-center">
                <img class="stats-coin" :src="COIN_ICON" />
                <span class="stats-count">{{ totalDraws }}</span>
              </div>
              <span class="stats-text">{{ statsText }}</span>
            </div>
            <div class="record-list flex-1">
              <p v-if="loading" class="muted">加载中…</p>
              <p v-else-if="recordList.length === 0" class="muted">暂无抽奖记录</p>
              <div v-for="(record, index) in recordList" :key="index" class="record-card">
                <div class="record-header flex flex-space-between flex-align-center">
                  <span class="record-time">{{ record.time }}</span>
                  <span class="record-tag">{{ record.drawText }}</span>
                </div>
                <div
                  class="record-body"
                  :class="{
                    single: record.type === 'single',
                    ten: record.type === 'ten',
                  }"
                >
                  <span class="prize-label">{{ locales['获得奖品'] }}</span>
                  <div class="prize-list flex flex-wrap">
                    <div
                      v-for="(prize, pIndex) in record.prizes"
                      :key="pIndex"
                      class="prize-item flex flex-column flex-center"
                      :style="{ backgroundImage: `url(${GIFT_BORDER})` }"
                    >
                      <span class="prize-count">×{{ prize.count }}</span>
                      <img class="prize-img" :src="prize.image" />
                      <span class="prize-name">{{ prize.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionBorder>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { inject, computed, ref, watch } from 'vue';
import SectionBorder from '@/components/section-border/index.vue';
import {
  WHEEL_RECORD_TOP,
  WHEEL_RECORD_MIDDLE,
  WHEEL_RECORD_BOTTOM,
  COIN_ICON,
  GIFT_BORDER,
  TITLE_LEFT,
  TITLE_RIGHT,
} from '../resources';
import { activityApi, resolvePrizeImage } from '../api';

const locales = inject('locales') || {};
const props = defineProps(['isShow']);
const emit = defineEmits(['onToggle']);

const loading = ref(false);
const records = ref([]);

const visible = computed({
  get: () => props.isShow,
  set: (v) => emit('onToggle', v),
});

async function loadRecords() {
  loading.value = true;
  try {
    const res = await activityApi.listRecords(1, 50);
    records.value = res.items;
  } catch (e) {
    console.error('loadRecords failed:', e);
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.isShow,
  (v) => {
    if (v) loadRecords();
  },
);

const totalDraws = computed(() =>
  records.value.reduce((sum, record) => sum + (record.drawType === 2 ? 10 : 1), 0),
);

const statsText = computed(() => {
  const tpl = locales['已进行X次抽奖'] || '{n} prize draws have been held';
  return tpl.replace('{n}', totalDraws.value);
});

const recordList = computed(() =>
  records.value.map((record) => ({
    time: record.createdAt ? new Date(record.createdAt).toLocaleString() : '',
    type: record.drawType === 2 ? 'ten' : 'single',
    drawText:
      record.drawType === 2
        ? `${locales['10Time'] || '10 Time'}`
        : `${locales['1Time'] || '1 Time'}`,
    prizes: record.prizes.map((p) => ({
      ...p,
      image: resolvePrizeImage(p.image),
    })),
  })),
);

const onClose = () => emit('onToggle', false);
</script>

<style scoped lang="less">
:deep(.van-popup) {
  background: transparent !important;
}

:deep(.van-popup--bottom) {
  background: transparent !important;
}

.lottery-popup {
  position: relative;
  width: 750px;
  height: 1200px;
  margin: 0 auto;
  overflow: hidden;

  .close-btn {
    position: absolute;
    top: 40px;
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

  .section-border {
    height: 100%;
  }
}

.lottery-content {
  height: 500px;
  box-sizing: border-box;
  padding: 0 30px;
}

.lottery-title {
  flex-shrink: 0;
  margin-bottom: 30px;

  .title-icon {
    width: 24px;
    height: 54px;
    object-fit: contain;
    margin: 0 24px;
  }

  .title-text {
    font-size: 36px;
    font-weight: 700;
    line-height: 44px;
    color: #ffdb85;
  }
}

.lottery-stats {
  flex-shrink: 0;
  margin-bottom: 30px;

  .stats-left {
    display: flex;
    align-items: center;
  }

  .stats-coin {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }

  .stats-count {
    font-size: 40px;
    font-weight: 700;
    color: #ffdb85;
  }

  .stats-text {
    font-size: 24px;
    color: #ffabab;
  }
}

.muted {
  text-align: center;
  color: #ffabab;
  font-size: 24px;
  padding: 40px 0;
}

.record-list {
  flex: none;
  height: 600px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.record-card {
  position: relative;
  background: rgba(79, 22, 20, 1);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
}

.record-header {
  margin-bottom: 16px;

  .record-time {
    font-size: 24px;
    color: #ffdb85;
  }

  .record-tag {
    position: absolute;
    top: 0;
    right: 0;
    padding: 6px 20px;
    background: linear-gradient(180deg, #ffebb7 0%, #ffcd7a 100%);
    border-radius: 0px 30px 0 30px;
    font-size: 22px;
    font-weight: 700;
    color: #5c3a0b;
  }
}

.record-body {
  display: flex;
  align-items: center;

  &.single {
    justify-content: space-between;

    .prize-label {
      margin-bottom: 0;
    }

    .prize-list {
      justify-content: flex-end;
    }
  }

  &.ten {
    justify-content: space-between;

    .prize-label {
      width: 100px;
      margin-bottom: 0;
      align-self: center;
      flex-shrink: 0;
    }

    .prize-list {
      display: grid;
      grid-template-columns: repeat(5, 100px);
      gap: 10px;
      width: auto;
    }

    .prize-item {
      width: 100px;
      height: 114px;
    }
  }
}

.prize-label {
  font-size: 26px;
  font-weight: 700;
  color: #ffdb85;
}

.prize-list {
  display: flex;
  flex-wrap: wrap;
}

.prize-item {
  position: relative;
  width: 104px;
  height: 118px;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .prize-count {
    position: absolute;
    width: 80px;
    top: 4px;
    right: 6px;
    font-size: 18px;
    color: #e2c472;
    text-align: center;
  }

  .prize-img {
    width: 80px;
    height: 76px;
    object-fit: contain;
  }

  .prize-name {
    position: absolute;
    bottom: 6px;
    left: 0;
    width: 100%;
    font-size: 18px;
    color: #ffdb85;
    text-align: center;
  }
}
</style>

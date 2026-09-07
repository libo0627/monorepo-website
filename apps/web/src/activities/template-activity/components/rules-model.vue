<template>
  <div class="dialog-wrap">
    <Dialog
      v-model:show="visible"
      :show-confirm-button="false"
      :show-cancel-button="false"
      close-on-click-overlay
      @close="onClose"
    >
      <div
        class="rules-dialog"
        :style="{ backgroundImage: `url(${resources.RULE_DIALOG_BG})` }"
        v-arClass:rtl
      >
        <img class="rules-close" :src="resources.ICON_RULE_CLOSE" @click="onClose" />

        <div class="rules-title">{{ locales['规则'] || 'Rules' }}</div>

        <div class="rules-content" v-arClass:rtl>
          <div v-for="(rule, index) in rules" :key="index" class="rule-item">
            <div class="rule-title">{{ rule.title }}</div>
            <div class="rule-text">{{ rule.text }}</div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { computed, inject, ref, watch } from 'vue';
import { Dialog } from 'vant';

const locales = inject('locales') || {};
const config = inject('activityConfig') || {};
const resources = inject('activityResources') || {};

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['onToggle']);

const visible = ref(false);

watch(
  () => props.isShow,
  (value) => {
    visible.value = value;
  },
  { immediate: true },
);

const onClose = () => {
  visible.value = false;
  emit('onToggle', false);
};

/**
 * 规则条数由配置决定，默认 4 条。
 * 每条规则由 locales 中成对的「规则N标题」「规则N内容」提供。
 */
const rules = computed(() => {
  const count = config.ruleCount || 4;
  return Array.from({ length: count }, (_, index) => {
    const num = index + 1;
    return {
      title: locales[`规则${num}标题`] || '',
      text: locales[`规则${num}内容`] || '',
    };
  });
});
</script>

<style scoped lang="less">
:deep(.van-dialog) {
  margin-left: 5px;
  background: transparent !important;
  overflow: visible;
}

:deep(.van-dialog__content) {
  padding: 0 !important;
}

.dialog-wrap {
  width: 730px;
  margin: 0 auto;
  direction: ltr;
}

.rules-dialog {
  position: relative;
  width: 730px;
  height: 874px;
  padding: 160px 100px 140px;
  box-sizing: border-box;
  background: no-repeat center / 100% 100%;

  .rules-close {
    position: absolute;
    top: -30px;
    right: 10px;
    width: 70px;
    height: 70px;
    cursor: pointer;
  }

  .rules-title {
    position: absolute;
    top: 58px;
    left: 50%;
    transform: translateX(-50%);
    width: 220px;
    font-size: 36px;
    font-weight: 700;
    text-align: center;
    color: var(--activity-active, #5b3100);
    text-shadow: 0 2px 4px rgba(255, 255, 255, 0.4);
  }

  .rules-content {
    display: flex;
    flex-direction: column;
    gap: 28px;
    height: 100%;
    overflow-y: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .rule-item {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .rule-title {
        font-size: 28px;
        font-weight: 700;
        line-height: 36px;
        background: linear-gradient(
          90deg,
          var(--activity-primary, #7b4fc4) 0%,
          #a855f7 50%,
          var(--activity-primary, #7b4fc4) 100%
        );
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .rule-text {
        font-size: 26px;
        line-height: 40px;
        color: var(--activity-text-sub, #4b3a6e);
      }
    }
  }
}
</style>

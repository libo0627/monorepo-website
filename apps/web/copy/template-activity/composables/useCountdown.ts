import { ref, computed, watch, onUnmounted } from 'vue';

/**
 * 通用倒计时 hook：管理剩余秒数的递减与格式化
 * @param {Function} getSeconds 获取剩余秒数的 getter（如 () => props.seconds）
 * @returns {{ countdownParts: import('vue').ComputedRef<{ days: String, hours: String, minutes: String, seconds: String, time: String }> }}
 */
export function useCountdown(getSeconds) {
  const remaining = ref(getSeconds());
  const countdownParts = computed(() => formatCountdown(remaining.value));

  let timer = null;
  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };
  const start = () => {
    stop();
    timer = setInterval(() => {
      if (remaining.value > 0) {
        remaining.value -= 1;
      } else {
        stop();
      }
    }, 1000);
  };

  // seconds 变化（如接口返回后）时重置并重新计时
  watch(
    getSeconds,
    (val) => {
      remaining.value = Number(val) || 0;
      start();
    },
    { immediate: true },
  );

  onUnmounted(stop);

  return { countdownParts };
}

/**
 * 倒计时格式化：将剩余秒数转换为 { days, hours, minutes, seconds, time: 'HH:MM:SS' }
 * @param {Number} totalSeconds 剩余秒数
 * @returns {{ days: String, hours: String, minutes: String, seconds: String, time: String }}
 *   days 为补零后的天数，hours/minutes/seconds 为补零后的时/分/秒，time 为补零后的 'HH:MM:SS'
 */
function formatCountdown(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(safe / 86400);
  const hours = Math.floor((safe % 86400) / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
    time: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
  };
}

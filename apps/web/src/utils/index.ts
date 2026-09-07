import { showToast } from 'vant';

/**
 * 通用工具函数集合。
 *
 * 说明：榜单活动模板（src/activities/template-activity）依赖
 * to / cfShowToast / formatNumber 三个方法，这里补齐，保持与原项目一致的调用方式。
 */

/** 把 promise 包成 [err, data]，避免业务里到处 try/catch */
async function to<T>(promise: Promise<T>): Promise<[unknown, T | undefined]> {
  try {
    return [null, await promise];
  } catch (err) {
    return [err, undefined];
  }
}

/** 轻提示 */
function cfShowToast(msg?: string) {
  if (msg) showToast(msg);
}

/** 千分位格式化：1234567 -> 1,234,567 */
function formatNumber(num?: number | string): string {
  const n = Number(num || 0);
  if (!Number.isFinite(n)) return '0';
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** 根据语言选择对应翻译，返回 key→string 的扁平对象 */
function transformLocales(
  language: string,
  localesList: Record<string, Record<string, string>>,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, translations] of Object.entries(localesList)) {
    result[key] = translations[language] || translations['en_US'] || key;
  }
  return result;
}

/**
 * 精确除法，移植自原 hoby 项目 cal.js。
 * 仅用于榜单数字的 K/M 缩略换算，避免浮点误差（如 0.1+0.2）。
 */
function divide(num1: number, num2: number): number {
  const digitLength = (n: number): number => {
    const e = n.toString().split(/[eE]/);
    const len = (e[0].split('.')[1] || '').length - +(e[1] || 0);
    return len > 0 ? len : 0;
  };
  const float2Fixed = (n: number): number => {
    if (n.toString().indexOf('e') === -1) return Number(n.toString().replace('.', ''));
    const d = digitLength(n);
    return d > 0 ? n * 10 ** d : n;
  };
  const times = (a: number, b: number): number => {
    const ac = float2Fixed(a);
    const bc = float2Fixed(b);
    const base = digitLength(a) + digitLength(b);
    return (ac * bc) / 10 ** base;
  };
  const n1 = float2Fixed(num1);
  const n2 = float2Fixed(num2);
  return times(n1 / n2, 10 ** (digitLength(num2) - digitLength(num1)));
}

/**
 * 榜单数字缩略显示：接口返回的礼物积分放大了十倍，先除 10 再按 K/M 缩略。
 * <1000 原样返回；>=1e3 显示一位小数 + K；>=1e6 显示一位小数 + M；>1e9 显示 999.9M+
 * 移植自原 hoby 项目 utils.js 的 numberThumbnail。
 * @param number 礼物积分（已放大十倍）
 */
function numberThumbnail(number?: number | string): number | string {
  const num = divide(Number(number || 0), 10);
  if (num < 1000) return num;

  if (num >= 10 ** 3 && num <= 999999) {
    const codyNum = divide(num, 10 ** 3);
    const decimalIndex = String(codyNum).indexOf('.');
    if (decimalIndex > -1) return String(codyNum).substring(0, decimalIndex + 2) + 'K';
    return codyNum + 'K';
  }

  if (num >= 10 ** 6 && num <= 999999999) {
    const codyNum = divide(num, 10 ** 6);
    const decimalIndex = String(codyNum).indexOf('.');
    if (decimalIndex > -1) return String(codyNum).substring(0, decimalIndex + 2) + 'M';
    return codyNum + 'M';
  }

  if (num > 999999999) return '999.9M+';
  return num;
}

/**
 * 榜单数字缩略显示（不放大）：与 numberThumbnail 逻辑一致，但积分不再除以 10。
 * 移植自原 hoby 项目 utils.js 的 numberThumbnail2。
 */
function numberThumbnail2(number?: number | string): number | string {
  const num = Number(number || 0);
  if (num < 1000) return num;

  if (num >= 10 ** 3 && num <= 999999) {
    const codyNum = divide(num, 10 ** 3);
    const decimalIndex = String(codyNum).indexOf('.');
    if (decimalIndex > -1) return String(codyNum).substring(0, decimalIndex + 2) + 'K';
    return codyNum + 'K';
  }

  if (num >= 10 ** 6) {
    const codyNum = divide(num, 10 ** 6);
    const decimalIndex = String(codyNum).indexOf('.');
    if (decimalIndex > -1) return String(codyNum).substring(0, decimalIndex + 2) + 'M';
    return codyNum + 'M';
  }
  return num;
}

export const utils = {
  to,
  cfShowToast,
  formatNumber,
  transformLocales,
  numberThumbnail,
  numberThumbnail2,
};

export const webviewFun = {
  closeWebViewPage() {
    if (window.history.length > 1) {
      window.history.back();
    }
  },
  hiddenBackButton() {
    // webview 环境下隐藏返回按钮，浏览器环境无操作
  },
};

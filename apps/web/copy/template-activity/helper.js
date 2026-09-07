/**
 * 计算榜单列表中每项落后前一名的差值
 * 第 4 名对比 Top3，第 5 名对比第 4 名，以此类推
 * @param {Array} list - 排行列表（第 4 名及以后）
 * @param {number} index - 当前项在 list 中的索引
 * @param {Array} topUsers - 前 3 名数据
 * @returns {number} 落后值
 */
export const getRankGap = (list, index, topUsers = []) => {
  const getValue = (item) => Number(item?.value || 0);
  if (index === 0) {
    const prevScore = getValue(topUsers[2]);
    const curScore = getValue(list[0]);
    return Math.max(0, prevScore - curScore);
  }
  const prevScore = getValue(list[index - 1]);
  const curScore = getValue(list[index]);
  return Math.max(0, prevScore - curScore);
};

const formatNumber = (num) => String(num || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/**
 * 格式化奖励底部标签
 * - type === 'gold' / 'gift'：展示金币 icon + 数量
 * - 其他类型：展示天数，如 "7 天"
 * @returns {{ isGold: boolean, text: string }}
 */
export const formatRewardLabel = (item, locales) => {
  if (!item) return { isGold: false, text: '' };

  const type = item.type || item.giftType;
  if (type === 'gold' || type === 'gift') {
    const value = item.quantity ?? item.gold ?? item.days ?? 0;
    return { isGold: true, text: formatNumber(value) };
  }

  if (item.days) {
    return { isGold: false, text: `${item.days} ${locales['天'] || 'day'}` };
  }

  return { isGold: false, text: '' };
};

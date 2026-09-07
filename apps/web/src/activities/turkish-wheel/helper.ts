/** 转盘目标角度计算 */
export const calculateTargetAngle = (targetIndex: number, segmentCount: number, baseOffset = 0) => {
  if (!segmentCount) return 0;
  const segmentAngle = 360 / segmentCount;
  return 360 - ((targetIndex * segmentAngle + segmentAngle / 2 + baseOffset) % 360);
};

/** easeOutCubic 缓动 */
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** 千分位格式化 */
export const formatNumber = (num: number | string) => {
  if (num === undefined || num === null || num === '') return '0';
  const n = Number(num);
  if (Number.isNaN(n)) return String(num);
  return n.toLocaleString('en-US');
};

/** 根据奖品 imageKey 查找索引 */
export const findRewardIndex = (
  list: Array<{ id?: string; imageKey?: string }>,
  rewardId: string,
) => {
  if (!Array.isArray(list)) return -1;
  return list.findIndex(
    (item) => String(item.id) === String(rewardId) || item.imageKey === rewardId,
  );
};

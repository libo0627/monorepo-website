/**
 * 榜单活动模板 - 接口工厂
 * 按活动 KEY 生成对应接口，避免硬编码活动名
 */
import http from '@/api/http';
import type { ConfigResponse, RankRewardsResponse } from './type';

export type { ConfigResponse, RankRewardsResponse } from './type';

/**
 * 创建活动接口集合
 * @param KEY - 活动唯一标识
 */
export const createActivityHttp = (KEY: string) => ({
  /** 获取活动配置 */
  getConfigApi: () => http.get(`/activity/${KEY}`) as Promise<ConfigResponse>,

  /**
   * 获取排名活动奖励
   * @param rank_type - 排名类型 'wealth' | 'charm'
   */
  getRankRewardsApi: (rank_type: string) =>
    http.get(`/activity/${KEY}/rank/${rank_type}/rewards`) as Promise<RankRewardsResponse>,

  /**
   * 获取当前周期用户排名信息
   * @param rank_type - 排名类型 'wealth' | 'charm'
   */
  getActivityRankInfoApi: (rank_type: string) => http.get(`/activity/${KEY}/rank/${rank_type}`),
});

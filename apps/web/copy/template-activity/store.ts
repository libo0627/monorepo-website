/**
 * 榜单活动模板 - Pinia store 工厂
 * 按 actKey 生成独立 store，避免不同活动状态串扰
 */
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { utils } from '@/utils';
import { createActivityHttp } from './http';
import type { ConfigData, ActivityGift, ActivityRankRewardInfo, GiftBagMaterialItem } from './type';

const { to, cfShowToast, formatNumber } = utils;

/** 单条榜单用户原始数据 */
interface RankInfoUser {
  rank?: number;
  score?: number;
  userInfo?: {
    uid?: number;
    nickname?: string;
    avatar?: string;
  };
}

/** 单个 rank_type 的榜单数据 */
interface RankInfoData {
  list: RankInfoUser[];
  mine: RankInfoUser;
  quantity: number;
}

/**
 * 创建活动 store
 * @param actKey - 活动唯一标识
 */
export const createActivityStore = (actKey: string) => {
  const storeId = `activityRank_${actKey}`;

  return defineStore(storeId, () => {
    const http = createActivityHttp(actKey);

    /** 活动配置原始数据 */
    const activityConfig = ref<ConfigData>({});

    /** 倒计时（秒） */
    const countdown = computed(() => activityConfig.value.countdown || 0);

    /** 活动礼物列表（已映射为 event-gift 组件所需结构） */
    const eventGiftMainList = computed(() =>
      (activityConfig.value.gifts || []).map((gift: ActivityGift) => ({
        id: gift.id || 0,
        avatar: gift.image || '',
        value: formatNumber(gift.gold),
        vipLv: 0,
        name: gift.name || '',
        type: gift.type || '',
        animationUrl: gift.animationUrl || '',
        animationType: gift.animationType || '',
      })),
    );

    /** 各 rank_type 对应的排名奖励原始数据 */
    const rankRewardsMap = ref<Record<string, ActivityRankRewardInfo[]>>({});

    /** 各 rank_type 对应的榜单信息原始数据 */
    const rankInfoMap = ref<Record<string, RankInfoData>>({});

    /** 拉取活动配置 */
    const fetchConfig = async () => {
      const [err, res] = await to(http.getConfigApi());
      if (err) {
        cfShowToast(err.msg);
        return;
      }
      activityConfig.value = res?.data || {};
    };

    /**
     * 拉取挑战榜排名奖励
     * @param rank_type - 'wealth' | 'charm'
     */
    const fetchRankRewards = async (rank_type: string) => {
      const [err, res] = await to(http.getRankRewardsApi(rank_type));
      if (err) {
        cfShowToast(err.msg);
        return;
      }
      rankRewardsMap.value[rank_type] = res?.data || [];
    };

    /**
     * 拉取当前周期榜单信息
     * @param rank_type - 'wealth' | 'charm'
     */
    const fetchRankInfo = async (rank_type: string) => {
      const [err, res] = await to(http.getActivityRankInfoApi(rank_type));
      if (err) {
        cfShowToast(err.msg);
        return;
      }
      const data = res?.data || {};
      rankInfoMap.value[rank_type] = {
        list: data.list || [],
        mine: data.mine || {},
        quantity: data.quantity || 0,
      };
    };

    /** 将后端榜单用户映射为 rank.vue 所需结构 */
    const mapRankUser = (item: RankInfoUser) => ({
      id: item?.userInfo?.uid || item?.rank || 0,
      rank: String(item?.rank || ''),
      name: item?.userInfo?.nickname || '',
      avatar: item?.userInfo?.avatar || '',
      value: String(item?.score || 0),
    });

    /**
     * 获取某个 rank_type 映射后的榜单数据
     * @param rank_type - 'wealth' | 'charm'
     */
    const mapRankData = (rank_type: string) => {
      const data = rankInfoMap.value[rank_type] || {
        list: [],
        mine: {},
        quantity: 0,
      };
      const all = (data.list || []).map(mapRankUser);
      const mine = data.mine || {};
      return {
        topUsers: all.slice(0, 3),
        rankList: all.slice(3),
        myRank: {
          rank: mine.rank ? String(mine.rank) : data.quantity ? `${data.quantity}+` : '',
          name: mine.userInfo?.nickname || '',
          avatar: mine.userInfo?.avatar || '',
          value: String(mine.score || 0),
        },
        quantity: data.quantity || 0,
      };
    };

    /**
     * 根据 rank 区间生成标题，如 [1] -> TOP1，[2,3] -> TOP2-3
     * @param rank - 排名区间数组
     */
    const formatRankTitle = (rank?: number[]) => {
      if (!rank?.length) return '';
      if (rank.length === 1) return `TOP${rank[0]}`;
      return `TOP${rank[0]}-${rank[rank.length - 1]}`;
    };

    /**
     * 将后端奖励物料映射为 challenge 组件所需结构
     * @param list - 后端原始奖励列表
     */
    const mapChallengeRewards = (list: ActivityRankRewardInfo[] = []) =>
      list.map((info, index) => ({
        key: `top${index + 1}`,
        rank: info.rank || [],
        title: formatRankTitle(info.rank),
        rewards: (info.rewards || []).map((item: GiftBagMaterialItem) => ({
          id: item.id || 0,
          url: item.image || '',
          value: formatNumber(item.quantity),
          name: item.name || '',
          type: item.type || '',
          days: item.days || 0,
          animationUrl: item.animationUrl || '',
          animationType: item.animationType || '',
        })),
      }));

    return {
      activityConfig,
      countdown,
      eventGiftMainList,
      fetchConfig,
      rankRewardsMap,
      fetchRankRewards,
      mapChallengeRewards,
      rankInfoMap,
      fetchRankInfo,
      mapRankData,
    };
  });
};

export default createActivityStore;

/**
 * 活动配置请求参数
 */
export interface ConfigRequest {
  /** 活动key */
  act_key: string;
}

/**
 * 活动配置响应数据结构
 */
export interface ConfigResponse {
  /** 状态码 */
  code?: object;
  /** 活动配置数据 */
  data?: ConfigData;
  /** 消息 */
  msg?: string;
  /** 毫秒时间戳 */
  ts?: number;
}

/**
 * 活动配置数据
 */
export interface ConfigData {
  /** 活动Key */
  actKey?: string;
  /** 倒计时（秒） */
  countdown?: number; // 业务用到
  /** 活动周期类型 */
  cycle?: string;
  /** 活动结束时间 */
  endTime?: string;
  /** 礼物列表 */
  gifts?: ActivityGift[]; // 业务用到
  /** 榜单排名类型 */
  rankTypes?: string[];
  /** 活动规则参数 */
  ruleParams?: object;
  /** 活动开始时间 */
  startTime?: string;
}

/**
 * 活动礼物
 */
export interface ActivityGift {
  /** 动效背景 */
  animationBg?: boolean;
  /** 动效解析方式 */
  animationParser?: string;
  /** 动图类型 */
  animationType?: string;
  /** 动图链接 */
  animationUrl?: string;
  /** 动图链接多语言 */
  animationUrlI18n?: object;
  /** 背景图 */
  backgroundUrl?: string;
  /** 背景图多语言 */
  backgroundUrlI18n?: object;
  /** 定制数据 */
  customData?: CustomData[];
  /** 售卖金币价值 */
  gold?: number;
  /** id */
  id?: number;
  /** 预览图片 */
  image?: string;
  /** 预览图片多语言 */
  imageI18n?: object;
  /** 名称 */
  name?: string;
  /** 名称多语言 */
  nameI18n?: object;
  /** 镜像动效图 */
  oppositeAnimationUrl?: string;
  /** 镜像动效图多语言 */
  oppositeAnimationUrlI18n?: object;
  /** 播放次数限制，0不限制 */
  plays?: number;
  /** 文字颜色参数 */
  textColor?: TextColor;
  /** 类型 */
  type?: string;
  /** 是否使用原有进场条 */
  useOriginal?: boolean;
}

/**
 * 定制数据
 */
export interface CustomData {
  /** 字体颜色 */
  color?: string;
  /** 高 */
  height?: number;
  /** key */
  key: string;
  /** 字体大小 */
  size?: number;
  /** 类型 */
  type: number;
  /** 值 */
  value?: string;
  /** 宽 */
  width?: number;
}

/**
 * 文字颜色参数
 */
export interface TextColor {
  /** 文字色位置 */
  colorIndexes?: string[];
  /** 文字色 */
  colors?: string[];
  /** 扫光色位置 */
  scanColorIndexes?: string[];
  /** 扫光色 */
  scanColors?: string[];
}

/**
 * 获取排名活动奖励请求参数
 */
export interface RankRewardsRequest {
  /** 活动key */
  act_key: string;
  /** 排名类型 */
  rank_type: string;
}

/**
 * 获取排名活动奖励响应数据结构
 */
export interface RankRewardsResponse {
  /** 状态码 */
  code?: object;
  /** 排名活动奖励列表 */
  data?: ActivityRankRewardInfo[];
  /** 消息 */
  msg?: string;
  /** 毫秒时间戳 */
  ts?: number;
}

/**
 * 排行榜奖励信息
 */
export interface ActivityRankRewardInfo {
  /** 排名区间，如 [1] 或 [2, 3] */
  rank?: number[];
  /** 奖励列表 */
  rewards?: GiftBagMaterialItem[];
}

/**
 * 礼包物料项（排名奖励物料）
 */
export interface GiftBagMaterialItem {
  /** 动效背景 */
  animationBg?: boolean;
  /** 动效解析方式 */
  animationParser?: string;
  /** 动图类型 */
  animationType?: string;
  /** 动图链接 */
  animationUrl?: string;
  /** 动图链接多语言 */
  animationUrlI18n?: object;
  /** 背景图 */
  backgroundUrl?: string;
  /** 背景图多语言 */
  backgroundUrlI18n?: object;
  /** 定制数据 */
  customData?: CustomData[];
  /** 天数 */
  days?: number;
  /** id */
  id?: number;
  /** 预览图片 */
  image?: string;
  /** 预览图片多语言 */
  imageI18n?: object;
  /** 名称 */
  name?: string;
  /** 名称多语言 */
  nameI18n?: object;
  /** 镜像动效图 */
  oppositeAnimationUrl?: string;
  /** 镜像动效图多语言 */
  oppositeAnimationUrlI18n?: object;
  /** 播放次数限制，0不限制 */
  plays?: number;
  /** 物料属性 1时效性 2数量 3时效性和和数量都支持 */
  prop?: number;
  /** 数量 */
  quantity?: number;
  /** 文字颜色参数 */
  textColor?: TextColor;
  /** 类型 */
  type?: string;
  /** 是否使用原有进场条 */
  useOriginal?: boolean;
}

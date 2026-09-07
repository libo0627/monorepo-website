/**
 * 榜单活动模板配置协议
 * 每个新活动只需实现一份该配置，模板内部代码无需改动
 */

/** 主题 CSS 变量（按需扩展） */
export interface ActivityTheme {
  /** 页面背景色 */
  '--activity-bg'?: string;
  /** 主强调色（如 Tab 默认文字） */
  '--activity-primary'?: string;
  /** 激活/选中态文字色 */
  '--activity-active'?: string;
  /** 主文字色 */
  '--activity-text-main'?: string;
  /** 次级文字色 */
  '--activity-text-sub'?: string;
  /** 榜单数值标签色 */
  '--activity-score-label'?: string;
  /** 排名数字色 */
  '--activity-rank-num'?: string;
  /** 我的排名区域主色 */
  '--activity-my-rank'?: string;
}

/** Tab 配置项 */
export interface TabConfig {
  /** 业务 key，也用于接口 rank_type */
  key: string;
  /** 对应 locales.js 中的文案 key */
  localeKey: string;
}

/** 活动资源配置（由每个活动的 resources.ts 提供） */
export interface ActivityResources {
  [key: string]: string | { [lang: string]: string };
}

/** 活动模板配置 */
export interface ActivityConfig {
  /** 活动唯一标识，决定接口路径和 Pinia store id */
  actKey: string;
  /** 图片资源对象，字段名需和模板约定一致 */
  resources: ActivityResources;
  /** 主题 CSS 变量对象 */
  theme: ActivityTheme;
  /** 页面主 Tab 配置 */
  mainTabs: TabConfig[];
  /** 子 Tab 配置（魅力/财富） */
  subTabs: TabConfig[];
  /** 榜单数值文案 key，默认 '祝福值' */
  scoreLabelKey?: string;
  /** 规则弹窗条数，默认 4 */
  ruleCount?: number;
  /** 背景音乐地址，为空则不播放 */
  audioSrc?: string;
}

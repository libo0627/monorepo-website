/**
 * 神象节活动配置
 * 本文件是榜单活动模板的首个实例配置
 * 出新活动时，复制本目录并只改此文件 + resources.ts + locales.js
 */
import * as resources from './resources';
import type { ActivityConfig } from '../template-activity/config.type';

const config: ActivityConfig = {
  /** 活动唯一标识，决定接口路径和 Pinia store id */
  actKey: 'ganesh_chaturthi',

  /** 图片资源（字段名需和模板约定一致） */
  resources,

  /** 主题 CSS 变量 */
  theme: {
    '--activity-bg': '#e8dafc',
    '--activity-primary': '#8651b7',
    '--activity-active': '#643204',
    '--activity-text-main': '#3b285d',
    '--activity-text-sub': '#4b3a6e',
    '--activity-score-label': '#4b3a6e',
    '--activity-rank-num': '#43297c',
    '--activity-my-rank': '#5b3100',
  },

  /** 页面主 Tab 配置 */
  mainTabs: [
    { key: 'challenge', localeKey: '挑战榜' },
    { key: 'rank', localeKey: '排行榜' },
  ],

  /** 子 Tab 配置（魅力/财富） */
  subTabs: [
    { key: 'charm', localeKey: '魅力榜' },
    { key: 'wealth', localeKey: '财富榜' },
  ],

  /** 榜单数值文案 key */
  scoreLabelKey: '祝福值',

  /** 规则弹窗条数 */
  ruleCount: 4,

  /** 背景音乐地址 */
  audioSrc: 'https://assets.sout.chat/common/2606/3306efc1751faa0a.mp3',
};

export default config;

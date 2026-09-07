// ──────────────────────────────────────────────
// 土耳其大转盘 — 静态资源
// ──────────────────────────────────────────────

// 顶部导航（原项目共享图标，此处用 SVG 占位）
const SVG_BACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='88' height='88' viewBox='0 0 88 88'%3E%3Cpath d='M54 18L30 44l24 26' stroke='%23f8e1b5' stroke-width='6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";
const SVG_RULE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='96' viewBox='0 0 192 96'%3E%3Crect width='192' height='96' rx='48 0 48 48' fill='%238b1a1a' stroke='%23f8e1b5' stroke-width='2'/%3E%3Ctext x='96' y='58' font-size='26' fill='%23f8e1b5' text-anchor='middle' font-weight='bold' font-family='sans-serif'%3ERULES%3C/text%3E%3C/svg%3E";

export const LOGO = '';
export const ICON_BACK = SVG_BACK;
export const ICON_MUSIC = '';
export const ICON_MUSIC_CLOSE = '';
export const RULE_BTN = SVG_RULE;

// Banner 区域
export { default as BANNER_BG } from '@/assets/img/activity/turkish-wheel/banner_bg@2x.webp';
export { default as BANNER_TITLE } from '@/assets/img/activity/turkish-wheel/banner_title@2x.webp';

// 内容区背景
export { default as CONTENT_BG } from '@/assets/img/activity/turkish-wheel/content_bg@2x.webp';

// 转盘奖励格子背景
export { default as REWARD_BOX_BG_1 } from '@/assets/img/activity/turkish-wheel/reward_box_bg_1@2x.webp';
export { default as REWARD_BOX_BG_3 } from '@/assets/img/activity/turkish-wheel/reward_box_bg_3@2x.webp';

// 转盘奖励图片
export { default as REWARD_IMG_1 } from '@/assets/img/activity/turkish-wheel/reward_1@2x.webp';
export { default as REWARD_IMG_2 } from '@/assets/img/activity/turkish-wheel/reward_2@2x.webp';
export { default as REWARD_IMG_3 } from '@/assets/img/activity/turkish-wheel/reward_3@2x.webp';
export { default as REWARD_IMG_4 } from '@/assets/img/activity/turkish-wheel/reward_4@2x.webp';
export { default as REWARD_IMG_5 } from '@/assets/img/activity/turkish-wheel/reward_5@2x.webp';
export { default as REWARD_IMG_6 } from '@/assets/img/activity/turkish-wheel/reward_6@2x.webp';

// 奖品 imageKey → 图片 映射（后端返回 imageKey，前端映射到实际图片）
import REWARD_IMG_1_SRC from '@/assets/img/activity/turkish-wheel/reward_1@2x.webp';
import REWARD_IMG_2_SRC from '@/assets/img/activity/turkish-wheel/reward_2@2x.webp';
import REWARD_IMG_3_SRC from '@/assets/img/activity/turkish-wheel/reward_3@2x.webp';
import REWARD_IMG_4_SRC from '@/assets/img/activity/turkish-wheel/reward_4@2x.webp';
import REWARD_IMG_5_SRC from '@/assets/img/activity/turkish-wheel/reward_5@2x.webp';
import REWARD_IMG_6_SRC from '@/assets/img/activity/turkish-wheel/reward_6@2x.webp';

export const PRIZE_IMAGE_MAP: Record<string, string> = {
  reward_1: REWARD_IMG_1_SRC,
  reward_2: REWARD_IMG_2_SRC,
  reward_3: REWARD_IMG_3_SRC,
  reward_4: REWARD_IMG_4_SRC,
  reward_5: REWARD_IMG_5_SRC,
  reward_6: REWARD_IMG_6_SRC,
};

// 抽奖按钮
export { default as DRAW_BTN_1 } from '@/assets/img/activity/turkish-wheel/draw_btn_1@2x.webp';
export { default as DRAW_BTN_10 } from '@/assets/img/activity/turkish-wheel/draw_btn_10@2x.webp';

// 金币图标
export { default as COIN_ICON } from '@/assets/img/activity/turkish-wheel/coin_icon@2x.webp';

// 默认头像
export { default as AVATAR_DEFAULT } from '@/assets/img/activity/turkish-wheel/avatar@2x.webp';

// Tab 按钮
export { default as TAB_TASK } from '@/assets/img/activity/turkish-wheel/tab_task@2x.webp';
export { default as TAB_TASK_ACTIVE } from '@/assets/img/activity/turkish-wheel/tab_task_active@2x.webp';
export { default as TAB_RANKINGS } from '@/assets/img/activity/turkish-wheel/tab_rankings@2x.webp';

// 任务提示条
export { default as TASK_TIP_BG } from '@/assets/img/activity/turkish-wheel/text_border@2x.webp';

// 任务项
export { default as TASK_ITEM_BG } from '@/assets/img/activity/turkish-wheel/task_item_bg@2x.webp';
export { default as TASK_BTN_GET } from '@/assets/img/activity/turkish-wheel/task_btn_get@2x.webp';
export { default as TASK_ICON_GO } from '@/assets/img/activity/turkish-wheel/go@2x.webp';
export { default as TASK_ICON_CHECK } from '@/assets/img/activity/turkish-wheel/task_icon_check@2x.webp';
export { default as NEW_TASK_BORDER } from '@/assets/img/activity/turkish-wheel/new_task_border@2x.webp';

// 弹窗/按钮边框
export { default as BORDER_TOP } from '@/assets/img/activity/turkish-wheel/border_top@2x.webp';
export { default as BORDER_MIDDLE } from '@/assets/img/activity/turkish-wheel/border_middle@2x.webp';
export { default as BORDER_BOTTOM } from '@/assets/img/activity/turkish-wheel/border_bottom@2x.webp';
export { default as BORDER_BTN_OK } from '@/assets/img/activity/turkish-wheel/border_btn_ok@2x.webp';
export { default as BORDER_BTN_ON } from '@/assets/img/activity/turkish-wheel/border_btn_on@2x.webp';

// 中奖框&记录框
export { default as RECORD_BORDER_TOP } from '@/assets/img/activity/turkish-wheel/record_border_top@2x.webp';
export { default as RECORD_BORDER_MIDDLE } from '@/assets/img/activity/turkish-wheel/record_border_middle@2x.webp';
export { default as RECORD_BORDER_BOTTOM } from '@/assets/img/activity/turkish-wheel/record_border_bottom@2x.webp';

// 转盘记录/抽奖弹窗边框
export { default as WHEEL_RECORD_TOP } from '@/assets/img/activity/turkish-wheel/wheel_record_top@2x.webp';
export { default as WHEEL_RECORD_MIDDLE } from '@/assets/img/activity/turkish-wheel/wheel_record_middle@2x.webp';
export { default as WHEEL_RECORD_BOTTOM } from '@/assets/img/activity/turkish-wheel/wheel_record_bottom@2x.webp';

// 头像边框
export { default as AVATAR_BORDER } from '@/assets/img/activity/turkish-wheel/avatar_border@2x.webp';

// 礼物背景框
export { default as GIFT_BORDER } from '@/assets/img/activity/turkish-wheel/gift_border@2x.webp';

// 标题装饰
export { default as TITLE_LEFT } from '@/assets/img/activity/turkish-wheel/title_left_icon.webp';
export { default as TITLE_RIGHT } from '@/assets/img/activity/turkish-wheel/title_right_icon.webp';

// 冠军奖励
export { default as CHAMPION_REWARD_BG } from '@/assets/img/activity/turkish-wheel/champion_reward_bg@2x.webp';
export { default as CHAMPION_REWARD_1 } from '@/assets/img/activity/turkish-wheel/champion_reward_1@2x.webp';
export { default as CHAMPION_REWARD_2 } from '@/assets/img/activity/turkish-wheel/champion_reward_2@2x.webp';
export { default as CHAMPION_REWARD_3 } from '@/assets/img/activity/turkish-wheel/champion_reward_3@2x.webp';
export { default as CHAMPION_REWARD_4 } from '@/assets/img/activity/turkish-wheel/champion_reward_4@2x.webp';

// 榜单背景
export { default as RANK_ITEM_BG } from '@/assets/img/activity/turkish-wheel/rank_item_bg@2x.webp';
export { default as RANK_TOP_LEFT_BG } from '@/assets/img/activity/turkish-wheel/top2_bg@2x.webp';
export { default as RANK_TOP_RIGHT_BG } from '@/assets/img/activity/turkish-wheel/top3_bg@2x.webp';
export { default as GROUP_2_BG } from '@/assets/img/activity/turkish-wheel/group_2_bg@2x.webp';
export { default as MY_RANK_BG } from '@/assets/img/activity/turkish-wheel/my_rank_bg@2x.webp';
export { default as CHAMPION_CROWN } from '@/assets/img/activity/turkish-wheel/champion_crown@2x.webp';

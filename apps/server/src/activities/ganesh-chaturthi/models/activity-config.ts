import mongoose from 'mongoose';

/**
 * 活动配置 —— ganesh_activity_configs
 *
 * countdown 不落库，按 endTime 实时计算，避免倒计时数据过期。
 */
const activityConfigSchema = new mongoose.Schema(
  {
    actKey: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    /** 活动周期类型：daily / weekly / period */
    cycle: { type: String, default: 'period' },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    /** 榜单类型，对应前端 subTabs 的 key */
    rankTypes: { type: [String], default: ['charm', 'wealth'] },
    /** 规则文案参数，前端按 ruleCount 逐条读取 */
    ruleParams: { type: mongoose.Schema.Types.Mixed, default: {} },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const ActivityConfig = mongoose.model(
  'GaneshActivityConfig',
  activityConfigSchema,
  'ganesh_activity_configs',
);

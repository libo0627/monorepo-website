import { describe, expect, it } from 'vitest';
import { designPx } from './rem';

describe('designPx', () => {
  it('按 rootValue 100 把 750 设计稿 px 转成 rem', () => {
    expect(designPx(750)).toBe('7.5rem');
    expect(designPx(726)).toBe('7.26rem');
    expect(designPx(154)).toBe('1.54rem');
    expect(designPx(326)).toBe('3.26rem');
  });

  it('0 值正常处理', () => {
    expect(designPx(0)).toBe('0rem');
  });

  it('结果必须以 rem 结尾 —— inline style 不被 postcss 处理，写 px 会放大一倍', () => {
    expect(designPx(88)).toMatch(/rem$/);
    expect(designPx(88)).not.toMatch(/px$/);
  });
});

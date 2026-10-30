import { describe, expect, it } from 'vitest';
import { speechPlan } from './voice';

describe('speechPlan', () => {
  it('slows single kana and short words and gives them an ending so they are not clipped', () => {
    expect(speechPlan('あ', false)).toEqual({ text: 'あ。', rate: 0.62 });
    expect(speechPlan('ください', false).rate).toBe(0.72);
    expect(speechPlan('コーヒーをください。', false)).toMatchObject({
      text: 'コーヒーをください。',
      rate: 0.8,
    });
  });
  it('slow mode is clearly slower than normal', () => {
    expect(speechPlan('あ', true).rate).toBeLessThan(speechPlan('あ', false).rate * 0.8);
  });
});

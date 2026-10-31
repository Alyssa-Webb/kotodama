import { describe, expect, it } from 'vitest';
import { resolveGuide, speechPlan } from './voice';

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

describe('resolveGuide', () => {
  it('lets the screen pin the guide it shows, ignoring the Voice setting', () => {
    let asked = 0;
    const setting = () => {
      asked++;
      return 'akari' as const;
    };
    expect(resolveGuide({ guide: 'tetsu' }, setting)).toBe('tetsu');
    expect(resolveGuide({ role: 'koto' }, setting)).toBe('koto');
    expect(asked).toBe(0);
    expect(resolveGuide({ role: 'quiz' }, setting)).toBe('akari');
    expect(asked).toBe(1);
  });
});

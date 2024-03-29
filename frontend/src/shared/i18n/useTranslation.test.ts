/**
 * NOTE: tests are done in the context of the Paris time-zone. That means there
 * is an offset of 1 hour (during winter) or 2 hours (during summer) with the
 * Greenwich meridian (referred as GMT, or UTC) used in the ISO format
 * (the ISO format is 'yyyy-MM-ddThh:mm:ssZ').
 */
import { act, renderHook } from '@testing-library/react';

import './config';
import { useTranslation } from './useTranslation';

/**
 * Create a mock component to call the hook, because hooks cannot be called
 * outside of a component.
 * Set the language to french and returns the functions of translation.
 */
async function testUseTranslation(): Promise<
  ReturnType<typeof useTranslation>
> {
  const testComponent = renderHook(useTranslation);
  const { i18n } = testComponent.result.current;
  await act(() => i18n.changeLanguage('fr-FR'));
  return testComponent.result.current;
}

describe('useTranslation hook to format dates and numbers', () => {
  it('formats dates', async () => {
    const { formatDate } = await testUseTranslation();
    const date = new Date('2023-01-27');

    expect(formatDate(date)).toBe('27/01/2023');
    expect(formatDate(date, { dateStyle: 'medium' })).toBe('27 janv. 2023');
    expect(formatDate(date, { dateStyle: 'long' })).toBe('27 janvier 2023');
    expect(formatDate(date, { dateStyle: 'full' })).toBe(
      'vendredi 27 janvier 2023',
    );
    expect(
      formatDate(date, { weekday: 'short', day: 'numeric', month: 'short' }),
    ).toBe('ven. 27 janv.');
  });

  it('formats time', async () => {
    const { formatTime } = await testUseTranslation();
    const time = new Date('2023-01-27T15:34:28Z');

    expect(formatTime(time)).toBe('16:34');
    expect(formatTime(time, { timeStyle: 'long' })).toBe('16:34:28 UTC+1');
  });

  it('formats date-time', async () => {
    const { formatDateTime } = await testUseTranslation();
    const date = new Date('2023-01-27T15:34:00Z');

    expect(formatDateTime(date)).toBe('27/01/2023 16:34');
    expect(
      formatDateTime(date, { dateStyle: 'long', timeStyle: 'short' }),
    ).toBe('27 janvier 2023 à 16:34');
  });

  it('formats date-time range', async () => {
    const { formatDateTimeRange } = await testUseTranslation();

    expect(
      formatDateTimeRange(
        new Date('2023-01-27T15:34:34Z'),
        new Date('2023-01-27T16:26:56Z'),
      )
        // replace special spaces for tests because they differ by OS
        .replaceAll(' ', ' ')
        .replaceAll(' ', ' '),
    ).toBe('27/01/2023, 16:34 – 17:26');

    expect(
      formatDateTimeRange(
        new Date('2023-01-27T15:34:34Z'),
        new Date('2023-02-27T08:26:56Z'),
      )
        // replace special spaces for tests because they differ by OS
        .replaceAll(' ', ' ')
        .replaceAll(' ', ' ')
        .replaceAll(',', ''),
    ).toBe('27/01/2023 16:34 – 27/02/2023 09:26');
  });

  it('formats relative time', async () => {
    const { formatRelativeTime } = await testUseTranslation();

    // fake date for today
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-05-01T08:00'));

    expect(formatRelativeTime(new Date('2023-01-27T15:34'))).toBe('27/01/2023');
    expect(formatRelativeTime(new Date('2023-05-01T15:34'))).toBe(
      'aujourd’hui à 15:34',
    );

    jest.useRealTimers();
  });
});

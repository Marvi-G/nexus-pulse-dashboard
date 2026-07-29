import { describe, it, expect } from 'vitest';
import { formatCurrency, formatCompactNumber, formatDate, formatDateShort, formatPercent, formatNumber } from '../../utils/formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formats a number as USD currency', () => {
      expect(formatCurrency(1234)).toBe('$1,234');
      expect(formatCurrency(0)).toBe('$0');
      expect(formatCurrency(99999)).toBe('$99,999');
    });
  });

  describe('formatCompactNumber', () => {
    it('formats large numbers with compact notation', () => {
      expect(formatCompactNumber(1500)).toBe('1.5K');
      expect(formatCompactNumber(1000000)).toBe('1M');
      expect(formatCompactNumber(500)).toBe('500');
    });
  });

  describe('formatDate', () => {
    it('formats an ISO date string to readable format', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });
  });

  describe('formatDateShort', () => {
    it('formats date to short format', () => {
      const result = formatDateShort('2024-06-20');
      expect(result).toContain('Jun');
      expect(result).toContain('20');
    });
  });

  describe('formatPercent', () => {
    it('formats positive percentage with + sign', () => {
      expect(formatPercent(12.5)).toBe('+12.5%');
    });

    it('formats negative percentage', () => {
      expect(formatPercent(-3.2)).toBe('-3.2%');
    });

    it('formats zero', () => {
      expect(formatPercent(0)).toBe('+0.0%');
    });
  });

  describe('formatNumber', () => {
    it('formats number with locale separators', () => {
      expect(formatNumber(1234)).toBe('1,234');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });
  });
});

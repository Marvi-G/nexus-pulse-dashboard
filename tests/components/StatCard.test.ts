import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import StatCard from '../../components/dashboard/StatCard.vue';

// Mock the useTheme composable
vi.mock('#imports', () => ({
  useTheme: () => ({ isDark: { value: false } }),
}));

describe('StatCard', () => {
  const defaultProps = {
    title: 'Total Revenue',
    value: '$284,500',
    change: 12.5,
    changeLabel: 'vs last month',
    icon: 'currency',
  };

  it('renders the title correctly', () => {
    const wrapper = mount(StatCard, { props: defaultProps });
    expect(wrapper.text()).toContain('Total Revenue');
  });

  it('renders the value correctly', () => {
    const wrapper = mount(StatCard, { props: defaultProps });
    expect(wrapper.text()).toContain('$284,500');
  });

  it('shows positive change with correct formatting', () => {
    const wrapper = mount(StatCard, { props: defaultProps });
    expect(wrapper.text()).toContain('+12.5%');
    expect(wrapper.text()).toContain('vs last month');
  });

  it('shows negative change correctly', () => {
    const wrapper = mount(StatCard, {
      props: { ...defaultProps, change: -5.3 },
    });
    expect(wrapper.text()).toContain('-5.3%');
  });
});

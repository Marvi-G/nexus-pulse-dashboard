import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Badge from '../../components/ui/Badge.vue';

describe('Badge', () => {
  it('renders the label text', () => {
    const wrapper = mount(Badge, {
      props: { label: 'Active', variant: 'active' },
    });
    expect(wrapper.text()).toBe('Active');
  });

  it('applies correct variant class for active status', () => {
    const wrapper = mount(Badge, {
      props: { label: 'Active', variant: 'active' },
    });
    expect(wrapper.classes()).toContain('bg-[var(--color-success-light)]');
  });

  it('applies correct variant class for inactive status', () => {
    const wrapper = mount(Badge, {
      props: { label: 'Inactive', variant: 'inactive' },
    });
    expect(wrapper.classes()).toContain('bg-[var(--color-bg-tertiary)]');
  });

  it('applies correct variant class for pending status', () => {
    const wrapper = mount(Badge, {
      props: { label: 'Pending', variant: 'pending' },
    });
    expect(wrapper.classes()).toContain('bg-[var(--color-warning-light)]');
  });
});

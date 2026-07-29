import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Toggle from '../../components/ui/Toggle.vue';

describe('Toggle', () => {
  it('renders in off state when modelValue is false', () => {
    const wrapper = mount(Toggle, {
      props: { modelValue: false },
    });
    expect(wrapper.attributes('aria-checked')).toBe('false');
  });

  it('renders in on state when modelValue is true', () => {
    const wrapper = mount(Toggle, {
      props: { modelValue: true },
    });
    expect(wrapper.attributes('aria-checked')).toBe('true');
  });

  it('emits update:modelValue on click', async () => {
    const wrapper = mount(Toggle, {
      props: { modelValue: false },
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
  });
});

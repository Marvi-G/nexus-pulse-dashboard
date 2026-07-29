import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Modal from '../../components/ui/Modal.vue';

describe('Modal', () => {
  it('does not render when modelValue is false', () => {
    const wrapper = mount(Modal, {
      props: { modelValue: false },
      slots: { default: 'Modal content' },
      global: {
        stubs: { teleport: true },
      },
    });
    expect(wrapper.text()).not.toContain('Modal content');
  });

  it('renders content when modelValue is true', () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true, title: 'Test Title' },
      slots: { default: 'Modal content' },
      global: {
        stubs: { teleport: true },
      },
    });
    expect(wrapper.text()).toContain('Modal content');
    expect(wrapper.text()).toContain('Test Title');
  });

  it('emits update:modelValue false when close button is clicked', async () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true, title: 'Test' },
      slots: { default: 'Content' },
      global: {
        stubs: { teleport: true },
      },
    });
    const closeBtn = wrapper.find('button');
    await closeBtn.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });
});

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Pagination from '../../components/tables/Pagination.vue';

const defaultProps = {
  currentPage: 2,
  totalItems: 53,
  itemsPerPage: 10,
  startItem: 11,
  endItem: 20,
  visiblePages: [1, 2, 3, 4, 5],
  hasPrev: true,
  hasNext: true,
};

describe('Pagination', () => {
  it('renders correct page info text', () => {
    const wrapper = mount(Pagination, { props: defaultProps });
    expect(wrapper.text()).toContain('11');
    expect(wrapper.text()).toContain('20');
    expect(wrapper.text()).toContain('53');
  });

  it('renders correct page number buttons', () => {
    const wrapper = mount(Pagination, { props: defaultProps });
    const buttons = wrapper.findAll('button');
    // Prev + 5 pages + Next = 7 buttons
    expect(buttons.length).toBe(7);
  });

  it('highlights current page', () => {
    const wrapper = mount(Pagination, { props: defaultProps });
    const pageButtons = wrapper.findAll('button').slice(1, 6); // exclude prev/next
    const activeButton = pageButtons.find((btn) =>
      btn.classes().includes('bg-[var(--color-accent)]')
    );
    expect(activeButton?.text()).toBe('2');
  });

  it('emits page event when page button is clicked', async () => {
    const wrapper = mount(Pagination, { props: defaultProps });
    const buttons = wrapper.findAll('button');
    // Click page 3 (index 3: prev=0, page1=1, page2=2, page3=3)
    await buttons[3].trigger('click');
    expect(wrapper.emitted('page')?.[0]).toEqual([3]);
  });

  it('disables prev button when hasPrev is false', () => {
    const wrapper = mount(Pagination, {
      props: { ...defaultProps, currentPage: 1, hasPrev: false },
    });
    const prevBtn = wrapper.findAll('button')[0];
    expect(prevBtn.attributes('disabled')).toBeDefined();
  });
});

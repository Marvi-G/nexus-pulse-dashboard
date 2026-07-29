import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DataTable from '../../components/tables/DataTable.vue';
import type { User } from '../../types/user';

const mockUsers: User[] = [
  { id: 1, name: 'Alice Smith', email: 'alice@test.com', role: 'Admin', status: 'Active', joinDate: '2024-01-01' },
  { id: 2, name: 'Bob Jones', email: 'bob@test.com', role: 'Editor', status: 'Inactive', joinDate: '2024-02-15' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@test.com', role: 'Viewer', status: 'Pending', joinDate: '2024-03-20' },
];

const columns = [
  { key: 'name' as keyof User, label: 'Name' },
  { key: 'email' as keyof User, label: 'Email' },
  { key: 'role' as keyof User, label: 'Role' },
  { key: 'status' as keyof User, label: 'Status' },
  { key: 'joinDate' as keyof User, label: 'Join Date' },
  { key: 'id' as keyof User, label: 'Actions', sortable: false },
];

const defaultTableProps = {
  rows: mockUsers,
  columns,
  search: '',
  totalFiltered: 3,
  sortKey: null as keyof User | null,
  sortDir: null as 'asc' | 'desc' | null,
};

describe('DataTable', () => {
  it('renders all rows', () => {
    const wrapper = mount(DataTable, {
      props: defaultTableProps,
      slots: { pagination: '<div>Pagination</div>' },
      global: {
        stubs: {
          UiBadge: { template: '<span><slot /></span>', props: ['label', 'variant'] },
          UiButton: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
        },
      },
    });
    // Should show all 3 names
    expect(wrapper.text()).toContain('Alice Smith');
    expect(wrapper.text()).toContain('Bob Jones');
    expect(wrapper.text()).toContain('Charlie Brown');
  });

  it('emits search event when search input changes', async () => {
    const wrapper = mount(DataTable, {
      props: defaultTableProps,
      slots: { pagination: '<div />' },
      global: {
        stubs: {
          UiBadge: { template: '<span><slot /></span>', props: ['label', 'variant'] },
          UiButton: { template: '<button><slot /></button>' },
        },
      },
    });
    const input = wrapper.find('input');
    await input.setValue('alice');
    expect(wrapper.emitted('search')?.[0]).toEqual(['alice']);
  });

  it('emits sort event when column header is clicked', async () => {
    const wrapper = mount(DataTable, {
      props: defaultTableProps,
      slots: { pagination: '<div />' },
      global: {
        stubs: {
          UiBadge: { template: '<span><slot /></span>', props: ['label', 'variant'] },
          UiButton: { template: '<button><slot /></button>' },
        },
      },
    });
    // Click the Name column header (first th)
    const headers = wrapper.findAll('th');
    await headers[0].trigger('click');
    expect(wrapper.emitted('sort')?.[0]).toEqual(['name']);
  });

  it('shows empty state when no rows', () => {
    const wrapper = mount(DataTable, {
      props: { ...defaultTableProps, rows: [], totalFiltered: 0 },
      slots: { pagination: '<div />' },
      global: {
        stubs: {
          UiBadge: { template: '<span><slot /></span>', props: ['label', 'variant'] },
          UiButton: { template: '<button><slot /></button>' },
        },
      },
    });
    expect(wrapper.text()).toContain('No users found');
  });
});

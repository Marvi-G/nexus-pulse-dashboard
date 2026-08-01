<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Page header -->
    <div>
      <h1 class="page-title">Users</h1>
      <p class="page-subtitle">Manage your team members and their roles.</p>
    </div>

    <!-- Data table -->
    <TablesDataTable
      :rows="usersStore.paginatedUsers"
      :columns="columns"
      :search="usersStore.searchQuery"
      :total-filtered="usersStore.filteredUsers.length"
      :sort-key="usersStore.sortConfig.key"
      :sort-dir="usersStore.sortConfig.direction"
      :loading="usersStore.isLoading"
      @search="usersStore.setSearch"
      @sort="usersStore.setSort"
      @edit="openEditModal"
      @delete="openDeleteConfirm"
    >
      <template #pagination>
        <TablesPagination
          :current-page="usersStore.currentPage"
          :total-items="usersStore.filteredUsers.length"
          :items-per-page="usersStore.itemsPerPage"
          :start-item="pagination.startItem"
          :end-item="pagination.endItem"
          :visible-pages="pagination.visiblePages"
          :has-prev="pagination.hasPrev"
          :has-next="pagination.hasNext"
          @page="usersStore.setPage"
        />
      </template>
    </TablesDataTable>

    <!-- Edit modal -->
    <UiModal v-model="editModalOpen" title="Edit User">
      <form @submit.prevent="saveEdit" class="space-y-4">
        <UiInput v-model="editForm.name" label="Name" placeholder="Full name" />
        <UiInput
          v-model="editForm.email"
          label="Email"
          type="email"
          placeholder="Email address"
        />
        <div class="space-y-1.5">
          <label
            class="block text-sm font-medium text-[var(--color-text-secondary)]"
            >Role</label
          >
          <select v-model="editForm.role" class="input-base">
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
        <div class="space-y-1.5">
          <label
            class="block text-sm font-medium text-[var(--color-text-secondary)]"
            >Status</label
          >
          <select v-model="editForm.status" class="input-base">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </form>
      <template #footer>
        <UiButton variant="secondary" @click="editModalOpen = false"
          >Cancel</UiButton
        >
        <UiButton variant="primary" @click="saveEdit">Save Changes</UiButton>
      </template>
    </UiModal>

    <!-- Delete confirmation modal -->
    <UiModal v-model="deleteModalOpen" title="Delete User">
      <div class="space-y-2">
        <p class="text-sm text-[var(--color-text-secondary)]">
          Are you sure you want to delete
          <strong class="text-[var(--color-text-primary)]">{{
            deleteTarget?.name
          }}</strong
          >? This action cannot be undone.
        </p>
      </div>
      <template #footer>
        <UiButton variant="secondary" @click="deleteModalOpen = false"
          >Cancel</UiButton
        >
        <UiButton variant="danger" @click="confirmDelete">Delete</UiButton>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUsersStore } from "~/stores/users";
import { usePagination } from "~/composables/usePagination";
import { useSettingsStore } from "~/stores/settings";
import type { User } from "~/types/user";

definePageMeta({
  middleware: "auth",
});

const usersStore = useUsersStore();
const settingsStore = useSettingsStore();

const columns = [
  { key: "name" as keyof User, label: "Name" },
  { key: "email" as keyof User, label: "Email" },
  { key: "role" as keyof User, label: "Role" },
  { key: "status" as keyof User, label: "Status" },
  { key: "joinDate" as keyof User, label: "Join Date" },
  { key: "id" as keyof User, label: "Actions", sortable: false },
];

const pagination = usePagination({
  totalItems: computed(() => usersStore.filteredUsers.length),
  itemsPerPage: usersStore.itemsPerPage,
  currentPage: computed(() => usersStore.currentPage),
});

// Edit modal
const editModalOpen = ref(false);
const editForm = ref<Partial<User>>({});

function openEditModal(user: User) {
  editForm.value = { ...user };
  editModalOpen.value = true;
}

function saveEdit() {
  if (editForm.value.id) {
    usersStore.updateUser(editForm.value as User);
    settingsStore.addToast("User updated successfully", "success");
  }
  editModalOpen.value = false;
}

// Delete modal
const deleteModalOpen = ref(false);
const deleteTarget = ref<User | null>(null);

function openDeleteConfirm(user: User) {
  deleteTarget.value = user;
  deleteModalOpen.value = true;
}

function confirmDelete() {
  if (deleteTarget.value) {
    usersStore.deleteUser(deleteTarget.value.id);
    settingsStore.addToast("User deleted successfully", "success");
  }
  deleteModalOpen.value = false;
}

onMounted(() => {
  usersStore.fetchUsers();
});
</script>

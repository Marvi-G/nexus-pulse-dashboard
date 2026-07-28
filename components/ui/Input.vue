<template>
  <div class="space-y-1.5">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-[var(--color-text-secondary)]"
    >
      {{ label }}
    </label>
    <div class="relative">
      <div
        v-if="$slots.icon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-tertiary)]"
      >
        <slot name="icon" />
      </div>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'input-base',
          $slots.icon ? 'pl-10' : '',
          error ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)] focus:ring-opacity-20 focus:border-[var(--color-danger)]' : '',
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
      />
    </div>
    <p v-if="error" class="text-xs text-[var(--color-danger)] mt-1">{{ error }}</p>
    <p v-if="hint && !error" class="text-xs text-[var(--color-text-tertiary)] mt-1">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string;
  type?: string;
  label?: string;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  label: '',
  placeholder: '',
  id: '',
  disabled: false,
  error: '',
  hint: '',
});

defineEmits<{
  'update:modelValue': [value: string];
  blur: [event: FocusEvent];
}>();
</script>

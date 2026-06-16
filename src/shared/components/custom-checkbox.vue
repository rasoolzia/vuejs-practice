<script setup lang="ts">
const DEFAULT_ERROR_TEXT = 'This field is required';

interface Props {
  label?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  hasError?: boolean;
  errorText?: string;
  inputClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  hasError: false,
});

const emit = defineEmits<{
  (e: 'change', value: boolean): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'focus', event: FocusEvent): void;
}>();

const modelValue = defineModel<boolean>({
  default: false,
});

const inputId =
  props.id || `checkbox-${Math.random().toString(36).slice(2, 9)}`;
const errorId = `${inputId}-error`;

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement;

  modelValue.value = target.checked;
  emit('change', target.checked);
};

const handleFocus = (e: FocusEvent) => {
  emit('focus', e);
};

const handleBlur = (e: FocusEvent) => {
  emit('blur', e);
};
</script>

<template>
  <div class="flex flex-col gap-1 select-none">
    <label :for="inputId" class="flex items-start gap-2 cursor-pointer">
      <input
        :id="inputId"
        :name="props.name"
        type="checkbox"
        :checked="modelValue"
        :disabled="props.disabled"
        :aria-invalid="props.hasError"
        :aria-describedby="props.hasError ? errorId : undefined"
        :class="[
          'mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50',
          inputClass,
        ]"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <span class="text-sm text-gray-900 dark:text-gray-100">
        {{ props.label }}
      </span>
    </label>

    <p v-if="props.hasError" :id="errorId" class="text-sm text-red-500">
      {{ props.errorText || DEFAULT_ERROR_TEXT }}
    </p>
  </div>
</template>

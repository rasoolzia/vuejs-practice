<script setup lang="ts">
const DEFAULT_ERROR_TEXT = 'This field is required';

interface Props {
  label?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  name?: string;
  value?: string | number;
  inputClass?: string;
  disabled?: boolean;
  inputStyle?: 'border' | 'underline' | 'floatingLabel';
  icon?: string;
  hasError?: boolean;
  errorText?: string;
  autoComplete?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  inputClass: '',
  disabled: false,
  inputStyle: 'border',
  hasError: false,
});

const emit = defineEmits<{
  (e: 'input', value: string): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'focus', event: FocusEvent): void;
}>();

const modelValue = defineModel({
  default: '',
});

const isFocused = ref(false);

const baseInputClasses =
  'block w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 focus:outline-none duration-200 bg-transparent autofill:bg-transparent';

const inputStyles: Record<string, string> = {
  border: 'border px-3 py-2 rounded-md',
  underline: 'border-b-1 p-1',
  floatingLabel: 'border px-3 pt-4 pb-2 rounded-md',
};

const inputId = props.id || `input-${Math.random().toString(36).slice(2, 9)}`;
const errorId = `${inputId}-error`;

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  modelValue.value = target.value;
  emit('input', target.value);
};

const handleFocus = (e: FocusEvent) => {
  if (
    props.inputStyle === 'floatingLabel' &&
    !(e.target as HTMLInputElement).value
  ) {
    isFocused.value = true;
  }
  emit('focus', e);
};

const handleBlur = (e: FocusEvent) => {
  if (
    props.inputStyle === 'floatingLabel' &&
    !(e.target as HTMLInputElement).value
  ) {
    isFocused.value = false;
  }
  emit('blur', e);
};
</script>

<template>
  <div class="flex flex-col space-y-1 select-none">
    <label
      v-if="props.label && props.inputStyle !== 'floatingLabel'"
      :for="inputId"
      class="text-sm font-medium text-gray-900 dark:text-gray-100"
    >
      {{ props.label }}
    </label>

    <div class="relative">
      <div
        v-if="props.icon"
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
      >
        <!-- <SvgLoader :name="props.icon" color="currentColor" /> -->
      </div>

      <input
        :id="inputId"
        :name="props.name"
        :type="props.type"
        v-model="modelValue"
        :placeholder="
          props.inputStyle === 'floatingLabel' && !props.placeholder
            ? undefined
            : props.placeholder
        "
        :disabled="props.disabled"
        :class="[
          baseInputClasses,
          props.inputClass,
          inputStyles[props.inputStyle],
          props.icon ? 'pl-10' : '',
          props.hasError
            ? 'border-red-500 dark:border-red-400'
            : 'focus:border-indigo-500',
        ]"
        :aria-invalid="!!props.hasError"
        :aria-describedby="props.hasError ? errorId : undefined"
        :aria-label="
          !props.label && props.inputStyle !== 'floatingLabel'
            ? props.placeholder
            : undefined
        "
        :autocomplete="props.autoComplete"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <label
        v-if="
          props.inputStyle === 'floatingLabel' &&
          (props.label || props.placeholder)
        "
        :for="inputId"
        class="absolute left-2 top-4 px-1.5 text-sm duration-200 pointer-events-none origin-top-left text-gray-700 dark:text-gray-300"
        :class="[
          isFocused || props.value || props.placeholder
            ? 'scale-75 -translate-y-3'
            : '',
          props.icon ? 'left-10' : '',
        ]"
      >
        {{ props.label || props.placeholder }}
      </label>

      <p v-if="props.hasError" :id="errorId" class="mt-1 text-sm text-red-500">
        {{ props.errorText || DEFAULT_ERROR_TEXT }}
      </p>
    </div>
  </div>
</template>

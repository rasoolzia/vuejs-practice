<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  prependIcon?: string;
  appendIcon?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
});
const emit = defineEmits<{ (e: 'click'): void }>();

const baseButtonClasses =
  'flex items-center justify-center gap-2 rounded-md font-medium focus:outline-none focus:ring-2 transition-colors duration-200 disabled:cursor-not-allowed cursor-pointer';
const variantsMap = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-400',
  secondary:
    'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-400',
  outline:
    'border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-neutral-800 focus:ring-indigo-500 disabled:border-indigo-300 disabled:text-indigo-300',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400',
};
const sizesMap = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const handleClick = () => emit('click');
</script>

<template>
  <button
    :class="[
      baseButtonClasses,
      variantsMap[props.variant],
      sizesMap[props.size],
    ]"
    :disabled="props.disabled || props.loading"
    :aria-busy="props.loading"
    :type="props.type"
    @click="handleClick"
  >
    <!-- <SvgLoader v-if="props.loading" width="24" height="24" name="spinner" /> -->
    <!-- v-else -->
    <!-- <template> -->
    <!-- <SvgLoader v-if="props.prependIcon" :name="props.prependIcon" /> -->
    <slot />
    <!-- <SvgLoader v-if="props.appendIcon" :name="props.appendIcon" /> -->
    <!-- </template> -->
  </button>
</template>

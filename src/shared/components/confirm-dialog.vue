<script setup lang="ts">
import { useConfirmDialogState } from '@shared/composables/useConfirm';
import CustomButton from './custom-button.vue';

const { state, handleConfirm, handleCancel } = useConfirmDialogState();

watchEffect(() => {
  document.body.style.overflow = state.isOpen ? 'hidden' : '';
});

function onBackdropClick(): void {
  if (state.isLoading || !state.closeOnClickOutside) return;
  handleCancel();
}

function onKeydown(e: KeyboardEvent): void {
  if (!state.isOpen || state.isLoading) return;
  if (e.key === 'Escape' && state.cancelByEscape) handleCancel();
  if (e.key === 'Enter' && state.confirmOnEnter) handleConfirm();
}

onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
});
</script>

<template>
  <teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="state.isOpen"
        class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click.self="onBackdropClick"
      >
        <div
          class="w-[min(400px,90vw)] rounded-lg bg-white p-6 shadow-2xl"
          role="alertdialog"
          aria-modal="true"
          :aria-label="state.title"
        >
          <h2
            class="mb-2 text-lg font-semibold"
            :class="
              state.variant === 'danger'
                ? 'text-red-600 dark:text-red-500'
                : 'text-gray-900 dark:text-white'
            "
          >
            {{ state.title }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300">
            {{ state.message }}
          </p>
          <div class="mt-5 flex justify-end gap-2">
            <CustomButton
              variant="secondary"
              :disabled="state.isLoading"
              @click="handleCancel"
            >
              {{ state.cancelText }}
            </CustomButton>
            <CustomButton
              :variant="state.variant"
              :loading="state.isLoading"
              @click="handleConfirm"
            >
              {{ state.confirmText }}
            </CustomButton>
          </div>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

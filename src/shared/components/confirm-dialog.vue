<script setup lang="ts">
import { useConfirmDialogState } from '@shared/composables/useConfirm';

const { state, handleConfirm, handleCancel } = useConfirmDialogState();

watchEffect(() => {
  document.body.style.overflow = state.isOpen ? 'hidden' : '';
});

function onKeydown(e: KeyboardEvent): void {
  if (!state.isOpen) return;
  if (e.key === 'Escape') handleCancel();
  if (e.key === 'Enter') handleConfirm();
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
        class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50"
        @click.self="handleCancel"
      >
        <div
          class="w-[min(400px,90vw)] rounded-lg bg-white p-6"
          role="alertdialog"
          aria-modal="true"
          :aria-label="state.title"
        >
          <h2 class="mb-2 text-lg font-semibold text-gray-900">
            {{ state.title }}
          </h2>
          <p class="text-gray-600">
            {{ state.message }}
          </p>
          <div class="mt-5 flex justify-end gap-2">
            <button
              type="button"
              class="rounded-md border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50"
              @click="handleCancel"
            >
              {{ state.cancelText }}
            </button>
            <button
              type="button"
              :class="[
                'rounded-md px-4 py-2 font-medium text-white',
                state.variant === 'danger'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-blue-500 hover:bg-blue-600',
              ]"
              @click="handleConfirm"
            >
              {{ state.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

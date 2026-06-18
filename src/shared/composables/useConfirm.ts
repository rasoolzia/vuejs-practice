import { reactive } from 'vue';

export type ConfirmVariant = 'primary' | 'danger';

export interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  confirmOnEnter?: boolean;
  cancelByEscape?: boolean;
  closeOnClickOutside?: boolean;
  onConfirm?: () => Promise<void> | void;
}

interface ConfirmState {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant: ConfirmVariant;
  confirmOnEnter: boolean;
  cancelByEscape: boolean;
  closeOnClickOutside: boolean;
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: (() => Promise<void> | void) | null;
}

const DEFAULT_OPTIONS = {
  title: 'Are you sure?',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'primary' as ConfirmVariant,
  confirmOnEnter: true,
  cancelByEscape: true,
  closeOnClickOutside: true,
};

const state = reactive<ConfirmState>({
  ...DEFAULT_OPTIONS,
  isOpen: false,
  isLoading: false,
  onConfirm: null,
});

let resolvePromise: ((value: boolean) => void) | null = null;

function confirm(options: ConfirmOptions = {}): Promise<boolean> {
  Object.assign(state, {
    ...DEFAULT_OPTIONS,
    ...options,
    isOpen: true,
    isLoading: false,
  });

  return new Promise<boolean>((resolve) => {
    resolvePromise = resolve;
  });
}

async function handleConfirm(): Promise<void> {
  if (state.isLoading) return;

  if (state.onConfirm) {
    state.isLoading = true;
    try {
      await state.onConfirm();
    } catch {
      return;
    } finally {
      state.isLoading = false;
    }
  }

  state.isOpen = false;
  resolvePromise?.(true);
  resolvePromise = null;
}

function handleCancel(): void {
  if (state.isLoading) return;
  state.isOpen = false;
  resolvePromise?.(false);
  resolvePromise = null;
}

export function useConfirm() {
  return { confirm };
}

export function useConfirmDialogState() {
  return { state, handleConfirm, handleCancel };
}

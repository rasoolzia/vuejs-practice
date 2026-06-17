import { reactive } from 'vue';

export type ConfirmVariant = 'default' | 'danger';

export interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
}

interface ConfirmState extends Required<ConfirmOptions> {
  isOpen: boolean;
}

const DEFAULT_OPTIONS: Required<ConfirmOptions> = {
  title: 'Are you sure?',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'default',
};

const state = reactive<ConfirmState>({
  ...DEFAULT_OPTIONS,
  isOpen: false,
});

let resolvePromise: ((value: boolean) => void) | null = null;

function confirm(options: ConfirmOptions = {}): Promise<boolean> {
  Object.assign(state, {
    ...DEFAULT_OPTIONS,
    ...options,
    isOpen: true,
  });

  return new Promise<boolean>((resolve) => {
    resolvePromise = resolve;
  });
}

function handleConfirm(): void {
  state.isOpen = false;
  resolvePromise?.(true);
  resolvePromise = null;
}

function handleCancel(): void {
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

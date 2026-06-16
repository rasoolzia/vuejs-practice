import type { z } from 'zod';

type FieldErrors<T> = Partial<Record<keyof T, string>>;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

/**
 * Lightweight form helper for Zod + Vue.
 *
 * Validation lifecycle:
 * - Before first submit: errors are hidden (isDirty = false)
 * - On submit: full validation runs, isDirty = true
 * - After first submit: every @input triggers validateField so errors
 *   update live (e.g. "Required" → "Invalid email") instead of disappearing
 * - clearFieldError is only meant for special cases (e.g. checkbox toggles)
 */
export function useZodForm<T extends Record<string, unknown>>(
  schema: z.ZodType<T>,
  data: T,
) {
  const fieldErrors = reactive<Record<string, string>>({});
  const formError = ref('');
  // Once the user submits once, we validate on every keystroke
  const isDirty = ref(false);

  const setErrorsFromZod = (error: z.ZodError<T>) => {
    const next: Record<string, string> = {};
    for (const issue of error.issues) {
      const key = issue.path?.[0];
      if (typeof key === 'string' && !(key in next)) {
        next[key] = issue.message;
      }
    }
    // Clear keys that are now valid, set keys that have errors
    for (const key of Object.keys(fieldErrors)) {
      if (!(key in next)) delete fieldErrors[key];
    }
    Object.assign(fieldErrors, next);
  };

  const clearErrors = () => {
    formError.value = '';
    for (const key of Object.keys(fieldErrors)) {
      delete fieldErrors[key];
    }
  };

  const clearFieldError = <K extends keyof T>(key: K) => {
    formError.value = '';
    delete fieldErrors[String(key)];
  };

  /**
   * Full validation — call on submit.
   * Sets isDirty so subsequent @input events validate live.
   */
  const validate = () => {
    isDirty.value = true;
    clearErrors();
    const result = schema.safeParse(data);
    if (result.success) return { ok: true as const, data: result.data };
    setErrorsFromZod(result.error);
    return { ok: false as const };
  };

  /**
   * Single-field validation — call on @input and @blur.
   * Before the first submit (isDirty = false) this is a no-op so we don't
   * show errors while the user is still filling the form for the first time.
   */
  const validateField = <K extends keyof T>(key: K) => {
    if (!isDirty.value) return true;

    const result = schema.safeParse(data);
    if (result.success) {
      // Field is now valid — clear its error if there was one
      delete fieldErrors[String(key)];
      return true;
    }

    const issueForField = result.error.issues.find((i) => i.path?.[0] === key);
    if (issueForField) {
      fieldErrors[String(key)] = issueForField.message;
      return false;
    }

    // No issue for this field specifically — it's valid now
    delete fieldErrors[String(key)];
    return true;
  };

  const isValidationError = (value: unknown) =>
    isObject(value) && typeof value.message === 'string';

  return {
    fieldErrors: fieldErrors as FieldErrors<T>,
    formError,
    isDirty,
    validate,
    validateField,
    clearFieldError,
    clearErrors,
    normalizeError: (value: unknown, fallback: string) =>
      isValidationError(value) ? (value as Error).message : fallback,
  };
}

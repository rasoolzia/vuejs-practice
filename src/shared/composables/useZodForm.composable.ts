import type { z } from 'zod';

type FieldErrors<T> = Partial<Record<keyof T, string>>;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

/**
 * Lightweight form helper for Zod + Vue.
 *
 * - `validate()` validates all fields (on submit)
 * - `validateField('name')` validates a single field (on blur)
 * - `clearFieldError('name')` clears error as user types
 */
export function useZodForm<T extends Record<string, unknown>>(
  schema: z.ZodType<T>,
  data: T,
) {
  // Note: use a plain string-keyed record to avoid Vue's generic reactive index typing issues.
  const fieldErrors = reactive<Record<string, string>>({});
  const formError = ref('');

  const setErrorsFromZod = (error: z.ZodError<T>) => {
    const next: Record<string, string> = {};
    for (const issue of error.issues) {
      const key = issue.path?.[0];
      if (typeof key === 'string' && !(key in next)) {
        next[key] = issue.message;
      }
    }
    Object.assign(fieldErrors, next);
  };

  const clearErrors = () => {
    formError.value = '';
    for (const key of Object.keys(fieldErrors)) {
      delete (fieldErrors as Record<string, string>)[key];
    }
  };

  const clearFieldError = <K extends keyof T>(key: K) => {
    formError.value = '';
    delete fieldErrors[String(key)];
  };

  const validate = () => {
    clearErrors();
    const result = schema.safeParse(data);
    if (result.success) return { ok: true as const, data: result.data };
    setErrorsFromZod(result.error);
    return { ok: false as const };
  };

  const validateField = <K extends keyof T>(key: K) => {
    clearFieldError(key);

    // Validate whole form and keep only this field's error.
    // (Zod doesn't support "validate a single field" reliably with refinements.)
    const result = schema.safeParse(data);
    if (result.success) return true;

    const issueForField = result.error.issues.find((i) => i.path?.[0] === key);
    if (issueForField) {
      fieldErrors[String(key)] = issueForField.message;
      return false;
    }
    return true;
  };

  const isValidationError = (value: unknown) =>
    isObject(value) && typeof value.message === 'string';

  return {
    fieldErrors: fieldErrors as FieldErrors<T>,
    formError,
    validate,
    validateField,
    clearFieldError,
    clearErrors,
    // tiny helper for unknown errors -> string
    normalizeError: (value: unknown, fallback: string) =>
      isValidationError(value) ? (value as Error).message : fallback,
  };
}

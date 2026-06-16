<template>
  <div class="signup">
    <form class="signup__form" @submit.prevent="handleSignUp">
      <CustomInput
        label="Username"
        name="username"
        v-model="data.username"
        :hasError="!!fieldErrors.username"
        :errorText="fieldErrors.username"
        @input="validateField('username')"
      />
      <CustomInput
        label="Email"
        name="email"
        v-model="data.email"
        :hasError="!!fieldErrors.email"
        :errorText="fieldErrors.email"
        @input="validateField('email')"
      />
      <CustomInput
        label="Password"
        name="password"
        type="password"
        v-model="data.password"
        :hasError="!!fieldErrors.password"
        :errorText="fieldErrors.password"
        @input="validateField('password')"
      />
      <CustomInput
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        v-model="data.confirmPassword"
        :hasError="!!fieldErrors.confirmPassword"
        :errorText="fieldErrors.confirmPassword"
        @input="validateField('confirmPassword')"
      />
      <div class="flex gap-2">
        <input
          type="checkbox"
          v-model="data.terms"
          id="terms"
          @change="validateField('terms')"
        />
        <label for="terms">I accept the terms and conditions</label>
      </div>
      <p v-if="fieldErrors.terms" class="mt-1 text-sm text-red-500">
        {{ fieldErrors.terms }}
      </p>
      <CustomButton type="submit" :disabled="authBridge.isAuthInUse.value">
        {{ authBridge.isAuthInUse.value ? 'Signing up…' : 'Sign Up' }}
      </CustomButton>
    </form>
    <p v-if="formError" class="mt-2 text-sm text-red-500">
      {{ formError }}
    </p>
    <div>
      Already have an account?
      <RouterLink :to="{ name: 'signin' }">Sign In</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authSchema } from '@/auth/schemas';
import { useZodForm } from '@/shared/composables/useZodForm.composable';
import { useAuthBridge } from '@shared/bridges';

const authBridge = useAuthBridge();

const data = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
});

const { fieldErrors, formError, validate, validateField } = useZodForm(
  authSchema.registerSchema,
  data,
);

const handleSignUp = async () => {
  const result = validate();
  if (!result.ok) return;

  const res = await authBridge.register(data);
  if (typeof res === 'string') {
    formError.value = res;
  }
};
</script>

<style lang="scss" scoped>
.signup {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>

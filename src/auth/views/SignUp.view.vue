<template>
  <div class="signup">
    <form class="signup__form" @submit.prevent="handleSignUp">
      <CustomInput
        label="Username"
        name="username"
        rules="required"
        v-model="data.username"
        :hasError="!!fieldErrors.username"
        :errorText="fieldErrors.username"
        @input="clearFieldError('username')"
        @blur="validateField('username')"
      />
      <CustomInput
        label="Email"
        name="email"
        rules="required"
        v-model="data.email"
        :hasError="!!fieldErrors.email"
        :errorText="fieldErrors.email"
        @input="clearFieldError('email')"
        @blur="validateField('email')"
      />
      <CustomInput
        label="Password"
        name="password"
        rules="required|min:5"
        type="password"
        v-model="data.password"
        :hasError="!!fieldErrors.password"
        :errorText="fieldErrors.password"
        @input="clearFieldError('password')"
        @blur="validateField('password')"
      />
      <CustomInput
        label="Password Confirmation"
        name="confirmPassword"
        rules="required|min:5"
        type="password"
        v-model="data.confirmPassword"
        :hasError="!!fieldErrors.confirmPassword"
        :errorText="fieldErrors.confirmPassword"
        @input="clearFieldError('confirmPassword')"
        @blur="validateField('confirmPassword')"
      />
      <div class="flex gap-2">
        <input
          type="checkbox"
          v-model="data.terms"
          id="terms"
          @change="
            data.terms ? clearFieldError('terms') : validateField('terms')
          "
        />
        <label for="terms">accept the terms</label>
      </div>
      <p v-if="fieldErrors.terms" class="mt-1 text-sm text-red-500">
        {{ fieldErrors.terms }}
      </p>
      <CustomButton type="submit">register</CustomButton>
    </form>
    <p v-if="formError" class="mt-2 text-sm text-red-500">
      {{ formError }}
    </p>
    <div>
      already have account?
      <RouterLink :to="{ name: 'signin' }">SignIn</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authSchema } from '@/auth/schemas';
import { useZodForm } from '@/shared/composables/useZodForm.composable';
import { useAuthBridge } from '@shared/bridges';
const authBridge = useAuthBridge();

//TODO use vee-validate, vue-query, error handling and fixing ui when I have time :)

const data = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
});

const { fieldErrors, formError, validate, validateField, clearFieldError } =
  useZodForm(authSchema.registerSchema, data);

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

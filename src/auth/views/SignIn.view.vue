<template>
  <div class="signin">
    <form class="signin__form" @submit.prevent="handleSignIn">
      <CustomInput
        label="Username or Email"
        name="identifier"
        rules="required"
        v-model="data.identifier"
        :hasError="!!fieldErrors.identifier"
        :errorText="fieldErrors.identifier"
        @input="clearFieldError('identifier')"
        @blur="validateField('identifier')"
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
      <div class="flex gap-2">
        <input type="checkbox" v-model="data.remember" id="remember" />
        <label for="remember">remember me</label>
      </div>
      <CustomButton type="submit">Sign In</CustomButton>
    </form>
    <p v-if="formError" class="mt-2 text-sm text-red-500">
      {{ formError }}
    </p>
    <div>
      Don't have an account?
      <RouterLink :to="{ name: 'signup' }">Sign Up</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authSchema } from '@/auth/schemas';
import { useZodForm } from '@/shared/composables/useZodForm.composable';
import { useAuthBridge } from '@shared/bridges';
const authBridge = useAuthBridge();

//TODO use vee-validate, vue-query, error handling and fixing ui when I have time :)
// const { handleSubmit, resetField } = useForm();

// const handleLogin = handleSubmit(async (formData) => {
//   try {
//     await authBridge.login({ formData });
//     router.replace({ name: "dashboard" });
//   } catch (error) {
//     console.error("An error occurred:", error);
//   } finally {
//   }
// });

const data = reactive({
  identifier: '',
  password: '',
  remember: false,
});

const { fieldErrors, formError, validate, validateField, clearFieldError } =
  useZodForm(authSchema.loginSchema, data);

const handleSignIn = async () => {
  const result = validate();
  if (!result.ok) return;

  const res = await authBridge.login(data);

  if (typeof res === 'string') {
    formError.value = res;
  }
};
</script>

<style lang="scss" scoped>
.signin {
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

<template>
  <div class="signup">
    <form class="signup__form" @submit.prevent="handleSignUp">
      <CustomInput
        label="Username"
        name="username"
        rules="required"
        v-model="data.username"
      />
      <CustomInput
        label="Email"
        name="email"
        rules="required"
        v-model="data.email"
      />
      <CustomInput
        label="Password"
        name="password"
        rules="required|min:5"
        type="password"
        v-model="data.password"
      />
      <CustomInput
        label="Password Confirmation"
        name="confirmPassword"
        rules="required|min:5"
        type="password"
        v-model="data.confirmPassword"
      />
      <div class="flex gap-2">
        <input type="checkbox" v-model="data.terms" id="terms" />
        <label for="terms">accept the terms</label>
      </div>
      <CustomButton type="submit">register</CustomButton>
    </form>
    <div>
      already have account?
      <RouterLink :to="{ name: 'signin' }">SignIn</RouterLink>
    </div>
  </div>
</template>

<script setup>
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
const handleSignUp = () => authBridge.register(data);
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

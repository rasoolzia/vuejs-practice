<script setup lang="ts">
import { useAuthBridge } from '@shared/bridges';
import { useConfirm } from '@shared/composables/useConfirm';

defineOptions({
  name: 'headerComponent',
});
const { username, logout } = useAuthBridge();
const { confirm } = useConfirm();

async function handleLogout() {
  const ok = await confirm({
    title: 'Log out?',
    message: "You'll need to sign in again to access your account.",
    confirmText: 'Log out',
    variant: 'danger',
  });
  if (ok) logout();
}
</script>

<template>
  <header class="flex w-full items-center justify-between bg-white px-8 py-3">
    <ProfileWidget :name="username" />
    <CustomDropdown align="right">
      <template #trigger>
        <CustomButton variant="outline">Menu</CustomButton>
      </template>
      <DropdownItem @click="console.log('profile')">profile</DropdownItem>
      <DropdownItem @click="console.log('settings')">settings</DropdownItem>
      <DropdownItem @click="handleLogout" class="text-red-500 hover:bg-red-50">
        logout
      </DropdownItem>
    </CustomDropdown>
  </header>
</template>

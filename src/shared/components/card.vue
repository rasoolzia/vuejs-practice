<script setup lang="ts">
defineOptions({
  name: 'cardComponent',
});
</script>

<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.card {
  border-radius: var(--c-card-border-radius, 12px);
  padding: var(--c-card-padding-y, 32px) var(--c-card-padding-x, 32px);
  background-color: var(--c-card-background-color, var(--color-white));
  width: 100%;
  overflow: hidden;
}
</style>

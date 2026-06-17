<script setup lang="ts">
defineOptions({
  name: 'ProfileWidget',
});
defineProps({
  name: { type: String },
});
</script>

<template>{{ name ?? '' }}</template>

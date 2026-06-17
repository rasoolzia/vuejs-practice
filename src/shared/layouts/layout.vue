<script setup lang="ts">
defineOptions({
  name: 'layoutComponent',
});
const route = useRoute();

const defaultLayout = 'default';
const layoutName = computed(() => route.meta?.layout || defaultLayout);
const layout = ref();

const layoutLoader = (name: string) =>
  markRaw(
    defineAsyncComponent(() => import(`@shared/layouts/${name}.layout.vue`)),
  );

watchEffect(() => {
  layout.value = layoutLoader(layoutName.value as string);
});
</script>

<template>
  <Transition mode="out-in" name="fade" appear>
    <component :is="layout">
      <slot />
    </component>
  </Transition>
  <ConfirmDialog />
</template>

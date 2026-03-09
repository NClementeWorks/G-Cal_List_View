<!-- StateBtn -->
<script setup>

  const status = defineModel ()
  const {
    label,
    icon,
    variant,
    color,
    disabled,
    loading,
  } = defineProps ({
    label: String,
    icon: String,
    variant: String,
    color: String,
    disabled: String,
    loading: String,
  })
</script>

<template>
  <template v-if="!status?.trim ().length">
    <VBtn
      v-if="label?.trim ().length"
      :prepend-icon="icon"
      :variant="variant"
      :color="color"
      :disabled="disabled"
      :loading="loading"
    >{{ label }}</VBtn>
    <VBtn
      v-else
      :icon="icon"
      :variant="variant"
      :color="color"
      :disabled="disabled"
      :loading="loading"
      ></VBtn>
  </template>
  <VIcon
    v-else-if="status === 'SUCCESS'"
    icon="mdi-check"
    ></VIcon>
  <VIcon
    v-else-if="status === 'FAILED'"
    icon="mdi-close"
    ></VIcon>
</template>

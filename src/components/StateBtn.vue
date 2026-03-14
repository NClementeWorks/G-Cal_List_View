<!-- StateBtn -->
<script setup>
  import Status from '@/constants/status'

  const status = defineModel ({
    default: Status.NONE,
  })
  const {
    label,
    icon,
    variant,
    color,
    disabled,
    onClick,
  } = defineProps ({
    label: String,
    icon: String,
    variant: String,
    color: String,
    disabled: String,
    onClick: Function,
  })

</script>

<template>
  <template v-if="!status?.trim ().length || [ Status.NONE, Status.PROGRESS ].includes ( status )">
    <VBtn
      v-if="label?.trim ().length"
      :prepend-icon="icon"
      :variant="variant"
      :color="color"
      :disabled="disabled"
      :loading="status === Status.PROGRESS"
      v-bind="$attrs"
      @click="onClick"
    >{{ label }}</VBtn>
    <VBtn
      v-else
      :icon="icon"
      :variant="variant"
      :color="color"
      :disabled="disabled"
      :loading="status === Status.PROGRESS"
      v-bind="$attrs"
      @click="onClick"
      ></VBtn>
  </template>
  <VIcon
    v-else-if="status === Status.SUCCESS"
    icon="mdi-check"
    color="success"
    ></VIcon>
  <VIcon
    v-else-if="status === Status.ERROR"
    icon="mdi-close"
    color="error"
    ></VIcon>
</template>

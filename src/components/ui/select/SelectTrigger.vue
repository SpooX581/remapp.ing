<script setup lang="ts">
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-vue-next'
import { SelectIcon, SelectTrigger, type SelectTriggerProps, useForwardProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<SelectTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <SelectTrigger
    v-bind="forwardedProps"
    class="select-trigger"
    :class="cn(
      'flex h-10 w-full items-center justify-between rounded-md px-3 py-2 text-s text-start bg-floating text-floating border border-floating',
      props.class,
    )"
  >
    <slot />
    <SelectIcon as-child>
      <ChevronDown class="w-4 h-4 opacity-50 shrink-0" />
    </SelectIcon>
  </SelectTrigger>
</template>

<style>
.select-trigger:focus {
  outline: none;
}

.select-trigger:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.select-trigger span {
  @apply text-base truncate;
}
</style>

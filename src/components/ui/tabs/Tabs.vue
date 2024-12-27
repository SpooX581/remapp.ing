<script setup lang="ts" generic="T extends string">
import type { TabsRootEmits, TabsRootProps } from 'radix-vue';
import { TabsRoot, useForwardPropsEmits } from 'radix-vue';

const props = defineProps<TabsRootProps<T>>();
const emits = defineEmits<TabsRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <TabsRoot v-bind="forwarded">
    <slot />
  </TabsRoot>
</template>

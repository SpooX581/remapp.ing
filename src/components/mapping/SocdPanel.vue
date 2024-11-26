<script setup lang="ts">
import ButtonContent from '@/components/ButtonContent.vue';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SOCDS_MAX_LEN } from '@/lib/config';
import { SOCD_TYPE, SOCD_TYPE_NAME, type SocdType } from '@/lib/socd';
import type { SocdPairData } from '@/stores/profiles';
import { Plus, X } from 'lucide-vue-next';

defineProps<{ socds: SocdPairData[] }>();
defineEmits<{
  remove: [index: number];
  add: [];
  select: [index: number, side: 'a' | 'b'];
  change: [index: number, type: SocdType];
}>();
</script>

<template>
  <div class="socd-panel">
    <div v-for="(socd, i) in socds" :style="{ '--socd': socd.i }">
      <button @click="$emit('remove', i)"><X /></button>

      <div class="flex flex-row">
        <button class="btn icon socd" @click="$emit('select', i, 'a')">
          <ButtonContent :binding="socd.a" />
        </button>
        <button class="btn icon socd" @click="$emit('select', i, 'b')">
          <ButtonContent :binding="socd.b" />
        </button>
      </div>

      <div>
        <Select :model-value="socd.type" @update:modelValue="(v) => $emit('change', i, v as SocdType)">
          <SelectTrigger>
            <SelectValue placeholder="Select SOCD type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="type in SOCD_TYPE" :value="type" :key="type">{{ SOCD_TYPE_NAME[type] }}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>

    <button v-if="socds.length < SOCDS_MAX_LEN" class="btn !py-2" @click="$emit('add')"><Plus /></button>
  </div>
</template>

<style>
.socd-panel {
  @apply p-4 gap-4;

  > div {
    @apply relative flex flex-col gap-2 p-2 rounded-lg bg-primary border border-floating;

    > button {
      @apply absolute right-2 top-2 text-gray-300 hover:text-red-500 transition-colors;
    }

    > div {
      @apply flex flex-row gap-4 items-center;
    }
  }
}

.light .btn.socd {
  border-width: 3px;
}

.btn.socd {
  @apply w-16 h-16;

  border-width: 2px;
  border-color: lch(50 clamp(100, calc(100 * var(--c)), 200) calc(108 * var(--socd)));

  > svg {
    width: 24px;
    height: 24px;
  }
}
</style>

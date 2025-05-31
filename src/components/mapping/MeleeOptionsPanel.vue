<script setup lang="ts">
import DragNumberInput from '@/components/DragNumberInput.vue';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CUSTOM_AIRDODGE_MAX, CUSTOM_AIRDODGE_MIN, type MeleeOptions } from '@/lib/config';
import { HelpCircleIcon } from 'lucide-vue-next';
import { ref, watch } from 'vue';

const props = defineProps<{
  options: MeleeOptions;
}>();

const enableCustomAirdodge = ref(props.options.customAirdodge != null);
const airdodgeX = ref(props.options.customAirdodge?.x ?? 0);
const airdodgeY = ref(props.options.customAirdodge?.y ?? 0);

watch(
  () => props.options.customAirdodge,
  (newValue) => {
    if (newValue == null) {
      enableCustomAirdodge.value = false;
      return;
    }

    if (airdodgeX.value !== newValue.x) airdodgeX.value = newValue.x ?? 0;
    if (airdodgeY.value !== newValue.y) airdodgeY.value = newValue.y ?? 0;
  },
);

function clampValue(value: number): number {
  return Math.max(CUSTOM_AIRDODGE_MIN, Math.min(CUSTOM_AIRDODGE_MAX, Math.round(value)));
}

function setAirdodge() {
  props.options.customAirdodge = {
    x: clampValue(airdodgeX.value),
    y: clampValue(airdodgeY.value),
  };
}

watch(enableCustomAirdodge, (newValue) => {
  if ((props.options.customAirdodge == null && !newValue) || (props.options.customAirdodge != null && newValue)) return;

  if (newValue) {
    setAirdodge();
  } else {
    props.options.customAirdodge = null;
  }
});

watch([airdodgeX, airdodgeY], () => {
  if (!enableCustomAirdodge.value) return;

  const airdodge = props.options.customAirdodge;

  if (airdodge == null || airdodge.x !== airdodgeX.value || airdodge.y !== airdodgeY.value) {
    setAirdodge();
  }
});

// if any of the values have changed set enabled to true
watch(
  [
    airdodgeX,
    airdodgeY,
    enableCustomAirdodge,
    () => props.options.disableLedgedashSocdOverride,
    () => props.options.crouchWalkOs,
  ],
  (newValue, oldValue) => {
    for (let i = 0; i < newValue.length; i++) {
      if (newValue[i] !== oldValue[i]) {
        props.options.enabled = true;
        return;
      }
    }
  },
);
</script>

<template>
  <div>
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <Label class="w-full font-semibold uppercase text-secondary">True Z Press</Label>
        <Checkbox v-model:checked="options.crouchWalkOs" />

        <Tooltip>
          <TooltipTrigger>
            <HelpCircleIcon class="text-muted-foreground size-4" />
          </TooltipTrigger>
          <TooltipContent side="right" align="start" class="flex max-w-80 flex-col gap-2 p-2 text-sm">
            <p>
              Set to true to make a Z input output an actual Z button press rather than the default analog shield + A
              grab macro.
            </p>
            <p>
              The default macro behaviour allows you to L cancel with Z without being locked out of tech, and true Z is
              still accessible by pressing Mod X and Z at the same time.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div class="flex items-center gap-2">
        <Label class="w-full font-semibold uppercase text-secondary">Disable Ledgedash SOCD Override</Label>
        <Checkbox v-model:checked="options.disableLedgedashSocdOverride" />

        <Tooltip>
          <TooltipTrigger>
            <HelpCircleIcon class="text-muted-foreground size-4" />
          </TooltipTrigger>
          <TooltipContent side="right" align="start" class="max-w-80 p-2 text-sm">
            <p>Set to true to disable the horizontal SOCD modifier override intended to assist with ledgedashing.</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div class="flex items-center gap-2">
        <Label class="w-full font-semibold uppercase text-secondary">Airdodge Coordinates</Label>
        <Checkbox v-model:checked="enableCustomAirdodge" />

        <Tooltip>
          <TooltipTrigger>
            <HelpCircleIcon class="text-muted-foreground size-4" />
          </TooltipTrigger>
          <TooltipContent side="right" align="start" class="max-w-80 p-2 text-sm">
            <p>Custom airdodge X/Y coordinates. Valid X/Y values are 0 to 100.</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div v-if="enableCustomAirdodge" class="flex gap-2">
        <DragNumberInput label="X" v-model="airdodgeX" :min="0" :max="100" :slow-step="5" :step="1" :fast-step="10" />
        <DragNumberInput label="Y" v-model="airdodgeY" :min="0" :max="100" :slow-step="5" :step="1" :fast-step="10" />
      </div>
    </div>
  </div>
</template>

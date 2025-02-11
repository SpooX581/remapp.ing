<script setup lang="ts">
import ButtonContent from '@/components/ButtonContent.vue';
import { useDevBar } from '@/composables/devBar';
import { displayPhysicalButton } from '@/lib/physicalDisplay';
import { BUTTON_HEIGHT, BUTTON_WIDTH, SCALE_FACTOR } from '@/lib/utils';
import { useEditor } from '@/stores/editor';
import type { ButtonData, ButtonState } from '@/stores/profiles';
import { computed, useTemplateRef } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps<{
  showSocd: boolean;
  data: ButtonData & ButtonState;
  inEditor?: boolean;
}>();
defineEmits(['clear']);

const state = computed(() => {
  if (props.data.isSelected) {
    return 'selected';
  }

  if (props.data.isDirty) {
    return 'dirty';
  }

  if (props.data.isModified) {
    return 'modified';
  }

  return 'none';
});

const x = computed(() => props.data.x * SCALE_FACTOR);
const y = computed(() => props.data.y * SCALE_FACTOR);

const width = BUTTON_WIDTH;
const height = BUTTON_HEIGHT;

const CUTOUT_RADIUS = 8;
const CUTOUT = 28;

const devBar = useDevBar();
const editor = useEditor();

const rect = useTemplateRef('rect');

defineExpose({ rect, i: props.data.i });
</script>

<template>
  <svg :x="x" :y="y" :width :height>
    <mask id="m" :width :height>
      <svg :width :height viewBox="0 0 88 88" fill="white">
        <rect :width :height fill="white"></rect>
        <rect :x="width - CUTOUT" :width="CUTOUT" :height="CUTOUT" fill="black"></rect>

        <rect
          :x="width - CUTOUT - CUTOUT_RADIUS"
          :width="CUTOUT_RADIUS + 1"
          :height="CUTOUT_RADIUS + 1"
          fill="black"
        ></rect>
        <circle :cx="width - CUTOUT - CUTOUT_RADIUS" :cy="CUTOUT_RADIUS" :r="CUTOUT_RADIUS" fill="white"></circle>

        <rect
          :x="width - CUTOUT - 1"
          :y="CUTOUT - CUTOUT_RADIUS + 1"
          :width="CUTOUT_RADIUS + 1"
          :height="CUTOUT_RADIUS + 1"
          fill="white"
        ></rect>
        <circle
          :cx="width - CUTOUT + CUTOUT_RADIUS"
          :cy="CUTOUT - CUTOUT_RADIUS"
          :r="CUTOUT_RADIUS"
          fill="black"
        ></circle>

        <rect
          :x="width - CUTOUT_RADIUS - 1"
          :y="CUTOUT - 1"
          :width="CUTOUT_RADIUS + 1"
          :height="CUTOUT_RADIUS + 1"
          fill="black"
        ></rect>
        <circle :cx="width - CUTOUT_RADIUS" :cy="CUTOUT + CUTOUT_RADIUS" :r="CUTOUT_RADIUS" fill="white"></circle>
      </svg>
    </mask>

    <foreignObject
      class="layout-button"
      :width
      :height
      :data-state="state"
      :data-hover="data.isHover"
      :class="{ socd: data.socd !== undefined && showSocd }"
      mask="url(#m)"
    >
      <div ref="rect" :style="{ '--socd': data.socd }">
        <ButtonContent :binding="data.binding" />
      </div>
      <code v-if="devBar && inEditor">
        {{ data.physical === 'unspecified' ? 'unsp' : displayPhysicalButton(data.physical, editor.naming) }}
      </code>
    </foreignObject>
    <foreignObject class="layout-button-corner" :width :height :data-hover="data.isHover">
      <button @click="$emit('clear')">
        <X :size="20" />
      </button>
    </foreignObject>
  </svg>
</template>

<style>
/* prettier-ignore */
.light {
  --button-selected: lch(77 24 47);
  --button-dirty:    lch(85 27 86);
  --button-modified: lch(85 26 153);
}

/* prettier-ignore */
.dark {
  --button-selected: lch(35 30 47);
  --button-dirty:    lch(45 30 86);
  --button-modified: lch(40 35 153);
}

.layout-button {
  @apply select-none;

  --r: 48px;
  --b: var(--bg-floating);

  &[data-hover='true'] {
    --r: 36px;
    --b: var(--bg-floating-hover);

    > div {
      border-top-right-radius: 32px;
    }
  }

  &[data-hover='false'] {
    mask: none;
  }

  &[data-state='selected'] {
    --r: 36px;
    --b: var(--button-selected);
  }

  &[data-state='dirty'] {
    --b: var(--button-dirty);
  }

  &[data-state='modified'] {
    --b: var(--button-modified);
  }

  &.socd > div {
    border-color: lch(50 clamp(100, calc(100 * var(--c)), 200) calc(108 * var(--socd)));
  }

  > div {
    @apply flex h-full w-full items-center justify-center transition-all;

    border-width: 2px;
    border-color: transparent;

    border-radius: var(--r);
    background-color: var(--b);

    span {
      @apply text-3xl font-semibold;
    }

    svg {
      @apply size-6;
    }

    > code {
      @apply absolute top-0 text-xs;
    }
  }
}

.layout-button-corner {
  @apply relative;

  &[data-hover='true'] {
    > button {
      visibility: visible;
      opacity: 1;
      animation: bounce-in 0.1s cubic-bezier(0.2, 1.8, 0.3, 1) both;
    }
  }

  &[data-hover='false'] {
    > button {
      animation: bounce-out 0.06s cubic-bezier(0.55, 0, 1, 0.45) both;
    }
  }

  > button {
    @apply absolute right-0 top-0 flex items-center justify-center bg-floating;
    border-radius: 8px 32px 8px 8px;
    width: 24px;
    height: 24px;
    padding-top: 4px;
    padding-right: 4px;
    will-change: transform, opacity;
    visibility: hidden;

    &:hover {
      @apply bg-floating-hover text-red-500;
    }

    &:active {
      @apply bg-floating-active;
    }
  }
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: translate(3px, -3px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
}

@keyframes bounce-out {
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(3px, -3px) scale(0.95);
  }
}
</style>

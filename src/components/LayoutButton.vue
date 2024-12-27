<script setup lang="ts">
import ButtonContent from '@/components/ButtonContent.vue';
import { useDevBar } from '@/composables/devBar';
import { displayPhysicalButton } from '@/lib/physicalDisplay';
import { BUTTON_HEIGHT, BUTTON_WIDTH, SCALE_FACTOR } from '@/lib/utils';
import { useEditor } from '@/stores/editor';
import type { ButtonData, ButtonState } from '@/stores/profiles';
import { computed, useTemplateRef } from 'vue';

const props = defineProps<{
  showSocd: boolean;
  data: ButtonData & ButtonState;
  inEditor?: boolean;
}>();

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

const devBar = useDevBar();
const editor = useEditor();

const rect = useTemplateRef('rect');

defineExpose({ rect, i: props.data.i });
</script>

<template>
  <svg :x="x" :y="y" :width :height>
    <rect ref="rect" :width :height :data-state="state" :data-hover="data.isHover" />

    <foreignObject class="layout-button" :width :height>
      <div
        :data-state="state"
        :data-hover="data.isHover"
        :class="{ socd: data.socd !== undefined && showSocd }"
        :style="{ '--socd': data.socd }"
      >
        <ButtonContent :binding="data.binding" />
      </div>
      <code v-if="devBar && inEditor">
        {{ data.physical === 'unspecified' ? 'unsp' : displayPhysicalButton(data.physical, editor.naming) }}
      </code>
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

.layout svg > svg > rect,
.layout-button > div {
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;

  --r: 48px;

  &[data-hover='true'] {
    --r: 36px;
  }

  &[data-state='selected'] {
    --r: 36px;
  }
}

.layout svg > svg {
  user-select: none;

  rect {
    transition-property: rx, ry, fill;

    rx: var(--r);
    ry: var(--r);

    fill: var(--bg-floating);

    &[data-hover='true'] {
      fill: var(--bg-floating-hover);
    }

    &[data-state='selected'] {
      fill: var(--button-selected);
    }

    &[data-state='dirty'] {
      fill: var(--button-dirty);
    }

    &[data-state='modified'] {
      fill: var(--button-modified);
    }
  }
}

.light .layout-button > div {
  border-width: 3px;
}

.layout-button > div {
  @apply flex items-center justify-center w-full h-full;

  transition-property: border-radius, border-color;

  border-width: 2px;
  border-radius: var(--r);
  border-color: transparent;

  &.socd {
    border-color: lch(50 clamp(100, calc(100 * var(--c)), 200) calc(108 * var(--socd)));
  }

  span {
    @apply text-3xl font-semibold;
  }

  svg {
    @apply w-6 h-6;
  }
}

.layout-button > code {
  @apply absolute top-0 text-xs;
}
</style>

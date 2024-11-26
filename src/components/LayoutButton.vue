<script setup lang="ts">
import ButtonContent from '@/components/ButtonContent.vue';
import type { ButtonData, ButtonState } from '@/stores/profiles';
import { computed, onBeforeUnmount, onMounted, useTemplateRef } from 'vue';

const rect = useTemplateRef('rect');

const props = defineProps<{
  elRef: (i: number, el: HTMLElement) => void;
  elUnref: (i: number) => void;

  showSocd: boolean;
  data: ButtonData & ButtonState;
}>();

onMounted(() => {
  props.elRef(props.data.i, rect.value as never as HTMLElement);
});

onBeforeUnmount(() => {
  props.elUnref(props.data.i);
});

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

const x = computed(() => props.data.x * 10);
const y = computed(() => props.data.y * 10);

const width = 88;
const height = 88;
</script>

<template>
  <svg ref="g" :x="x" :y="y">
    <rect ref="rect" :width :height :data-state="state" :data-hover="data.isHover" />

    <foreignObject :width :height>
      <div
        class="layout-button"
        :data-state="state"
        :data-hover="data.isHover"
        :class="{ socd: data.socd !== undefined && showSocd }"
        :style="{ '--socd': data.socd }"
      >
        <ButtonContent :binding="data.binding" />
      </div>
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

.layout svg rect,
.layout-button {
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

.layout svg {
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

.light .layout-button {
  border-width: 3px;
}

.layout-button {
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
</style>

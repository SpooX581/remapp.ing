<script setup lang="ts">
// biome-ignore lint/style/useImportType: its just wrong
import LayoutButton from '@/components/LayoutButton.vue';
import { useElements } from '@/composables/elements';
import {
  BUTTON_HEIGHT,
  BUTTON_WIDTH,
  SCALE_FACTOR,
  VIEWPORT_SAFE_MIN_X,
  VIEWPORT_SAFE_MIN_Y,
  useTemplateRefs,
  viewport_safe_max,
} from '@/lib/utils';
import type { ButtonData, ButtonState } from '@/stores/profiles';
import { useEventListener, useMagicKeys, useMouse, whenever } from '@vueuse/core';
import { computed, onMounted, onUnmounted, reactive, ref, useTemplateRef, watch, type ComponentInstance } from 'vue';

const props = defineProps<{
  buttons: (ButtonData & ButtonState)[];
  showSocd?: boolean;
  draggable?: boolean;
  inEditor?: boolean;
  viewportSize: [number, number];
}>();
const emit = defineEmits<{
  hover: [number | null];
  clear: [number];
}>();

const selected = defineModel<number | null>('selected');

const viewport = useTemplateRef('viewport');
const { elements: layoutButtons, setElement } = useTemplateRefs<ComponentInstance<typeof LayoutButton>>();
const rects = computed(
  () =>
    layoutButtons.value
      ?.map((c) =>
        c != null && c.rect != null
          ? {
              el: c.rect,
              i: c.i,
            }
          : null,
      )
      .filter((r) => r != null) ?? [],
);

const { elements, recalculate } = useElements(viewport, rects);

const { x, y } = useMouse();
const hoveredElement = ref<number | null>(null);

function setButton(i: number | null | undefined, data: Partial<ButtonData & ButtonState>) {
  if (i == null || i < 0 || i >= props.buttons.length) return;
  props.buttons[i] = { ...props.buttons[i], ...data };
}

function getButton(i: number) {
  if (i == null || i < 0 || i >= props.buttons.length) return null;
  return props.buttons[i];
}

watch([x, y], () => {
  if (props.buttons.length === 0) return;

  let anyHovered = false;

  // this is reversed because the element with the highest index should
  // be on top due to being the last element added
  //
  // if the loop started at 0, every time you have overlapping buttons,
  // the one you hover would be drawn on bottom of all which looks weird
  for (let i = elements.value.length - 1; i >= 0; i--) {
    if (elements.value[i] == null) break;
    const { rect } = elements.value[i];

    if (anyHovered && hoveredElement.value !== i) {
      if (getButton(i)?.isHover) {
        setButton(i, { isHover: false });
      }
      continue;
    }

    const hovered =
      x.value >= rect.left && //
      x.value <= rect.right &&
      y.value >= rect.top &&
      y.value <= rect.bottom;

    if (hovered) {
      anyHovered = true;
      hoveredElement.value = i;
    }

    if (getButton(i)?.isHover !== hovered) {
      setButton(i, { isHover: hovered });
    }
  }

  if (!anyHovered) hoveredElement.value = null;
});

watch(hoveredElement, (newValue, oldValue) => {
  if (newValue === oldValue) return;
  emit('hover', newValue);
});

const cursor = computed(() => (hoveredElement.value !== null ? 'pointer' : 'default'));

const container = useTemplateRef('container');

const size = reactive({
  width: 0,
  height: 0,
});

const viewportRatio = computed(() => props.viewportSize[0] / props.viewportSize[1]);
const viewportSafe = computed(() => viewport_safe_max(props.viewportSize));

function onLayoutResize() {
  if (!container.value) return;

  const width = container.value.clientWidth;
  const height = container.value.clientHeight;

  const ratio = width / height;

  if (ratio > viewportRatio.value) {
    size.width = height * viewportRatio.value;
    size.height = height;
  } else {
    size.width = width * viewportRatio.value;
    size.height = width / viewportRatio.value;
  }

  recalculate();
}

const layoutObserver = new ResizeObserver(onLayoutResize);

onMounted(() => {
  onLayoutResize();
  if (container.value) layoutObserver.observe(container.value);
});

watch(props.viewportSize, onLayoutResize, { deep: true });

onUnmounted(() => layoutObserver.disconnect());

let mouseDown = false;

function onMouseMove(e: MouseEvent) {
  if (!mouseDown || selected.value == null || !viewport.value) return;

  const viewportScaling = viewport.value.clientWidth / props.viewportSize[0];

  // offset mouse 0,0 to top left of container
  const viewportRect = viewport.value.getBoundingClientRect();

  const mouseX = (e.clientX - viewportRect.left) / viewportScaling;
  const mouseY = (e.clientY - viewportRect.top) / viewportScaling;

  const newX = mouseX - BUTTON_WIDTH / 2;
  const clampedX = Math.min(Math.max(newX, VIEWPORT_SAFE_MIN_X), viewportSafe.value[0]);

  const newY = mouseY - BUTTON_HEIGHT / 2;
  const clampedY = Math.min(Math.max(newY, VIEWPORT_SAFE_MIN_Y), viewportSafe.value[1]);

  const x = Number((clampedX / SCALE_FACTOR).toFixed(2));
  const y = Number((clampedY / SCALE_FACTOR).toFixed(2));

  setButton(selected.value, { x, y });

  recalculate(selected.value);
}

function onMouseDown() {
  if (!mouseDown && hoveredElement.value !== null) {
    mouseDown = true;

    if (selected.value === hoveredElement.value) {
      // only listen for mousemove if dragging enabled
      if (props.draggable) {
        document.addEventListener('mousemove', onMouseMove);
      }
    } else {
      selected.value = hoveredElement.value;
    }
  }
}

watch(
  () => selected.value,
  (newValue, oldValue) => {
    if (newValue === oldValue) return;
    setButton(oldValue, { isSelected: false });
    setButton(newValue, { isSelected: true });
  },
);

useEventListener('mousedown', onMouseDown);

useEventListener('mouseup', () => {
  if (mouseDown) {
    mouseDown = false;
    document.removeEventListener('mousemove', onMouseMove);
  }
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove);
});

const { escape: esc } = useMagicKeys();

whenever(esc, () => {
  if (selected.value != null) {
    setButton(selected.value, { isSelected: false });
    selected.value = null;
  }
});
</script>

<template>
  <div class="layout">
    <div ref="container">
      <svg
        ref="viewport"
        :class="{ 'border border-floating bg-something shadow': !!inEditor }"
        :viewBox="`0 0 ${viewportSize[0]} ${viewportSize[1]}`"
        :style="{ cursor }"
        :height="size.height"
        :width="size.width"
      >
        <LayoutButton
          :ref="(el) => setElement(el as never, data.i)"
          v-for="data in buttons"
          :key="data.i"
          :data
          :show-socd="!!showSocd"
          :in-editor="!!inEditor"
          @clear="$emit('clear', data.i)"
        />
      </svg>
    </div>
  </div>
</template>

<style>
.layout > div {
  @apply flex h-full w-full items-center justify-center;

  > svg {
    @apply max-h-full max-w-full rounded-lg;

    g {
      transition: filter 0.1s ease;

      filter: drop-shadow(1px 3px 2px rgba(0, 0, 0, 0.3));

      &:hover {
        filter: drop-shadow(1px 3px 2px rgba(0, 0, 0, 0.5));
      }
    }
  }
}
</style>

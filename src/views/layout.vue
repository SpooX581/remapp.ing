<script setup lang="ts">
import { type Layout, getLayouts, importLayout } from '@/lib/layout';
import { useDeviceManager } from '@/stores/deviceManager';
import { useDropZone, useFileDialog, whenever } from '@vueuse/core';
import { Upload } from 'lucide-vue-next';
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import { useRouter } from 'vue-router';

const sectionPosition = ref('down');

const deviceManager = useDeviceManager();

const allLayouts = ref<Map<string, Layout>>(new Map());

onMounted(() => {
  requestAnimationFrame(() => {
    sectionPosition.value = 'up';
  });

  getLayouts().then((layouts) => {
    allLayouts.value = layouts;
  });
});

const router = useRouter();

whenever(
  () => deviceManager.layout,
  () => router.push('/mapping'),
  { immediate: true },
);

const dropZone = useTemplateRef('drop-zone');

const { isOverDropZone } = useDropZone(dropZone, {
  onDrop,
  dataTypes: ['application/json'],
  multiple: false,
  preventDefaultForUnhandled: false,
});

async function onDrop(files: File[] | null) {
  if (files && files.length !== 0) {
    const layout = await importLayout(files[0]);
    if (layout) {
      deviceManager.overrideLayout(layout);
    }
  }
}

const { open, files, reset } = useFileDialog({
  accept: '.json',
  multiple: false,
});

watch(files, async () => {
  if (files.value && files.value.length !== 0) {
    const layout = await importLayout(files.value[0]);
    if (layout) {
      deviceManager.overrideLayout(layout);
    }
    reset();
  }
});
</script>

<template>
  <section class="select-layout" :class="sectionPosition">
    <span>
      Couldn't detect layout for device:
      <code class="bg-secondary py-1 px-2 rounded-lg border border-floating">{{ deviceManager.info?.deviceName }}</code>
    </span>

    <div class="grid grid-cols-2 gap-4 h-full">
      <div class="flex flex-col items-center gap-4 bg-secondary rounded-lg p-4">
        <span>Select your layout:</span>

        <div class="flex gap-2 w-full items-center justify-center whitespace-nowrap px-2 py-1 flex-wrap">
          <div v-for="[key, layout] in allLayouts"
            class="awa flex flex-col gap-2 rounded-md text-floating bg-floating px-4" :key>
            <button class="text-lg my-2" @click="deviceManager.overrideLayout(layout)">{{ layout.name }}</button>
          </div>
        </div>
      </div>

      <div ref="drop-zone" class="flex flex-col items-center gap-4 bg-secondary rounded-lg p-4">
        <span>Or import custom:</span>

        <div role="button"
          class="flex items-center justify-center rounded-xl border-2 border-dashed p-4 w-full h-full transition-colors hover:border-accent cursor-pointer"
          :class="{ 'border-accent': isOverDropZone, 'border-floating': !isOverDropZone }" @click="() => open()">
          <Upload class="size-24 text-muted" />
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.select-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  transition-property: transform opacity;
  transition-duration: 300ms;
  transition-timing-function: ease-in-out;

  height: 256px;
}

.select-layout.down {
  transform: translateY(50%);
  opacity: 0;
}

.select-layout.up {
  transform: translateY(0);
  opacity: 1;
}

.select-layout > div > a {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  cursor: pointer;

  transition: font-weight 300ms;
}

.select-layout > div > a:hover {
  font-weight: 500;
}

/* todo: these */
.select-layout > div > a rect {
  transition: filter 100ms, fill 150ms;
  fill: var(--bg-floating);
}

.select-layout > div > a:hover rect {
  filter: drop-shadow(0 3px 2px rgba(0, 0, 0, 0.3));
  fill: var(--bg-floating-hover);
}

.awa {
  cursor: pointer;

  @apply transition-colors;
  transition-property: background-color, color, font-weight;

  /* &[data-state='active'] {
    background-color: var(--bg-floating-active);
    color: var(--text-primary);
    font-weight: 600;
  } */

  &:hover {
    background-color: var(--bg-floating-hover);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}
</style>

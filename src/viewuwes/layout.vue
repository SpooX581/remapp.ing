<script setup lang="ts">
import { useDevBar } from '@/composables/devBar';
import { type Layout, getLayouts } from '@/lib/layout';
import { useDeviceManager } from '@/stores/deviceManager';
import { whenever } from '@vueuse/core';
import { onMounted, ref } from 'vue';
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
const devBar = useDevBar();

whenever(
  () => deviceManager.layout && !devBar.value,
  () => router.push('/mapping'),
  { immediate: true },
);
</script>

<template>
  <section class="select-layout" :class="sectionPosition">
    <span>
      Couldn't detect layout for device: <code>{{ deviceManager.info?.deviceName }}</code>
      !
    </span>
    <span>Select your layout:</span>

    <div class="flex gap-2 w-full items-center justify-center whitespace-nowrap px-2 py-1 flex-wrap">
      <div
        v-for="[key, layout] in allLayouts"
        class="awa flex flex-col gap-2 rounded-md text-floating bg-floating px-4"
        :key
      >
        <button class="text-lg my-2" @click="deviceManager.overrideLayout(layout)">{{ layout.name }}</button>
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

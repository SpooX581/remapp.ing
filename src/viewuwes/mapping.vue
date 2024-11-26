<script setup lang="ts">
import LayoutButton from '@/components/LayoutButton.vue';
import ProfileSelect from '@/components/ProfileSelect.vue';
import { BombIcon, SaveIcon } from '@/components/icons';
import BindingsPanel from '@/components/mapping/BindingsPanel.vue';
import SocdPanel from '@/components/mapping/SocdPanel.vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import useActiveProfile from '@/composables/activeProfile';
import type { Binding } from '@/lib/bindings';
import { useDeviceManager } from '@/stores/deviceManager';
import { useProfile } from '@/stores/profiles';
import { useMouse } from '@vueuse/core';
import { computed, onMounted, onUnmounted, ref, shallowRef, triggerRef, useTemplateRef, watch } from 'vue';

const deviceManager = useDeviceManager();

const activeProfile = useActiveProfile();
const profile = computed(() => deviceManager.layout && useProfile(activeProfile.value, deviceManager.layout));

const elements = shallowRef<{ i: number; el: HTMLElement; rect: DOMRect }[]>([]);

function calculateBboxes() {
  let i = 0;

  for (const { el } of elements.value) {
    elements.value[i].rect = el.getBoundingClientRect();
    i++;
  }

  triggerRef(elements);
}

const observer = new ResizeObserver(calculateBboxes);
const container = useTemplateRef('container');

onMounted(() => {
  calculateBboxes();
  if (container.value) {
    observer.observe(container.value);
  }
});

onUnmounted(() => {
  observer.disconnect();
});

const { x, y } = useMouse();
const cursor = ref('default');
const hoveredElement = ref<number | null>(null);

watch([x, y], () => {
  let anyHovered = false;

  for (const { rect, i } of elements.value) {
    if (anyHovered) {
      profile.value?.setHover(i, false);
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

    profile.value?.setHover(i, hovered);
  }

  if (!anyHovered) hoveredElement.value = null;
  cursor.value = anyHovered ? 'pointer' : 'default';
});

function setElement(i: number, el: HTMLElement) {
  elements.value.push({ i, el, rect: el.getBoundingClientRect() });
  triggerRef(elements);
}

function unsetElement(i: number) {
  elements.value = elements.value.filter((e) => e.i !== i);
  triggerRef(elements);
}

function onClick(e: Event, i: number) {
  e.preventDefault();

  profile.value?.toggleSelected(i);
}

function clearSelection() {
  if (hoveredElement.value !== null) return;
  profile.value?.clearSelected();
}

// todo: useMagicKeys maybe
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    clearSelection();
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown);
});

function setBinding(binding: Binding) {
  profile.value?.setBinding(binding);

  // todo: should the button be unselected
  clearSelection();
}

function setSocdBinding(i: number, side: 'a' | 'b') {
  profile.value?.setSocdBinding(i, side);

  // todo: should the button be unselected
  clearSelection();
}

type Tab = 'bindings' | 'socd';

const tab = ref<Tab>('bindings');
</script>

<template>
  <section class="mapping">
    <div class="layout">
      <div>
        <svg ref="container" viewBox="0 0 1000 600" :style="{ cursor: cursor }">
          <LayoutButton
            :el-ref="setElement"
            :el-unref="unsetElement"
            v-for="(data, i) in profile?.buttons"
            :key="i"
            :data
            :show-socd="tab === 'socd'"
            @click="(e: Event) => onClick(e, i)"
          />
        </svg>
      </div>
    </div>

    <Tabs class="inspector" v-model="tab">
      <TabsList>
        <TabsTrigger value="bindings">BINDINGS</TabsTrigger>
        <TabsTrigger value="socd">SOCD</TabsTrigger>
      </TabsList>

      <TabsContent value="bindings" class="panel scroller">
        <BindingsPanel @select="setBinding" />
      </TabsContent>

      <TabsContent value="socd" class="panel scroller">
        <SocdPanel
          v-if="profile"
          :socds="profile.socd"
          @select="setSocdBinding"
          @change="profile.setSocdBindingType"
          @add="profile.addSocd"
          @remove="profile.removeSocd"
        />
      </TabsContent>
    </Tabs>

    <footer class="flex">
      <div class="flex gap-8 items-center">
        <ProfileSelect />

        <div>
          <h2 class="text-xl">Connected to:</h2>
          <span>{{ deviceManager.info?.deviceName }}</span>
        </div>
      </div>

      <div class="flex gap-2 items-center">
        <Tooltip>
          <TooltipTrigger as-child>
            <button class="btn icon h-16 w-16" @click="profile?.clearMappings()">
              <BombIcon class="w-8 h-8" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" class="text-center max-w-64" :collision-padding="8">
            <p>Nuclear Bomb</p>
            <p class="text-tertiary">Clear device remappings from active profile</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <button class="btn icon h-16 w-16" @click="deviceManager.saveConfig()">
              <SaveIcon class="w-8 h-8" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" :collision-padding="8">
            <p>Save and Upload</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </footer>
  </section>
</template>

<style>
.mapping {
  display: grid;

  grid-template-columns: 4rem 1fr 320px;
  grid-template-rows: 8rem minmax(0, 1fr) 88px;

  gap: 1rem;
  padding: 1rem;

  width: 100%;
  height: 100vh;

  overflow: hidden;

  grid-template-areas:
    'header  header inspector'
    'sidebar layout inspector'
    'footer  footer footer';

  > .layout {
    grid-area: layout;
  }

  > .inspector {
    grid-area: inspector;
  }

  > footer {
    grid-area: footer;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.layout > div {
  display: flex;

  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  overflow: hidden;

  > svg {
    width: 100%;
    height: 100%;

    g {
      transition: filter 0.1s ease;

      filter: drop-shadow(1px 3px 2px rgba(0, 0, 0, 0.3));

      &:hover {
        filter: drop-shadow(1px 3px 2px rgba(0, 0, 0, 0.5));
      }
    }
  }
}

.inspector {
  display: flex;
  flex-flow: column nowrap;

  > .panel {
    display: flex;
    flex-flow: column nowrap;

    &[data-state='inactive'] {
      display: none;
    }

    > div {
      @apply relative flex flex-col p-4 bg-secondary text-secondary rounded-lg;

      overflow-x: hidden;
      overflow-y: auto;
      min-height: 0;

      /* rng scrollbar style because default looks worse than anything else */

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: var(--bg-floating-active); /* maybe change later */
        border-radius: 4px;
      }

      &::-webkit-scrollbar-track {
        background-color: var(--bg-tertiary);
        border-radius: 1rem;
      }
    }
  }
}
</style>

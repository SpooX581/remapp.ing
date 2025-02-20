<script setup lang="ts">
import Combobox from '@/components/Combobox.vue';
import LayoutContainer from '@/components/LayoutContainer.vue';
import InspectorPanel from '@/components/editor/InspectorPanel.vue';
import PropertiesPanel from '@/components/editor/PropertiesPanel.vue';
import SocdPanel from '@/components/editor/SocdPanel.vue';
import HiddenPanel from '@/components/editor/HiddenPanel.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getLayouts, importLayout } from '@/lib/layout';
import { gameModeToName } from '@/lib/modes';
import { useEditor } from '@/stores/editor';
import { useEventListener, useFileDialog, useLocalStorage } from '@vueuse/core';
import { PlusIcon } from 'lucide-vue-next';
import { onMounted, ref, useTemplateRef, watch } from 'vue';

type Tab = 'properties' | 'inspector' | 'socd' | 'hidden';

const tab = ref<Tab>('inspector');

const editor = useEditor();

const INSPECTOR_MIN_WIDTH = 350;
let inspectorMaxWidth = 800;

const inspectorWidth = useLocalStorage<number>('editor-inspector-width', INSPECTOR_MIN_WIDTH);
const resizeHandle = useTemplateRef('inspector-handle');

let isResizing = false;
let dragStart = 0;
let inspectorWidthStart = INSPECTOR_MIN_WIDTH;

useEventListener(resizeHandle, 'mousedown', (e: MouseEvent) => {
  if (e.button !== 0) return;
  isResizing = true;
  dragStart = e.clientX;
  inspectorWidthStart = inspectorWidth.value ?? 0;
});

useEventListener('mouseup', () => {
  isResizing = false;
});

useEventListener('mousemove', (e: MouseEvent) => {
  if (!isResizing) return;
  e.preventDefault();
  // clientX gets smaller the wider the inspector gets
  inspectorWidth.value = Math.min(
    inspectorMaxWidth,
    Math.max(INSPECTOR_MIN_WIDTH, inspectorWidthStart + (dragStart - e.clientX)),
  );
});

function exportLayout() {
  const layout = editor.exportToLayout();

  console.info(layout);

  const blob = new Blob([JSON.stringify(layout, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'layout.json';
  a.click();
  URL.revokeObjectURL(url);
}

const { open, files, reset } = useFileDialog({
  accept: '.json',
  multiple: false,
});

async function importDefaultLayout() {
  const layouts = await getLayouts();
  const slimLayout = layouts.get('gram-slim-smash');
  if (slimLayout) {
    editor.importFromLayout(slimLayout);
  }
}

watch(files, async () => {
  if (!files.value || files.value.length === 0) return;

  const layout = await importLayout(files.value[0]);

  if (layout) {
    editor.importFromLayout(layout);
  }

  reset();
});

function setMaxWidth() {
  inspectorMaxWidth = window.innerWidth * 0.8;
}

onMounted(setMaxWidth);
useEventListener('resize', setMaxWidth);
</script>

<template>
  <section class="editor">
    <LayoutContainer
      class="content"
      in-editor
      :buttons="editor.buttons"
      v-model:selected="editor.selected"
      draggable
      :viewport-size="editor.viewportSize"
      @clear="editor.deleteButton"
    />

    <Tabs class="inspector" v-model="tab" :style="{ width: `${inspectorWidth}px` }">
      <div ref="inspector-handle" class="resize-handle"></div>

      <TabsList>
        <TabsTrigger value="inspector">INSPECTOR</TabsTrigger>
        <TabsTrigger value="socd">SOCD</TabsTrigger>
        <TabsTrigger value="hidden">HIDDEN</TabsTrigger>
        <TabsTrigger value="properties">PROPERTIES</TabsTrigger>
      </TabsList>

      <TabsContent value="inspector" class="panel scroller">
        <InspectorPanel v-if="editor.selectedButton" :button="editor.selectedButton" />
        <div v-else class="flex h-full w-full items-center justify-center">
          <span class="text-lg text-tertiary">Select a button</span>
        </div>
      </TabsContent>

      <TabsContent value="properties" class="panel scroller">
        <PropertiesPanel />
      </TabsContent>

      <TabsContent value="socd" class="panel scroller">
        <SocdPanel />
      </TabsContent>

      <TabsContent value="hidden" class="panel scroller">
        <HiddenPanel />
      </TabsContent>
    </Tabs>

    <footer>
      <button class="btn" @click="editor.addButton">
        <span>Add button</span>
        <PlusIcon />
      </button>

      <div class="flex items-center gap-4">
        <Button @click="importDefaultLayout">Default Layout</Button>
        <Button @click="editor.clear">Clear</Button>
        <Button @click="exportLayout">Export</Button>
        <Button @click="() => open()">Import</Button>

        <div class="flex flex-col gap-1">
          <Label class="text-sm uppercase text-secondary">View layout as</Label>
          <Combobox direction="top" :options="editor.viewModeOptions" v-model="editor.viewMode">
            <template #preview="{ value }">
              <span v-if="value">{{ gameModeToName(value) }}</span>
            </template>

            <template #empty>No modes found</template>

            <template #item="{ html }"><span v-html="html" /></template>
          </Combobox>
        </div>
      </div>
    </footer>
  </section>
</template>

<style>
.editor {
  @apply grid h-screen w-full gap-4 overflow-hidden p-4;

  grid-template-columns: 4rem 1fr minmax(350px, auto);
  grid-template-rows: 8rem minmax(0, 1fr) 88px;

  grid-template-areas:
    'header header inspector'
    'sidebar content inspector'
    'footer footer footer';

  > .content {
    grid-area: content;
  }

  > .inspector {
    grid-area: inspector;
  }

  .viewport {
    grid-area: draggable;
  }

  > footer {
    grid-area: footer;

    @apply flex items-center justify-between rounded-lg bg-secondary p-4;

    > button {
      @apply flex items-center justify-center gap-2;
    }
  }
}

.editor .inspector {
  @apply relative flex flex-col flex-nowrap;

  > .resize-handle {
    @apply absolute -left-2 top-0 z-10 h-full w-1 cursor-ew-resize rounded-full transition-colors;

    /* padding on either side */
    &::after {
      @apply absolute -left-1 -right-1 top-0 h-full;
      content: '';
    }

    &:hover {
      @apply bg-floating-hover;
    }
  }

  > .panel {
    @apply flex flex-col flex-nowrap gap-4 rounded-lg bg-secondary p-2;

    &[data-state='inactive'] {
      display: none;
    }
  }
}
</style>

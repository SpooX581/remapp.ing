<script setup lang="ts">
import DefaultBindSelect from '@/components/DefaultBindSelect.vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GAME_MODE, gameModeToName } from '@/lib/modes';
import { ref } from 'vue';

const allModes = Object.values(GAME_MODE).filter((v) => v !== GAME_MODE.UNSPECIFIED);

const x = ref(0);
const y = ref(0);

const deviceName = ref('');
</script>

<template>
  <div class="content"></div>

  <aside class="inspector">
    <div class="flex gap-2">
      <div class="flex gap-2 items-center w-full">
        <Label>X</Label>
        <Input v-model="x" type="number" min="0" max="1000" />
      </div>

      <div class="flex gap-2 items-center w-full">
        <Label>Y</Label>
        <Input v-model="y" type="number" min="0" max="1000" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <Label>Default mode bindings</Label>
      <div class="flex flex-col gap-1">
        <div v-for="mode in allModes" class="pl-2 flex gap-2 items-center justify-between">
          <Label class="text-neutral-500 font-semibold">{{ gameModeToName(mode) }}</Label>
          <DefaultBindSelect :mode />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <Label>Device Name</Label>
      <div class="flex flex-col gap-1">
        <Input v-model="deviceName" type="text" placeholder="GRAM Slim SMASH" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <Label>Button Position</Label>
      <div class="flex flex-col gap-1">
        <!-- combobox with all the haybox lf1 fuckers -->
      </div>
    </div>
  </aside>
</template>

<style>
.viewport {
  grid-area: draggable;
}

.inspector {
  grid-area: inspector;

  display: flex;
  flex-flow: column nowrap;

  gap: 1rem;
  padding: 1rem;

  border-radius: 0.5rem;
  background-color: var(--bg-secondary);
}
</style>

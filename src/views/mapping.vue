<script setup lang="ts">
import LayoutContainer from '@/components/LayoutContainer.vue';
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
import { computed, ref } from 'vue';

const deviceManager = useDeviceManager();

const activeProfile = useActiveProfile();
const profile = computed(() => deviceManager.layout && useProfile(activeProfile.value, deviceManager.layout));

function onClick(i: number | null) {
  if (!profile.value) return;

  if (i === profile.value.selected) {
    profile.value.selected = null;
  } else {
    profile.value.selected = i;
  }
}

function clearSelected() {
  if (profile.value) profile.value.selected = null;
}

function setBinding(binding: Binding) {
  profile.value?.setBinding(binding);

  // todo: should the button be unselected
  clearSelected();
}

function setSocdBinding(i: number, side: 'a' | 'b') {
  profile.value?.setSocdBinding(i, side);

  // todo: should the button be unselected
  clearSelected();
}

type Tab = 'bindings' | 'socd';

const tab = ref<Tab>('bindings');
</script>

<template>
  <section class="mapping">
    <template v-if="profile">
      <LayoutContainer
        :show-socd="tab === 'socd'"
        :buttons="profile.buttons"
        :selected="profile.selected"
        @update:selected="onClick"
        :viewport-size="profile.viewportSize"
      />
    </template>

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
  @apply grid gap-4 p-4 w-full h-screen overflow-hidden;

  grid-template-columns: 4rem 1fr 320px;
  grid-template-rows: 8rem minmax(0, 1fr) 88px;

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

    @apply flex items-center justify-between;
  }
}

.mapping .inspector {
  @apply flex flex-col flex-nowrap;

  > .panel {
    @apply flex flex-col flex-nowrap;

    &[data-state='inactive'] {
      display: none;
    }

    > div {
      @apply relative flex flex-col p-4 bg-secondary text-secondary rounded-lg;

      overflow-x: hidden;
      overflow-y: auto;
      min-height: 0;
    }
  }
}
</style>

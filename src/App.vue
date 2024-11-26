<script setup lang="ts">
import CommandPalette from '@/components/CommandPalette.vue';
import Devbar from '@/components/Devbar.vue';
import { GithubIcon, HeartIcon } from '@/components/icons';
import { Toaster } from '@/components/ui/toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ref, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { DONATE, GITHUB } from './lib/links';
import { useDeviceManager } from './stores/deviceManager';
import { useDevBar } from './composables/devBar';

const route = useRoute();

type HeaderPosition = 'up' | 'down' | 'corner';
const headerPosition = ref<HeaderPosition>('down');

function onRouteSwitch() {
  switch (route.path) {
    case '/':
      headerPosition.value = 'down';
      break;
    case '/layout':
      headerPosition.value = 'up';
      break;
    default:
      headerPosition.value = 'corner';
      break;
  }
}

const deviceManager = useDeviceManager();
const router = useRouter();
const devBar = useDevBar();

function noLayoutFound() {
  router.push('/layout');
}

function disconnected() {
  // disable automatically redirecting if devbar is open
  if (!devBar.value) {
    router.push('/');
  }
}

deviceManager.onNoLayoutFound(noLayoutFound);
deviceManager.onDisconnected(disconnected);

watch(route, onRouteSwitch, { immediate: true });
</script>

<template>
  <Toaster />
  <TooltipProvider :delay-duration="300">
    <Devbar />

    <div class="header flex flex-col mb-20" :class="[headerPosition, headerPosition !== 'corner' && 'items-center']">
      <h1 class="font-light tracking-giga leading-tight">RE:MAPPING</h1>

      <div v-if="headerPosition === 'corner'" class="pl-2 text-base">
        <h3>Designed by:</h3>
        <h3>GRAMCTRL & AEROKEY LABS</h3>
      </div>

      <h3 v-else class="text-2xl">Designed by: GRAMCTRL & AEROKEY LABS</h3>
    </div>

    <RouterView />

    <div class="corner-thing" :class="headerPosition">
      <div class="spacer"></div>
      <!-- <Tooltip>
        <TooltipTrigger as-child>
          <a class="btn icon w-16 h-16" :href="DONATE">
            <HeartIcon class="w-10 h-10" />
          </a>
        </TooltipTrigger>
        <TooltipContent side="right" :collision-padding="8">
          <p>Donate <3</p>
        </TooltipContent>
      </Tooltip> -->
      <Tooltip>
        <TooltipTrigger as-child>
          <a class="btn icon w-16 h-16" :href="GITHUB">
            <GithubIcon class="w-10 h-10" />
          </a>
        </TooltipTrigger>
        <TooltipContent side="right" :collision-padding="8">
          <p>GitHub</p>
        </TooltipContent>
      </Tooltip>
    </div>

    <CommandPalette />
  </TooltipProvider>
</template>

<style>
.header {
  @apply absolute -translate-x-1/2 left-1/2;

  transition-property: top, left, transform, font-size;
  transition-duration: 300ms;
  transition-timing-function: ease-in-out;

  top: 20%;

  h1 {
    font-size: 128px;
    transition: font-size 300ms;
  }

  &.up {
    top: 10%;
  }

  &.corner {
    @apply top-0 left-0 transform-none pt-4 pl-4;

    h1 {
      font-size: 64px;
    }
  }
}

.corner-thing {
  @apply absolute bottom-0 top-0 left-0 flex flex-col gap-4 pl-4 pb-4;

  > .spacer {
    height: 100%;
    transition: height 300ms ease-in-out;
  }

  &.corner {
    @apply pt-4;

    > .spacer {
      height: 128px;
    }
  }
}
</style>

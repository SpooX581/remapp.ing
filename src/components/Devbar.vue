<script setup lang="ts">
import { useDevBar } from '@/composables/devBar';
import { useDeviceManager } from '@/stores/deviceManager';
import { useRouter } from 'vue-router';

const router = useRouter();
const devmgr = useDeviceManager();
const devBar = useDevBar();
</script>

<template>
  <div v-if="devBar" class="devbar">
    <template v-for="route in router.options.routes">
      <RouterLink v-if="!route.children" :to="route.path">
        {{ route.name ?? route.path }}
      </RouterLink>
      <div v-else class="flex gap-1">
        <RouterLink :to="route.path" class="mr-2">
          {{ route.name ?? route.path }}
        </RouterLink>
        <span>[</span>
        <div class="flex gap-4">
          <RouterLink v-for="child in route.children" :to="`${route.path}/${child.path}`">
            {{ child.name ?? child.path }}
          </RouterLink>
        </div>
        <span>]</span>
      </div>
    </template>

    <a @click="devmgr.connectEmulated">connect emulated</a>
  </div>
</template>

<style>
.devbar {
  z-index: 50;
  @apply absolute transition-[top] flex gap-6 py-4 px-6 select-none justify-center backdrop-blur-md bg-floating-transparent rounded-xl;

  top: -3rem;

  &:hover {
    top: 1rem;

    &::before {
      content: '';
      position: absolute;
      top: -2rem;
      left: 0;
      right: 0;
      height: 2rem;
    }
  }

  a {
    @apply hover:underline cursor-pointer;
  }

  a,
  span {
    @apply text-base;
  }
}
</style>

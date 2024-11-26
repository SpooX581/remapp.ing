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
    <RouterLink v-for="route in router.options.routes" :to="route.path" class="text-base hover:underline">
      {{ route.name ?? route.path }}
    </RouterLink>

    <a @click="devmgr.connectEmulated" class="text-base hover:underline cursor-pointer"> connect emulated </a>
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
}
</style>

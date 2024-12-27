<script setup lang="ts">
import { CheckIcon, CoggerIcon, USBIcon } from '@/components/icons';
import { useDeviceManager } from '@/stores/deviceManager';
import { useRouter } from 'vue-router';

const deviceManager = useDeviceManager();

const router = useRouter();

async function onClick() {
  await deviceManager.connect();
}

deviceManager.onConnected(() => {
  router.push('/layout');
});
</script>

<template>
  <div class="flex flex-col items-center h-[256px] pt-12">
    <span class="text-2xl text-primary mb-8">Hold <b>START</b> while plugging in.</span>

    <button @click="onClick" class="btn gap-4">
      <span>CONNECT</span>
      <CheckIcon v-if="deviceManager.state == 'connected'" class="w-8 h-8" />
      <CoggerIcon v-else-if="deviceManager.state == 'connecting'" class="w-8 h-8 animate-spin" />
      <USBIcon v-else-if="deviceManager.state == 'disconnected'" class="w-8 h-8" />
    </button>
  </div>
</template>

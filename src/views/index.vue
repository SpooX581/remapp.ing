<script setup lang="ts">
import { CheckIcon, CoggerIcon, USBIcon } from '@/components/icons';
import { useToast } from '@/components/ui/toast';
import { useDeviceManager } from '@/stores/deviceManager';
import { h, onMounted } from 'vue';

const deviceManager = useDeviceManager();

async function onClick() {
  await deviceManager.connect();
}

onMounted(() => {
  if (!('serial' in navigator)) {
    const { toast } = useToast();

    const vnode = h('span', { class: 'text-sm' }, [
      'Please use a ',
      h(
        'a',
        { href: 'https://caniuse.com/web-serial', target: '_blank', class: 'text-primary underline' },
        'browser that supports the Web Serial API.',
      ),
    ]);

    toast({
      variant: 'destructive',
      title: 'Web Serial API is not supported',
      description: vnode,
    });
  }
});
</script>

<template>
  <div class="flex h-[256px] flex-col items-center pt-12">
    <span class="mb-8 text-2xl text-primary">Hold <b>START</b> while plugging in.</span>

    <button @click="onClick" class="btn gap-4">
      <span>CONNECT</span>
      <CheckIcon v-if="deviceManager.state == 'connected'" class="h-8 w-8" />
      <CoggerIcon v-else-if="deviceManager.state == 'connecting'" class="h-8 w-8 animate-spin" />
      <USBIcon v-else-if="deviceManager.state == 'disconnected'" class="h-8 w-8" />
    </button>
  </div>
</template>

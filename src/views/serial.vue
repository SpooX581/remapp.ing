<script setup lang="ts">
import { CheckIcon, CoggerIcon, USBIcon } from '@/components/icons';
import { useDeviceManager } from '@/stores/deviceManager';
import { nextTick, reactive, ref } from 'vue';

const BUFFER_SIZE = 256;

const deviceManager = useDeviceManager();

const scroller = ref<HTMLElement | null>(null);

const data = reactive<string[]>([]);
const input = ref('');

function appendData(value: string) {
  if (data.length > BUFFER_SIZE) {
    data.shift();
  }

  data.push(value);

  nextTick(() => {
    scroller.value?.scrollTo(0, scroller.value.scrollHeight);
  });
}

const help = [
  '! available commands:',
  '! - get_device_info',
  '! - get_config',
  '! - reboot_bootloader',
  '! - reboot_firmware',
  '! - help',
  '! - clear',
];

async function sendData() {
  const originalValue = input.value.trim().toLowerCase();
  const value = originalValue.replace(/[\s_-]+/g, '');
  if (!value || !deviceManager.serial) return;

  input.value = '';
  appendData(`> ${originalValue}`);

  switch (value) {
    case 'getdeviceinfo': {
      const deviceInfo = await deviceManager.serial.getDeviceInfo();

      if (deviceInfo) {
        appendData(`${JSON.stringify(deviceInfo, null, 2)}`);
      } else {
        appendData('! failed to get device info');
      }

      break;
    }
    case 'getconfig': {
      const config = await deviceManager.serial.getConfig();

      if (config) {
        appendData(`${JSON.stringify(config, null, 2)}`);
      } else {
        appendData('! failed to get config');
      }

      break;
    }
    case 'rebootbootloader': {
      const success = await deviceManager.serial.rebootBootloader();

      if (success) {
        appendData('rebooting bootloader');
      } else {
        appendData('! failed to reboot bootloader');
      }

      break;
    }
    case 'rebootfirmware': {
      const success = await deviceManager.serial.rebootFirmware();

      if (success) {
        appendData('rebooting firmware');
      } else {
        appendData('! failed to reboot firmware');
      }

      break;
    }
    case 'help': {
      appendData(help.join('\n'));

      break;
    }
    case 'clear': {
      data.splice(0, data.length);

      break;
    }
    default: {
      appendData([`! unknown command: ${originalValue}`, ...help].join('\n'));

      break;
    }
  }
}

async function onClick() {
  await deviceManager.connect();
}

function copyLine(line: string) {
  navigator.clipboard.writeText(line);
}
</script>

<template>
  <div class="flex h-full w-full flex-col overflow-hidden p-8">
    <div v-if="deviceManager.serial" class="ml-24 mt-32 flex h-full flex-col gap-4 overflow-hidden">
      <div
        ref="scroller"
        class="serial-scroller flex flex-col rounded-md border border-secondary bg-secondary p-2 text-secondary"
      >
        <div v-for="line in data">
          <pre>{{ line }}</pre>
          <button @click="copyLine(line)">COPY</button>
        </div>
      </div>

      <input
        class="w-full rounded-md border border-secondary bg-secondary p-2 text-secondary outline-none"
        type="text"
        placeholder="Enter command"
        v-model="input"
        @keyup.enter="sendData"
      />
    </div>

    <div v-else class="ml-24 mt-32 flex flex-col items-center">
      <h1 class="text-3xl">serial port not connected</h1>
      <span class="mb-8 text-2xl text-black">Hold <b>START</b> while plugging in.</span>

      <button @click="onClick" class="btn gap-4">
        <span>CONNECT</span>
        <CheckIcon v-if="deviceManager.state == 'connected'" class="h-8 w-8" />
        <CoggerIcon v-else-if="deviceManager.state == 'connecting'" class="h-8 w-8 animate-spin" />
        <USBIcon v-else-if="deviceManager.state == 'disconnected'" class="h-8 w-8" />
      </button>
    </div>
  </div>
</template>

<style>
.serial-scroller {
  display: flex;
  flex-flow: column nowrap;
  overflow-y: auto;
  height: 100%;
  width: 100%;

  & > :first-child {
    margin-top: auto !important;
  }

  > * {
    @apply relative w-full shrink-0 rounded-md px-2 transition-colors;

    > button {
      @apply absolute bottom-0 right-0 hidden items-center justify-center rounded-md bg-floating px-2 py-1 text-xs text-floating;
    }

    &:hover > button {
      @apply flex;

      &:hover {
        @apply rounded-bl-none rounded-tr-none bg-floating-hover;
      }

      &:active {
        @apply bg-floating-active;
      }
    }

    &:has(button:hover) {
      @apply bg-white/10;
    }
  }
}
</style>

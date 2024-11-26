<script setup lang="ts">
import { CheckIcon, CoggerIcon, USBIcon } from '@/components/icons';
import { useDeviceManager } from '@/stores/deviceManager';
import { Copy } from 'lucide-vue-next';
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
  <div class="w-full h-full flex flex-col p-8 overflow-hidden">
    <div v-if="deviceManager.serial" class="mt-32 ml-24 h-full flex flex-col gap-4 overflow-hidden">
      <div
        ref="scroller"
        class="serial-scroller flex flex-col bg-secondary border border-secondary text-secondary p-2 rounded-md"
      >
        <div v-for="line in data">
          <pre>{{ line }}</pre>
          <button @click="copyLine(line)">COPY</button>
        </div>
      </div>

      <input
        class="border border-secondary bg-secondary text-secondary p-2 outline-none rounded-md w-full"
        type="text"
        placeholder="Enter command"
        v-model="input"
        @keyup.enter="sendData"
      />
    </div>

    <div v-else class="mt-32 ml-24 flex flex-col items-center">
      <h1 class="text-3xl">serial port not connected</h1>
      <span class="text-2xl text-black mb-8">Hold <b>START</b> while plugging in.</span>

      <button @click="onClick" class="btn gap-4">
        <span>CONNECT</span>
        <CheckIcon v-if="deviceManager.state == 'connected'" class="w-8 h-8" />
        <CoggerIcon v-else-if="deviceManager.state == 'connecting'" class="w-8 h-8 animate-spin" />
        <USBIcon v-else-if="deviceManager.state == 'disconnected'" class="w-8 h-8" />
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
    @apply relative w-full shrink-0 transition-colors rounded-md px-2;

    > button {
      @apply hidden absolute right-0 bottom-0 bg-floating text-floating rounded-md text-xs py-1 px-2 items-center justify-center;
    }

    &:hover > button {
      @apply flex;

      &:hover {
        @apply bg-floating-hover rounded-bl-none rounded-tr-none;
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

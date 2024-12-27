<script setup lang="ts">
import Theme from '@/components/commands/Theme.vue';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { useToast } from '@/components/ui/toast';
import { useDevBar } from '@/composables/devBar';
import { useTheme } from '@/composables/theme';
import { GITHUB } from '@/lib/links';
import { useDeviceManager } from '@/stores/deviceManager';
import { useActiveElement, useMagicKeys } from '@vueuse/core';
import fuzzysort from 'fuzzysort';
import { PopoverAnchor } from 'radix-vue';
import { type Component, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const activeElement = useActiveElement();

function shouldNotOpen() {
  return open.value || activeElement.value?.tagName === 'INPUT' || activeElement.value?.tagName === 'TEXTAREA';
}

const keys = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.type !== 'keydown' || shouldNotOpen()) return;

    if ((e.ctrlKey && e.key === 'k') || (e.ctrlKey && e.shiftKey && e.key === 'p') || e.key === '/') {
      e.preventDefault();
    }
  },
});

const ctrlK = keys['ctrl+k'];
const ctrlShiftP = keys['ctrl+shift+p'];
const slash = keys['/'];
const f1 = keys.f1;

watch([ctrlK, ctrlShiftP, slash, f1], ([a, b, c, d]) => {
  if (!shouldNotOpen() && (a || b || c || d)) toggle();
});

const open = ref(false);

function toggle() {
  open.value = !open.value;
  if (open.value) {
    mode.value = 'main';
  } else {
    results.value = null;
  }
}

function close() {
  open.value = false;
  results.value = null;
}

const theme = useTheme();

const devBar = useDevBar();
function toggleDevBar() {
  devBar.value = !devBar.value;
}

const deviceManager = useDeviceManager();

const route = useRoute();
const router = useRouter();

const { toast } = useToast();

function testToaster() {
  toast({
    variant: 'default',
    title: 'default',
    description: 'description',
  });

  toast({
    variant: 'destructive',
    title: 'destructive',
    description: 'description',
  });
}

function clearLayout() {
  deviceManager.layout = null;
}

type SubCommand = ['sub', string, Component];
type FunctionCommand = ['fn', string, () => void];

type Commands = {
  [key: string]: {
    condition?: () => boolean;
    label: string;
    commands: {
      [key: string]: SubCommand | FunctionCommand;
    };
  };
};

function goToLink(url: string) {
  window.location.href = url;
}

const commands = {
  mapping: {
    condition: () => route.path === '/mapping',
    label: 'Mapping',
    commands: {
      saveProfile: ['fn', 'Save Profile', () => {}],
      saveAll: ['fn', 'Save All Profiles', () => {}],
      nukeProfile: ['fn', 'Nuke Current Profile', () => {}],
      nukeAll: ['fn', 'Nuke All Profiles', () => {}],
    },
  },
  aesthetic: {
    condition: undefined,
    label: 'Aesthetic',
    commands: {
      theme: ['sub', 'Set theme', Theme],
      toggleTheme: ['fn', 'Toggle Light/Dark', theme.toggle],
    },
  },
  device: {
    condition: undefined,
    label: 'Device',
    commands: {
      connect: ['fn', 'Connect Device', deviceManager.connect],
      connectEmulated: ['fn', 'Connect Emulated', deviceManager.connectEmulated],
      disconnect: ['fn', 'Disconnect Device', deviceManager.disconnect],
    },
  },
  misc: {
    condition: undefined,
    label: 'Misc',
    commands: {
      serial: ['fn', 'Serial Console', () => router.push('/serial')],
      editor: ['fn', 'Visual Editor', () => router.push('/editor')],
      github: ['fn', 'GitHub', () => goToLink(GITHUB)],
      // donate: ['fn', 'Donate <3', () => goToLink(DONATE)],
    },
  },
  dev: {
    condition: undefined,
    label: 'Dev',
    commands: {
      toggleDevbar: ['fn', 'Toggle Dev Bar', toggleDevBar],
      testToaster: ['fn', 'Test Toaster', testToaster],
      clearSelectedLayout: ['fn', 'Clear Selected Layout', clearLayout],
    },
  },
} as const satisfies Commands;

type AllCommands = typeof commands;

type CategoryCommands<T extends keyof AllCommands> = AllCommands[T]['commands'];

type SubCommandKey = {
  [K in keyof AllCommands]: {
    [C in keyof CategoryCommands<K>]: CategoryCommands<K>[C] extends SubCommand ? C : never;
  }[keyof CategoryCommands<K>];
}[keyof AllCommands];

type Mode = 'main' | SubCommandKey;

const mode = ref<Mode>('main');

function selected(newMode: Mode) {
  mode.value = newMode;
}

// map of all all commands with type 'sub' > component
const subCommandsMap = new Map<SubCommandKey, Component>(
  Object.entries(commands)
    .flatMap(([_, category]) => {
      return Object.entries(category.commands).map(([id, command]) => {
        if (command[0] === 'sub') {
          return [id, command[2]];
        }

        return null;
      });
    })
    .filter((x): x is [SubCommandKey, Component] => x !== null),
);

type IdLabel = { id: string; label: string };

// array of { id, label } for all commands
const commandLabels: IdLabel[] = Object.entries(commands).flatMap(([_, category]) => {
  return Object.entries(category.commands).map(([id, [_, label]]) => {
    return { id, label };
  });
});

const commandLabelsMap = new Map(commandLabels.map(({ id, label }) => [id, label]));

type Results = Fuzzysort.KeyResults<IdLabel>;

const results = ref<Results | null>(null);

function filterFunction(keys: string[], query: string) {
  if (!query) return keys;

  results.value = fuzzysort.go(query, commandLabels, { key: 'label' });

  return results.value?.map(({ obj }) => obj.id);
}

function displayLabel(results: Results | null, id: string) {
  if (results) {
    const result = results.find(({ obj }) => obj.id === id);
    if (result) return result.highlight('<strong>', '</strong>');
  }

  return commandLabelsMap.get(id) ?? '';
}

type FunctionCommandObj = {
  id: string;
  type: 'fn';
  label: string;
  action: () => void;
};

type SubCommandObj = {
  id: SubCommandKey;
  type: 'sub';
  label: string;
  component: Component;
};

function getCommands(category: AllCommands[keyof AllCommands]): (FunctionCommandObj | SubCommandObj)[] {
  return Object.entries(category.commands).map(([id, command]) => {
    if (command[0] === 'fn') {
      return {
        id,
        type: 'fn',
        label: command[1],
        action: command[2],
      } as FunctionCommandObj;
    }

    return {
      id,
      type: 'sub',
      label: command[1],
      component: command[2],
    } as SubCommandObj;
  });
}
</script>

<template>
  <Popover :open @update:open="toggle">
    <PopoverAnchor class="absolute top-0" />
    <PopoverContent class="p-0 w-[600px]" :side-offset="16">
      <Command v-if="mode === 'main'" :filter-function="(filterFunction as never)">
        <CommandInput placeholder="Enter command" />
        <CommandList position="inline">
          <CommandEmpty>No command found</CommandEmpty>
          <template v-for="[key, category] in Object.entries(commands)">
            <CommandGroup
              v-if="category.condition ? category.condition() : true"
              :key
              :heading="key != 'base' ? category.label : ''"
            >
              <template v-for="command in getCommands(category)" :key>
                <CommandItem v-if="command.type === 'fn'" :value="command.id" @select="command.action">
                  <span class="text-sm" v-html="displayLabel(results, command.id)" />
                </CommandItem>
                <CommandItem v-else :value="command.id" @select="selected(command.id)">
                  <span class="text-sm" v-html="displayLabel(results, command.id)" />
                </CommandItem>
              </template>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
      <component v-else :is="subCommandsMap.get(mode)" @close="close" />
    </PopoverContent>
  </Popover>
</template>

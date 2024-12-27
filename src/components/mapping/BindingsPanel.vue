<script setup lang="ts">
import { type Binding, BINDING as B } from '@/lib/bindings';
import ButtonContent from '@/components/ButtonContent.vue';
import useActiveProfile from '@/composables/activeProfile';
import { computed } from 'vue';
import { useDeviceManager } from '@/stores/deviceManager';

defineEmits<(e: 'select', binding: Binding) => void>();

const CATEGORY = {
  FACE_BUTTONS: 'face buttons',
  MOVEMENT: 'movement',
  TRIGGERS: 'triggers',
  C_STICK: 'c-stick',
  MENU_BUTTONS: 'menu buttons',
  DPAD: 'dpad',
  MODIFIERS: 'modifiers',
  MISC: 'misc',
  KEYBOARD: 'keyboard',
} as const;

type Category = (typeof CATEGORY)[keyof typeof CATEGORY];

// category for each button
const BUTTON_CATEGORIES = {
  [B.A]: CATEGORY.FACE_BUTTONS,
  [B.B]: CATEGORY.FACE_BUTTONS,
  [B.X]: CATEGORY.FACE_BUTTONS,
  [B.Y]: CATEGORY.FACE_BUTTONS,
  [B.Z]: CATEGORY.FACE_BUTTONS,

  [B.LEFT_STICK_UP]: CATEGORY.MOVEMENT,
  [B.LEFT_STICK_DOWN]: CATEGORY.MOVEMENT,
  [B.LEFT_STICK_LEFT]: CATEGORY.MOVEMENT,
  [B.LEFT_STICK_RIGHT]: CATEGORY.MOVEMENT,

  [B.RIGHT_STICK_UP]: CATEGORY.C_STICK,
  [B.RIGHT_STICK_DOWN]: CATEGORY.C_STICK,
  [B.RIGHT_STICK_LEFT]: CATEGORY.C_STICK,
  [B.RIGHT_STICK_RIGHT]: CATEGORY.C_STICK,

  [B.DPAD_MOD]: CATEGORY.DPAD,
  [B.DPAD_UP]: CATEGORY.DPAD,
  [B.DPAD_DOWN]: CATEGORY.DPAD,
  [B.DPAD_LEFT]: CATEGORY.DPAD,
  [B.DPAD_RIGHT]: CATEGORY.DPAD,

  [B.LEFT_TRIGGER]: CATEGORY.TRIGGERS,
  [B.RIGHT_TRIGGER]: CATEGORY.TRIGGERS,
  [B.LEFT_SHOULDER]: CATEGORY.TRIGGERS,
  [B.RIGHT_SHOULDER]: CATEGORY.TRIGGERS,

  [B.MX]: CATEGORY.MODIFIERS,
  [B.MY]: CATEGORY.MODIFIERS,

  [B.START]: CATEGORY.MENU_BUTTONS,
  [B.SELECT]: CATEGORY.MENU_BUTTONS,
  [B.HOME]: CATEGORY.MENU_BUTTONS,
  [B.CAPTURE]: CATEGORY.MENU_BUTTONS,

  [B.LEFT_STICK_CLICK]: CATEGORY.MISC,
  [B.RIGHT_STICK_CLICK]: CATEGORY.MISC,
  [B.LIGHT_SHIELD]: CATEGORY.MISC,
  [B.MEDIUM_SHIELD]: CATEGORY.MISC,

  [B.KB_A]: CATEGORY.KEYBOARD,
  [B.KB_B]: CATEGORY.KEYBOARD,
  [B.KB_C]: CATEGORY.KEYBOARD,
  [B.KB_D]: CATEGORY.KEYBOARD,
  [B.KB_E]: CATEGORY.KEYBOARD,
  [B.KB_F]: CATEGORY.KEYBOARD,
  [B.KB_G]: CATEGORY.KEYBOARD,
  [B.KB_H]: CATEGORY.KEYBOARD,
  [B.KB_I]: CATEGORY.KEYBOARD,
  [B.KB_J]: CATEGORY.KEYBOARD,
  [B.KB_K]: CATEGORY.KEYBOARD,
  [B.KB_L]: CATEGORY.KEYBOARD,
  [B.KB_M]: CATEGORY.KEYBOARD,
  [B.KB_N]: CATEGORY.KEYBOARD,
  [B.KB_O]: CATEGORY.KEYBOARD,
  [B.KB_P]: CATEGORY.KEYBOARD,
  [B.KB_Q]: CATEGORY.KEYBOARD,
  [B.KB_R]: CATEGORY.KEYBOARD,
  [B.KB_S]: CATEGORY.KEYBOARD,
  [B.KB_T]: CATEGORY.KEYBOARD,
  [B.KB_U]: CATEGORY.KEYBOARD,
  [B.KB_V]: CATEGORY.KEYBOARD,
  [B.KB_W]: CATEGORY.KEYBOARD,
  [B.KB_X]: CATEGORY.KEYBOARD,
  [B.KB_Y]: CATEGORY.KEYBOARD,
  [B.KB_Z]: CATEGORY.KEYBOARD,
} as const satisfies { [key in Exclude<Binding, 'unspecified'>]: Category };

// order of categories in ui
const categoryOrder = [
  CATEGORY.FACE_BUTTONS,
  CATEGORY.MOVEMENT,
  CATEGORY.C_STICK,
  CATEGORY.DPAD,
  CATEGORY.TRIGGERS,
  CATEGORY.MODIFIERS,
  CATEGORY.MENU_BUTTONS,
  CATEGORY.MISC,
  CATEGORY.KEYBOARD,
] as const;

const activeProfile = useActiveProfile();
const deviceManager = useDeviceManager();

const categories = computed(() => {
  const categories: { name: Category; bindings: Binding[] }[] = categoryOrder.map((name) => ({ name, bindings: [] }));

  for (const [_, binding] of deviceManager.layout?.modes[activeProfile.value]?.bindings ?? []) {
    if (binding === B.UNSPECIFIED) continue;
    const category = BUTTON_CATEGORIES[binding];

    const categoryObj = categories.find((o) => o.name === category);

    if (!categoryObj) continue;

    categoryObj.bindings.push(binding);
  }

  return categories.filter((category) => category.bindings.length > 0);
});
</script>

<template>
  <div class="binding-panel">
    <div v-for="category in categories" :key="category.name">
      <span class="category text-lg uppercase">{{ category.name }}</span>

      <div class="buttons-list flex gap-4 flex-wrap">
        <div
          ref="buttons"
          class="btn h-16 w-16 cursor-pointer"
          v-for="binding in category.bindings"
          :key="binding"
          @click="$emit('select', binding)"
        >
          <ButtonContent :binding />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.binding-panel {
  @apply gap-7;

  > div {
    @apply flex flex-col gap-4;
  }

  .category {
    @apply sticky top-0 select-none;

    &::before {
      content: '';

      position: absolute;

      top: -1rem;
      right: -1rem;
      left: -1rem;

      height: 3rem;

      z-index: -1;

      backdrop-filter: blur(8px);
    }
  }
}

.buttons-list > div {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;

  span {
    font-size: 1.25rem;
    font-weight: 600;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
}
</style>

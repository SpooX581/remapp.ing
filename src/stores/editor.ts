import type { Binding } from '@/lib/bindings';
import type { PhysicalButton } from '@/lib/buttons';
import type { GameMode } from '@/lib/modes';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export type ButtonPosition = {
  id: PhysicalButton;
  x: number;
  y: number;
};

export const useEditor = defineStore('editor', () => {
  const modes = ref<Set<GameMode>>(new Set());

  const buttons = ref<Map<PhysicalButton, ButtonPosition>>(new Map());
  const assignments = ref<Map<PhysicalButton, Map<GameMode, Binding>>>(new Map());

  function addButton(button: PhysicalButton, x: number, y: number) {
    buttons.value.set(button, { id: button, x, y });
  }

  function assignBinding(button: PhysicalButton, mode: GameMode, binding: Binding): boolean {
    if (!modes.value.has(mode)) return false;

    const a = assignments.value.get(button) ?? new Map();
    a.set(mode, binding);

    assignments.value.set(button, a);

    return true;
  }

  return {
    modes,

    buttons,
    assignments,

    addButton,
    assignBinding,
  };
});

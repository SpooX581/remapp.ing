import { useLocalStorage } from '@vueuse/core';

const active = useLocalStorage<boolean>('devBar', false);

export function useDevBar() {
  return active;
}

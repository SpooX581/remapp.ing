import type { Serializer } from '@vueuse/core';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type Ref, onBeforeUpdate, type ComponentPublicInstance, ref } from 'vue';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mouseEventToRange(e: MouseEvent, el: HTMLElement, min: number, max: number): number {
  const rect = el.getBoundingClientRect();
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  return min + (x / rect.width) * (max - min);
}

export function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

const REGEX_PATTERN = /^\/(.+)\/(.*)$/;

export function parseRegex(str: string): RegExp | null {
  const match = str.match(REGEX_PATTERN);
  if (!match) return null;

  return new RegExp(match[1], match[2]);
}

export const DEFAULT_VIEWPORT_WIDTH = 1000;
export const DEFAULT_VIEWPORT_HEIGHT = 600;

export const BUTTON_WIDTH = 88;
export const BUTTON_HEIGHT = 88;

export const SCALE_FACTOR = 10;

export const VIEWPORT_SAFE_MIN_X = 0;
export const VIEWPORT_SAFE_MIN_Y = 0;

export function viewport_safe_max([width, height]: [number, number]): [number, number] {
  return [width - BUTTON_WIDTH, height - BUTTON_HEIGHT];
}

function replacer(_: string, value: Map<unknown, unknown> | Set<unknown> | unknown) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  }

  if (value instanceof Set) {
    return {
      dataType: 'Set',
      value: Array.from(value.values()),
    };
  }

  return value;
}

type MapValue = {
  dataType: 'Map';
  value: Iterable<[unknown, unknown]>;
};

type SetValue = {
  dataType: 'Set';
  value: Iterable<unknown>;
};

type ReviverValue = MapValue | SetValue;

function reviver(_: string, value: ReviverValue) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }

    if (value.dataType === 'Set') {
      return new Set(value.value);
    }
  }

  return value;
}

// biome-ignore lint/suspicious/noExplicitAny: just let me any
export const MAP_SERIALIZER: Serializer<any> = {
  read: (str) => JSON.parse(str, reviver),
  write: (value) => JSON.stringify(value, replacer),
};

export function useTemplateRefs<T extends Element | HTMLElement | ComponentPublicInstance>() {
  const elements: Ref<T[]> = ref([]);

  onBeforeUpdate(() => {
    elements.value = [];
  });

  function setElement(el: T | null, index: number): void {
    if (el == null) {
      elements.value.splice(index, 1);
      return;
    }

    if (el instanceof Element) {
      if (el instanceof HTMLElement) {
        elements.value[index] = el;
        return;
      }
    } else if (el.$el instanceof HTMLElement) {
      elements.value[index] = el.$el as T;
      return;
    } else {
      // assume ComponentPublicInstance
      elements.value[index] = el as T;
    }
  }

  return { elements, setElement };
}

export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.onabort = () => reject(new Error('aborted'));
    reader.readAsText(file);
  });
}

import { onMounted, onUnmounted, ref, triggerRef, watch, type Ref } from 'vue';

type IElement = { i: number; el: Element; rect: DOMRect };

export type UseElements = {
  elements: Ref<IElement[]>;
  recalculate(i?: number): void;
};

function calculateBboxes(elements: Ref<IElement[]>, children: Ref<ChildElement[]>) {
  if (elements.value.length === 0) return;

  // Sort by the original index order from children
  const indexMap = new Map(children.value.map((child, idx) => [child.i, idx]));
  elements.value.sort((a, b) => {
    const aIdx = indexMap.get(a.i) ?? 0;
    const bIdx = indexMap.get(b.i) ?? 0;
    return aIdx - bIdx;
  });

  for (const element of elements.value) {
    if (element != null) element.rect = element.el.getBoundingClientRect();
  }
}

type ChildElement = {
  el: Element;
  i: number;
};

export function useElements(container: Ref<Element | null>, children: Ref<ChildElement[]>): UseElements {
  const elements = ref<IElement[]>([]);

  const resizeObserver = new ResizeObserver(() => {
    calculateBboxes(elements, children);
    triggerRef(elements);
  });

  onMounted(() => {
    calculateBboxes(elements, children);
    triggerRef(elements);

    if (container.value) {
      resizeObserver.observe(container.value);
    }
  });

  watch(children, () => {
    // if any child is different, recalculate all
    if (
      children.value.length !== elements.value.length ||
      children.value.some(({ el, i }) => {
        const element = elements.value[i];
        return !element || element.el !== el || element.i !== i;
      })
    ) {
      elements.value = children.value.map(({ el, i }) => ({ i, el, rect: el.getBoundingClientRect() }));
      calculateBboxes(elements, children);
      triggerRef(elements);
    }
  });

  onUnmounted(() => {
    resizeObserver.disconnect();
  });

  function recalculate(i?: number) {
    if (i !== undefined) {
      const element = elements.value.find((el) => el.i === i);
      if (element) {
        element.rect = element.el.getBoundingClientRect();
      }
    } else {
      calculateBboxes(elements, children);
    }

    triggerRef(elements);
  }

  return { elements, recalculate };
}

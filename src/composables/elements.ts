import { onMounted, onUnmounted, ref, triggerRef, watch, type Ref } from 'vue';

type IElement = { i: number; el: Element; rect: DOMRect };

export type UseElements = {
  elements: Ref<IElement[]>;
  recalculate(i?: number): void;
};

function calculateBboxes(elements: Ref<IElement[]>) {
  if (elements.value.length === 0) return;

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
    calculateBboxes(elements);
    triggerRef(elements);
  });

  onMounted(() => {
    calculateBboxes(elements);
    triggerRef(elements);

    if (container.value) {
      resizeObserver.observe(container.value);
    }
  });

  watch(children, () => {
    // if any child is different, recalculate all
    if (
      children.value.length !== elements.value.length ||
      // this might not do anything
      children.value.some(({ el, i }) => {
        const element = elements.value[i];
        return !element || element.el !== el || element.i !== i;
      })
    ) {
      elements.value = children.value.map(({ el, i }) => ({ i, el, rect: el.getBoundingClientRect() }));
      triggerRef(elements);
    }
  });

  onUnmounted(() => {
    resizeObserver.disconnect();
  });

  function recalculate(i: number) {
    if (i !== undefined) {
      elements.value[i].rect = elements.value[i].el.getBoundingClientRect();
    } else {
      calculateBboxes(elements);
    }

    triggerRef(elements);
  }

  return { elements, recalculate };
}

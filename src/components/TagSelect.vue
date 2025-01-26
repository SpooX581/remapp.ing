<script setup lang="ts" generic="TLabel extends string, TValue extends string">
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components/ui/tags-input';
import fuzzysort from 'fuzzysort';
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'radix-vue';
import { type Ref, computed, ref, watch } from 'vue';

const LABEL_KEY = 'label';
const VALUE_KEY = 'value';

type Option = { [LABEL_KEY]: TLabel; [VALUE_KEY]: TValue };

const props = defineProps<{
  options: Option[];
  direction?: 'top' | 'bottom';

  sortFn?: (a: TValue, b: TValue) => number;

  // uses modelValue instead of defineModel because the
  // update event does not work properly with defineModel
  modelValue: Set<TValue>;
}>();
const emit = defineEmits<{
  'update:modelValue': [Set<TValue>];
}>();

const open = ref(false);
const searchTerm = ref('');

const options = computed<Option[]>(() =>
  props.options
    .filter(({ value }) => !props.modelValue?.has(value))
    .map(({ label, value }) => ({ [LABEL_KEY]: label, [VALUE_KEY]: value })),
);

type Result = Fuzzysort.KeysResult<Option>;

// typescript doesnt like this type for some reason
const results: Ref<Result[]> = ref(options.value.map((option) => ({ obj: option }) as never));

function filterFunction(_: TValue[], query: string): TValue[] {
  const sortResults = fuzzysort.go(query, options.value, {
    keys: [LABEL_KEY, VALUE_KEY],
    all: true,
    scoreFn: (result) => {
      const labelScore = (result[0]?.score ?? -1000) * 1.1;
      const valueScore = result[1]?.score ?? -1000;

      return Math.max(labelScore, valueScore);
    },
  });

  results.value = Array.from(sortResults);

  return sortResults.map((result) => result.obj[VALUE_KEY]);
}

function refreshResults() {
  filterFunction([], '');
}

// update results when options change
watch(() => props.options, refreshResults, { deep: true });

function onSelect(value: TValue) {
  const set = new Set(props.modelValue ?? []);
  set.add(value);
  emit('update:modelValue', set);
  searchTerm.value = '';
}

function onRemove(value: TValue) {
  const set = new Set(props.modelValue ?? []);
  set.delete(value);
  emit('update:modelValue', set);
  refreshResults();
}

function highlight(result: Result[number], fallback: string): string {
  const highlighted = result?.highlight('<strong>', '</strong>');
  if (highlighted == null || highlighted === '') return fallback;
  return highlighted;
}

function resultLabelHtml(result: Result): string {
  return highlight(result[0], result.obj[LABEL_KEY]);
}

function resultValueHtml(result: Result): string {
  return highlight(result[1], result.obj[VALUE_KEY]);
}

const internalModelValue = computed(() => Array.from(props.modelValue ?? []));
const displayedModelValue = computed(() => {
  const arr = Array.from(props.modelValue ?? []);
  if (props.sortFn) arr.sort(props.sortFn);
  return arr;
});
</script>

<template>
  <TagsInput :model-value="internalModelValue" :data-empty="displayedModelValue.length === 0">
    <div class="flex flex-wrap items-center gap-2 px-3">
      <TagsInputItem v-for="value in displayedModelValue" :key="value" :value>
        <TagsInputItemText>
          <slot name="tag" :value />
        </TagsInputItemText>
        <TagsInputItemDelete @click="onRemove(value)" />
      </TagsInputItem>
    </div>

    <ComboboxRoot
      :model-value="modelValue"
      v-model:open="open"
      v-model:search-term="searchTerm"
      class="w-full"
      :filter-function="filterFunction as never"
    >
      <ComboboxAnchor as-child>
        <ComboboxInput placeholder="Search" as-child>
          <TagsInputInput
            class="w-full px-3"
            :class="(modelValue?.size ?? 0) > 0 ? 'mt-2' : ''"
            @keydown.enter.prevent
            @focus="open = true"
          />
        </ComboboxInput>
      </ComboboxAnchor>

      <ComboboxPortal>
        <ComboboxContent>
          <CommandList :side-offset="5" position="popper" class="tag-select-list">
            <CommandEmpty><slot name="empty" /></CommandEmpty>

            <CommandGroup>
              <template v-for="result in results">
                <CommandItem
                  v-if="options.find((option) => option.value === result.obj.value)"
                  :key="result.obj.value"
                  :value="result.obj.value"
                  @select.prevent="onSelect(result.obj.value)"
                >
                  <div class="tag-select-item-content">
                    <div><slot name="item" :value="result.obj.value" :html="resultLabelHtml(result)" /></div>
                    <span class="id" v-html="resultValueHtml(result)"></span>
                  </div>
                </CommandItem>
              </template>
            </CommandGroup>
          </CommandList>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </TagsInput>
</template>

<style>
.tag-select-list {
  @apply mt-2 w-[--radix-popper-anchor-width] rounded-md border border-floating bg-floating text-floating shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2;
}

.tag-select-item-content,
.tag-select-item-preview {
  @apply flex h-6 w-full items-center justify-between gap-2;

  span {
    @apply text-lg font-semibold;

    strong {
      @apply font-bold text-primary;
    }
  }

  .id {
    @apply text-sm text-secondary;
  }

  svg {
    @apply size-4;
  }
}

.tag-select-item > div {
  @apply flex items-center gap-2;
}
</style>

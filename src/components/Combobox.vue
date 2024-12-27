<script setup lang="ts" generic="TLabel extends string, TValue extends string">
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import fuzzysort from 'fuzzysort';
import { Check, ChevronsUpDown } from 'lucide-vue-next';
import { type Ref, computed, nextTick, ref, watch } from 'vue';

// i had an issue where search didnt work because the key was
// inconsistent so i decided that would never happen again
const LABEL_KEY = 'label';
const VALUE_KEY = 'value';

type Option = { [LABEL_KEY]: TLabel; [VALUE_KEY]: TValue };

const props = defineProps<{
  options: Option[];
  direction?: 'top' | 'bottom';
  closeOnSelect?: boolean;

  class?: string;
}>();

const open = ref(false);
const modelValue = defineModel<TValue>('modelValue');

const options = computed<Option[]>(() =>
  props.options.map(({ label, value }) => ({ [LABEL_KEY]: label, [VALUE_KEY]: value })),
);

type Result = Fuzzysort.KeysResult<Option>;

const results: Ref<Result[]> = ref(options.value.map((option) => ({ obj: option })) as never);

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

watch(modelValue, refreshResults);

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

const selected = defineModel<TValue>('selected');

const resultData = computed(() => {
  return results.value.map((result) => {
    const value = result.obj[VALUE_KEY];
    return {
      isSelected: value === modelValue.value,
      value,
      labelHtml: resultLabelHtml(result),
      valueHtml: resultValueHtml(result),
    };
  });
});

const searchTerm = ref('');

// biome-ignore lint/suspicious/noAssignInExpressions: i dont care
watch(open, () => nextTick(() => nextTick(() => nextTick(() => (searchTerm.value = '')))));
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="default"
        size="sm"
        role="combobox"
        :aria-expanded="open"
        :class="
          cn(props.class, 'max-w-full justify-between bg-floating hover:bg-floating-hover', {
            'bg-floating-hover': open,
          })
        "
      >
        <div class="combobox-item-preview">
          <slot name="preview" :value="modelValue" />
        </div>

        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>

    <PopoverContent class="w-min min-w-[300px] p-0" align="end">
      <Command
        :class="direction === 'top' ? 'flex-col-reverse' : 'flex-col'"
        v-model="modelValue"
        :filter-function="(filterFunction as never)"
        v-model:selected-value="selected"
        :reset-search-term-on-blur="false"
        v-model:search-term="searchTerm"
      >
        <CommandInput placeholder="Search" :direction />

        <CommandEmpty><slot name="empty" /></CommandEmpty>

        <CommandList>
          <CommandGroup>
            <CommandItem
              class="cursor-pointer hover:text-primary"
              v-for="{ value, isSelected, labelHtml, valueHtml } in resultData"
              v-memo="[value, isSelected, labelHtml, valueHtml]"
              :key="value"
              :value="value"
              @select="open = closeOnSelect ? false : open"
            >
              <Check :class="cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')" />
              <div class="combobox-item-content">
                <div :class="{ 'text-primary': isSelected }">
                  <slot name="item" :value :html="labelHtml" />
                </div>
                <span class="id" v-html="valueHtml"></span>
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<style>
.combobox-item-preview,
.combobox-item-preview span {
  @apply text-ellipsis overflow-hidden;
}

.combobox-item-content,
.combobox-item-preview {
  @apply flex items-center w-full h-6 gap-2 justify-between;

  span {
    @apply text-base font-semibold whitespace-nowrap;

    strong {
      @apply font-bold text-primary;
    }
  }

  .id {
    @apply text-secondary text-sm;
  }

  svg {
    @apply size-4;
  }
}

.combobox-item > div {
  @apply flex items-center gap-2;
}
</style>

import { useToast } from '@/components/ui/toast';
import type { Binding } from '@/lib/bindings';
import type { PhysicalButton } from '@/lib/buttons';
import type { GameMode } from '@/lib/modes';
import type { SocdType } from '@/lib/socd';
import { parseRegex, readFile } from '@/lib/utils';

export type BindingVisibility = 'hidden';

export type ModeConfigResponse = {
  bindings?: ([number, Binding] | [number, Binding, BindingVisibility])[];
  socd?: [Binding, Binding, SocdType][];
};

export type LayoutResponse = {
  name: string;

  deviceName?: string;
  pattern?: string;

  viewport: [number, number];

  buttons?: [number, number, number][];
  modes?: Partial<{ [key in GameMode]: ModeConfigResponse }>;
};

export type ModeConfig = {
  bindings: ([PhysicalButton, Binding] | [PhysicalButton, Binding, BindingVisibility])[];
  socd: [Binding, Binding, SocdType][];
};

export type Layout = {
  id: string;
  name: string;

  deviceName?: string;
  pattern?: RegExp;

  viewport: [number, number];

  buttons: [PhysicalButton, number, number][];
  modes: Partial<{ [key in GameMode]: ModeConfig }>;
};

export type LayoutExport = Omit<Layout, 'id' | 'path' | 'pattern'> & {
  pattern?: string;
};

export type LayoutIndex = { name: string; path: string };

function parseBinding([button, binding, visibility]: NonNullable<
  ModeConfigResponse['bindings']
>[number]): ModeConfig['bindings'][number] {
  const physical = button.toString() as PhysicalButton;

  if (visibility === 'hidden') {
    return [physical, binding, visibility];
  }

  return [physical, binding];
}

function parseModeConfigResponse(data: ModeConfigResponse): ModeConfig {
  return {
    bindings: data.bindings?.map(parseBinding) ?? [],
    socd: data.socd ?? [],
  };
}

function parseLayoutResponseButtons(data?: LayoutResponse['buttons']): Layout['buttons'] {
  if (!data) return [];
  return data?.map(([b, x, y]) => [b.toString() as PhysicalButton, x, y]);
}

function parseLayoutResponseModes(data?: LayoutResponse['modes']): Layout['modes'] {
  if (!data) return {};
  return Object.fromEntries(Object.entries(data ?? {}).map(([k, v]) => [k as GameMode, parseModeConfigResponse(v)]));
}

async function loadLayout(entry: LayoutIndex): Promise<Layout> {
  const res = await fetch(`/layouts/${entry.path}`);
  const data: LayoutResponse = await res.json();

  // /a/b/c.json -> a_b_c
  const id = entry.path.replace(/\//g, '_').replace('.json', '');

  return {
    id,
    name: data.name,

    deviceName: data.deviceName,
    pattern: data.pattern ? (parseRegex(data.pattern) ?? undefined) : undefined,

    viewport: data.viewport,

    buttons: parseLayoutResponseButtons(data.buttons),
    modes: parseLayoutResponseModes(data.modes),
  };
}

async function loadLayouts(): Promise<Layout[]> {
  const res = await fetch('/layouts/index.json');
  const index: LayoutIndex[] = await res.json();

  const layouts: Layout[] = [];

  for (const entry of index) {
    try {
      layouts.push(await loadLayout(entry));
    } catch (e) {
      console.error(`Failed to load layout: ${entry.path}`, e);
    }
  }

  return layouts;
}

const layouts: Map<string, Layout> = new Map();

export async function getLayouts() {
  if (layouts.size === 0) {
    for (const layout of await loadLayouts()) {
      layouts.set(layout.id, layout);
    }
  }

  return layouts;
}

export function validateLayout(data: LayoutExport): [string, string][] | null {
  const errors: Map<keyof LayoutExport, string> = new Map();

  data.name = data.name?.trim();

  if (!data.name) {
    errors.set('name', 'required');
  } else if (typeof data.name !== 'string') {
    errors.set('name', 'must be a string');
  }

  if (data.deviceName && typeof data.deviceName !== 'string') {
    errors.set('deviceName', 'must be a string');
  }

  if (data.pattern && typeof data.pattern !== 'string') {
    errors.set('pattern', 'must be a string');
  }

  if (!Array.isArray(data.buttons)) {
    errors.set('buttons', 'must be an array');
  }

  if (typeof data.modes !== 'object') {
    errors.set('modes', 'must be an object');
  }

  // todo: more validation if its an issue

  if (errors.size > 0) {
    return Array.from(errors.entries());
  }

  return null;
}

export function layoutIdFromName(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      // todo: maybe allow more characters
      .replace(/[^0-9a-z]+/g, '_')
  );
}

export function layoutFromExport(data: LayoutExport): Layout {
  return {
    id: layoutIdFromName(data.name),
    name: data.name,
    deviceName: data.deviceName,
    viewport: [1000, 600],
    pattern: data.pattern ? (parseRegex(data.pattern) ?? undefined) : undefined,
    buttons: data.buttons,
    modes: data.modes,
  };
}

export async function importLayout(file: File) {
  const { toast } = useToast();

  try {
    const data = await readFile(file);
    const imported = JSON.parse(data) as LayoutExport;

    const errors = validateLayout(imported);

    if (errors != null) {
      console.error('Failed to import layout:');
      for (const [key, error] of errors) {
        console.error(key, error);
      }

      toast({
        variant: 'destructive',
        title: 'Failed to import layout',
        description: 'The file is not a valid layout.',
      });

      return;
    }

    const layout = layoutFromExport(imported);

    return layout;
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.error('Failed to import layout:', e);
      toast({
        variant: 'destructive',
        title: 'Failed to import layout',
        description: 'The file is not valid JSON.',
      });
    } else {
      console.error('Failed to import layout:', e);
      toast({
        variant: 'destructive',
        title: 'Failed to import layout',
        description: 'An unknown error occurred. Check the console for more details.',
      });
    }
  }
}

import type { Binding } from '@/lib/bindings';
import type { PhysicalButton } from '@/lib/buttons';
import type { GameMode } from '@/lib/modes';
import type { SocdType } from '@/lib/socd';
import { parseRegex } from '@/lib/utils';

export type ModeConfigResponse = {
  bindings?: [number, Binding][];
  socd?: [Binding, Binding, SocdType][];
};

export type LayoutResponse = {
  name: string;

  deviceName?: string;
  pattern?: string;
  buttons?: [number, number, number][];
  modes?: Partial<{ [key in GameMode]: ModeConfigResponse }>;
};

export type ModeConfig = {
  bindings: [PhysicalButton, Binding][];
  socd: [Binding, Binding, SocdType][];
};

export type Layout = {
  id: string;
  path: string;
  name: string;

  deviceName?: string;
  pattern?: RegExp;
  buttons: [PhysicalButton, number, number][];
  modes: Partial<{ [key in GameMode]: ModeConfig }>;
};

export type LayoutIndex = { name: string; path: string };

function parseModeConfigResponse(data: ModeConfigResponse): ModeConfig {
  return {
    bindings: data.bindings?.map(([b, v]) => [b.toString() as PhysicalButton, v]) ?? [],
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
    path: entry.path,
    name: data.name,

    deviceName: data.deviceName,
    pattern: data.pattern ? (parseRegex(data.pattern) ?? undefined) : undefined,
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

  // return [...layouts.values()];
  return layouts;
}

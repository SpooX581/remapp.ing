import { BINDING as B, type Binding } from '@/lib/bindings';
import { PHYSICAL_BUTTON, type PhysicalButton } from '@/lib/buttons';
import type { Layout } from '@/lib/layout';
import type { GameMode } from '@/lib/modes';

export function physicalToBinding(layout: Layout, mode: GameMode, button: PhysicalButton): Binding {
  const binding = layout.modes[mode]?.bindings.find(([physical, _]) => physical === button);
  return binding?.[1] ?? B.UNSPECIFIED;
}

export function bindingToPhysical(layout: Layout, mode: GameMode, button: Binding): PhysicalButton {
  const physical = layout.modes[mode]?.bindings.find(([_, binding]) => binding === button);
  return physical?.[0] ?? PHYSICAL_BUTTON.UNSPECIFIED;
}

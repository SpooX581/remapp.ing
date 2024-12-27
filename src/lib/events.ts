// todo: delete this maybe

export const Events = {
  BUTTON_CHANGE: 'buttonchange',
  BUTTON_DELETE: 'buttondelete',
  BUTTON_CLEAR: 'buttonclear',
} as const;

export type ButtonChangeEvent = CustomEvent<number>;
export type ButtonDeleteEvent = CustomEvent<number>;

export function dispatchButtonChange(i: number) {
  window.dispatchEvent(new CustomEvent<ButtonChangeEvent['detail']>(Events.BUTTON_CHANGE, { detail: i }));
}

export function dispatchButtonDelete(i: number) {
  window.dispatchEvent(new CustomEvent<ButtonDeleteEvent['detail']>(Events.BUTTON_DELETE, { detail: i }));
}

export function dispatchButtonClear() {
  window.dispatchEvent(new CustomEvent(Events.BUTTON_CLEAR));
}

declare global {
  interface WindowEventMap {
    buttonchange: ButtonChangeEvent;
    buttondelete: ButtonDeleteEvent;
    buttonclear: CustomEvent;
  }
}

import { customElements, HTMLElement } from 'global/window';

class LazyLoader extends HTMLElement {
  static get is () { return 'lazy-loader'; }

  import (name) {
    const el = this.querySelector(`[module="${name}"]`);
    return el &&
      el.tagName.toLowerCase() === 'lazy-load' &&
      typeof el.import === 'function'
      ? el.import()
      : Promise.reject(new Error('No element to be lazy loaded'));
  }
}

!customElements.get(LazyLoader.is)
  ? customElements.define(LazyLoader.is, LazyLoader)
  : console.warn(`${LazyLoader.is} is already defined`);

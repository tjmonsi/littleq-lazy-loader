import { customElements, HTMLElement } from 'global/window';
import { importHref } from '@polymer/polymer/lib/utils/import-href';

class LazyLoad extends HTMLElement {
  static get is () { return 'lazy-load'; }

  import () {
    const href = this.getAttribute('href');
    return href && typeof href === 'string' && href.trim() ? this.importHref(href) : Promise.reject(new Error('There\'s no href attribute present in this tag'));
  }

  importHref (href) {
    const type = this.getAttribute('type');
    return type === 'html' ? this.importHtml(href) : this.importJs(href);
  }

  importHtml (href) {
    const promise = new Promise((resolve, reject) => {
      importHref(href, resolve, reject);
    });
    return promise();
  }

  importJs (href) {
    const promise = new Promise((resolve, reject) => {
      const script = /** @type {HTMLLinkElement} */ (document.createElement('script'));
      script.src = href;
      const cleanup = () => {
        script.removeEventListener('load', loadListener);
        script.removeEventListener('error', errorListener);
      };
      const loadListener = (event) => {
        cleanup();
        resolve(event);
      };
      const errorListener = (event) => {
        cleanup();
        reject(event);
      };
      script.addEventListener('load', loadListener);
      script.addEventListener('error', errorListener);
      if (script.parentNode === null) document.head.appendChild(script);
    });
    return promise();
  }
}

!customElements.get(LazyLoad.is)
  ? customElements.define(LazyLoad.is, LazyLoad)
  : console.warn(`${LazyLoad.is} is already defined`);

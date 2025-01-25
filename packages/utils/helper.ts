export const APP = document.querySelector<HTMLDivElement>("#app")!;

export class EC<K extends keyof HTMLElementTagNameMap> {
  private _element: HTMLElementTagNameMap[K];
  constructor(private elementName: K) {
    this._element = document.createElement(
      this.elementName
    ) as HTMLElementTagNameMap[K];
  }
  get element() {
    return this._element;
  }

  text(text: string) {
    this._element.textContent = text;
    return this;
  }
  innerHtml(html: string) {
    this._element.innerHTML = html;
    return this;
  }
  appendTo(parent: HTMLElement) {
    parent.appendChild(this._element);
    return this;
  }
  class(className: string | string[]) {
    className = Array.isArray(className) ? className : [className];
    this._element.classList.add(...className);
    return this;
  }
  attr(attrs: Partial<HTMLElementTagNameMap[K]>) {
    for (const key in attrs) {
      this._element.setAttribute(key, (attrs as any)[key]);
    }
    return this;
  }
  style(styles: Partial<CSSStyleDeclaration>) {
    for (const key in styles) {
      this._element.style.setProperty(key, (styles as any)[key]);
    }
    return this;
  }
}

export function ec<K extends keyof HTMLElementTagNameMap>(element: K) {
  return new EC(element) as EC<K>;
}

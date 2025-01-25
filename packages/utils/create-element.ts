type Properties<K extends keyof HTMLElementTagNameMap> = Partial<
  Omit<HTMLElementTagNameMap[K], "style">
> & { style?: Partial<CSSStyleDeclaration>; class?: string | string[] };

export function createRoot(
  rootElement: HTMLElement,
  props?: Record<string, any>,
  ...children: HTMLElement[]
) {
  for (const key in props) {
    rootElement.setAttribute(key, props[key]);
  }
  if (children) {
    children.forEach((child) => {
      rootElement.appendChild(child);
    });
  }
  return rootElement;
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  name: K,
  props?: Properties<K>,
  ...children: (HTMLElement | string | Promise<HTMLElement>)[]
) {
  const element = document.createElement(name) as HTMLElementTagNameMap[K];

  for (const prop in props) {
    const key = prop as keyof Properties<K>;
    if (key === "style") {
      for (const styleKey in props[key]) {
        (element.style as any)[styleKey] = props[key][styleKey];
      }
      continue;
    }

    if (key === "onclick") {
      element.onclick = props[key] as
        | ((this: GlobalEventHandlers, ev: MouseEvent) => any)
        | null;
      continue;
    }

    if (key === "class") {
      const p = props[key];
      const classes = Array.isArray(p) ? p : [p];
      element.classList.add(...(classes as string[]));
      continue;
    }

    element.setAttribute(key as string, props[key] as string);
  }
  if (children) {
    children.forEach(async (child) => {
      if (child instanceof Promise) {
        const resolvedChild = await child;
        element.append(resolvedChild);
      } else {
        element.append(child);
      }
    });
  }
  return element;
}

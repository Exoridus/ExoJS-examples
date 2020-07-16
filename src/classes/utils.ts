
export const injectStyles = (css: string, container: HTMLElement): void => {
  const style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.appendChild(document.createTextNode(css));

  container.appendChild(style);
};

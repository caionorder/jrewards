export class DOMUtil {
    /**
     * Verifica se um elemento está visível na viewport
     */
    public static isElementInViewport(elementId: string): boolean {
      const el = document.getElementById(elementId);
      if (!el) return false;
  
      const rect = el.getBoundingClientRect();
      const windowHeight = 
        window.innerHeight || 
        document.documentElement.clientHeight;
      const windowWidth = 
        window.innerWidth || 
        document.documentElement.clientWidth;
  
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= windowHeight &&
        rect.right <= windowWidth
      );
    }
  
    /**
     * Verifica se o dispositivo é móvel
     */
    public static isMobile(): boolean {
      if (sessionStorage.getItem('desktop')) {
        return false;
      }
      
      if (localStorage.getItem('mobile')) {
        return true;
      }
  
      const mobileDevices = [
        'iphone',
        'ipad',
        'android',
        'blackberry',
        'nokia',
        'opera mini',
        'windows mobile',
        'windows phone',
        'iemobile',
        'tablet',
        'mobi'
      ];
  
      const userAgent = navigator.userAgent.toLowerCase();
      return mobileDevices.some(device => userAgent.includes(device));
    }
  
    /**
     * Carrega um script de forma assíncrona
     */
    public static loadScript(src: string): Promise<void> {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    }
  
    /**
     * Carrega um estilo de forma assíncrona
     */
    public static loadStyle(href: string): Promise<void> {
      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to load style: ${href}`));
        document.head.appendChild(link);
      });
    }
  
    /**
     * Adiciona uma classe a um elemento
     */
    public static addClass(element: HTMLElement, className: string): void {
      if (!element.classList.contains(className)) {
        element.classList.add(className);
      }
    }
  
    /**
     * Remove uma classe de um elemento
     */
    public static removeClass(element: HTMLElement, className: string): void {
      if (element.classList.contains(className)) {
        element.classList.remove(className);
      }
    }
  
    /**
     * Toggle de uma classe em um elemento
     */
    public static toggleClass(element: HTMLElement, className: string): void {
      element.classList.toggle(className);
    }
  
    /**
     * Verifica se um elemento tem uma classe
     */
    public static hasClass(element: HTMLElement, className: string): boolean {
      return element.classList.contains(className);
    }
  
    /**
     * Obtém a posição de um elemento relativa ao documento
     */
    public static getOffset(element: HTMLElement): { top: number; left: number } {
      const rect = element.getBoundingClientRect();
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
      return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
      };
    }
  
    /**
     * Verifica se um elemento está parcialmente visível
     */
    public static isElementPartiallyVisible(element: HTMLElement): boolean {
      const rect = element.getBoundingClientRect();
      const windowHeight = 
        window.innerHeight || 
        document.documentElement.clientHeight;
      const windowWidth = 
        window.innerWidth || 
        document.documentElement.clientWidth;
  
      const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
      const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
  
      return vertInView && horInView;
    }
  
    /**
     * Obtém a porcentagem visível de um elemento
     */
    public static getVisiblePercentage(element: HTMLElement): number {
      const rect = element.getBoundingClientRect();
      const windowHeight = 
        window.innerHeight || 
        document.documentElement.clientHeight;
      const windowWidth = 
        window.innerWidth || 
        document.documentElement.clientWidth;
  
      // Altura visível
      const visibleHeight = Math.min(rect.bottom, windowHeight) - 
                           Math.max(rect.top, 0);
      const totalHeight = rect.bottom - rect.top;
  
      // Largura visível
      const visibleWidth = Math.min(rect.right, windowWidth) - 
                          Math.max(rect.left, 0);
      const totalWidth = rect.right - rect.left;
  
      // Área visível em porcentagem
      const visibleArea = (visibleHeight * visibleWidth) / 
                         (totalHeight * totalWidth);
  
      return Math.max(0, Math.min(100, visibleArea * 100));
    }
  
    /**
     * Cria um elemento com atributos
     */
    public static createElement<K extends keyof HTMLElementTagNameMap>(
      tag: K,
      attributes: { [key: string]: string } = {},
      children: (string | Node)[] = []
    ): HTMLElementTagNameMap[K] {
      const element = document.createElement(tag);
      
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
  
      children.forEach(child => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else {
          element.appendChild(child);
        }
      });
  
      return element;
    }
  
    /**
     * Verifica se o documento está pronto
     */
    public static documentReady(): Promise<void> {
      return new Promise(resolve => {
        if (document.readyState === 'complete' || 
            document.readyState === 'interactive') {
          resolve();
        } else {
          document.addEventListener('DOMContentLoaded', () => resolve());
        }
      });
    }
  
    /**
     * Limpa todos os filhos de um elemento
     */
    public static clearChildren(element: HTMLElement): void {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  
    /**
     * Insere um elemento após outro
     */
    public static insertAfter(
      newNode: HTMLElement,
      referenceNode: HTMLElement
    ): void {
      referenceNode.parentNode?.insertBefore(newNode, referenceNode.nextSibling);
    }
  }
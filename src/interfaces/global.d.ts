declare global {
  interface Window {
    googletag: any;
    timer: () => void;
    dataLayer: any;
    gtag: (command: string, eventName: string, params?: Record<string, any>) => void;
  }
}
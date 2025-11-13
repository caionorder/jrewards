import rewardsCss from '../styles/rewards'
import { DOMUtil } from '../utils/dom-util'

declare global {
  interface Window {
    googletag: any;
    timer: () => void;
    dataLayer: any;
    gtag: (command: string, eventName: string, params?: Record<string, any>) => void;
  }
}

export class Rewards {

  private currentDataReward: any = null;
  private rewardedAdEvent: any = null;
  private classList: string | null = null;
  private id: number = 0;
  private id_client: number = 0;

  constructor() {

    const element = document.querySelector(`[groone="reward"]`);

    if (!element || !element.getAttribute('data-id') || !element.getAttribute('data-client')) {
      console.warn('[Reward] Elemento não encontrado para rewards:', `[groone="reward"]`);
      return;
    }

    this.id = parseInt(element.getAttribute('data-id') || '0');
    this.id_client = parseInt(element.getAttribute('data-client') || '0');

    this.initializeReward(element);
  }

  private initializeReward = (element: Element) => {
    console.debug('[initializeReward] Iniciando reward com elemento:', element);

    if (typeof googletag === 'undefined' || !googletag.cmd) {
      console.warn("[initializeReward] googletag não está disponível. Tentando novamente...");
      setTimeout(() => this.initializeReward(element), 100);
      return;
    }

    console.debug("[initializeReward] googletag disponível. Continuando...");
    const rewardElement = document.querySelector(`[groone="reward"]`);

    if (!rewardElement) return;

    console.debug("[initializeReward] Reward element encontrado:", rewardElement);
    this.initializeRewardedAd(rewardElement);
  }

  private initializeRewardedAd = async (rewardElement: any) => {

    const dataReward = await this.requestAdRewardFromService(this.id, this.id_client);

    var rewardedSlot: any;
    const timer = parseInt(dataReward.timer) || 0;
    const rewardId = rewardElement.id || 'reward_' + Math.random().toString(36).substring(2, 15);

    if (this.hasRewardBeenShownRecently()) {
      console.log('Reward já exibido nos últimos ' + dataReward?.end_time + ' minutos, pulando...');
      return;
    }

    const loadRewardedAd = () => {

      googletag.cmd.push(() => {
        rewardedSlot = googletag.defineOutOfPageSlot(dataReward.block, googletag.enums.OutOfPageFormat.REWARDED);

        if (rewardedSlot) {
          rewardedSlot.addService(googletag.pubads());

          googletag.pubads().addEventListener('rewardedSlotReady', (event) => {

            this.rewardedAdEvent = event;

            this.addRewardStyles();

            this.createRewardStructure(rewardElement, dataReward);

            setTimeout(() => {
              const showRewardedAdButton = document.getElementById('show_rewarded_ad');

              if (showRewardedAdButton) {
                showRewardedAdButton.onclick = (e) => {
                  e.preventDefault();
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    event: 'clickReward',
                  });
                  event.makeRewardedVisible();
                };
              }
            }, 100);
          });

          // Reward Fechado
          googletag.pubads().addEventListener('rewardedSlotClosed', function () {
            dismissRewardedAd(false);
          });

          // Reward Concluído
          googletag.pubads().addEventListener('rewardedSlotGranted', (event) => {
            dismissRewardedAd(true);
            console.log("currentDataReward?.end_time", this.currentDataReward?.end_time);

            const minutes = parseInt(this.currentDataReward?.end_time);
            this.markRewardAsShown(minutes);

            const link = dataReward.link;
            if (link) {
              const urlParams = this.getURLParameters();
              const finalUrl = this.addParamsToURL(link, urlParams);

              setTimeout(() => {
                window.location.href = finalUrl;
              }, 500);
            }
          });

          googletag.enableServices();
          googletag.display(rewardedSlot);
        }
      });
    }

    const dismissRewardedAd = (completed: any) => {
      googletag.destroySlots([rewardedSlot]);
      this.dismissOfferwall();
    }

    if (timer > 0) {
      setTimeout(loadRewardedAd, timer * 1000);
    } else {
      setTimeout(loadRewardedAd, 500);
    }
  }

  private getClientLanguage = (): string => {
    const { lang } = document.documentElement;
    
    const languageMap: { [key: string]: string } = {
      'en': 'en_US',
      'pt': 'pt_BR',
      'es': 'es_ES',
      'fr': 'fr_FR',
      'it': 'it_IT',
      'de': 'de_DE',
      'nl': 'nl_NL',
      'ru': 'ru_RU',
      'ja': 'ja_JP',
      'zh': 'zh_CN',
      'ar': 'ar_SA',
      'ko': 'ko_KR',
      'tr': 'tr_TR',
      'pl': 'pl_PL',
      'sv': 'sv_SE'
    };

    var newlang = lang.split('-')[0]; 
    var mapped = languageMap[newlang] || lang || 'en_US';

    console.debug('[clientLanguage] Original lang:', lang);
    console.debug('[clientLanguage] Mapped lang:', mapped);

    return mapped;
  }

  private requestAdRewardFromService = async (id_reward: number, id_client: number): Promise<any> => {
    try {
      // const response = await fetch(`http://127.0.0.1:8000/api/reward/${id_client}/${id_reward}`); //dev
      const response = await fetch(`https://genius.groone.com/api/reward/${id_client}/${id_reward}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const request = await response.json();
      const lang = this.getClientLanguage();

      if (request.success != true) {
        throw new Error(`Not found Reward`);
      }
      
      console.debug('[reward] Dados Reward:', request.data);
      console.debug('[reward] Usando idioma:', lang);

      return {
        icon: this.randomIcon(),
        title: request.data.title,
        description: request.data.description,
        block: request.data.block,
        button: request.data.button,
        link: request.data.link,
        language: lang,
        interval: request.data.interval,
        primary_color: request.data.primary_color,
        secundary_color: request.data.secundary_color,
      };
    } catch (error) {
      console.error('[reward] Error fetching ad reward:', error);
      return null;
    }
  }

  private randomIcon = () => {
    const icons = ["🎁", "🏆", "🎉", "🚀", "🥳", "🎊"];
    var index = Math.floor(Math.random() * icons.length)

    return icons[index]
  }

  private getLocalizedFooterText = (language: string) => {
    const locales: { [key: string]: string } = {
      'pt': 'Oferta patrocinada',
      'pt_BR': 'Oferta patrocinada',
      'en_US': 'Sponsored offer',
      'es_ES': 'Oferta patrocinada',
      'fr_FR': 'Offre sponsorisée',
      'it_IT': 'Offerta sponsorizzata',
      'de_DE': 'Gesponsertes Angebot',
      'nl_NL': 'Gesponsorde aanbieding',
      'ru_RU': 'Спонсируемое предложение',
      'ja_JP': 'スポンサー付きオファー',
      'zh_CN': '赞助优惠',
      'ar_SA': 'عرض برعاية',
      'ko_KR': '스폰서 제공 혜택',
      'tr_TR': 'Sponsorlu teklif',
      'pl_PL': 'Oferta sponsorowana',
      'sv_SE': 'Sponsrat erbjudande'
    };

    return locales[language] || locales['en_US'];
  }

  private getURLParameters = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const params: any = {};

    const trackingParams = [
      'utm_source', 
      'utm_medium', 
      'utm_campaign', 
      'utm_term', 
      'utm_content',
      'fbclid', 
      'gclid',
      'source',
    ];

    trackingParams.forEach(param => {
      if (urlParams.has(param)) {
        params[param] = urlParams.get(param);
      }
    });

    return params;
  }

  private addParamsToURL = (url: string, params: any) => {
    if (!url) return url;

    try {
      const urlObj = new URL(url);
      const urlParams = new URLSearchParams(urlObj.search);

      Object.keys(params).forEach(key => {
        if (!urlParams.has(key)) {
          urlParams.set(key, params[key]);
        }
      });

      urlObj.search = urlParams.toString();
      return urlObj.toString();
    } catch (e) {
      console.error('Erro ao adicionar parâmetros à URL:', e);
      return url;
    }
  }

  private setCookie = (name: string, value: string, minutes: number) => {
    const date = new Date();

    date.setTime(date.getTime() + (minutes * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  private getCookie = (name: string) => {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(cname) === 0) {
        return c.substring(cname.length, c.length);
      }
    }
    return "";
  }

  private hasRewardBeenShownRecently = () => {
    const cookieKey = "reward_shown";
    return this.getCookie(cookieKey) === "true";
  }

  private markRewardAsShown = (minutes: any) => {
    const cookieKey = "reward_shown";
    this.setCookie(cookieKey, "true", minutes);
  }

  public dismissOfferwall = () => {
    const offerwall = document.getElementById('reward_modal_container');
    if (offerwall) {
      offerwall.style.opacity = '0';
      setTimeout(() => {
        offerwall.parentNode?.removeChild(offerwall);
      }, 300);
    }

    const styles = document.getElementById('reward-styles');
    if (styles) {
      styles.parentNode?.removeChild(styles);
    }
  }

  private hexToRGB = (hex: string) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  }

  public addRewardStyles = () => {
    if (document.getElementById('reward-styles')) return;

    const styleElement = document.createElement('style');
    styleElement.id = 'reward-styles';
    styleElement.textContent = rewardsCss;
    document.head.appendChild(styleElement);
  }

  private createRewardStructure = (rewardElement: any, dataReward: any) => {
    
    const language = dataReward.language || 'en_US';
    const fontLink = document.createElement('link')
    
    console.debug('[createRewardStructure] Language:', language);

    const createHeader = () => {
      fontLink.id = "reward-font";
      fontLink.rel = "stylesheet";
      fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap";
      document.head.appendChild(fontLink);

      const primary_color_rgb = this.hexToRGB(dataReward.primary_color);
      document.documentElement.style.setProperty('--reward-primary-rgb', primary_color_rgb);

      const secundary_color_rgb = this.hexToRGB(dataReward.secundary_color);
      document.documentElement.style.setProperty('--reward-secundary-rgb', secundary_color_rgb);

      document.documentElement.style.setProperty('--reward-primary', dataReward.primary_color);
      document.documentElement.style.setProperty('--reward-secundary', dataReward.secundary_color);
    }

    const createButtonCloseModal = () => {
      const closeButton = document.createElement('button');
      closeButton.className = 'reward-close';
      closeButton.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
          </svg>
      `;
      closeButton.onclick = this.dismissOfferwall;

      header.appendChild(closeButton);
    }

    createHeader()

    // Backdrop
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'reward-modal-backdrop';
    modalBackdrop.id = 'reward_modal_container';

    // Wrapper (para animação shake)
    const modalWrapper = document.createElement('div');
    modalWrapper.className = 'reward-modal-wrapper';

    // Modal
    const modal = document.createElement('div');
    modal.className = 'reward-modal';

    // Header
    const header = document.createElement('div');
    header.className = 'reward-header';

    createButtonCloseModal()

    // Content
    const content = document.createElement('div');
    content.className = 'reward-content';
    content.innerHTML = this.createNormalRewardContent(dataReward);

    // Footer
    const footer = document.createElement('div');
    footer.className = 'reward-footer';
    footer.textContent = this.getLocalizedFooterText(language);

    modal.appendChild(header);
    modal.appendChild(content);
    modal.appendChild(footer);

    modalWrapper.appendChild(modal);
    modalBackdrop.appendChild(modalWrapper);
    rewardElement.appendChild(modalBackdrop);

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalWrapper.classList.add('reward-shake');
        setTimeout(() => modalWrapper.classList.remove('reward-shake'), 350);
      }
    });
  }

  private createNormalRewardContent = (dataReward: any) => {
    return `
        <div class="reward-icon-wrapper">
          ${dataReward.icon}
        </div>
        <h2 class="reward-title">${dataReward.title}</h2>
        <p class="reward-description">${dataReward.description}</p>
        <button class="reward-button" id="show_rewarded_ad">
          ${dataReward.button}
        </button>
      `;
  }
}



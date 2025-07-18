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

  private currentQuizPage = 0;
  private quizAnswers: any[] = [];
  private currentDataReward: any = null;
  private rewardedAdEvent: any = null;
  private classList: string | null = null;
  private id: number = 0;
  private network: string | null = null;
  private domain: string | null = null;
  private subdomain: string | null = null;
  private date: string | null = null;

  constructor() {

    const element = document.querySelector(`[joinadscode="AdRewarded"]`);
    if (!element || !element.getAttribute('data-id') || !element.getAttribute('data-network') || !element.getAttribute('data-domain') || !element.getAttribute('data-subdomain') || !element.getAttribute('data-date')) {
      console.warn('[Rewards] Elemento não encontrado para rewards:', `[joinadscode="AdRewarded"]`);
      return;
    }

    this.id = parseInt(element.getAttribute('data-id') || '0');
    this.network = element.getAttribute('data-network') || 'network';
    this.domain = element.getAttribute('data-domain') || 'domain';
    this.subdomain = element.getAttribute('data-subdomain') || 'subdomain';
    this.date = element.getAttribute('data-date') || 'date';

    this.initializeReward(element);
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

  private getLocalizedQuizTexts = (language: string) => {
    const locales: { [key: string]: { questionProgress: string; backButton: string } } = {
      'pt': {
        questionProgress: 'Pergunta {current} de {total}',
        backButton: 'Voltar'
      },
      'pt_BR': {
        questionProgress: 'Pergunta {current} de {total}',
        backButton: 'Voltar'
      },
      'en_US': {
        questionProgress: 'Question {current} of {total}',
        backButton: 'Back'
      },
      'es_ES': {
        questionProgress: 'Pregunta {current} de {total}',
        backButton: 'Volver'
      },
      'fr_FR': {
        questionProgress: 'Question {current} sur {total}',
        backButton: 'Retour'
      },
      'it_IT': {
        questionProgress: 'Domanda {current} di {total}',
        backButton: 'Indietro'
      },
      'de_DE': {
        questionProgress: 'Frage {current} von {total}',
        backButton: 'Zurück'
      },
      'nl_NL': {
        questionProgress: 'Vraag {current} van {total}',
        backButton: 'Terug'
      },
      'ru_RU': {
        questionProgress: 'Вопрос {current} из {total}',
        backButton: 'Назад'
      },
      'ja_JP': {
        questionProgress: '質問 {current} / {total}',
        backButton: '戻る'
      },
      'zh_CN': {
        questionProgress: '问题 {current} / {total}',
        backButton: '返回'
      },
      'ar_SA': {
        questionProgress: 'السؤال {current} من {total}',
        backButton: 'رجوع'
      },
      'ko_KR': {
        questionProgress: '질문 {current} / {total}',
        backButton: '뒤로'
      },
      'tr_TR': {
        questionProgress: 'Soru {current} / {total}',
        backButton: 'Geri'
      },
      'pl_PL': {
        questionProgress: 'Pytanie {current} z {total}',
        backButton: 'Wstecz'
      },
      'sv_SE': {
        questionProgress: 'Fråga {current} av {total}',
        backButton: 'Tillbaka'
      }
    };

    return locales[language] || locales['en_US'];
  }

  private getURLParameters = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const params: any = {};

    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'fbclid', 'gclid', 'msclkid', 'ref', 'source', 'referrer'
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
    date.setTime(date.getTime() + (minutes * 60 * 1000)); // agora em minutos
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

  private hasRewardBeenShownRecently = (rewardId: number) => {
    const cookieKey = "reward_shown";
    return this.getCookie(cookieKey) === "true";
  }

  private markRewardAsShown = (rewardId: number, minutes: any) => {
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

  private initializeReward = (element: Element) => {
    console.debug('[initializeReward] Iniciando reward com elemento:', element);

    if (typeof googletag === 'undefined' || !googletag.cmd) {
      console.warn("[initializeReward] googletag não está disponível. Tentando novamente...");
      setTimeout(() => this.initializeReward(element), 100);
      return;
    }

    console.debug("[initializeReward] googletag disponível. Continuando...");
    const rewardElement = document.querySelector(`[joinadscode="AdRewarded"]`);

    if (!rewardElement) return;

    console.debug("[initializeReward] Reward element encontrado:", rewardElement);
    this.initializeRewardedAd(rewardElement);
  }

  private hexToRGBA = (hex: string, alpha: number) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  public addRewardStyles = () => {
    if (document.getElementById('reward-styles')) return;

    const styleElement = document.createElement('style');
    styleElement.id = 'reward-styles';
    styleElement.textContent = rewardsCss;
    document.head.appendChild(styleElement);
  }

  private createRewardStructure = (rewardElement: any, dataReward: any) => {
    const isQuiz = dataReward.type === 2;
    const language = dataReward.language || 'en_US';

    // Define a cor do botão como CSS variable
    if (dataReward?.color_button) {
      // Define cores dinâmicas
      document.documentElement.style.setProperty('--reward-primary', dataReward.color_button);
      document.documentElement.style.setProperty('--reward-secondary', dataReward.color_button);
      document.documentElement.style.setProperty('--reward-primary-dark', dataReward.color_button);

      // Define versão transparente para hover
      const rgba = this.hexToRGBA(dataReward.color_button, 0.1);
      document.documentElement.style.setProperty('--reward-primary-transparent', rgba);
    }


    console.debug('[createRewardStructure] Type:', dataReward.type);
    console.debug('[createRewardStructure] Language:', language);
    console.debug('[createRewardStructure] Is Quiz:', isQuiz);

    // Container principal
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'reward-modal-backdrop';
    modalBackdrop.id = 'reward_modal_container';

    const modal = document.createElement('div');
    modal.className = 'reward-modal';

    // Header com botão de fechar
    const header = document.createElement('div');
    header.className = 'reward-header';

    const closeButton = document.createElement('button');
    closeButton.className = 'reward-close';
    closeButton.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
    closeButton.onclick = this.dismissOfferwall;
    header.appendChild(closeButton);

    // Timer (se aplicável)
    if (dataReward.showTimer) {
      const timer = document.createElement('div');
      timer.className = 'reward-timer';
      timer.innerHTML = `
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
          </svg>
          <span id="reward-timer-text">5s</span>
        `;
      header.appendChild(timer);
    }

    modal.appendChild(header);

    // Content
    const content = document.createElement('div');
    content.className = 'reward-content';

    if (isQuiz) {
      content.innerHTML = this.createQuizContent(dataReward);
    } else {
      content.innerHTML = this.createNormalRewardContent(dataReward);
    }

    modal.appendChild(content);

    // Footer
    const footer = document.createElement('div');
    footer.className = 'reward-footer';
    footer.textContent = this.getLocalizedFooterText(language);
    modal.appendChild(footer);

    modalBackdrop.appendChild(modal);
    rewardElement.appendChild(modalBackdrop);

    // Event listeners
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        this.dismissOfferwall();
      }
    });

    // Inicializar quiz se necessário
    if (isQuiz) {
      this.initializeQuiz(dataReward);
    }
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
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      `;
  }

  private createQuizContent = (dataReward: any) => {
    const language = dataReward.language || 'en_US';
    const texts = this.getLocalizedQuizTexts(language);
    const progressText = texts.questionProgress
      .replace('{current}', '1')
      .replace('{total}', dataReward.pages.length);

    return `
        <div class="quiz-container" id="quiz-container">
          <div class="quiz-progress">
            <div class="quiz-progress-bar">
              <div class="quiz-progress-fill" id="quiz-progress-fill" style="width: 0%"></div>
            </div>
            <div class="quiz-progress-text" id="quiz-progress-text">${progressText}</div>
          </div>
          <div id="quiz-content">
            <!-- Conteúdo dinâmico do quiz -->
          </div>
        </div>
      `;
  }

  private initializeQuiz = (dataReward: any) => {
    this.currentQuizPage = 0;
    this.quizAnswers = [];
    this.currentDataReward = dataReward;
    this.showQuizPage(dataReward.pages[this.currentQuizPage], this.currentQuizPage, dataReward.pages.length);
  }

  private showQuizPage = (page: any, index: number, total: number) => {
    const quizContent = document.getElementById('quiz-content');
    if (!quizContent) return;

    // Obter textos localizados
    const language = this.currentDataReward?.language || 'en_US';
    const texts = this.getLocalizedQuizTexts(language);

    // Atualizar progresso
    const progress = ((index + 1) / total) * 100;
    const progressFill = document.getElementById('quiz-progress-fill');
    const progressText = document.getElementById('quiz-progress-text');

    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressText) {
      progressText.textContent = texts.questionProgress
        .replace('{current}', (index + 1).toString())
        .replace('{total}', total.toString());
    }

    // Criar conteúdo da página
    quizContent.innerHTML = `
        <h3 class="quiz-question">${page.message || page.title || ''}</h3>
        <div class="quiz-options" id="quiz-options">
          ${page.buttons.map((btn: any, i: number) => `
            <button class="quiz-option" data-value="${btn.value || btn.name}" data-index="${i}">
              ${btn.text || btn.name}
            </button>
          `).join('')}
        </div>
        ${index > 0 ? `
          <div class="quiz-navigation">
            <div></div>
          </div>
        ` : ''}
      `;

    // Event listeners para as opções
    const options = quizContent.querySelectorAll('.quiz-option');

    options.forEach((option, btnIndex) => {

      option.addEventListener('click', (e) => {

        // Visual feedback
        options.forEach(opt => opt.classList.remove('selected'));
        if (!e.currentTarget || !(e.currentTarget instanceof HTMLElement)) {
          return
        }

        e.currentTarget.classList.add('selected');

        // Salvar resposta
        this.quizAnswers[index] = e.currentTarget.getAttribute('data-value');

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'quiz_answered',
          page_index: index, // página atual do quiz
          button_index: btnIndex, // índice do botão clicado
          button_value: e.currentTarget.getAttribute('data-value') // valor selecionado
        });

        // Aguardar um pouco para o usuário ver a seleção
        setTimeout(() => {
          if (index === total - 1) {
            this.showQuizComplete();
          } else {
            this.currentQuizPage++;
            this.showQuizPage(this.currentDataReward.pages[this.currentQuizPage], this.currentQuizPage, total);
          }
        }, 300);
      });
    });

    // Botão voltar
    const backBtn = document.getElementById('quiz-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.currentQuizPage--;
        this.showQuizPage(this.currentDataReward.pages[this.currentQuizPage], this.currentQuizPage, total);
      });
    }
  }

  private showQuizComplete = () => {
    console.debug('[showQuizComplete] Exibindo tela de conclusão do quiz');
    const quizContent = document.getElementById('quiz-content');
    if (!quizContent) return;


    quizContent.innerHTML = `
        <div class="quiz-complete">
          <div class="quiz-complete-icon">
            ${this.currentDataReward.icon}
            </div>
            <h3 class="reward-title">${this.currentDataReward.title}</h3>
            <p class="reward-description">${this.currentDataReward.description}</p>
            <button class="reward-button" id="show_rewarded_ad">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15V7l6 5-6 5z"/>
              </svg>
              ${this.currentDataReward.button}
            </button>
            <p style="font-size: 12px; color: #666; margin-top: 12px; text-align: center;">${this.currentDataReward.sub_describe}</p>
          </div>
        `;

    // Esconder a barra de progresso
    const progressBar = document.querySelector('.quiz-progress') as HTMLElement;
    if (progressBar) progressBar.style.display = 'none';

    // Adicionar o event listener ao botão de desbloquear
    setTimeout(() => {
      const unlockButton = document.getElementById('show_rewarded_ad');
      console.debug('unlockButton:', unlockButton);
      console.debug('this.rewardedAdEvent:', this.rewardedAdEvent);
      if (unlockButton && this.rewardedAdEvent) {
        console.debug('Adicionando evento ao botão de desbloquear reward');
        unlockButton.onclick = (e) => {
          console.debug('Botão de desbloquear reward clicado');
          e.preventDefault();

          console.debug('Clicou no botão de desbloquear reward');

          // Dispara evento para o Google Tag Manager
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'reward_clicked',
            type: 'quiz'
          });

          this.rewardedAdEvent.makeRewardedVisible();
        };
      }
    }, 100);
  }

  // Função para inicializar o anúncio recompensado
  private initializeRewardedAd = async (rewardElement: any) => {

    const { lang } = document.documentElement;

    // Mapear códigos de idioma curtos para completos
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

    var newlang = lang.split('-')[0]; // Pegar apenas a parte antes do traço, se existir

    // Usar o mapeamento ou manter o original se já estiver no formato completo
    const mappedLang = languageMap[newlang] || lang || 'en_US';
    console.debug('[initializeRewardedAd] Original lang:', lang);
    console.debug('[initializeRewardedAd] Mapped lang:', mappedLang);

    const dataReward = await this.requestAdRewardFromService(this.id, mappedLang);

    if (!dataReward) return;

    const isMobile = typeof DOMUtil !== 'undefined' && DOMUtil.isMobile ? DOMUtil.isMobile() : false;
    const deviceType = isMobile ? "MOBILE" : "WEB";
    const adUnit = `/${this.network || 'network'}/${this.domain || 'domain'}/${this.subdomain || 'subdomain'}_${deviceType}_Rewards_${this.date || 'date'}`;

    var rewardedSlot: any;
    const timer = parseInt(dataReward.timer) || 0;
    const rewardId = rewardElement.id || 'reward_' + Math.random().toString(36).substring(2, 15);

    if (this.hasRewardBeenShownRecently(rewardId)) {
      console.log('Reward já exibido nos últimos ' + dataReward?.end_time + ' minutos, pulando...');
      return;
    }

    const loadRewardedAd = () => {

      googletag.cmd.push(() => {
        rewardedSlot = googletag.defineOutOfPageSlot(adUnit, googletag.enums.OutOfPageFormat.REWARDED);

        if (rewardedSlot) {
          rewardedSlot.addService(googletag.pubads());

          googletag.pubads().addEventListener('rewardedSlotReady', (event) => {
            // Armazenar o evento globalmente para usar no quiz
            this.rewardedAdEvent = event;

            this.addRewardStyles();

            // Se tiver timer, mostrar countdown antes
            if (timer > 0) {
              dataReward.showTimer = true;
              let timeLeft = timer;
              this.createRewardStructure(rewardElement, dataReward);

              const timerText = document.getElementById('reward-timer-text');
              const timerInterval = setInterval(() => {
                timeLeft--;
                if (timerText) timerText.textContent = `${timeLeft}s`;

                if (timeLeft <= 0) {
                  clearInterval(timerInterval);
                  const timerElement = document.querySelector('.reward-timer') as HTMLElement;
                  if (timerElement) timerElement.style.display = 'none';
                }
              }, 1000);
            } else {
              this.createRewardStructure(rewardElement, dataReward);
            }

            // Adicionar evento ao botão após toda a estrutura estar pronta
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

          googletag.pubads().addEventListener('rewardedSlotClosed', function () {
            dismissRewardedAd(false);
          });

          googletag.pubads().addEventListener('rewardedSlotGranted', (event) => {
            dismissRewardedAd(true);
            console.log("currentDataReward?.end_time", this.currentDataReward?.end_time);

            const minutes = parseInt(this.currentDataReward?.end_time);
            this.markRewardAsShown(rewardId, minutes);

            const link = dataReward.link;
            if (link) {
              const urlParams = this.getURLParameters();
              const finalUrl = this.addParamsToURL(link, urlParams);

              // Pequeno delay para garantir que o ad foi fechado
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

    // Aguardar um pouco antes de carregar se não tiver timer
    if (timer > 0) {
      setTimeout(loadRewardedAd, timer * 1000);
    } else {
      // Delay pequeno para garantir que a página carregou
      setTimeout(loadRewardedAd, 500);
    }
  }

  private requestAdRewardFromService = async (id: number, lang: string): Promise<any> => {
    try {
      const response = await fetch(`https://services.joinads.me/rewards/get/${id}/${lang}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const request = await response.json();
      console.debug('[AdRewarded] Dados da recompensa:', request.data);
      console.debug('[AdRewarded] Reward locale:', request.data.reward.locale);
      console.debug('[AdRewarded] Lang parameter:', lang);
      console.debug('[AdRewarded] Usando idioma:', lang);

      // Verificar se é quiz (type 2) ou reward normal (type 1)
      const isQuiz = request.data.reward.type === 2;

      if (isQuiz) {
        // Processar dados do quiz
        return {
          type: 2,
          title: request.data.reward.title,
          icon: request.data.reward.icon || '❓',
          link: request.data.reward.link,
          timer: request.data.reward.timer,
          language: lang, // Usar o lang parameter ao invés do locale
          pages: request.data.pages || [],
          color_progress_bar: request.data.reward.color_progress_bar || '#2196f3',
          color_button: request.data.reward.color_button || '#4caf50',
          sub_describe: request.data.reward.sub_describe || 'Complete the quiz to unlock your reward!',
          button: request.data.reward.button || 'Unlock',
          description: request.data.reward.description || 'Unlock',
          end_time: parseInt(request.data.reward.end_time) || 10,
        };
      } else {
        // Processar dados do reward normal
        return {
          type: 1,
          title: request.data.messages.title,
          description: request.data.messages.description,
          button: request.data.messages.button,
          link: request.data.reward.link,
          timer: request.data.reward.timer,
          icon: request.data.reward.icon,
          language: lang, // Usar o lang parameter ao invés do locale
          color_progress_bar: request.data.reward.color_progress_bar || '#2196f3',
          color_button: request.data.reward.color_button || '#4caf50',
          end_time: parseInt(request.data.reward.end_time) || 10,
        };
      }
    } catch (error) {
      console.error('[AdRewarded] Error fetching ad reward:', error);
      return null;
    }
  }

}



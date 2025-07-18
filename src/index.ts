import { DOMUtil } from "./utils/dom-util";
import { Rewards } from "./services/rewards";


export default class JoinAdsRewards {
    private Rewards!: Rewards;
    private domUtil = new DOMUtil();

    constructor() {
        this.initializeServices();
    }

    /**
     * Inicializa todos os serviços necessários
     */
    private initializeServices(): void {        
        this.Rewards = new Rewards();
    }

    /**
     * Métodos públicos para acesso externo aos managers
     */
    public getRewards(): Rewards {
        return this.Rewards;
    }
    public getDomUtil(): DOMUtil {
        return this.domUtil;
    }
}

const joinAdsRewards = new JoinAdsRewards();
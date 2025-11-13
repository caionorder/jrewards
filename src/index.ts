import { DOMUtil } from "./utils/dom-util";
import { Rewards } from "./services/rewards";


export default class GrooneRewards {
    private Rewards!: Rewards;
    private domUtil = new DOMUtil();

    constructor() {
        this.initializeServices();
    }

    private initializeServices(): void {        
        this.Rewards = new Rewards();
    }

    public getRewards(): Rewards {
        return this.Rewards;
    }
    public getDomUtil(): DOMUtil {
        return this.domUtil;
    }
}

const grooneRewards = new GrooneRewards();
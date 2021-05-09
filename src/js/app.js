import { Event } from "./event";
import { Helper } from "./helper";
import { Renderer } from "./renderer";

export class RoolithEditor {
    constructor(selector, settings = {}) {
        this.selector = selector;
        this.instanceId = Helper.generateInstanceId(15);
        this.settings = {...settings};
        this.renderer = null;
        this.event = null;

        this.init();
    }

    init() {
        this.renderer = new Renderer(this.selector, this.instanceId, this.settings);
        this.renderer.generate();

        this.event = new Event(this.renderer, this.settings);
        this.event.register();
    }
}

window.RoolithEditor = RoolithEditor;
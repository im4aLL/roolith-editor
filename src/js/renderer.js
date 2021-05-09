import { ToolbarIcons } from "./toolbar";

export class Renderer {
    constructor(selector, instanceId, settings) {
        this.selector = selector;
        this.instanceId = instanceId;
        this.settings = settings;

        this.buttons = ['bold', 'italic', 'insertUnorderedList', 'insertOrderedList', 'removeFormat'];
        this.editorId = `roolith-editor-${this.instanceId}`;
    }

    getButtons() {
        return this.buttons;
    }

    getEditorId() {
        return this.editorId;
    }

    generate() {
        this.hideSelector();
        this.attachInstanceClass();
        this.generateSkeleton();
        this.generateToolbar();
    }

    generateSkeleton() {
        this.selector.insertAdjacentHTML('afterend', `
            <div class="roolith__editor" id="${this.editorId}">
                <div class="roolith__editor__toolbar">
                    <ul class="roolith__editor__toolbar__list"></ul>
                </div>
                <div class="roolith__editor__content" contenteditable="true" spellcheck="true"></div>
            </div>
        `);
    }

    generateToolbar() {
        if (this.settings && this.settings.toolbar) {
            this.buttons = this.settings.toolbar;
        }

        const editorElem = document.getElementById(this.editorId);
        const toolbarContainerElem = editorElem.querySelector(`.roolith__editor__toolbar__list`);
        let toolbarHtml = '';

        this.buttons.forEach(button => {
            const icon = ToolbarIcons[button] || null;

            if (icon) {
                toolbarHtml += `<li class="roolith__editor__toolbar__list__item" data-command="${button}"><button>${icon}</button></li>`;
            }
        });

        toolbarContainerElem.innerHTML = toolbarHtml;
    }

    hideSelector() {
        this.selector.style.display = 'none';
    }

    attachInstanceClass() {
        this.selector.classList.add(`roolith-editor-selector-${this.instanceId}`);
    }
}
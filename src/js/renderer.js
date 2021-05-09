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
            } else if (button === '-') {
                toolbarHtml += `<li class="roolith__editor__toolbar__list__item roolith__editor__toolbar__list__item--separator">-</li>`;
            } else if (button === 'headings') {
                toolbarHtml += `
                    <li class="roolith__editor__toolbar__list__item roolith__editor__toolbar__list__item--fit is--show">
                        <div class="roolith__editor__toolbar__list__item__dropdown">
                            <div class="roolith__editor__toolbar__list__item__dropdown__header">Heading</div>
                            <ul class="roolith__editor__toolbar__list__item__dropdown__list">
                                <li class="roolith__editor__toolbar__list__item__dropdown__list__item is--h1" data-command="formatBlock:h1"><button>Heading 1</button></li>
                                <li class="roolith__editor__toolbar__list__item__dropdown__list__item is--h2" data-command="formatBlock:h2"><button>Heading 2</button></li>
                                <li class="roolith__editor__toolbar__list__item__dropdown__list__item is--h3" data-command="formatBlock:h3"><button>Heading 3</button></li>
                                <li class="roolith__editor__toolbar__list__item__dropdown__list__item is--h4" data-command="formatBlock:h4"><button>Heading 4</button></li>
                                <li class="roolith__editor__toolbar__list__item__dropdown__list__item is--h5" data-command="formatBlock:h5"><button>Heading 5</button></li>
                                <li class="roolith__editor__toolbar__list__item__dropdown__list__item is--h6" data-command="formatBlock:h6"><button>Heading 6</button></li>
                            </ul>
                        </div>
                    </li>
                `;
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
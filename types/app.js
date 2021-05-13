class Helper {
    static generateInstanceId(length) {
        const result = [];
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;

        for ( let i = 0; i < length; i++ ) {
            result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
        }

        return result.join('');
    }

    static saveSelection() {
        let sel = Helper.getSelection();

        if (sel && sel.getRangeAt && sel.rangeCount) {
            return sel.getRangeAt(0);
        }

        return false;
    }

    static restoreSelection(range, sel) {
        if (range && sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    static getSelection() {
        if (window.getSelection) {
            const selection = window.getSelection();

            if (selection.rangeCount) {
                return selection;
            }
        }

        return false;
    }

    static insertAtCaret(html) {
        const selection = Helper.getSelection();
        let range;

        if (!selection) {
            return false;
        }
        

        if (selection.getRangeAt && selection.rangeCount) {
            range = selection.getRangeAt(0);
            range.deleteContents();

            const el = document.createElement('div');
            el.innerHTML = html;

            const frag = document.createDocumentFragment();
            let node;
            let lastNode;

            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }

            range.insertNode(frag);

            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }

    static putCaretAtEnd(contentEditableElement) {
        let range;
        let selection;

        range = document.createRange();
        range.selectNodeContents(contentEditableElement);
        range.collapse(false);
        selection = Helper.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
    
    static parseTemplate(template, data) {
        return template.replace(/\{([\w\.]*)\}/g, (str, key) => {
            const keys = key.split('.');
            let v = data[keys.shift()];

            if (keys.length > 0) {
                keys.forEach(k => {
                    v = v[k];
                });
            }

            return (typeof v !== 'undefined' && v !== null) ? v : '';
        });
    }
}

const Template = {
    skeleton: `
        <div class="roolith__editor" id="{editorId}">
            <div class="roolith__editor__toolbar">
                <ul class="roolith__editor__toolbar__list"></ul>
            </div>
            <div class="roolith__editor__content" contenteditable="true" spellcheck="true"></div>
        </div>
    `,

    button: `<li class="roolith__editor__toolbar__list__item" data-command="{button}"><button>{icon}</button></li>`,

    separator: `<li class="roolith__editor__toolbar__list__item roolith__editor__toolbar__list__item--separator">-</li>`,

    headings: `
        <li class="roolith__editor__toolbar__list__item roolith__editor__toolbar__list__item--dropdown">
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
    `,

    modal: `
        <div class="roolith__editor__modal">
            <div class="roolith__editor__modal__content">
                <div class="roolith__editor__modal__content__header">{title} <button class="roolith__editor__modal__close"></button></div>
                <div class="roolith__editor__modal__content__body">
                    {content}
                </div>
                <div class="roolith__editor__modal__content__footer">
                    <button class="roolith__editor__modal__cta">Insert</button>
                </div>
            </div>
        </div>
    `,

    image: `
        <form class="roolith__editor__modal__form" data-command="image">
            <div class="roolith__editor__modal__form__item">
                <label for="roolithModalImageTitle" class="roolith__editor__modal__form__item__label">Title</label>
                <input type="text" id="roolithModalImageTitle" name="roolithModalImageTitle" class="roolith__editor__modal__form__item__field">
            </div>
            <div class="roolith__editor__modal__form__item">
                <label for="roolithModalImageUrl" class="roolith__editor__modal__form__item__label">URL</label>
                <input type="text" id="roolithModalImageUrl" name="roolithModalImageUrl" class="roolith__editor__modal__form__item__field">
            </div>
        </form>
    `,

    video: `
        <form class="roolith__editor__modal__form" data-command="video">
            <div class="roolith__editor__modal__form__item">
                <textarea type="text" rows="5" id="roolithModalEmbededCode" name="roolithModalEmbededCode" class="roolith__editor__modal__form__item__field"></textarea>
            </div>
        </form>
    `
};

class EventHandler {
    constructor(renderer, modal, observer, settings) {
        this.renderer = renderer;
        this.modal = modal;
        this.observer = observer;
        this.settings = settings;

        this.editor = document.getElementById(this.renderer.editorId);
        this.editorBody = this.editor.querySelector('.roolith__editor__content');
    }

    register() {
        this.registerToolbarEvents();
        this.registerDocumentClick();
        this.registerContentChangeEvent();
    }

    unregister() {
        this.unregisterToolbarEvents();
        this.unregisterDocumentClick();
        this.unregisterContentChangeEvent();
    }

    registerToolbarEvents() {
        this.editor.querySelectorAll('.roolith__editor__toolbar__list__item, .roolith__editor__toolbar__list__item__dropdown__list__item').forEach(button => {
            button.addEventListener('click', this.toolbarButtonClickEvent.bind(this, button));
        });
    }

    unregisterToolbarEvents() {
        this.editor.querySelectorAll('.roolith__editor__toolbar__list__item, .roolith__editor__toolbar__list__item__dropdown__list__item').forEach(button => {
            button.removeEventListener('click', this.toolbarButtonClickEvent.bind(this, button));
        });
    }

    toolbarButtonClickEvent(button, event) {
        let commandName = button.getAttribute('data-command');

        if (this.settings.registerCustomToolbar) {
            const customToolbar = this.settings.registerCustomToolbar.find(customToolbar => customToolbar.name === commandName);
            if (customToolbar) {
                customToolbar.clickHandler.call(this, event, button);
                return;
            }
        }

        let showUi = false;
        let value = null;

        if (!commandName) {
            const dropdown = button.classList.contains('roolith__editor__toolbar__list__item--dropdown');

            if (dropdown) {
                event.stopPropagation();
                button.classList.toggle('is--show');
            }

            return;
        }

        if (commandName.indexOf(':') > -1) {
            const arr = commandName.split(':');
            commandName = arr[0];
            value = arr[1];
        }

        if (commandName === 'createLink') {
            this.executeLinkCommand(event);
        } else if (commandName === 'image') {
            this.executeImageCommand(event);
        } else if (commandName === 'video') {
            this.executeVideoCommand(event);
        } else if (commandName === 'videoUrl') {
            this.executeVideoUrlCommand(event);
        } else {
            this.executeCommand(event, commandName, showUi, value);
        }
    }

    executeLinkCommand(event) {
        const linkUrl = prompt('Enter a URL:', 'http://');

        if (!linkUrl || linkUrl === 'http://') {
            return false;
        }

        const selectionText = Helper.getSelection();

        if (selectionText) {
            let value = `<a href="${linkUrl}">${selectionText}</a>`;

            if (this.settings.linkType) {
                value = `<a href="${linkUrl}" target="${this.settings.linkType}">${selectionText}</a>`;
            }

            this.executeCommand(event, 'insertHTML', false, value);
        }
    }

    executeVideoUrlCommand(event) {
        const url = prompt('Enter video URL:', 'http://');
        const html = `
            <video width="320" height="240" controls>
                <source src="${url}">
                Your browser does not support the video tag.
            </video>
        `;

        this.executeCommand(event, 'insertHTML', false, html);
    }

    executeImageCommand(event) {
        event.preventDefault();

        this.modal.open({
            title: 'Insert image',
            content: Template.image,
        });
    }

    executeVideoCommand(event) {
        event.preventDefault();

        this.modal.open({
            title: 'Insert embed code',
            content: Template.video,
        });
    }

    executeCommand(event, commandName, showUi = false, value = null) {
        this.editorBody.focus();
        
        try {
            event.preventDefault();
            document.execCommand(commandName, showUi, value);

            if (commandName === 'removeFormat') {
                document.execCommand('formatBlock', false, 'div');
            }
        } catch (e) {
            console.log(e);
        }
    }

    registerDocumentClick() {
        document.addEventListener('click', this.closeDropdown.bind(this));
    }

    unregisterDocumentClick() {
        document.removeEventListener('click', this.closeDropdown.bind(this));
    }

    closeDropdown() {
        const dropdown = document.querySelector('.roolith__editor__toolbar__list__item--dropdown');
            
        if (dropdown) {
            dropdown.classList.remove('is--show');
        }
    }

    registerContentChangeEvent() {
        this.editorBody.addEventListener('input', this.onChangeEditorBody.bind(this));
    }

    unregisterContentChangeEvent() {
        this.editorBody.removeEventListener('input', this.onChangeEditorBody.bind(this));
    }

    onChangeEditorBody(event) {
        const value = event.target.innerHTML;

        this.renderer.selector.value = value;
        this.observer.dispatch('change', value);
    }
}

const ToolbarIcons = {
    'bold': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bold"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>',

    'italic': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-italic"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>',

    'insertUnorderedList': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>',

    'insertOrderedList': '<svg viewBox="0 0 24 24"><path d="M10 17h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 010-2zm0-6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 010-2zm0-6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 110-2zM6 4v3.5c0 .3-.2.5-.5.5a.5.5 0 01-.5-.5V5h-.5a.5.5 0 010-1H6zm-1 8.8l.2.2h1.3c.3 0 .5.2.5.5s-.2.5-.5.5H4.9a1 1 0 01-.9-1V13c0-.4.3-.8.6-1l1.2-.4.2-.3a.2.2 0 00-.2-.2H4.5a.5.5 0 01-.5-.5c0-.3.2-.5.5-.5h1.6c.5 0 .9.4.9 1v.1c0 .4-.3.8-.6 1l-1.2.4-.2.3zM7 17v2c0 .6-.4 1-1 1H4.5a.5.5 0 010-1h1.2c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3H4.4a.4.4 0 110-.8h1.3c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3H4.5a.5.5 0 110-1H6c.6 0 1 .4 1 1z" fill-rule="evenodd"></path></svg>',

    'removeFormat': '<svg viewBox="0 0 24 24"><path d="M13.2 6a1 1 0 010 .2l-2.6 10a1 1 0 01-1 .8h-.2a.8.8 0 01-.8-1l2.6-10H8a1 1 0 110-2h9a1 1 0 010 2h-3.8zM5 18h7a1 1 0 010 2H5a1 1 0 010-2zm13 1.5L16.5 18 15 19.5a.7.7 0 01-1-1l1.5-1.5-1.5-1.5a.7.7 0 011-1l1.5 1.5 1.5-1.5a.7.7 0 011 1L17.5 17l1.5 1.5a.7.7 0 01-1 1z" fill-rule="evenodd"></path></svg>',

    'justifyLeft': '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-align-left"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>',

    'justifyCenter': '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-align-center"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>',

    'justifyRight': '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-align-right"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>',

    'justifyFull': '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-align-justify"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>',

    'createLink': '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',

    'underline': '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-underline"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line></svg>',

    'subscript': '<svg viewBox="0 0 24 24"><path d="M10.4 10l4.6 4.6-1.4 1.4L9 11.4 4.4 16 3 14.6 7.6 10 3 5.4 4.4 4 9 8.6 13.6 4 15 5.4 10.4 10zM21 19h-5v-1l1-.8 1.7-1.6c.3-.4.5-.8.5-1.2 0-.3 0-.6-.2-.7-.2-.2-.5-.3-.9-.3a2 2 0 00-.8.2l-.7.3-.4-1.1 1-.6 1.2-.2c.8 0 1.4.3 1.8.7.4.4.6.9.6 1.5s-.2 1.1-.5 1.6a8 8 0 01-1.3 1.3l-.6.6h2.6V19z" fill-rule="nonzero"></path></svg>',

    'superscript': '<svg viewBox="0 0 24 24"><path d="M15 9.4L10.4 14l4.6 4.6-1.4 1.4L9 15.4 4.4 20 3 18.6 7.6 14 3 9.4 4.4 8 9 12.6 13.6 8 15 9.4zm5.9 1.6h-5v-1l1-.8 1.7-1.6c.3-.5.5-.9.5-1.3 0-.3 0-.5-.2-.7-.2-.2-.5-.3-.9-.3l-.8.2-.7.4-.4-1.2c.2-.2.5-.4 1-.5.3-.2.8-.2 1.2-.2.8 0 1.4.2 1.8.6.4.4.6 1 .6 1.6 0 .5-.2 1-.5 1.5l-1.3 1.4-.6.5h2.6V11z" fill-rule="nonzero"></path></svg>',

    'formatBlock:blockquote': '<svg viewBox="0 0 20 20"><path d="M3 10.423a6.5 6.5 0 0 1 6.056-6.408l.038.67C6.448 5.423 5.354 7.663 5.22 10H9c.552 0 .5.432.5.986v4.511c0 .554-.448.503-1 .503h-5c-.552 0-.5-.449-.5-1.003v-4.574zm8 0a6.5 6.5 0 0 1 6.056-6.408l.038.67c-2.646.739-3.74 2.979-3.873 5.315H17c.552 0 .5.432.5.986v4.511c0 .554-.448.503-1 .503h-5c-.552 0-.5-.449-.5-1.003v-4.574z"></path></svg>',

    'formatBlock:pre': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-code"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',

    'image': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-image"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',

    'video': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-youtube"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>',

    'indent': '<svg viewBox="0 0 20 20"><path d="M2 3.75c0 .414.336.75.75.75h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm5 6c0 .414.336.75.75.75h9.5a.75.75 0 1 0 0-1.5h-9.5a.75.75 0 0 0-.75.75zM2.75 16.5h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 1 0 0 1.5zM1.632 6.95 5.02 9.358a.4.4 0 0 1-.013.661l-3.39 2.207A.4.4 0 0 1 1 11.892V7.275a.4.4 0 0 1 .632-.326z"></path></svg>',

    'videoUrl': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-video"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>'
};

class Renderer {
    constructor(selector, instanceId, settings) {
        this.selector = selector;
        this.instanceId = instanceId;
        this.settings = settings;

        this.buttons = ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList', 'removeFormat'];
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

        this.applyStyles();
    }

    generateSkeleton() {
        this.selector.insertAdjacentHTML('afterend', Helper.parseTemplate(Template.skeleton, { editorId: this.editorId }));
    }

    generateToolbar() {
        if (this.settings && this.settings.toolbar) {
            this.buttons = this.settings.toolbar;
        }

        const editorElem = document.getElementById(this.editorId);
        const toolbarContainerElem = editorElem.querySelector(`.roolith__editor__toolbar__list`);
        let toolbarHtml = '';

        this.buttons.forEach(button => {
            const icon = this.getToolbarIcon(button) || null;

            if (icon) {
                toolbarHtml += Helper.parseTemplate(Template.button, { button, icon });
            } else if (button === '-') {
                toolbarHtml += Template.separator;
            } else if (button === 'headings') {
                toolbarHtml += Template.headings;
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

    getToolbarIcon(button) {
        if (ToolbarIcons[button]) {
            return ToolbarIcons[button];
        } else if (this.settings.registerCustomToolbar) {
            const customToolbar = this.settings.registerCustomToolbar.find(customToolbar => customToolbar.name === button);
            if (customToolbar) {
                return customToolbar.icon;
            }
        }

        return null;
    }

    applyStyles() {
        const editorContainer = document.getElementById(this.editorId);
        const editorBody = editorContainer.querySelector('.roolith__editor__content');
        const { width, height } = this.settings;

        if (width) {
            editorContainer.style.width = width;
        }

        if (height) {
            editorBody.style.minHeight = height;
        }
    }
}

class Modal {
    constructor(renderer, observer) {
        this.renderer = renderer;
        this.observer = observer;

        this.range = null;
        this.sel = null;
        this.editor = document.getElementById(this.renderer.editorId);
        this.editorBody = this.editor.querySelector('.roolith__editor__content');
        this.watchKeyboard();
    }

    open(settings = { title: 'Untitled', content: '' }) {
        this.range = Helper.saveSelection();
        this.sel = Helper.getSelection();

        document.body.insertAdjacentHTML('afterend', Helper.parseTemplate(Template.modal, { title: settings.title, content: settings.content }));

        this.registerCloseEvent();
        this.registerInsertEvent();
    }

    close() {
        const modal = document.querySelector('.roolith__editor__modal');

        if (modal) {
            this.unregisterCloseEvent();
            this.unregisterInsertEvent();
            document.querySelector('.roolith__editor__modal').remove();

            if (this.range) {
                Helper.restoreSelection(this.range, this.sel);
            }
        }
    }

    registerCloseEvent() {
        document.querySelector('.roolith__editor__modal__close').addEventListener('click', this.close.bind(this));
    }

    unregisterCloseEvent() {
        document.querySelector('.roolith__editor__modal__close').removeEventListener('click', this.close.bind(this));
    }

    registerInsertEvent() {
        document.querySelector('.roolith__editor__modal__cta').addEventListener('click', this.insertContent.bind(this));
    }

    unregisterInsertEvent() {
        document.querySelector('.roolith__editor__modal__cta').removeEventListener('click', this.insertContent.bind(this));
    }

    insertContent() {
        const fields = document.querySelectorAll('.roolith__editor__modal__content .roolith__editor__modal__form__item__field');
        const commandName = document.querySelector('.roolith__editor__modal__content .roolith__editor__modal__form').getAttribute('data-command');
        this.close();

        if (fields) {
            const obj = {};
            obj['command'] = commandName;
            fields.forEach(field => {
                obj[field.getAttribute('name')] = field.value;
            });

            this.observer.dispatch('modalInsert', obj);
        }
    }

    setFocusToEditor(callback) {
        if (document.activeElement !== this.editorBody) {
            Helper.putCaretAtEnd(this.editorBody);
            
            if (callback) {
                callback.call(this, this.editorBody);
            }
        }
    }

    watchKeyboard() {
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }
}

class Observer {
    static events = [];

    static listen(name, callback) {
        if (!Observer.events[name]) {
            Observer.events[name] = [];
        }

        Observer.events[name].push(callback);
    }

    static listeners(eventNames = [], callback) {
        if (eventNames.length === 0) {
            return;
        }

        eventNames.forEach(name => {
            Observer.listen(name, callback);
        });
    }

    static dispatch(name, arg) {
        if (Observer.events[name]) {
            Observer.events[name].forEach(callback => {
                if (typeof arg !== 'undefined') {
                    callback.call(Observer, arg, name);
                } else {
                    callback.call(Observer, name);
                }
            });
        }
    }
}

class RoolithEditor {
    constructor(selector, settings = {}) {
        this.selector = selector;
        this.instanceId = Helper.generateInstanceId(15);
        this.settings = {...settings};
        this.renderer = null;
        this.eventHandler = null;
        this.modal = null;
        this.openModalCallback = null;
        this.observer = Observer;
        this.on = this.observer.listen.bind(this);

        this.init();
    }

    init() {
        this.renderer = new Renderer(this.selector, this.instanceId, this.settings);
        this.renderer.generate();
        this.modal = new Modal(this.renderer, this.observer);

        this.eventHandler = new EventHandler(this.renderer, this.modal, this.observer, this.settings);
        this.eventHandler.register();

        this.observeModalInsert();
    }

    insertContent(content = '') {
        this.closeModal();

        this.modal.setFocusToEditor();
        
        if (content && content.length > 0) {
            Helper.insertAtCaret(content);
            
            const editorBody = this.eventHandler.editorBody;
            const event = new Event('input');
            editorBody.dispatchEvent(event);
        }
    }

    openModal(title = '', content = '', callback) {
        this.modal.open({ title, content });

        if (callback) {
            this.openModalCallback = callback;
        }
    }

    closeModal() {
        this.modal.close();
    }

    change(callback = null) {
        if (callback) {
            callback.call(this);
        }
    }

    observeModalInsert() {
        this.observer.listen('modalInsert', value => {
            if (value.command === 'image' && value.roolithModalImageUrl?.length > 0) {
                const html = `<img src="${value.roolithModalImageUrl}" title="${value.roolithModalImageTitle}">`;
                this.insertContent(html);
            } else if (value.command === 'video' && value.roolithModalEmbededCode?.length > 0) {
                this.insertContent(value.roolithModalEmbededCode);
            } else if (this.openModalCallback) {
                this.openModalCallback.call(this, value);
                this.openModalCallback = null;
            }
        });
    }
}

window.RoolithEditor = RoolithEditor;

export { RoolithEditor };

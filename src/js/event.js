import { Helper } from "./helper";
import { Template } from "./template";

export class Event {
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
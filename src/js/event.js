import { Helper } from "./helper";
import { Template } from "./template";

export class Event {
    constructor(renderer, modal, settings) {
        this.renderer = renderer;
        this.settings = settings;

        this.editor = document.getElementById(this.renderer.editorId);
        this.editorBody = this.editor.querySelector('.roolith__editor__content');
        this.modal = modal;
    }

    register() {
        this.registerToolbarEvents();
    }

    unregister() {
        this.unregisterToolbarEvents();
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
        console.log(button);

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
            const type = button.getAttribute('data-type');
            if (type === 'dropdown') {
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
}
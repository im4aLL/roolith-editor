import { Helper } from "./helper";
import { Template } from "./template";
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
}
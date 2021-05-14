import { Helper } from "./helper";
import { Template } from "./template";
var EventHandler = /** @class */ (function () {
    function EventHandler(renderer, modal, observer, settings) {
        this.renderer = renderer;
        this.modal = modal;
        this.observer = observer;
        this.settings = settings;
        this.editor = document.getElementById(this.renderer.editorId);
        this.editorBody = this.editor.querySelector('.roolith__editor__content');
    }
    EventHandler.prototype.register = function () {
        this.registerToolbarEvents();
        this.registerDocumentClick();
        this.registerContentChangeEvent();
    };
    EventHandler.prototype.unregister = function () {
        this.unregisterToolbarEvents();
        this.unregisterDocumentClick();
        this.unregisterContentChangeEvent();
    };
    EventHandler.prototype.registerToolbarEvents = function () {
        var _this = this;
        this.editor.querySelectorAll('.roolith__editor__toolbar__list__item, .roolith__editor__toolbar__list__item__dropdown__list__item').forEach(function (button) {
            button.addEventListener('click', _this.toolbarButtonClickEvent.bind(_this, button));
        });
    };
    EventHandler.prototype.unregisterToolbarEvents = function () {
        var _this = this;
        this.editor.querySelectorAll('.roolith__editor__toolbar__list__item, .roolith__editor__toolbar__list__item__dropdown__list__item').forEach(function (button) {
            button.removeEventListener('click', _this.toolbarButtonClickEvent.bind(_this, button));
        });
    };
    EventHandler.prototype.toolbarButtonClickEvent = function (button, event) {
        var commandName = button.getAttribute('data-command');
        if (this.settings.registerCustomToolbar) {
            var customToolbar = this.settings.registerCustomToolbar.find(function (customToolbar) { return customToolbar.name === commandName; });
            if (customToolbar) {
                customToolbar.clickHandler.call(this, event, button);
                return;
            }
        }
        var showUi = false;
        var value = null;
        if (!commandName) {
            var dropdown = button.classList.contains('roolith__editor__toolbar__list__item--dropdown');
            if (dropdown) {
                event.stopPropagation();
                button.classList.toggle('is--show');
            }
            return;
        }
        if (commandName.indexOf(':') > -1) {
            var arr = commandName.split(':');
            commandName = arr[0];
            value = arr[1];
        }
        if (commandName === 'createLink') {
            this.executeLinkCommand(event);
        }
        else if (commandName === 'image') {
            this.executeImageCommand(event);
        }
        else if (commandName === 'video') {
            this.executeVideoCommand(event);
        }
        else if (commandName === 'videoUrl') {
            this.executeVideoUrlCommand(event);
        }
        else {
            this.executeCommand(event, commandName, showUi, value);
        }
    };
    EventHandler.prototype.executeLinkCommand = function (event) {
        var linkUrl = prompt('Enter a URL:', 'http://');
        if (!linkUrl || linkUrl === 'http://') {
            return false;
        }
        var selectionText = Helper.getSelection();
        if (selectionText) {
            var value = "<a href=\"" + linkUrl + "\">" + selectionText + "</a>";
            if (this.settings.linkType) {
                value = "<a href=\"" + linkUrl + "\" target=\"" + this.settings.linkType + "\">" + selectionText + "</a>";
            }
            this.executeCommand(event, 'insertHTML', false, value);
        }
    };
    EventHandler.prototype.executeVideoUrlCommand = function (event) {
        var url = prompt('Enter video URL:', 'http://');
        var html = "\n            <video width=\"320\" height=\"240\" controls>\n                <source src=\"" + url + "\">\n                Your browser does not support the video tag.\n            </video>\n        ";
        this.executeCommand(event, 'insertHTML', false, html);
    };
    EventHandler.prototype.executeImageCommand = function (event) {
        event.preventDefault();
        this.modal.open({
            title: 'Insert image',
            content: Template.image,
        });
    };
    EventHandler.prototype.executeVideoCommand = function (event) {
        event.preventDefault();
        this.modal.open({
            title: 'Insert embed code',
            content: Template.video,
        });
    };
    EventHandler.prototype.executeCommand = function (event, commandName, showUi, value) {
        if (showUi === void 0) { showUi = false; }
        if (value === void 0) { value = null; }
        this.editorBody.focus();
        try {
            event.preventDefault();
            document.execCommand(commandName, showUi, value);
            if (commandName === 'removeFormat') {
                document.execCommand('formatBlock', false, 'div');
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    EventHandler.prototype.registerDocumentClick = function () {
        document.addEventListener('click', this.closeDropdown.bind(this));
    };
    EventHandler.prototype.unregisterDocumentClick = function () {
        document.removeEventListener('click', this.closeDropdown.bind(this));
    };
    EventHandler.prototype.closeDropdown = function () {
        var dropdown = document.querySelector('.roolith__editor__toolbar__list__item--dropdown');
        if (dropdown) {
            dropdown.classList.remove('is--show');
        }
    };
    EventHandler.prototype.registerContentChangeEvent = function () {
        this.editorBody.addEventListener('input', this.onChangeEditorBody.bind(this));
    };
    EventHandler.prototype.unregisterContentChangeEvent = function () {
        this.editorBody.removeEventListener('input', this.onChangeEditorBody.bind(this));
    };
    EventHandler.prototype.onChangeEditorBody = function (event) {
        var value = event.target.innerHTML;
        this.renderer.selector.value = value;
        this.observer.dispatch('change', value);
    };
    return EventHandler;
}());
export { EventHandler };

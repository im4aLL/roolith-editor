"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = void 0;
var helper_1 = require("./helper");
var template_1 = require("./template");
var Modal = /** @class */ (function () {
    function Modal(renderer, observer) {
        this.renderer = renderer;
        this.observer = observer;
        this.range = null;
        this.sel = null;
        this.editor = document.getElementById(this.renderer.editorId);
        this.editorBody = this.editor.querySelector('.roolith__editor__content');
        this.watchKeyboard();
    }
    Modal.prototype.open = function (settings) {
        if (settings === void 0) { settings = { title: 'Untitled', content: '' }; }
        this.range = helper_1.Helper.saveSelection();
        this.sel = helper_1.Helper.getSelection();
        document.body.insertAdjacentHTML('afterend', helper_1.Helper.parseTemplate(template_1.Template.modal, { title: settings.title, content: settings.content }));
        this.registerCloseEvent();
        this.registerInsertEvent();
    };
    Modal.prototype.close = function () {
        var modal = document.querySelector('.roolith__editor__modal');
        if (modal) {
            this.unregisterCloseEvent();
            this.unregisterInsertEvent();
            document.querySelector('.roolith__editor__modal').remove();
            if (this.range) {
                helper_1.Helper.restoreSelection(this.range, this.sel);
            }
        }
    };
    Modal.prototype.registerCloseEvent = function () {
        document.querySelector('.roolith__editor__modal__close').addEventListener('click', this.close.bind(this));
    };
    Modal.prototype.unregisterCloseEvent = function () {
        document.querySelector('.roolith__editor__modal__close').removeEventListener('click', this.close.bind(this));
    };
    Modal.prototype.registerInsertEvent = function () {
        document.querySelector('.roolith__editor__modal__cta').addEventListener('click', this.insertContent.bind(this));
    };
    Modal.prototype.unregisterInsertEvent = function () {
        document.querySelector('.roolith__editor__modal__cta').removeEventListener('click', this.insertContent.bind(this));
    };
    Modal.prototype.insertContent = function () {
        var fields = document.querySelectorAll('.roolith__editor__modal__content .roolith__editor__modal__form__item__field');
        var commandName = document.querySelector('.roolith__editor__modal__content .roolith__editor__modal__form').getAttribute('data-command');
        this.close();
        if (fields) {
            var obj_1 = {};
            obj_1['command'] = commandName;
            fields.forEach(function (field) {
                obj_1[field.getAttribute('name')] = field.value;
            });
            this.observer.dispatch('modalInsert', obj_1);
        }
    };
    Modal.prototype.setFocusToEditor = function (callback) {
        if (document.activeElement !== this.editorBody) {
            helper_1.Helper.putCaretAtEnd(this.editorBody);
            if (callback) {
                callback.call(this, this.editorBody);
            }
        }
    };
    Modal.prototype.watchKeyboard = function () {
        var _this = this;
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                _this.close();
            }
        });
    };
    return Modal;
}());
exports.Modal = Modal;

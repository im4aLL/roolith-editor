var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { EventHandler } from "./eventHandler";
import { Helper } from "./helper";
import { Renderer } from "./renderer";
import { Modal } from "./modal";
import { Observer } from "./observer";
var RoolithEditor = /** @class */ (function () {
    function RoolithEditor(selector, settings) {
        if (settings === void 0) { settings = {}; }
        this.selector = selector;
        this.instanceId = Helper.generateInstanceId(15);
        this.settings = __assign({}, settings);
        this.renderer = null;
        this.eventHandler = null;
        this.modal = null;
        this.openModalCallback = null;
        this.observer = Observer;
        this.on = this.observer.listen.bind(this);
        this.init();
    }
    RoolithEditor.prototype.init = function () {
        this.renderer = new Renderer(this.selector, this.instanceId, this.settings);
        this.renderer.generate();
        this.modal = new Modal(this.renderer, this.observer);
        this.eventHandler = new EventHandler(this.renderer, this.modal, this.observer, this.settings);
        this.eventHandler.register();
        this.observeModalInsert();
    };
    RoolithEditor.prototype.insertContent = function (content) {
        if (content === void 0) { content = ''; }
        this.closeModal();
        this.modal.setFocusToEditor();
        if (content && content.length > 0) {
            Helper.insertAtCaret(content);
            var editorBody = this.eventHandler.editorBody;
            var event_1 = new Event('input');
            editorBody.dispatchEvent(event_1);
        }
    };
    RoolithEditor.prototype.openModal = function (title, content, callback) {
        if (title === void 0) { title = ''; }
        if (content === void 0) { content = ''; }
        this.modal.open({ title: title, content: content });
        if (callback) {
            this.openModalCallback = callback;
        }
    };
    RoolithEditor.prototype.closeModal = function () {
        this.modal.close();
    };
    RoolithEditor.prototype.change = function (callback) {
        if (callback === void 0) { callback = null; }
        if (callback) {
            callback.call(this);
        }
    };
    RoolithEditor.prototype.observeModalInsert = function () {
        var _this = this;
        this.observer.listen('modalInsert', function (value) {
            var _a, _b;
            if (value.command === 'image' && ((_a = value.roolithModalImageUrl) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                var html = "<img src=\"" + value.roolithModalImageUrl + "\" title=\"" + value.roolithModalImageTitle + "\">";
                _this.insertContent(html);
            }
            else if (value.command === 'video' && ((_b = value.roolithModalEmbededCode) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                _this.insertContent(value.roolithModalEmbededCode);
            }
            else if (_this.openModalCallback) {
                _this.openModalCallback.call(_this, value);
                _this.openModalCallback = null;
            }
        });
    };
    return RoolithEditor;
}());
export { RoolithEditor };
var global = window || global;
global.RoolithEditor = RoolithEditor;

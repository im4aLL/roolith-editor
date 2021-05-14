"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
var helper_1 = require("./helper");
var template_1 = require("./template");
var toolbar_1 = require("./toolbar");
var Renderer = /** @class */ (function () {
    function Renderer(selector, instanceId, settings) {
        this.selector = selector;
        this.instanceId = instanceId;
        this.settings = settings;
        this.buttons = ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList', 'removeFormat'];
        this.editorId = "roolith-editor-" + this.instanceId;
    }
    Renderer.prototype.getButtons = function () {
        return this.buttons;
    };
    Renderer.prototype.getEditorId = function () {
        return this.editorId;
    };
    Renderer.prototype.generate = function () {
        this.hideSelector();
        this.attachInstanceClass();
        this.generateSkeleton();
        this.generateToolbar();
        this.applyStyles();
    };
    Renderer.prototype.generateSkeleton = function () {
        this.selector.insertAdjacentHTML('afterend', helper_1.Helper.parseTemplate(template_1.Template.skeleton, { editorId: this.editorId }));
    };
    Renderer.prototype.generateToolbar = function () {
        var _this = this;
        if (this.settings && this.settings.toolbar) {
            this.buttons = this.settings.toolbar;
        }
        var editorElem = document.getElementById(this.editorId);
        var toolbarContainerElem = editorElem.querySelector(".roolith__editor__toolbar__list");
        var toolbarHtml = '';
        this.buttons.forEach(function (button) {
            var icon = _this.getToolbarIcon(button) || null;
            if (icon) {
                toolbarHtml += helper_1.Helper.parseTemplate(template_1.Template.button, { button: button, icon: icon });
            }
            else if (button === '-') {
                toolbarHtml += template_1.Template.separator;
            }
            else if (button === 'headings') {
                toolbarHtml += template_1.Template.headings;
            }
        });
        toolbarContainerElem.innerHTML = toolbarHtml;
    };
    Renderer.prototype.hideSelector = function () {
        this.selector.style.display = 'none';
    };
    Renderer.prototype.attachInstanceClass = function () {
        this.selector.classList.add("roolith-editor-selector-" + this.instanceId);
    };
    Renderer.prototype.getToolbarIcon = function (button) {
        if (toolbar_1.ToolbarIcons[button]) {
            return toolbar_1.ToolbarIcons[button];
        }
        else if (this.settings.registerCustomToolbar) {
            var customToolbar = this.settings.registerCustomToolbar.find(function (customToolbar) { return customToolbar.name === button; });
            if (customToolbar) {
                return customToolbar.icon;
            }
        }
        return null;
    };
    Renderer.prototype.applyStyles = function () {
        var editorContainer = document.getElementById(this.editorId);
        var editorBody = editorContainer.querySelector('.roolith__editor__content');
        var _a = this.settings, width = _a.width, height = _a.height;
        if (width) {
            editorContainer.style.width = width;
        }
        if (height) {
            editorBody.style.minHeight = height;
        }
    };
    return Renderer;
}());
exports.Renderer = Renderer;

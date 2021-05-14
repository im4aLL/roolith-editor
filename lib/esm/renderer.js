import { Helper } from "./helper";
import { Template } from "./template";
import { ToolbarIcons } from "./toolbar";
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
        this.selector.insertAdjacentHTML('afterend', Helper.parseTemplate(Template.skeleton, { editorId: this.editorId }));
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
                toolbarHtml += Helper.parseTemplate(Template.button, { button: button, icon: icon });
            }
            else if (button === '-') {
                toolbarHtml += Template.separator;
            }
            else if (button === 'headings') {
                toolbarHtml += Template.headings;
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
        if (ToolbarIcons[button]) {
            return ToolbarIcons[button];
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
export { Renderer };

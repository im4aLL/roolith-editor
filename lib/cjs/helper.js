"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
var Helper = /** @class */ (function () {
    function Helper() {
    }
    Helper.generateInstanceId = function (length) {
        var result = [];
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
        }
        return result.join('');
    };
    Helper.saveSelection = function () {
        var sel = Helper.getSelection();
        if (sel && sel.getRangeAt && sel.rangeCount) {
            return sel.getRangeAt(0);
        }
        return false;
    };
    Helper.restoreSelection = function (range, sel) {
        if (range && sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };
    Helper.getSelection = function () {
        if (window.getSelection) {
            var selection = window.getSelection();
            if (selection.rangeCount) {
                return selection;
            }
        }
        return false;
    };
    Helper.insertAtCaret = function (html) {
        var selection = Helper.getSelection();
        var range;
        if (!selection) {
            return false;
        }
        if (selection.getRangeAt && selection.rangeCount) {
            range = selection.getRangeAt(0);
            range.deleteContents();
            var el = document.createElement('div');
            el.innerHTML = html;
            var frag = document.createDocumentFragment();
            var node = void 0;
            var lastNode = void 0;
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
    };
    Helper.putCaretAtEnd = function (contentEditableElement) {
        var range;
        var selection;
        range = document.createRange();
        range.selectNodeContents(contentEditableElement);
        range.collapse(false);
        selection = Helper.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    };
    Helper.parseTemplate = function (template, data) {
        return template.replace(/\{([\w\.]*)\}/g, function (str, key) {
            var keys = key.split('.');
            var v = data[keys.shift()];
            if (keys.length > 0) {
                keys.forEach(function (k) {
                    v = v[k];
                });
            }
            return (typeof v !== 'undefined' && v !== null) ? v : '';
        });
    };
    return Helper;
}());
exports.Helper = Helper;

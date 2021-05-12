export class Helper {
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
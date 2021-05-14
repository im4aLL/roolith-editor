export class Helper {
    static generateInstanceId(length: any): string;
    static saveSelection(): false | Range;
    static restoreSelection(range: any, sel: any): void;
    static getSelection(): false | Selection | null;
    static insertAtCaret(html: any): false | undefined;
    static putCaretAtEnd(contentEditableElement: any): void;
    static parseTemplate(template: any, data: any): any;
}

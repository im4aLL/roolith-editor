import { Helper } from "./helper";

export class Modal {
    constructor() {
        this.range = null;
    }

    open() {
        this.range = Helper.saveSelection();

        document.body.insertAdjacentHTML('afterend', `
            <div class="roolith__editor__modal">
                <div class="roolith__editor__modal__content">
                    <div class="roolith__editor__modal__content__header">Paste code here <button class="roolith__editor__modal__close"></button></div>
                    <div class="roolith__editor__modal__content__body">
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores, necessitatibus. Aut unde, quisquam debitis optio molestias beatae tempore, repudiandae excepturi ea quam, eveniet officiis. Quo possimus voluptatem assumenda ab repellendus.</p>
                    </div>
                </div>
            </div>
        `);

        this.registerCloseEvent();
    }

    close() {
        this.unregisterCloseEvent();
        document.querySelector('.roolith__editor__modal').remove();

        if (this.range) {
            Helper.restoreSelection(this.range);
        }
    }

    registerCloseEvent() {
        document.querySelector('.roolith__editor__modal__close').addEventListener('click', this.close.bind(this));
    }

    unregisterCloseEvent() {
        document.querySelector('.roolith__editor__modal__close').removeEventListener('click', this.close.bind(this));
    }
}
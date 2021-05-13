export const Template = {
    skeleton: `
        <div class="roolith__editor" id="{editorId}">
            <div class="roolith__editor__toolbar">
                <ul class="roolith__editor__toolbar__list"></ul>
            </div>
            <div class="roolith__editor__content" contenteditable="true" spellcheck="true"></div>
        </div>
    `,

    button: `<li class="roolith__editor__toolbar__list__item" data-command="{button}"><button>{icon}</button></li>`,

    separator: `<li class="roolith__editor__toolbar__list__item roolith__editor__toolbar__list__item--separator">-</li>`,

    headings: `
        <li class="roolith__editor__toolbar__list__item roolith__editor__toolbar__list__item--dropdown">
            <div class="roolith__editor__toolbar__list__item__dropdown">
                <div class="roolith__editor__toolbar__list__item__dropdown__header">Heading</div>
                <ul class="roolith__editor__toolbar__list__item__dropdown__list">
                    <li class="roolith__editor__toolbar__list__item__dropdown__list__item is--h1" data-command="formatBlock:h1"><button>Heading 1</button></li>
                    <li class="roolith__editor__toolbar__list__item__dropdown__list__item is--h2" data-command="formatBlock:h2"><button>Heading 2</button></li>
                    <li class="roolith__editor__toolbar__list__item__dropdown__list__item is--h3" data-command="formatBlock:h3"><button>Heading 3</button></li>
                    <li class="roolith__editor__toolbar__list__item__dropdown__list__item is--h4" data-command="formatBlock:h4"><button>Heading 4</button></li>
                    <li class="roolith__editor__toolbar__list__item__dropdown__list__item is--h5" data-command="formatBlock:h5"><button>Heading 5</button></li>
                    <li class="roolith__editor__toolbar__list__item__dropdown__list__item is--h6" data-command="formatBlock:h6"><button>Heading 6</button></li>
                </ul>
            </div>
        </li>
    `,

    modal: `
        <div class="roolith__editor__modal">
            <div class="roolith__editor__modal__content">
                <div class="roolith__editor__modal__content__header">{title} <button class="roolith__editor__modal__close"></button></div>
                <div class="roolith__editor__modal__content__body">
                    {content}
                </div>
                <div class="roolith__editor__modal__content__footer">
                    <button class="roolith__editor__modal__cta">Insert</button>
                </div>
            </div>
        </div>
    `,

    image: `
        <form class="roolith__editor__modal__form" data-command="image">
            <div class="roolith__editor__modal__form__item">
                <label for="roolithModalImageTitle" class="roolith__editor__modal__form__item__label">Title</label>
                <input type="text" id="roolithModalImageTitle" name="roolithModalImageTitle" class="roolith__editor__modal__form__item__field">
            </div>
            <div class="roolith__editor__modal__form__item">
                <label for="roolithModalImageUrl" class="roolith__editor__modal__form__item__label">URL</label>
                <input type="text" id="roolithModalImageUrl" name="roolithModalImageUrl" class="roolith__editor__modal__form__item__field">
            </div>
        </form>
    `,

    video: `
        <form class="roolith__editor__modal__form" data-command="video">
            <div class="roolith__editor__modal__form__item">
                <textarea type="text" rows="5" id="roolithModalEmbededCode" name="roolithModalEmbededCode" class="roolith__editor__modal__form__item__field"></textarea>
            </div>
        </form>
    `
}
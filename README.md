# roolith-editor
A basic es6 rich text editor (typescript supported)

![roolith editor demo](https://raw.githubusercontent.com/im4aLL/roolith-editor/master/roolith-editor.png)

### Live demo
[http://habibhadi.com/lab/roolith-editor/](http://habibhadi.com/lab/roolith-editor/)

## Usage

```html
<textarea id="editor"></textarea>
```

```js
import { RoolithEditor } from '@im4all/editor';

new RoolithEditor(document.getElementById('editor'));
```

## Installation

```
npm install @im4all/editor --save
```

Add `style.scss` to project and import RoolithEditor from package. Check out demo folder for more details or you can use compiled version for non es6 project. To do that clone the repo and run `npm run build` and it will generate dist folder with minified css and js file.

### watch for changes

```js
const editor = new RoolithEditor(document.getElementById('editor'));

editor.on('change', value => {
    console.log(value);
});
```

### Customize toolbar

```js
const editor = new RoolithEditor(document.getElementById('editor'), {
    toolbar: [
        'bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList', 'removeFormat', '-', 
        'indent', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', '-',
        'headings', 'createLink', 'subscript', 'superscript', 'formatBlock:blockquote', 'formatBlock:pre', '-',
        'image', 'video', 'videoUrl'
    ],
    linkType: '_blank',
    width: '100%',
    height: '50vh'
});

editor.on('change', value => {
    console.log(value);
});
```

### Custom toolbar
```js
const editor = new RoolithEditor(document.getElementById('editor'), {
    registerCustomToolbar: [
        {
            name: 'custom', 
            icon: `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-help-circle"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            `,
            clickHandler: (event, button) => {
                editor.openModal('Test', `
                    <form class="roolith__editor__modal__form" data-command="custom">
                        <div class="roolith__editor__modal__form__item">
                            <textarea type="text" rows="5" name="something" class="roolith__editor__modal__form__item__field"></textarea>
                        </div>
                    </form>
                `, value => {
                    if (value.command === 'custom') {
                        console.log(value);
                        editor.insertContent(value.something);
                    }
                });
            }
        }
    ],
    toolbar: [
        'bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList', 'removeFormat', '-', 
        'indent', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', '-',
        'headings', 'createLink', 'subscript', 'superscript', 'formatBlock:blockquote', 'formatBlock:pre', '-',
        'image', 'video', 'videoUrl', 'custom',
    ],
    linkType: '_blank',
    width: '100%',
    height: '50vh'
});

editor.on('change', value => {
    console.log(value);
});
```

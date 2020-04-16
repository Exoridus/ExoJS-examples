import $ from "jquery";
import CodeMirror from "codemirror";

interface Example {
    title: string;
    path: string;
}

interface ExamplesCategory {
    title: string;
    examples: Array<Example>;
}

type ExamplesConfig = Array<ExamplesCategory>;

export class ExampleLoader {
    private readonly $navigation: JQuery<HTMLDivElement> = $('.navigation-list');
    private readonly $preview: JQuery<HTMLDivElement> = $('.example-preview');
    private readonly $title: JQuery<HTMLDivElement> = $('.editor-title');
    private readonly $code: JQuery<HTMLTextAreaElement> = $('.editor-code');
    private readonly $refresh: JQuery<HTMLDivElement> = $('.refresh-button');
    private readonly requestOptions: RequestInit = {
        cache: "no-cache",
        method: "GET",
        mode: "cors",
    };

    private activeExample: Example | null = null;
    private activeEditor: CodeMirror.EditorFromTextArea | null = null;
    private activePath = location.hash.slice(1);

    async init() {
        const response = await fetch(`examples.json?no-cache=${Date.now()}`, this.requestOptions);
        const examples = await response.json();

        await this.createNavigation(examples);

        this.$refresh.on('click', () => {
            if (this.activeEditor) {
                this.createExample(this.activeEditor.getValue());
            }
        })
    }

    createExample(source: string) {
        const $frame: JQuery<HTMLIFrameElement> = $('<iframe>', {
            'class': 'preview-frame',
            'src': 'preview.html',
        });

        this.$preview.empty();
        this.$preview.append($frame);

        $frame.contents()
            .find('body')
            .append($(`<script>window.onload = function() { ${source} }</script>`));

        this.$code.html(source);

        if (this.activeEditor) {
            $(this.activeEditor.getWrapperElement()).remove();
        }

        this.activeEditor = CodeMirror.fromTextArea(this.$code[0], {
            mode: 'javascript',
            theme: 'monokai',
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            viewportMargin: Infinity,
            lineWrapping: true,
            indentUnit: 4,
        });
    }

    async loadExample(example: Example) {
        if (this.activeExample === example) {
            return;
        }

        this.activeExample = example;
        this.activePath = example.path;
        window.location.hash = this.activePath;
        document.title = `${example.title} - ExoJS Examples`;
        this.$title.html(`Example Code: ${example.title}`);

        const response = await fetch(`examples/${this.activePath}?no-cache=${Date.now()}`, {
            cache: "no-cache",
            method: "GET",
            mode: "cors",
        });

        this.createExample(await response.text());
    }

    async createNavigation(examplesCategories: ExamplesConfig) {
        for (const category of examplesCategories) {
            this.$navigation.append($('<div>', {
                'class': 'navigation-sub-header',
                'html': category.title
            }));

            for (const example of category.examples) {
                this.$navigation.append($('<div>', {
                    'class': 'navigation-item',
                    'html': example.title
                }).on('click', () => this.loadExample(example)));

                if (!this.activePath || this.activePath === example.path) {
                    this.loadExample(example);
                }
            }
        }
    }
}
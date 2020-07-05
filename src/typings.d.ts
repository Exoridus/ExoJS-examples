declare module '*.module.scss' {
    const classNames: {
        [className: string]: string;
        css: string;
    };
    export = classNames;
}


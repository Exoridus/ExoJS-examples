declare module '*.module.scss' {
    const classNames: { [className: string]: string; app: any };
    export = classNames;
}


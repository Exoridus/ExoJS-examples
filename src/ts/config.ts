export interface IExample {
    title: string;
    path: string;
}

export interface IExampleCategory {
    title: string;
    path: string;
    examples: Array<IExample>;
}

export type ExamplesConfig = Array<IExampleCategory>;

interface IAppConfig {
    examplesPath: string, // 'examples/'
    assetsPath: string, // 'assets/'
    examples: ExamplesConfig,
    requestOptions: RequestInit;
}

const getCleanTitle = (text: string): string => text.split('-')
    .map((part: string) => part[0].toUpperCase() + part.substr(1))
    .join(' ');

const buildExamples = (config: Record<string, Array<string>>): ExamplesConfig => (
    Object.entries(config).map(([path, files]) => ({
        title: getCleanTitle(path),
        path: `${path}/`,
        examples: files.map((fileName: string): IExample => ({
            title: getCleanTitle(fileName),
            path: `${fileName}.js`,
        }))
    }))
);

export const config: IAppConfig = {
    examplesPath: 'examples/',
    assetsPath: 'assets/',
    examples: buildExamples({
        'rendering': [
            'sprite',
            'container',
            'blendmodes',
            'tinted-sprites',
            'view-handling',
            'render-to-texture',
            'display-text',
            'display-video',
            'display-svg',
            'spritesheet',
        ],
        'input': [
            'gamepad',
        ],
        'collision-detection': [
            'rectangles',
        ],
        'particle-system': [
            'bonfire',
            'fireworks',
        ],
        'extras': [
            'audio-visualisation',
            'benchmark',
        ]
    }),
    requestOptions: {
        cache: 'no-cache',
        method: 'GET',
        mode: 'cors',
    },
};
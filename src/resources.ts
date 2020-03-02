const loadImage = (
    url: string,
): Promise<HTMLImageElement> =>
    new Promise(resolve => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.src = url;
    });

type Images = {
    forest0001: HTMLImageElement,
    forest0002: HTMLImageElement,
    hero0001: HTMLImageElement,
    hero0002: HTMLImageElement,
    hero0003: HTMLImageElement,
    hero0004: HTMLImageElement,
    hero0005: HTMLImageElement,
    hero0006: HTMLImageElement,
    hero0007: HTMLImageElement,
    hero0008: HTMLImageElement,
    hero0009: HTMLImageElement,
    hero0010: HTMLImageElement,
    hero0011: HTMLImageElement,
    hero0012: HTMLImageElement,
    hero0013: HTMLImageElement,
};

export type Resources = {
    images: Images,
};

export const loadResources = (): Promise<Resources> => new Promise(resolve => {
    Promise.all([
        loadImage('res/forest0001.png'),
        loadImage('res/forest0002.png'),
        loadImage('res/hero0001.png'),
        loadImage('res/hero0002.png'),
        loadImage('res/hero0003.png'),
        loadImage('res/hero0004.png'),
        loadImage('res/hero0005.png'),
        loadImage('res/hero0006.png'),
        loadImage('res/hero0007.png'),
        loadImage('res/hero0008.png'),
        loadImage('res/hero0009.png'),
        loadImage('res/hero0010.png'),
        loadImage('res/hero0011.png'),
        loadImage('res/hero0012.png'),
        loadImage('res/hero0013.png'),
    ])
    .then(([
        forest0001,
        forest0002,
        hero0001,
        hero0002,
        hero0003,
        hero0004,
        hero0005,
        hero0006,
        hero0007,
        hero0008,
        hero0009,
        hero0010,
        hero0011,
        hero0012,
        hero0013,
    ]) => {
        resolve({
            images: {
                forest0001,
                forest0002,
                hero0001,
                hero0002,
                hero0003,
                hero0004,
                hero0005,
                hero0006,
                hero0007,
                hero0008,
                hero0009,
                hero0010,
                hero0011,
                hero0012,
                hero0013,
            }
        });
    });
});
declare const Howl: any;

const menuMusic = new Howl({
    src: ['res/music_menu.mp3'],
    loop: true,
    volume: 0.5,
});

let playedMenuMusic: any = null;

export const fadeToMenuMusic = () => {
    playedMenuMusic = menuMusic.play();
};

export const fadeToCaveMusic = () => {
};

export const setCaveMusicIntensity = (intensity: number) => {
};

export const startReverseMusic = () => {
};
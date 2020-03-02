import { Renderer } from "render";
import { GameState } from "state";
import { loadResources } from "resources";

const MAX_CATCH_UP_DELAY_SECONDS = 5;
const FRAME_SECONDS = 0.033;

const canvasContext = (document.getElementById('game-canvas') as HTMLCanvasElement).getContext('2d')!;
const renderer = new Renderer(canvasContext);

const startTime: number = performance.now() / 1000;
let previousTime: number = startTime;
let frameAccTime: number = 0;

const curFrame: GameState = GameState.create();
const prevFrame: GameState = GameState.create();
const lerpFrame: GameState = GameState.create();

export type InputState = {
    left:  boolean,
    right: boolean,
    jump:  boolean,
};

const keys: any = {};
document.onkeydown = e => keys[e.keyCode] = true; // and preventDefault
document.onkeyup   = e => delete keys[e.keyCode];

loadResources().then(res => {
    const frame = () => {
        const newTime = performance.now() / 1000;
        let deltaTime = newTime - previousTime;
        previousTime = newTime;

        if (deltaTime > MAX_CATCH_UP_DELAY_SECONDS) {
            deltaTime = MAX_CATCH_UP_DELAY_SECONDS;
        }

        frameAccTime += deltaTime;

        while (frameAccTime >= FRAME_SECONDS) {
            frameAccTime -= FRAME_SECONDS;

            const inputs: InputState = {
                left: keys[37],
                jump: keys[38],
                right: keys[39],
            };

            GameState.copy(prevFrame, curFrame);
            GameState.step(curFrame, inputs);
        }

        const t = frameAccTime / FRAME_SECONDS;
        GameState.lerp(lerpFrame, prevFrame, curFrame, t);
        renderer.render(res, lerpFrame);

        requestAnimationFrame(frame);
    };

    frame();
});
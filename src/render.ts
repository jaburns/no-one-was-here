import { Const } from "utils";
import { GameState } from "state";
import { LEVELS } from "levels";
import { Resources } from "resources";
import { PRNG } from "prng";
import { vec2 } from "gl-matrix";

const drawJaggyRect = (rng:PRNG, gfx:CanvasRenderingContext2D, x:number, y:number, w:number, h:number, forest:boolean) :void => {
    const STEP_SIZE :number = 15;
    const JAG_SIZE :number = 7;

    const stepX :number = w / Math.round(w / STEP_SIZE);
    const stepY :number = h / Math.round(h / STEP_SIZE);

    const startX :number = x - JAG_SIZE*rng.random();
    const startY :number = y - JAG_SIZE*rng.random();

    gfx.fillStyle = forest ? '#00002D' : '#160A47';
    gfx.beginPath();
    gfx.moveTo(startX, startY);
    let i: number;
    for (i = 0; i < w - stepX / 2 ; i += stepX) {
        gfx.lineTo(x + i, y - JAG_SIZE*rng.random());
    }
    for (i = 0; i < h - stepY / 2 ; i += stepY) {
        gfx.lineTo(x + w + JAG_SIZE*rng.random(), y + i);
    }
    for (i = w; i > stepX / 2 ; i -= stepX) {
        gfx.lineTo(x + i, y + h + JAG_SIZE*rng.random());
    }
    for (i = h; i > 1.5*stepY ; i -= stepY) {
        gfx.lineTo(x - JAG_SIZE*rng.random(), y + i);
    }
    gfx.closePath();
    gfx.fill();
}

export const getCamX = (level: number, playerX: number): number =>
    Math.min(LEVELS[level].maxX-800, Math.max(0, playerX-400));

export class Renderer {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly rng: PRNG;
    private readonly rainGrad: CanvasGradient;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.rng = new PRNG(0);

        this.rainGrad = ctx.createLinearGradient(0, 0, 0, 12);
        this.rainGrad.addColorStop(0, 'rgba(255,255,255,0.0)');
        this.rainGrad.addColorStop(1, 'rgba(255,255,255,1.0)');
    }

    render(res: Resources, state: Const<GameState>) {
        const ctx = this.ctx;
        const level = LEVELS[state.level];

        this.rng.reseed(0);

        const camX = getCamX(state.level, state.player.pos[0]);

        ctx.clearRect(0,0,800,480);

        ctx.drawImage(res.images.forest0001, -(camX/4%820), 45);
        ctx.drawImage(res.images.forest0001, 820-(camX/4%820), 45);
        ctx.drawImage(res.images.forest0002, -(camX/2%820), 45);
        ctx.drawImage(res.images.forest0002, 820-(camX/2%820), 45);

        this.rain(res, state.rainAngle, state.rain);

        if (level.caves) {
            for (let i = 0; i < 5; ++i) {
                ctx.fillStyle = state.cavesDone[i] ? '#000004' : '#371435';
                ctx.fillRect(level.caves[0] - camX + 95 + i*205, 480 + level.caves[1] + 60, 200, 165);
            }
            ctx.drawImage(res.images.caves, level.caves[0] - camX, 480 + level.caves[1])
        }

        ctx.fillStyle = '#00000d';
        level.grounds.forEach(g => {
            const r = g(state.frame);
            drawJaggyRect(this.rng, ctx, r.xmin - camX, 480 + r.ymin, r.xmax - r.xmin, r.ymax - r.ymin, true);
        });

        const animFrame = (res.images as any)['hero'+(state.player.walkAnimFrame.toString() as any).padStart(4,'0')];

        if (level.title) {
            ctx.drawImage(res.images.title, level.title[0] - camX, 480 + level.title[1])
        }

        if (state.player.faceRight) {
            ctx.drawImage(animFrame, state.player.pos[0] - 31 - camX, 480 + state.player.pos[1] - 62);
        } else {
            ctx.save();
            ctx.translate(state.player.pos[0] - camX, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(animFrame, -31, 480 + state.player.pos[1] - 62);
            ctx.restore();
        }

        if (level.friend) {
            ctx.drawImage(res.images.friend, level.friend[0] - camX, 480 + level.friend[1])
        }
    }

    private rain(res: Resources, angle: number, drops: Const<vec2[]>) {
        const ctx = this.ctx;

        for (let i = 0; i < drops.length; ++i) {
            ctx.save();
            ctx.globalAlpha = .3;
            ctx.translate(drops[i][0], drops[i][1]);
            ctx.scale(.5, .7);
            ctx.rotate(angle);
            ctx.translate(-1,-20);
            ctx.drawImage(res.images.rain,0,0);
            ctx.restore();
        }
    }
};
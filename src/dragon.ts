import { Resources } from "resources";
import { vec2 } from "gl-matrix";

const SLEEP_MOUTH_LINE = [
    vec2.fromValues(-385, 35),
    vec2.fromValues(-306, 49),
    vec2.fromValues(-247, 54),
    vec2.fromValues(-187, 49),
    vec2.fromValues(-127, 66)
];

const AWAKE_MOUTH_LINE = [
    vec2.fromValues(-385, 35),
    vec2.fromValues(-306, 49),
    vec2.fromValues(-247, 38),
    vec2.fromValues(-187, 38),
    vec2.fromValues(-105, -9)
];

const LOWER_JAW = [
        vec2.fromValues(0,    151),
        vec2.fromValues(-115, 169),
        vec2.fromValues(-172, 151),
        vec2.fromValues(-232, 167),
        vec2.fromValues(-324, 152),
        vec2.fromValues(-385, 173),
        vec2.fromValues(-398, 123)
    ]
    .concat(AWAKE_MOUTH_LINE)
    .concat([
        vec2.fromValues(0, 0),
    ]);

const UPPER_HEAD =
    AWAKE_MOUTH_LINE.slice().reverse()
    .concat([
        vec2.fromValues(-398,   33),
        vec2.fromValues(-388,  -11),
        vec2.fromValues(-361,  -45),
        vec2.fromValues(-298,  -45),
        vec2.fromValues(-251,  -75),
        vec2.fromValues(-212,  -75),
        vec2.fromValues(-164, -114),
        vec2.fromValues( -66, -135),
        vec2.fromValues( -29, -135),
        vec2.fromValues(   0, -123),
        vec2.fromValues(   0,   10)
    ]);

const FRONT_HORN = [
    vec2.fromValues(-125,  116),
    vec2.fromValues(-257,   65),
    vec2.fromValues(-308,  -21),
    vec2.fromValues(-308, -114),
    vec2.fromValues(-230, -173),
    vec2.fromValues(-115, -173),
    vec2.fromValues( -59, -118),
    vec2.fromValues( -77, -104),
    vec2.fromValues(-112, -104),
    vec2.fromValues(-145, -135),
    vec2.fromValues(-208, -135),
    vec2.fromValues(-261,  -91),
    vec2.fromValues(-261,  -22),
    vec2.fromValues(-208,   59),
    vec2.fromValues(-125,  116)
];

const CLOSED_EYE = [
    vec2.fromValues(-195, -48),
    vec2.fromValues(-139, -56),
    vec2.fromValues(-155, -48)
];

const BACK_HORN = 
    FRONT_HORN.map(x => vec2.fromValues(x[0] - 40, x[1] + 10));

const fillShape = (gfx: CanvasRenderingContext2D, shape: vec2[], style: string, x: number, y: number) :void => {
    gfx.fillStyle = style;
    gfx.beginPath();
    gfx.moveTo(x + shape[0][0], y + shape[0][1]);
    for (let i = 1; i < shape.length; ++i) {
        gfx.lineTo(x + shape[i][0], y + shape[i][1]);
    }
    gfx.fill();
};

const lerp = (a:number, b:number, t:number): number => a + t*(b - a);

const fillNostril = (gfx: CanvasRenderingContext2D, x: number, y: number, open: number): void => {
    gfx.fillStyle = '#100039';
    gfx.beginPath();
    gfx.moveTo(x - 351, y - 13);
    gfx.lineTo(x - 326, y - 14);

    const cx = x + lerp(-342, -336, open);
    const cy = y + lerp(  -7,    4, open);
    const px = x + lerp(-354, -360, open);
    const py = y + lerp(  -1,    4, open);

    gfx.quadraticCurveTo(cx, cy, px, py);
    gfx.fill();
};

const drawPentagon = (gfx: CanvasRenderingContext2D, x: number, y: number, rads: number, alpha: number, radius: number): void => {
    gfx.globalAlpha = alpha;
    gfx.fillStyle = '#ffffff';
    gfx.beginPath();
    for (let i = 0; i < 5; ++i) {
        gfx[i == 0 ? 'moveTo' : 'lineTo'](
            x + radius*Math.cos(rads + i/5*2*Math.PI),
            y + radius*Math.sin(rads + i/5*2*Math.PI)
        );
    }
    gfx.fill();
    gfx.globalAlpha = 1;
};

export const drawDragon = (gfx: CanvasRenderingContext2D, x: number, y: number, frame: number): void => {
    frame = frame % 90;

    fillShape(gfx, BACK_HORN, '#8E4444', x, y);
    fillShape(gfx, LOWER_JAW, '#3B5B3F', x, y);
    fillShape(gfx, UPPER_HEAD, '#3B5B3F', x, y);
    fillShape(gfx, CLOSED_EYE, '#100039', x, y);

    fillNostril(gfx, x, y, frame < 20
        ? 1 - frame / 20
        : frame > 45
            ? (frame - 45) / (90 - 45)
            : 0);

    gfx.strokeStyle = '#100039';
    gfx.lineWidth = 6;
    gfx.lineCap = 'butt';
    gfx.beginPath();
    gfx.moveTo(x + SLEEP_MOUTH_LINE[0][0], y + SLEEP_MOUTH_LINE[0][1]);
    for (let i = 1; i < SLEEP_MOUTH_LINE.length; ++i) {
        gfx.lineTo(x + SLEEP_MOUTH_LINE[i][0], y + SLEEP_MOUTH_LINE[i][1]);
    }
    gfx.stroke();

    if (frame >= 3 && frame < 28) {
        const t = (frame - 3) / (28 - 3);
        const px = x + lerp(-347, -349, t);
        const py = y + lerp(  -7, -146, t);
        const rads = t*32 * Math.PI / 180;
        drawPentagon(gfx, px, py, rads, .5*(1-t), 6+t*55);
    }

    fillShape(gfx, FRONT_HORN, '#9E5151', x, y);
};
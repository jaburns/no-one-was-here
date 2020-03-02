import { vec2 } from "gl-matrix";
import { Rect } from "rect";

export type GroundChunk = (t: number) => Rect;

export type Level = {
    grounds: GroundChunk[],
};

const basic = (x: number, y: number, w: number, h: number): GroundChunk => {
    const result = Rect.fromXYWH(x, y, w, h);
    return _ => result;
};

const forestLeftRight = (x: number, y: number): GroundChunk => {
    const A = Rect.fromXYWH(x-50, y-178, 100, 35);
    const B = Rect.fromXYWH(x+330, y-178, 100, 35);
    const lerp = Rect.create();

    return t => {
        t %= 181;
        if (t <=  30) return A;
        if (t <   94) return Rect.lerp(lerp, A, B, (t-30)/(94-30));
        if (t <= 123) return B;
        return Rect.lerp(lerp, B, A, (t-123)/(181-123));
    };
};

const HubLevel = {
    grounds: [
        basic(  0, -73, 574, 171),
        basic(746, -73, 574, 171),
        basic(1300, -184, 320, 257),
        basic(1802, -78, 574, 171),
        forestLeftRight(2493, 100),
        basic(2994, -78, 1344, 171),
    ]
};

export const LEVELS = [
    HubLevel
];
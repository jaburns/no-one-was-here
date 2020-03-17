import { vec2 } from "gl-matrix";
import { Rect } from "rect";

export type GroundChunk = (t: number) => Rect;

export type Level = {
    maxX: number,
    grounds: GroundChunk[],

    caves?: vec2,
    title?: vec2,
    friend?: vec2,

    dragon?: vec2,
    artifact?: vec2,
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
    maxX: 2994 + 1344 - 5,
    grounds: [
        basic(-10, -73, 574, 171),
        basic(746, -73, 574, 171),
        basic(1300, -184, 320, 257),
        basic(1802, -78, 574, 171),
        forestLeftRight(2493, 100),
        basic(2994, -78, 1344, 171),
    ],

    caves: vec2.fromValues(3163, -78-225),
    title: vec2.fromValues(165, -440),
    friend: vec2.fromValues(55, -175),
};

const Level1 = {
    maxX: 1724,
    grounds: [
        basic(-218, -73, 860, 171),
        basic(494, -211, 362, 49),
        basic(714, -73, 1394, 171),
    ],

    dragon: vec2.fromValues(1725, -239),
    artifact: vec2.fromValues(1249, -200),
};

export const LEVELS: Level[] = [
    HubLevel,
    Level1,
];
import { vec2 } from "gl-matrix";
import { numberLerp } from "./utils";

export type Rect = {
    xmin: number,
    xmax: number,
    ymin: number,
    ymax: number,
};

export const Rect = {
    create: (): Rect => ({
        xmin: 0,
        xmax: 0,
        ymin: 0,
        ymax: 0,
    }),

    fromXYWH: (x: number, y: number, w: number, h: number): Rect => {
        const result = Rect.create();
        result.xmin = x;
        result.xmax = x + w;
        result.ymin = y;
        result.ymax = y + h;
        return result;
    },

    clone: (self: Rect): Rect => Rect.copy(Rect.create(), self),

    copy: (self: Rect, from: Rect): Rect => Rect.lerp(self, from, from, 0),

    lerp: (out: Rect, from: Rect, to: Rect, t: number): Rect => {
        out.xmin = numberLerp(0, from.xmin, to.xmin, t);
        out.xmax = numberLerp(0, from.xmax, to.xmax, t);
        out.ymin = numberLerp(0, from.ymin, to.ymin, t);
        out.ymax = numberLerp(0, from.ymax, to.ymax, t);
        return out;
    },

    intersects: (self: Rect, next: Rect): boolean =>
        ! (self.ymin > next.ymax ||
           next.ymin > self.ymax ||
           self.xmin > next.xmax ||
           next.xmin > self.xmax),

    containsPoint: (self: Rect, pt: vec2): boolean =>
        pt[0] >= self.xmin && pt[0] <= self.xmax &&
        pt[1] >= self.ymin && pt[1] <= self.ymax,
};
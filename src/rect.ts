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

    fromValues: (xmin: number, ymin: number, xmax: number, ymax: number): Rect => {
        const result = Rect.create();
        result.xmin = xmin;
        result.xmax = xmax;
        result.ymin = ymin;
        result.ymax = ymax;
        return result;
    },

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

    clear: (self: Rect): Rect => {
        self.xmin = 0;
        self.xmax = 0;
        self.ymin = 0;
        self.ymax = 0;
        return self;
    },

    lerp: (out: Rect, from: Rect, to: Rect, t: number): Rect => {
        out.xmin = numberLerp(0, from.xmin, to.xmin, t);
        out.xmax = numberLerp(0, from.xmax, to.xmax, t);
        out.ymin = numberLerp(0, from.ymin, to.ymin, t);
        out.ymax = numberLerp(0, from.ymax, to.ymax, t);
        return out;
    },

    setToPoint: (self: Rect, p: vec2): Rect => {
        self.xmin = p[0];
        self.xmax = p[0];
        self.ymin = p[1];
        self.ymax = p[1];
        return self;
    },

    expandToContainPoint: (self: Rect, p: vec2): Rect => {
        if (p[0] < self.xmin) self.xmin = p[0];
        if (p[1] < self.ymin) self.ymin = p[1];
        if (p[0] > self.xmax) self.xmax = p[0];
        if (p[1] > self.ymax) self.ymax = p[1];
        return self;
    },

    expandByRadius: (self: Rect, r: number): Rect => {
        self.xmin -= r;
        self.xmax += r;
        self.ymin -= r;
        self.ymax += r;
        return self;
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
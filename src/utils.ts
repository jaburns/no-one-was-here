import { DeepReadonly } from "ts-essentials";

export type Const<T> = DeepReadonly<T>;

export const unconst = <T>(x: Const<T>): T => x as T;

export const numberLerp = (_: number, a: number, b: number, t: number): number =>
    a + (b - a) * t;

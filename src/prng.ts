// http://en.wikipedia.org/wiki/Linear_congruential_generator

const A = 1664525;
const C = 1013904223;
const M = 4294967296;

export class PRNG
{
    private seed :number;

    constructor(seed?: number) {
        this.reseed(seed);
    }

    reseed(seed?: number) {
        this.seed = typeof seed === 'number' ? seed : Math.floor(Math.random() * M);
    }

    random(): number {
        this.seed = (A * this.seed + C) % M;
        return this.seed / M;
    }
}
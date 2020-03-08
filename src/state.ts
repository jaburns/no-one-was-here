import { Const, numberLerp } from "utils";
import { vec2 } from "gl-matrix";
import { InputState } from "index";
import { LEVELS } from "levels";
import { Rect } from "rect";
import { getCamX } from "render";

export type GameState = {
    level: number,
    player: PlayerState,
    frame: number,
    cavesDone: boolean[],
    rain: vec2[],
    rainAngle: number,
};

type PlayerState = {
    pos: vec2,
    vel: vec2,
    platformVel: vec2,
    canJumpCounter: number,
    jumpStarted: boolean,
    jumpFrames: number,
    canJump: boolean,
    standing: boolean,
    faceRight: boolean,
    walkAnimFrame: number,
};

const PlayerState = {
    create: (): PlayerState => ({
        pos: vec2.fromValues(400, -240),
        vel: vec2.create(),
        platformVel: vec2.create(),
        canJumpCounter: 0,
        jumpStarted: false,
        jumpFrames: 0,
        canJump: false,
        standing: false,
        faceRight: true,
        walkAnimFrame: 1,
    }),

    clone: (self: PlayerState): PlayerState => PlayerState.copy(PlayerState.create(), self),

    copy: (self: PlayerState, from: PlayerState): PlayerState => PlayerState.lerp(self, from, from, 0),

    lerp: (out: PlayerState, from: PlayerState, to: PlayerState, t: number): PlayerState => {
        vec2.lerp(out.pos, from.pos, to.pos, t);
        vec2.lerp(out.vel, from.vel, to.vel, t);
        out.canJumpCounter = to.canJumpCounter;
        out.jumpStarted = to.jumpStarted;
        out.jumpFrames = to.jumpFrames;
        out.canJump = to.canJump;
        out.faceRight = to.faceRight;
        out.walkAnimFrame = to.walkAnimFrame;
        return out;
    },

    step: (self: PlayerState, t: number, level: number, input: Const<InputState>) => {
        let walking = false;

        // Horizontal velocity update
        {
            const MAX_RUN   :number = 12;
            const RUN_DECEL :number = 4;
            const RUN_ACCEL :number = 1;
            const AIR_DECEL :number = 1;

            if (input.left) {
                if (self.vel[0] > 0) self.vel[0] -= RUN_DECEL; else self.vel[0] -= RUN_ACCEL;
                if (self.vel[0] < -MAX_RUN) self.vel[0] = -MAX_RUN;
                self.faceRight = false;
                walking = true;
            }
            else if (input.right) {
                if (self.vel[0] < 0) self.vel[0] += RUN_DECEL; else self.vel[0] += RUN_ACCEL;
                if (self.vel[0] > MAX_RUN) self.vel[0] = MAX_RUN;
                self.faceRight = true;
                walking = true;
            }
            else {
                ((decel: number) => {
                    if (self.vel[0] > decel) {
                        self.vel[0] -= decel;
                    } else if (self.vel[0] < -decel) {
                        self.vel[0] += decel;
                    } else {
                        self.vel[0] = 0;
                    }
                })(
                    self.standing ? RUN_DECEL : AIR_DECEL
                );
            }
        }

        // Vertical velocity update
        {
            const GRAVITY          :number =  2;
            const MAX_FALL         :number = 16;
            const JUMP             :number = 16;
            const JUMP_FRAMES      :number =  8;
            const JUMP_END_GRAVITY :number =  3;

            if (self.standing) {
                self.canJumpCounter = 3;
            }
            else if (self.canJumpCounter > 0) {
                self.canJumpCounter--;
            }

            if (input.jump) {
                if (self.canJumpCounter > 0 && !self.jumpStarted) {
                    self.jumpStarted = true;
                    //AudioPlayer.instance.playSoundEvent(AudioData.JUMP);
                }
            }
            else {
                self.jumpStarted = false;
            }

            if (self.jumpStarted) {
                self.vel[1] = -JUMP;

                self.jumpFrames++;
                if (self.jumpFrames >= JUMP_FRAMES) {
                    self.jumpStarted = false;
                }
            } else if (self.vel[1] < 0) {
                self.vel[1] += JUMP_END_GRAVITY;
            } else {
                self.vel[1] += GRAVITY;
            }

            if (self.vel[1] > MAX_FALL) {
                self.vel[1] = MAX_FALL;
            }
        }

        // Animation update

        if (self.standing) {
            if (walking) {
                if (self.walkAnimFrame < 2 || self.walkAnimFrame > 11) self.walkAnimFrame = 8;
                self.walkAnimFrame++;
                if (self.walkAnimFrame > 11) self.walkAnimFrame = 2;
            }
            else {
                self.walkAnimFrame = 1;
            }
        } else {
            self.walkAnimFrame = self.vel[1] < 0 ? 13 : 12;
        }

        // Position update and collision

        const lev = LEVELS[level];

        vec2.add(self.pos, self.pos, self.platformVel);

        self.standing = false;
        self.platformVel[0] = 0;
        self.platformVel[1] = 0;

        self.pos[1] += self.vel[1];

        lev.grounds.forEach(x => {
            if (Rect.containsPoint(x(t), vec2.fromValues(self.pos[0] + 5, self.pos[1]))
            || Rect.containsPoint(x(t), vec2.fromValues(self.pos[0] - 5, self.pos[1]))) {
                self.pos[1] = x(t).ymin;
                self.standing = true;
                self.vel[1] = 0;
                self.jumpFrames = 0;
                self.jumpStarted = false;
                self.platformVel[0] = x(t+1).xmin - x(t).xmin;
                self.platformVel[1] = x(t+1).ymin - x(t).ymin;
            }
        });

        self.pos[0] += self.vel[0];

        lev.grounds.forEach(x => {
            if (Rect.containsPoint(x(t), vec2.fromValues(self.pos[0] + 10, self.pos[1] - 5))) {
                self.pos[0] = x(t).xmin - 10;
                self.vel[0] = 0;
            }
            if (Rect.containsPoint(x(t), vec2.fromValues(self.pos[0] - 10, self.pos[1] - 5))) {
                self.pos[0] = x(t).xmax + 10
                self.vel[0] = 0;
            }
        });

        if (lev.caves && self.pos[0] < 20) {
            self.pos[0] = 20;
            self.vel[0] = 0;
        }
        if (self.pos[0] > lev.maxX - 20) {
            self.pos[0] = lev.maxX - 20;
            self.vel[0] = 0;
        }
    },
};

export const GameState = {
    create: (): GameState => ({
        level: 0,
        player: PlayerState.create(),
        frame: 1,
        cavesDone: [false,false,false,false,false],
        rain: Array(200).fill(0).map(_ => vec2.fromValues(800*Math.random(), 480*Math.random())),
        rainAngle: Math.PI / 16,
    }),

    clone: (self: GameState): GameState => GameState.copy(GameState.create(), self),

    copy: (self: GameState, from: GameState): GameState => GameState.lerp(self, from, from, 0),

    lerp: (out: GameState, from: GameState, to: GameState, t: number): GameState => {
        out.level = to.level;
        PlayerState.lerp(out.player, from.player, to.player, t);
        out.frame = numberLerp(0, from.frame, to.frame, t);
        out.cavesDone.forEach((_, i) => out.cavesDone[i] = to.cavesDone[i]);
        out.rain.forEach((_, i) => {
            if (from.rain[i][1] > to.rain[i][1]) {
                vec2.copy(out.rain[i], to.rain[i]);
            } else {
                vec2.lerp(out.rain[i], from.rain[i], to.rain[i], t);
            }
        });
        return out;
    },

    step: (self: GameState, input: Const<InputState>) => {
        self.frame++;

        const lastCamX = getCamX(self.level, self.player.pos[0]);

        PlayerState.step(self.player, self.frame, self.level, input);

        const newCamX = getCamX(self.level, self.player.pos[0]);
        const dx = newCamX - lastCamX;

        // Update rain
        {
            const SPEED = 15;

            self.rainAngle = dx/40 + Math.PI/16;

            const sin = Math.sin(self.rainAngle + Math.PI/2);
            const cos = Math.cos(self.rainAngle + Math.PI/2);

            self.rain.forEach(drop => {
                drop[0] += SPEED * cos - dx;
                drop[1] += SPEED * sin;
                drop[0] %= 800;
                if (drop[0] < 0) drop[0] += 800;
                drop[1] %= 480;
            });
        }
    },
};
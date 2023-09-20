export type AnimData = {
    name: string,
    frameRate: number, 
    repeat: number,
    prefix: string,
    start: number,
    end: number,
}

export const goRightAnim: AnimData = {
    name: 'goRight',
    frameRate: 16,
    repeat: 0,
    prefix: "knight/knight iso char_run right_",
    start: 0,
    end: 2,
};

export const goLeftAnim: AnimData = {
    name: 'goLeft',
    frameRate: 16,
    repeat: 0,
    prefix: "knight/knight iso char_run left_",
    start: 0,
    end: 2,
};

export const standAnim: AnimData  = {
    name: 'stand',
    frameRate: 5,
    repeat: -1,
    prefix: "knight/knight iso char_idle_",
    start: 0,
    end: 3,
};

export const sliceUpAnim: AnimData = {
    name: 'sliceUp',
    frameRate: 12,
    repeat: 0,
    prefix: "knight/knight iso char_slice up_",
    start: 0,
    end: 2,
};

export const sliceLeftAnim: AnimData = {
    name: 'sliceLeft',
    frameRate: 12,
    repeat: 0,
    prefix: "knight/knight iso char_slice right_",
    start: 0,
    end: 2,
};

export const sliceRightAnim: AnimData = {
    name: 'sliceRight',
    frameRate: 12,
    repeat: 0,
    prefix: "knight/knight iso char_slice left_",
    start: 0,
    end: 2,
};


export const animList: AnimData[] = [goLeftAnim, goRightAnim, standAnim, sliceLeftAnim, sliceRightAnim, sliceUpAnim];
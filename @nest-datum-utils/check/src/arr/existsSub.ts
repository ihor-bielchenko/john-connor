
const existsSub = (master: Array<number>, sub: Array<number>) => master.length > 0 && sub.length > 0 && sub.every((i => v => i = master.indexOf(v, i) + 1)(0));

export default existsSub;

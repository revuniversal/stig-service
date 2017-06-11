export type ERR = Error | null;
export type Callback<T = undefined, R = any> = (err: ERR, arg?: T) => R;

export type Reporter<T> = (err: Error | null, x: T) => void;
export type Iterator<T> = (err: Error | null, x: T, report: Callback) => void;
export type StigLink = { name: string; url: string };

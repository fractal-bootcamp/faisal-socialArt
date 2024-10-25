// Add these helper types and function
export type Diff<T, U> = T extends U ? never : T;
export type TypeDiff<T, U> = Diff<keyof T | keyof U, keyof T & keyof U>;

export function getTypeDiff<T, U>(t: T, u: U): TypeDiff<T, U> {
    return {} as TypeDiff<T, U>;
}

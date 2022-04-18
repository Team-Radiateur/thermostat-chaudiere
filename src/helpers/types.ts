export type OneOf<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType> ? ElementType : never;

export type ValueOf<T> = T[keyof T];

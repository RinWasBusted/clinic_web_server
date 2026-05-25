export type Primitive = string | number | boolean | Date | null;
export type Value = Primitive | Value[] | {
    [key: string]: Value;
};
export type Exclude<T, U> = T extends U ? never : T;
export type ValueWithoutArray = Exclude<Value, any[]>;
export type ValuePrimitive = Exclude<Value, object>;
export type ObjectType = {
    [key: string]: Value;
};
export type ObjectNoArrayType = {
    [key: string]: ValueWithoutArray;
};
export type PrimitiveType = Primitive;
export type RecordType = Record<string, PrimitiveType>;
//# sourceMappingURL=index.d.ts.map
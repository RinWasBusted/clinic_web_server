// Primitive: Basic data types
// Example: "hello", 42, true, new Date(), null
export type Primitive = string | number | boolean | Date | null;

// Value: Recursive type allowing primitives, arrays, and nested objects
// Example: "text" | 123 | { user: "john", age: 30, tags: ["admin", "active"] }
export type Value = Primitive | Value[] | { [key: string]: Value };

// Exclude: Utility type to remove unwanted types from a union
// Example: Exclude<string | number | boolean, boolean> = string | number
export type Exclude<T, U> = T extends U ? never : T;

/* eslint-disable @typescript-eslint/no-explicit-any */
// ValueWithoutArray: Removes array type from Value
// Example: "text" | 123 | { user: "john", profile: { role: "admin" } } ✅
// NOT allowed: { items: [1, 2, 3] } ❌
export type ValueWithoutArray = Exclude<Value, any[]>;

// ValuePrimitive: Removes object type from Value (only primitives and primitives in arrays)
// Example: "text" | 123 | true | [1, 2, "hello"] ✅
// NOT allowed: { key: "value" } ❌
export type ValuePrimitive = Exclude<Value, object>;

// ObjectType: Object where values can be anything (primitives, arrays, nested objects)
// Example: { name: "John", age: 30, tags: ["admin", "user"], profile: { role: "admin" } }
export type ObjectType = { [key: string]: Value };

// ObjectNoArrayType: Object where values cannot contain arrays, but can be nested objects
// Example: { name: "John", age: 30, profile: { role: "admin", active: true } } ✅
// NOT allowed: { tags: ["admin", "user"] } ❌
export type ObjectNoArrayType = { [key: string]: ValueWithoutArray };

// PrimitiveType: Alias for Primitive type for backwards compatibility
// Example: "text" | 42 | true | new Date() | null
export type PrimitiveType = Primitive;

export type RecordType = Record<string, PrimitiveType>;

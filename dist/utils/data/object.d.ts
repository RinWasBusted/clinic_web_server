/**
 * This module provides utility functions for working with objects, such as flattening nested objects into a single level.
 */
import { ObjectNoArrayType, RecordType } from "../types/index.js";
declare const _o: {
    /**
     * Flatten a nested object into a single level object with dot notation keys. Best used for flattening objects with nested objects but no arrays.
     * This automatically ignores array values and only flattens nested objects. If a value is an array, it will be ignored.
     * Example: { user: { name: "John", age: 30 }, array: ["item1", "item2"] } will become { "user.name": "John", "user.age": 30 }
     * @param obj ObjectNoArrayType
     * @param prefix string
     * @param result RecordType
     * @return RecordType
     * @example
     * const obj = { user: { name: "John", age: 30 }, active: true };
     * const result = _o.flatten(obj);
     * // result = { "user.name": "John", "user.age": 30, active: true }
     */
    flatten(obj: ObjectNoArrayType, prefix?: string, result?: RecordType): RecordType;
    /**
     * Remove a specified prefix from the keys of an object.
     * Example ``{"disease.diseaseID": "123"}`` with prefix ``disease`` will become ``{"diseaseID": "123"}``.
     * @param obj RecordType
     * @param prefix string
     * @returns RecordType
     * @example
     * const obj = {"disease.diseaseID": "123", "disease.diseaseName": "Flu", "symptom": "Fever"};
     * const result = _o.killPrefix(obj, "disease");
     * // result = {"diseaseID": "123", "diseaseName": "Flu"}
     */
    killPrefix(obj: RecordType, prefix: string): RecordType;
};
export default _o;
//# sourceMappingURL=object.d.ts.map
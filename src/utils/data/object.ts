/**
 * This module provides utility functions for working with objects, such as flattening nested objects into a single level.
 */
type ObjectType = { [Key: string]: ObjectType | string | number | boolean | Date | null };

// _o = object utilities
const _o = {
  flatten(obj: ObjectType, prefix = "", result: Record<string, unknown> = {}): Record<string, unknown> {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === "object" && !Array.isArray(value)) {
          this.flatten(value as ObjectType, newKey, result);
        } else {
          result[newKey] = value;
        }
      }
    }
    return result;
  },

  /**
   * Remove a specified prefix from the keys of an object.
   * Example ``{"disease.diseaseID": "123"}`` with prefix ``disease`` will become ``{"diseaseID": "123"}``.
   * @param obj ObjectType
   * @param prefix string
   * @returns ObjectType
   * @example
   * const obj = {"disease.diseaseID": "123", "disease.diseaseName": "Flu", "symptom": "Fever"};
   * const result = _o.killPrefix(obj, "disease");
   * // result = {"diseaseID": "123", "diseaseName": "Flu"}
   */
  killPrefix(obj: ObjectType, prefix: string): ObjectType {
    const result: ObjectType = {};
    for (const key in obj) {
      if (key.startsWith(prefix + ".")) {
        const newKey = key.slice(prefix.length + 1);
        if (newKey && obj[key]) result[newKey] = obj[key];
      } else {
        if (typeof obj[key] !== "undefined") result[key] = obj[key];
      }
    }
    return result;
  },
};
export default _o;

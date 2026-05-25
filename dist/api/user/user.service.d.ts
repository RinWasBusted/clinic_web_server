/**
 * Check if a given string is a valid roleName by querying the Role table dynamically.
 * This replaces the old AccountRole enum check.
 */
export declare function isValidRoleName(roleName: string): Promise<boolean>;
/**
 * Get all role names from the database.
 */
export declare function getAllRoleNames(): Promise<string[]>;
//# sourceMappingURL=user.service.d.ts.map
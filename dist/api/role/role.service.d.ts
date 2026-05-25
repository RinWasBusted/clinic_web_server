import { CreateRoleInput, UpdateRoleInput } from "../../schema/role.schema.js";
export declare const roleService: {
    getAllRoles(): Promise<{
        roleName: string;
        roleID: string;
        roleDescription: string | null;
        createdAtLocal: string | null;
    }[]>;
    getRoleById(roleID: string): Promise<{
        permissions: string[];
        roleName: string;
        roleID: string;
        roleDescription: string | null;
        createdAtLocal: string | null;
    } | null>;
    createRole(data: CreateRoleInput): Promise<{
        roleName: string;
        roleID: string;
        roleDescription: string | null;
        createdAtLocal: string | null;
    }>;
    updateRole(roleID: string, data: UpdateRoleInput): Promise<{
        roleName: string;
        roleID: string;
        roleDescription: string | null;
        createdAtLocal: string | null;
    }>;
    deleteRole(roleID: string): Promise<{
        roleName: string;
        roleID: string;
        roleDescription: string | null;
        createdAtLocal: string | null;
    }>;
};
//# sourceMappingURL=role.service.d.ts.map
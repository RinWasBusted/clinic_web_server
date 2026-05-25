import { permissionService } from "./permission.service.js";
export const getAllPermissions = async (req, res, next) => {
    try {
        const permissions = await permissionService.getAllPermissions();
        res.status(200).json({ message: "Get all permissions successfully", data: permissions });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=permission.controller.js.map
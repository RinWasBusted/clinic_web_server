declare class AuthorizationService {
    constructor();
    private renderList;
    getPermissionsListByRole(roleID: string | null | undefined, roleName: string | null | undefined): Promise<string[]>;
}
declare const _default: AuthorizationService;
export default _default;
//# sourceMappingURL=authorization.service.d.ts.map
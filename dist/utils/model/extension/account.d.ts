declare const AccountExtension: (client: any) => {
    $extends: {
        extArgs: import("../../../generated/prisma/runtime/client.js").InternalArgs<{
            account: {
                fullName: {
                    needs: {
                        firstName: true;
                        lastName: true;
                    };
                    compute(account: {
                        firstName: string;
                        lastName: string;
                    }): string;
                };
                genderDisplay: {
                    needs: {
                        gender: true;
                    };
                    compute(account: {
                        gender: import("../../../generated/prisma/index.js").$Enums.Gender | null;
                    }): "Nam" | "Nữ";
                };
            };
        }, unknown, {}, unknown>;
    };
};
export default AccountExtension;
//# sourceMappingURL=account.d.ts.map
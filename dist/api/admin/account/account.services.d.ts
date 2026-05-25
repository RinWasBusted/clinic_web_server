/**
 * Map a role's profileType to a Prisma nested-create payload.
 * profileType is stored on the Role record (e.g. "staff", "doctor", etc.)
 * Returns an empty object for unknown / custom roles (no sub-table).
 */
export declare function buildProfileCreate(profileType: string | null | undefined): {
    staff: {
        create: {};
    };
    doctor?: undefined;
    pharmacist?: undefined;
    manager?: undefined;
    patient?: undefined;
} | {
    doctor: {
        create: {};
    };
    staff?: undefined;
    pharmacist?: undefined;
    manager?: undefined;
    patient?: undefined;
} | {
    pharmacist: {
        create: {};
    };
    staff?: undefined;
    doctor?: undefined;
    manager?: undefined;
    patient?: undefined;
} | {
    manager: {
        create: {};
    };
    staff?: undefined;
    doctor?: undefined;
    pharmacist?: undefined;
    patient?: undefined;
} | {
    patient: {
        create: {};
    };
    staff?: undefined;
    doctor?: undefined;
    pharmacist?: undefined;
    manager?: undefined;
} | {
    staff?: undefined;
    doctor?: undefined;
    pharmacist?: undefined;
    manager?: undefined;
    patient?: undefined;
};
declare const updateAvatar: (accountId: string, url: string) => Promise<{
    status: number;
    message: string;
}>;
export { updateAvatar };
//# sourceMappingURL=account.services.d.ts.map
export type AccountDto = {
  firstName: string;
  lastName: string;
  email: string;
  role: "doctor" | "pharmacist";
  birthDate: string;
  phoneNumber: string;
  password: string;
};

export type RegisterManyBody = {
  accounts: AccountDto[];
};

export type RegisterOneBody = {
  account: AccountDto;
};
export type Empty = Record<string, never>;
export type AccountInfo = {
  accounts: [
    {
      account_id: string;
      is_default: BooleanString;
      account_name: string;
      base_uri: string;
    }
  ];
};

export type UserInfo = {
  userName: string;
  userId: string;
  userType: string;
  isAdmin: BooleanString;
  userStatus: string;
  uri: string;
  email: string;
  createdDateTime: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  permissionProfileId: string;
  permissionProfileName: string;
};

export type Brands = {
  senderBrandIdDefault: string;
  brands: {
    brandId: string;
    brandName: string;
    isOverridingCompanyName: BooleanString;
    isSendingDefault: BooleanString;
    isSigningDefault: BooleanString;
  }[];
};

type BooleanString = "true" | "false";

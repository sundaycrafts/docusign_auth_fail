export type UserInfo = {
  accounts: [
    {
      account_id: string;
      is_default: boolean;
      account_name: string;
      base_uri: string;
    }
  ];
};

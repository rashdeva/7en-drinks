import { transformKeysToSnakeCase } from "~/lib/utils";
import { UserModel } from "./models";

// mappers.ts
const toUserDto = (user: Partial<UserModel>): any => {
  return transformKeysToSnakeCase(user);
};

export { toUserDto };

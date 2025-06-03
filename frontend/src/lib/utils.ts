import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserModel } from "~/db/models";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserInitials(user: UserModel): string {
  const { firstName, lastName } = user;
  const firstNameInitial = firstName.charAt(0);
  const lastNameInitial = lastName ? lastName?.charAt(0) : "";
  return lastNameInitial
    ? `${firstNameInitial}${lastNameInitial}`
    : firstNameInitial;
}

export function getUserFullName(user: UserModel): string {
  const { firstName, lastName } = user;
  return lastName ? `${firstName} ${lastName}` : firstName;
}

export function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`);
}

export const transformKeysToSnakeCase = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map(transformKeysToSnakeCase) as unknown as T;
  } else if (obj !== null && typeof obj === "object") {
    const newObj: any = {};
    Object.keys(obj).forEach((key) => {
      const newKey = camelToSnakeCase(key);
      newObj[newKey] = transformKeysToSnakeCase((obj as any)[key]);
    });
    return newObj;
  }
  return obj;
};

export function capitalizeFirstLetter(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getPluralForm(
  number: number,
  singular: string,
  few: string,
  many: string
) {
  if (number % 10 === 1 && number % 100 !== 11) {
    return singular;
  } else if (
    2 <= number % 10 &&
    number % 10 <= 4 &&
    (number % 100 < 10 || number % 100 >= 20)
  ) {
    return few;
  } else {
    return many;
  }
}

export function getTokens(
  tokens: number | [number, number],
  isTeacher: boolean
): number {
  if (typeof tokens === "number") {
    return tokens; // Same amount for both users and teachers
  } else {
    return isTeacher ? tokens[1] : tokens[0]; // Different amounts for users and teachers
  }
}

export function isOneHourAgo(dateString: string): boolean {
  const givenDate = new Date(dateString);
  const now = new Date();

  // Ensure that the date is valid
  if (isNaN(givenDate.getTime())) {
    return false;
  }

  // Calculate the difference in milliseconds
  const differenceInMs = now.getTime() - givenDate.getTime();

  // Convert milliseconds to hours (1 hour = 60 minutes * 60 seconds * 1000 milliseconds)
  const differenceInHours = differenceInMs / (1000 * 60 * 60);

  return differenceInHours >= 1;
}

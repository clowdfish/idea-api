/**
 * User licence types.
 */
export enum UserLicence {
  free,
  pro,
  business
}

/**
 * The user object being attached to the response.
 */
export interface User {
  id: number;
  email: string;
  licence?: UserLicence;

  /** Twitter user name */
  twitter?: string;

  /** Auth token that must be send to the back end API with every request */
  token?: string;
}
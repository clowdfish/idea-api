/**
 * User profile data structure.
 */
export interface User {
  id: number;
  email: string;

  /** Twitter user name */
  twitter?: string;

  /** Auth token that must be send to the back end API with every request */
  token?: string;
}

/**
 * Idea data structure.
 */
export interface Idea {

  id: number;
  title: string;
  description: string;

  /** List of image urls */
  images: string[];

  /** The email of the creating user */
  creator: string;

  /** A list of email addresses of the owners of that idea. */
  owners: string[];
}

/**
 * Campaign data structure.
 */
export interface Campaign {

  title: string;
  description: string;

  /** Title image url */
  image: string;

  ideas: Idea[];
}
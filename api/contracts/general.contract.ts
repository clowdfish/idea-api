/**
 * Server response in case of an error.
 */
interface ErrorResponse {

  /** Error message */
  message: string;

  /** HTTP status code of response */
  statusCode?: number;
}
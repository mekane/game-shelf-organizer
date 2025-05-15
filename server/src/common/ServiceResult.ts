export enum ServiceStatus {
  Success = 'success',
  BadRequest = 'bad-request',
  NotFound = 'not-found',
  NotAllowed = 'not-allowed',
  DatabaseError = 'db-error',
  InvalidBggUser = 'invalid-bgg-user',
}
export interface ServiceResult<T> {
  status: ServiceStatus;
  content?: T;
}

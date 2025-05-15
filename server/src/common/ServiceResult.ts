export enum ServiceStatus {
  Success = 'success',
  BadRequest = 'bad-request',
  NotFound = 'not-found',
  NotAllowed = 'not-allowed',
  DatabaseError = 'db-error',
  EmailInUse = 'email-in-use',
  InvalidBggUser = 'invalid-bgg-user',
  InvalidCredentials = 'invalid-credentials',
  OwnUser = 'own-user',
}

export interface ServiceResult<T> {
  status: ServiceStatus;
  content?: T;
}

export enum ServiceStatus {
  BadRequest = 'bad-request',
  DatabaseError = 'db-error',
  DuplicateId = 'duplicate-id',
  EmailInUse = 'email-in-use',
  InvalidBggUser = 'invalid-bgg-user',
  InvalidCredentials = 'invalid-credentials',
  NotAllowed = 'not-allowed',
  NotFound = 'not-found',
  OwnUser = 'own-user',
  Success = 'success',
}

export interface ServiceResult<T> {
  status: ServiceStatus;
  content?: T;
}

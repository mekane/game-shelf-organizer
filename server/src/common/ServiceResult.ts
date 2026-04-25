import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

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
  message?: string;
}

export function checkServiceResults<T>(res: ServiceResult<T>) {
  const { message, status } = res;

  if (status === ServiceStatus.BadRequest) {
    throw new BadRequestException(message);
  }

  if (status === ServiceStatus.DatabaseError) {
    throw new InternalServerErrorException(res.message);
  }

  if (status === ServiceStatus.NotFound) {
    throw new NotFoundException(message);
  }

  if (status === ServiceStatus.NotAllowed) {
    throw new ForbiddenException(message);
  } else if (status !== ServiceStatus.Success) {
    console.log(`### Service Error of type ${status} not handled: ${message}`);
    throw new Error(message);
  }

  return res.content;
}

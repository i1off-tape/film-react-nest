export enum RepositoryErrorCode {
  DuplicateSeatInOrder = 'DUPLICATE_SEAT_IN_ORDER',
  SessionNotFound = 'SESSION_NOT_FOUND',
  SeatOutOfRange = 'SEAT_OUT_OF_RANGE',
  SeatAlreadyTaken = 'SEAT_ALREADY_TAKEN',
}

export class RepositoryError extends Error {
  constructor(
    public readonly code: RepositoryErrorCode,
    message: string,
  ) {
    super(message);
  }
}

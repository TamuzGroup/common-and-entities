export class ApiError {
  public readonly statusCode: number;

  public readonly isOperational: boolean;
  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack = ""
  )
};

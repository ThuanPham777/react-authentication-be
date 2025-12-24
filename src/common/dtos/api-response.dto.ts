export class ApiResponseDto<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: any[];

  constructor(status: 'success' | 'error', data?: T, message?: string) {
    this.status = status;
    this.data = data;
    this.message = message;
  }

  static success<T>(data?: T, message?: string): ApiResponseDto<T> {
    return new ApiResponseDto('success', data, message);
  }

  static error(message: string, errors?: any[]): ApiResponseDto {
    const response = new ApiResponseDto('error', undefined, message);
    response.errors = errors;
    return response;
  }
}

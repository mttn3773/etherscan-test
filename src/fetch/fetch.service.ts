import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

export type RequestMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS';
@Injectable()
export class FetchService {
  constructor() {}

  async makeRequest<T>(
    method: RequestMethod,
    url: string,
    body: Record<string, string> = {},
    headers: Record<string, string> = {},
  ): Promise<T> {
    try {
      const res = await fetch(url, {
        method,
        headers,
      });

      return res.json() as T;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

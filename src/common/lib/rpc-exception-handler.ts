import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

type RpcError = { status: number; message: string } | string;

/**
 * Извлекает данные из RpcException
 */
function extractRpcError(error: RpcException | RpcError): RpcError {
  if (error instanceof RpcException) {
    return error.getError() as RpcError;
  }
  return error;
}

/**
 * Конвертирует RpcException в соответствующее HTTP исключение
 */
function convertRpcExceptionToHttpException(
  error: RpcException | RpcError,
): HttpException {
  const rpcError = extractRpcError(error);

  if (typeof rpcError === 'string') {
    return new BadRequestException(rpcError);
  }

  if (typeof rpcError === 'object' && rpcError.status) {
    switch (rpcError.status) {
      case 400:
        return new BadRequestException(rpcError.message);
      case 401:
        return new UnauthorizedException(rpcError.message);
      case 403:
        return new ForbiddenException(rpcError.message);
      case 404:
        return new NotFoundException(rpcError.message);
      case 409:
        return new ConflictException(rpcError.message);
      case 422:
        return new UnprocessableEntityException(rpcError.message);
      case 429:
        return new HttpException(
          rpcError.message,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      case 500:
        return new InternalServerErrorException(rpcError.message);
      case 502:
        return new BadGatewayException(rpcError.message);
      case 503:
        return new ServiceUnavailableException(rpcError.message);
      default:
        return new BadRequestException(rpcError.message);
    }
  }

  return new BadRequestException('Ошибка запроса');
}

/**
 * RxJS оператор для обработки RpcException в микросервисах
 * Автоматически конвертирует RpcException в соответствующие HTTP исключения
 */
function handleRpcException<T>(): (source: Observable<T>) => Observable<T> {
  return catchError((error: unknown) => {
    // Логирование для отладки
    if (process.env.NODE_ENV !== 'production') {
      console.error('RPC Error caught:', {
        error,
        type: typeof error,
        isRpcException: error instanceof RpcException,
        errorKeys:
          error && typeof error === 'object' ? Object.keys(error) : null,
        errorStringified: JSON.stringify(error),
      });
    }

    // Проверка на экземпляр RpcException
    if (error instanceof RpcException) {
      return throwError(() => convertRpcExceptionToHttpException(error));
    }

    // Проверка на сериализованный RpcException (приходит через TCP)
    // Может быть в формате { status: number, message: string }
    if (error && typeof error === 'object') {
      const err = error as Record<string, unknown>;

      // Проверяем наличие полей status и message
      if (
        'status' in err &&
        'message' in err &&
        typeof err.status === 'number' &&
        typeof err.message === 'string'
      ) {
        const rpcError = {
          status: err.status,
          message: err.message,
        };
        return throwError(() => convertRpcExceptionToHttpException(rpcError));
      }
    }

    // Если не удалось обработать, пробрасываем как есть
    return throwError(() => error);
  });
}

/**
 * Отправляет запрос в микросервис с автоматической обработкой RpcException
 * @param client - ClientProxy для отправки запроса
 * @param pattern - Паттерн сообщения
 * @param data - Данные для отправки
 * @returns Promise с результатом запроса
 */
export async function sendToMicroservice<T>(
  client: ClientProxy,
  pattern: string,
  data: unknown,
): Promise<T> {
  return firstValueFrom(
    client.send<T>(pattern, data).pipe(handleRpcException()),
  );
}

import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    console.error('[GlobalErrorHandler]', error);

    if (error instanceof Error) {
      console.error(error.stack);
      return;
    }

    if (error && typeof error === 'object') {
      for (const key of Object.getOwnPropertyNames(error)) {
        console.error(`[GlobalErrorHandler] ${key}:`, (error as Record<string, unknown>)[key]);
      }
    }
  }
}

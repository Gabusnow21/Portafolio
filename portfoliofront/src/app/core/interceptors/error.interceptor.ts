import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Error inesperado. Intenta de nuevo más tarde.';

      if (error.status === 0) {
        message = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      } else if (error.status === 400) {
        message = error.error?.detail || 'Solicitud inválida.';
      } else if (error.status === 404) {
        message = 'Recurso no encontrado.';
      } else if (error.status === 500) {
        message = 'Error del servidor. Intenta más tarde.';
      }

      console.error(`[HTTP ${error.status}] ${req.method} ${req.url}:`, message);

      return throwError(() => ({ status: error.status, message, original: error }));
    })
  );
};

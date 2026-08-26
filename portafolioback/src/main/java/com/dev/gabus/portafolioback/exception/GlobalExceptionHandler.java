package com.dev.gabus.portafolioback.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidationErrors(MethodArgumentNotValidException ex) {
        String detail = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.joining("; "));
        return createProblem(HttpStatus.BAD_REQUEST, "Error de validación",
            URI.create("/errors/validation"), detail);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail handleIllegalArgument(IllegalArgumentException ex) {
        return createProblem(HttpStatus.BAD_REQUEST, "Solicitud inválida",
            URI.create("/errors/bad-request"), ex.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleNotFound(ResourceNotFoundException ex) {
        return createProblem(HttpStatus.NOT_FOUND, "Recurso no encontrado",
            URI.create("/errors/not-found"), ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception ex) {
        return createProblem(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor",
            URI.create("/errors/internal"),
            "Ocurrió un error inesperado. Intente de nuevo más tarde.");
    }

    private ProblemDetail createProblem(HttpStatus status, String title, URI type, String detail) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, detail);
        problem.setTitle(title);
        problem.setType(type);
        return problem;
    }
}

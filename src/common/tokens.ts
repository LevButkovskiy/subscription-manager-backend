/**
 * Токены для Dependency Injection
 * Используются для слабой связанности модулей и возможности вынесения в микросервисы
 */
export const USER_SERVICE_TOKEN = Symbol('IUserService');
export const AUTH_SERVICE_TOKEN = Symbol('IAuthService');
export const AUTH_CLIENT_TOKEN: string | symbol = Symbol('AUTH_CLIENT');
export const USERS_CLIENT_TOKEN: string | symbol = Symbol('USERS_CLIENT');

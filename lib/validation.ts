import DOMPurify from "isomorphic-dompurify";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function sanitizeString(input: string | null | undefined): string {
  if (!input) return "";
  return DOMPurify.sanitize(input.trim());
}

export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return "";
  const sanitized = sanitizeString(url);
  try {
    new URL(sanitized);
    return sanitized;
  } catch {
    return "";
  }
}

export function sanitizeEmail(email: string | null | undefined): string {
  if (!email) return "";
  const sanitized = sanitizeString(email).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : "";
}

export function validateRequired(value: unknown, fieldName: string): ValidationResult {
  if (value === null || value === undefined || value === "") {
    return { valid: false, errors: [`${fieldName} is required`] };
  }
  return { valid: true, errors: [] };
}

export function validateString(
  value: unknown,
  fieldName: string,
  options?: { minLength?: number; maxLength?: number; pattern?: RegExp }
): ValidationResult {
  const errors: string[] = [];

  if (typeof value !== "string") {
    errors.push(`${fieldName} must be a string`);
    return { valid: false, errors };
  }

  const sanitized = sanitizeString(value);

  if (options?.minLength && sanitized.length < options.minLength) {
    errors.push(`${fieldName} must be at least ${options.minLength} characters`);
  }

  if (options?.maxLength && sanitized.length > options.maxLength) {
    errors.push(`${fieldName} must be no more than ${options.maxLength} characters`);
  }

  if (options?.pattern && !options.pattern.test(sanitized)) {
    errors.push(`${fieldName} format is invalid`);
  }

  return { valid: errors.length === 0, errors };
}

export function validateUrl(value: unknown, fieldName: string): ValidationResult {
  if (!value) {
    return { valid: true, errors: [] }; // URL is optional
  }

  if (typeof value !== "string") {
    return { valid: false, errors: [`${fieldName} must be a string`] };
  }

  const sanitized = sanitizeUrl(value);
  if (!sanitized) {
    return { valid: false, errors: [`${fieldName} must be a valid URL`] };
  }

  return { valid: true, errors: [] };
}

export function validateEmail(value: unknown, fieldName: string): ValidationResult {
  if (!value) {
    return { valid: true, errors: [] }; // Email is optional unless required
  }

  if (typeof value !== "string") {
    return { valid: false, errors: [`${fieldName} must be a string`] };
  }

  const sanitized = sanitizeEmail(value);
  if (!sanitized) {
    return { valid: false, errors: [`${fieldName} must be a valid email address`] };
  }

  return { valid: true, errors: [] };
}

export function validateNumber(
  value: unknown,
  fieldName: string,
  options?: { min?: number; max?: number }
): ValidationResult {
  const errors: string[] = [];

  if (typeof value !== "number" && typeof value !== "string") {
    errors.push(`${fieldName} must be a number`);
    return { valid: false, errors };
  }

  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) {
    errors.push(`${fieldName} must be a valid number`);
    return { valid: false, errors };
  }

  if (options?.min !== undefined && num < options.min) {
    errors.push(`${fieldName} must be at least ${options.min}`);
  }

  if (options?.max !== undefined && num > options.max) {
    errors.push(`${fieldName} must be no more than ${options.max}`);
  }

  return { valid: errors.length === 0, errors };
}

export function validateArray(
  value: unknown,
  fieldName: string,
  options?: { minLength?: number; maxLength?: number }
): ValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(value)) {
    errors.push(`${fieldName} must be an array`);
    return { valid: false, errors };
  }

  if (options?.minLength && value.length < options.minLength) {
    errors.push(`${fieldName} must have at least ${options.minLength} items`);
  }

  if (options?.maxLength && value.length > options.maxLength) {
    errors.push(`${fieldName} must have no more than ${options.maxLength} items`);
  }

  return { valid: errors.length === 0, errors };
}

export function validateFile(
  file: File | null | undefined,
  options?: { maxSizeMB?: number; allowedTypes?: string[] }
): ValidationResult {
  const errors: string[] = [];

  if (!file) {
    return { valid: false, errors: ["File is required"] };
  }

  if (options?.maxSizeMB) {
    const maxSizeBytes = options.maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      errors.push(`File size must be less than ${options.maxSizeMB}MB`);
    }
  }

  if (options?.allowedTypes && !options.allowedTypes.includes(file.type)) {
      errors.push(`File type must be one of: ${options.allowedTypes.join(", ")}`);
  }

  return { valid: errors.length === 0, errors };
}

export function combineValidationResults(...results: ValidationResult[]): ValidationResult {
  const allErrors = results.flatMap((r) => r.errors);
  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  };
}


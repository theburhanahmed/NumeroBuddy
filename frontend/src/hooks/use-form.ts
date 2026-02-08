'use client';

import { useState, useCallback, useMemo } from 'react';
import { validateField, ValidationRules, type ValidationResult } from '@/lib/form-validation';

interface UseFormOptions {
  initialValues: Record<string, string>;
  validationRules: ValidationRules;
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
}

// Helper function to normalize error values - ensures they're always strings
// This specifically handles ValidationResult objects with {isValid, error, isDirty} structure
const normalizeError = (error: any): string => {
  // Already a string - return as-is
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle ValidationResult objects specifically (has isValid, error, isDirty keys)
  if (error && typeof error === 'object' && !Array.isArray(error)) {
    // Check if it's a ValidationResult-like object
    if ('error' in error && typeof error.error === 'string') {
      return error.error;
    }
    // Check for message property
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    // If it's an object with isValid/isDirty but no error string, return empty
    if ('isValid' in error || 'isDirty' in error) {
      // This is likely a ValidationResult object - extract error property safely
      const errorValue = 'error' in error ? error.error : '';
      return typeof errorValue === 'string' ? errorValue : '';
    }
  }
  
  // For any other type, try to convert to string or return empty
  if (error === null || error === undefined) {
    return '';
  }
  
  // Last resort: try to stringify, but return empty if it's still an object
  if (typeof error === 'object') {
    return '';
  }
  
  return String(error);
};

export function useForm({
  initialValues,
  validationRules,
  onSubmit
}: UseFormOptions) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Wrapper to ensure errors are always normalized when setting state
  // This is critical - we MUST normalize ALL values, including existing ones from prev
  const setErrorsNormalized = useCallback((errors: Record<string, any> | ((prev: Record<string, string>) => Record<string, any>)) => {
    setErrors((prev) => {
      const newErrors = typeof errors === 'function' ? errors(prev) : errors;
      const normalized: Record<string, string> = {};
      // Normalize ALL keys from newErrors - including any spread from prev
      Object.keys(newErrors).forEach(key => {
        const value = newErrors[key];
        // CRITICAL: Normalize even if value is null/undefined (convert to empty string)
        normalized[key] = normalizeError(value);
      });
      // Also normalize any existing keys from prev that weren't in newErrors
      Object.keys(prev).forEach(key => {
        if (!(key in normalized)) {
          normalized[key] = normalizeError(prev[key]);
        }
      });
      return normalized;
    });
  }, []);

  const handleChange = useCallback(
    (name: string, value: string) => {
      setValues(prev => ({ ...prev, [name]: value }));
      if (touched[name]) {
        const rules = validationRules[name];
        if (rules) {
          const result: ValidationResult = validateField(value, rules);
          // CRITICAL: Extract error as string BEFORE storing - don't pass result object
          const errorString = typeof result.error === 'string' ? result.error : '';
          // Use normalized setter - this will normalize everything including prev values
          setErrorsNormalized(prev => {
            const updated = { ...prev };
            updated[name] = errorString;
            return updated;
          });
        }
      }
    },
    [touched, validationRules, setErrorsNormalized]
  );

  const handleBlur = useCallback(
    (name: string) => {
      setTouched(prev => ({ ...prev, [name]: true }));
      const rules = validationRules[name];
      if (rules) {
        const result: ValidationResult = validateField(values[name], rules);
        // CRITICAL: Extract error as string immediately - use normalizeError for safety
        const errorString = normalizeError(result.error);
        // Use normalized setter - this will normalize everything including prev values
        setErrorsNormalized(prev => {
          const updated = { ...prev };
          updated[name] = errorString;
          return updated;
        });
      } else {
        // Clear error if no rules
        setErrorsNormalized(prev => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    },
    [values, validationRules, setErrorsNormalized]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const allTouched: Record<string, boolean> = {};
      Object.keys(values).forEach(key => {
        allTouched[key] = true;
      });
      setTouched(allTouched);

      const newErrors: Record<string, string> = {};
      let hasErrors = false;
      Object.keys(validationRules).forEach(key => {
        const rules = validationRules[key];
        if (rules) {
          const result: ValidationResult = validateField(values[key] || '', rules);
          if (!result.isValid) {
            // CRITICAL: Extract error as string BEFORE storing
            const errorString = typeof result.error === 'string' ? result.error : '';
            newErrors[key] = errorString;
            hasErrors = true;
          }
        }
      });
      // Use normalized setter - this will normalize everything
      setErrorsNormalized(newErrors);

      if (!hasErrors) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validationRules, onSubmit, setErrorsNormalized]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Double-check normalization before returning (defensive)
  const normalizedErrors = useMemo(() => {
    const normalized: Record<string, string> = {};
    Object.keys(errors).forEach(key => {
      const errorValue = errors[key];
      // Extra safety: if somehow an object got in, normalize it
      normalized[key] = normalizeError(errorValue);
    });
    return normalized;
  }, [errors]);

  return {
    values,
    errors: normalizedErrors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  };
}


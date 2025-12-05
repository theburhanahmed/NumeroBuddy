'use client';

import { useState, useCallback } from 'react';
import { validateField, ValidationRules } from '@/lib/form-validation';

interface UseFormOptions {
  initialValues: Record<string, string>;
  validationRules: ValidationRules;
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
}

export function useForm({
  initialValues,
  validationRules,
  onSubmit
}: UseFormOptions) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (name: string, value: string) => {
      setValues(prev => ({ ...prev, [name]: value }));
      if (touched[name]) {
        const rules = validationRules[name];
        if (rules) {
          const error = validateField(value, rules);
          setErrors(prev => ({ ...prev, [name]: error }));
        }
      }
    },
    [touched, validationRules]
  );

  const handleBlur = useCallback(
    (name: string) => {
      setTouched(prev => ({ ...prev, [name]: true }));
      const rules = validationRules[name];
      if (rules) {
        const error = validateField(values[name], rules);
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    },
    [values, validationRules]
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
        const error = validateField(values[key] || '', validationRules[key]);
        if (error) {
          newErrors[key] = error;
          hasErrors = true;
        }
      });
      setErrors(newErrors);

      if (!hasErrors) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validationRules, onSubmit]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  };
}


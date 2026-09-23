import { createContext, type ReactNode, useContext, useId } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

interface FieldErrorContextValue {
  name: string;
  id: string;
  invalid: boolean;
  message?: string;
}

const FieldErrorContext = createContext<FieldErrorContextValue | null>(null);

// The field owns placement; this provider adds no layout wrapper.
export function FieldErrorScope({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  const id = useId();
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name, exact: true });
  const { error } = getFieldState(name, formState);

  return (
    <FieldErrorContext.Provider
      value={{ name, id, invalid: Boolean(error), message: error?.message }}
    >
      {children}
    </FieldErrorContext.Provider>
  );
}

export function useFieldErrorAttributes(name?: string) {
  const error = useContext(FieldErrorContext);
  if (!error || error.name !== name) return {};

  return {
    'aria-invalid': error.invalid || undefined,
    'aria-describedby': error.message ? error.id : undefined,
  };
}

export function FieldErrorMessage({ name }: { name?: string }) {
  const error = useContext(FieldErrorContext);
  if (!error?.message || error.name !== name) return null;

  return (
    <p id={error.id} className="mt-1 text-sm font-normal text-red-600">
      {error.message}
    </p>
  );
}

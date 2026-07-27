import clsx from "clsx";
import { forwardRef } from "react";

/**
 * Hairline-underline field. No boxes anywhere in this system: the label sits
 * above in mono uppercase and the underline turns signal-red on focus.
 */

interface Wrap {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

export function FieldShell({ label, required, error, hint, className, children, htmlFor }: Wrap) {
  return (
    <div className={clsx("min-w-0", className)}>
      <label htmlFor={htmlFor} className="label mb-1.5 block">
        {label}
        {required && <span className="ml-1 text-signal">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 font-mono text-micro uppercase tracking-[0.14em] text-signal">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-small text-ink-3">{hint}</p>
      ) : null}
    </div>
  );
}

export const TextField = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & Omit<Wrap, "children">
>(function TextField({ label, required, error, hint, className, ...rest }, ref) {
  return (
    <FieldShell
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
      htmlFor={rest.id}
    >
      <input ref={ref} className={clsx("field", error && "field-invalid")} {...rest} />
    </FieldShell>
  );
});

export const SelectField = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & Omit<Wrap, "children">
>(function SelectField({ label, required, error, hint, className, children, ...rest }, ref) {
  return (
    <FieldShell
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
      htmlFor={rest.id}
    >
      <select
        ref={ref}
        className={clsx("field appearance-none pr-6", error && "field-invalid")}
        {...rest}
      >
        {children}
      </select>
    </FieldShell>
  );
});

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & Omit<Wrap, "children">
>(function TextAreaField({ label, required, error, hint, className, ...rest }, ref) {
  return (
    <FieldShell
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
      htmlFor={rest.id}
    >
      <textarea
        ref={ref}
        className={clsx("field resize-none", error && "field-invalid")}
        {...rest}
      />
    </FieldShell>
  );
});

/** Square hairline checkbox — reads as a control, not a toy. */
export function CheckField({
  label,
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label
      className={clsx(
        "group tap inline-flex cursor-pointer select-none items-center gap-3",
        className
      )}
    >
      <input type="checkbox" className="peer sr-only" {...rest} />
      {/* The inner mark is a descendant, not a sibling, so it needs the arbitrary
          child variant — plain `peer-checked:` would never reach it. */}
      <span
        aria-hidden
        className="relative h-4 w-4 shrink-0 border border-ink transition-colors duration-200
                   peer-checked:bg-ink peer-checked:[&>span]:scale-100
                   peer-focus-visible:outline peer-focus-visible:outline-2
                   peer-focus-visible:outline-offset-2 peer-focus-visible:outline-signal"
      >
        <span
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2
                     scale-0 bg-paper transition-transform duration-200 ease-swiss"
        />
      </span>
      <span className="font-mono text-micro uppercase tracking-[0.14em] text-ink-2 transition-colors group-hover:text-ink">
        {label}
      </span>
    </label>
  );
}

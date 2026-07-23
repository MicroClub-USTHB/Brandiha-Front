"use client";

import {
  ChangeEventHandler,
  ComponentPropsWithoutRef,
  HTMLInputTypeAttribute,
  ReactNode,
} from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
> = {
  name: TName;
  label: ReactNode;
  description?: ReactNode;
  required?: boolean;
  control: ControllerProps<TFieldValues, TName, TTransformedValues>["control"];
};

type FormBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
> = FormControlProps<TFieldValues, TName, TTransformedValues> & {
  horizontal?: boolean;
  controlFirst?: boolean;
  hideLabel?: boolean;
  fieldClassName?: string;
  children: (
    field: Parameters<
      ControllerProps<TFieldValues, TName, TTransformedValues>["render"]
    >[0]["field"] & {
      "aria-invalid": boolean;
      id: string;
    }
  ) => ReactNode;
};

type FormControlFunction<
  ExtraProps extends Record<string, unknown> = Record<never, never>
> = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
>(
  props: FormControlProps<TFieldValues, TName, TTransformedValues> & ExtraProps
) => ReactNode;

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues
>({
  children,
  control,
  label,
  name,
  description,
  required,
  controlFirst,
  horizontal,
  hideLabel,
  fieldClassName,
}: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const labelElement = (
          <FieldLabel htmlFor={field.name} className={hideLabel ? "sr-only" : undefined}>
            <span className="text-md">
              {label}
              {required && (
                <span
                  className="ml-0.5 inline-block translate-y-[0.15em] text-lg font-bold leading-none text-primary"
                  aria-hidden="true"
                >
                  *
                </span>
              )}
            </span>
          </FieldLabel>
        );

        const descriptionElement = description && (
          <FieldDescription>{description}</FieldDescription>
        );

        const control = children({
          ...field,
          id: field.name,
          "aria-invalid": fieldState.invalid,
        });

        const errorElem = fieldState.invalid && (
          <FieldError errors={[fieldState.error]} />
        );

        return (
          <Field
            data-invalid={fieldState.invalid}
            orientation={horizontal ? "horizontal" : undefined}
            className={fieldClassName}
          >
            {controlFirst ? (
              <>
                {control}
                <FieldContent>
                  {labelElement}
                  {errorElem}
                </FieldContent>
              </>
            ) : (
              <>
                {hideLabel ? (
                  labelElement
                ) : (
                  <FieldContent>{labelElement}</FieldContent>
                )}
                {control}
                {descriptionElement}
                {errorElem}
              </>
            )}
          </Field>
        );
      }}
    />
  );
}

export const FormInput: FormControlFunction<{
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  className?: string;
  icon?: ReactNode;
  step?: number | string;
  disabled?: boolean;
  onChangeCapture?: ChangeEventHandler<HTMLInputElement>;
}> = ({
  type,
  placeholder,
  className,
  icon,
  disabled,
  onChangeCapture,
  ...props
}) => (
    <FormField {...props} hideLabel>
      {(field) => (
        <Input
          type={type}
          placeholder={
            placeholder ?? (typeof props.label === "string" ? props.label : undefined)
          }
          icon={icon}
          required={props.required}
          className={className}
          disabled={disabled}
          onChangeCapture={onChangeCapture}
          {...field}
        />
      )}
    </FormField>
  );

export const FormTextarea: FormControlFunction<
  ComponentPropsWithoutRef<typeof Textarea>
> = ({ placeholder, className, ...props }) => (
  <FormField {...props} hideLabel>
    {(field) => (
      <Textarea
        placeholder={
          placeholder ?? (typeof props.label === "string" ? props.label : undefined)
        }
        required={props.required}
        className={className}
        {...field}
      />
    )}
  </FormField>
);

export const FormSelect: FormControlFunction<{
  children: ReactNode;
  placeholder?: string;
  disabled?: boolean;
}> = ({ children, placeholder, disabled, ...props }) => (
  // `hideLabel` + label-as-placeholder so the trigger reads as a pill matching
  // the text inputs (same height, radius, border-2, and card background).
  <FormField {...props} hideLabel>
    {({ onChange, onBlur, ...field }) => (
      <Select {...field} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          aria-invalid={field["aria-invalid"]}
          id={field.id}
          onBlur={onBlur}
          // Inline bg/border tokens so the trigger fill and stroke exactly match
          // the text-input pill, regardless of the base trigger classes.
          style={{ backgroundColor: "var(--card)", borderColor: "var(--input)" }}
          className="relative h-12 w-full rounded-lg border-2 px-4 text-base shadow-xs md:text-sm data-[size=default]:h-12"
        >
          {/* Decorative break in the top-left border, matching the inputs. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-[3px] left-5 h-[3px] w-3.5"
            style={{ backgroundColor: "var(--card)" }}
          />
          {props.required && (
            <span
              aria-hidden
              className="pointer-events-none absolute top-1.5 right-3 text-lg leading-none font-bold text-primary"
            >
              *
            </span>
          )}
          <SelectValue
            placeholder={
              placeholder ??
              (typeof props.label === "string" ? props.label : "Select")
            }
          />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    )}
  </FormField>
);

export const FormCheckbox: FormControlFunction = (props) => (
  // The horizontal Field top-aligns the box with the label block (`items-start`)
  // for multi-line labels; a single-line checkbox reads better centered. The
  // matching label bottom-margin reset lives in the `.reg-form` global styles.
  <FormField {...props} horizontal controlFirst fieldClassName="!items-center">
    {({ onChange, value, ...field }) => (
      <Checkbox {...field} checked={value} onCheckedChange={onChange} />
    )}
  </FormField>
);

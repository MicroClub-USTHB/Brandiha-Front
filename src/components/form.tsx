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
}: FormBaseProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const labelElement = (
          <FieldLabel htmlFor={field.name} className={hideLabel ? "sr-only" : undefined}>
            <span>
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
}> = ({ children, placeholder = "Select", disabled, ...props }) => (
  <FormField {...props}>
    {({ onChange, onBlur, ...field }) => (
      <Select {...field} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          aria-invalid={field["aria-invalid"]}
          id={field.id}
          onBlur={onBlur}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    )}
  </FormField>
);

export const FormCheckbox: FormControlFunction = (props) => (
  <FormField {...props} horizontal controlFirst>
    {({ onChange, value, ...field }) => (
      <Checkbox {...field} checked={value} onCheckedChange={onChange} />
    )}
  </FormField>
);

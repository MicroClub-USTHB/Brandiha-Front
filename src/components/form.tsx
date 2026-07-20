"use client";

import { HTMLInputTypeAttribute, ReactNode } from "react";
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FormControlProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  label: ReactNode;
  description?: ReactNode;
  required?: boolean;
};

type FieldRenderProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = ControllerRenderProps<TFieldValues, TName> & {
  id: string;
  "aria-invalid": boolean;
};

function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  required,
  horizontal,
  children,
}: FormControlProps<TFieldValues, TName> & {
  horizontal?: boolean;
  children: (field: FieldRenderProps<TFieldValues, TName>) => ReactNode;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const control = children({
          ...field,
          id: field.name,
          "aria-invalid": fieldState.invalid,
        });

        const labelElement = (
          <Label htmlFor={field.name}>
            {label}
            {required && (
              <span aria-hidden className="text-destructive">
                *
              </span>
            )}
          </Label>
        );

        return (
          <div className="flex flex-col gap-1.5">
            {horizontal ? (
              <div className="flex items-center gap-2">
                {control}
                {labelElement}
              </div>
            ) : (
              <>
                {labelElement}
                {control}
              </>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            {fieldState.error?.message && (
              <p className="text-sm text-destructive">{fieldState.error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}

export function FormInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  type,
  placeholder,
  ...props
}: FormControlProps<TFieldValues, TName> & {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
}) {
  return (
    <FormField {...props}>
      {({ value, ...field }) => (
        <Input {...field} value={value ?? ""} type={type} placeholder={placeholder} />
      )}
    </FormField>
  );
}

export function FormTextarea<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  placeholder,
  ...props
}: FormControlProps<TFieldValues, TName> & { placeholder?: string }) {
  return (
    <FormField {...props}>
      {({ value, ...field }) => (
        <Textarea {...field} value={value ?? ""} placeholder={placeholder} />
      )}
    </FormField>
  );
}

export function FormSelect<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  children,
  placeholder = "Select",
  ...props
}: FormControlProps<TFieldValues, TName> & {
  children: ReactNode;
  placeholder?: string;
}) {
  return (
    <FormField {...props}>
      {({ value, onChange, onBlur, name, id, "aria-invalid": ariaInvalid }) => (
        <Select value={value} onValueChange={(next) => onChange(next)} name={name}>
          <SelectTrigger
            id={id}
            aria-invalid={ariaInvalid}
            onBlur={onBlur}
            className="w-full"
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
      )}
    </FormField>
  );
}

export function FormCheckbox<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: FormControlProps<TFieldValues, TName>) {
  return (
    <FormField {...props} horizontal>
      {({ value, onChange, onBlur, name, id, "aria-invalid": ariaInvalid }) => (
        <Checkbox
          checked={!!value}
          onCheckedChange={(checked) => onChange(checked)}
          onBlur={onBlur}
          name={name}
          id={id}
          aria-invalid={ariaInvalid}
        />
      )}
    </FormField>
  );
}

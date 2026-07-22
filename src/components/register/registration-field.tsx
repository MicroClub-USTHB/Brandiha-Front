import { Control, FieldPath } from "react-hook-form";
import { FormCheckbox, FormInput, FormSelect, FormTextarea } from "@/components/form";
import { SelectItem } from "@/components/ui/select";
import { FIELD_ICONS } from "@/components/register/field-icons";
import { RegistrationFormData } from "@/lib/validators/registration-schema";

type RegistrationFieldProps = {
  control: Control<RegistrationFormData>;
  name: FieldPath<RegistrationFormData>;
  label: string;
  type?: string;
  options?: readonly string[];
  required: boolean;
};

/** Renders the right form control for a single registration field by its type. */
export function RegistrationField({
  control,
  name,
  label,
  type,
  options,
  required,
}: RegistrationFieldProps) {
  const common = { control, name, label };

  switch (type) {
    case "textarea":
      return <FormTextarea {...common} required={required} />;

    case "boolean":
      return <FormCheckbox {...common} />;

    case "select":
      return (
        <FormSelect {...common} required={required}>
          {options?.map((option) => (
            <SelectItem key={option} value={option} className="font-sans">
              {option}
            </SelectItem>
          ))}
        </FormSelect>
      );

    default:
      return (
        <FormInput
          {...common}
          type={type}
          icon={FIELD_ICONS[name]}
          required={required}
        />
      );
  }
}

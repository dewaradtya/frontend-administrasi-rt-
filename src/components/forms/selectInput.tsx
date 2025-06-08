interface Option {
  label: string;
  value: string | number;
}

interface SelectInputProps {
  name: string;
  value: string | number;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean;
}

export default function SelectInput({
  name,
  value,
  options,
  onChange,
  required = false,
  placeholder,
  readOnly = false,
}: SelectInputProps) {
  if (readOnly) {
    const selected = options.find((opt) => opt.value === value);

    return (
      <>
        <input type="hidden" name={name} value={value} />
        <div className="w-full p-2 border rounded bg-gray-100 text-gray-600">
          {selected?.label ?? "-"}
        </div>
      </>
    );
  }

  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-2 border rounded"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

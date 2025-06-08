interface CheckboxInputProps {
  name: string;
  checked: boolean;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CheckboxInput({
  name,
  checked,
  label,
  onChange,
}: CheckboxInputProps) {
  return (
    <div className="flex items-center space-x-2">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} />
      <label htmlFor={name}>{label}</label>
    </div>
  );
}

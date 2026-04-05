interface CustomLabelProps {
  id: string;
  label: string;
}
export default function CustomLabel({ id, label }: CustomLabelProps) {
  return (
    <label htmlFor={id} className="text-xs text-gray-500 font-semibold">
      {label}
    </label>
  );
}

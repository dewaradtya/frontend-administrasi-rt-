interface FormErrorMessageProps {
  message?: string;
  id?: string;
}

export default function ErrorMessage({ message, id }: FormErrorMessageProps) {
  if (!message) return null;

  return (
    <p id={id} className="mt-1 text-sm text-red-600" role="alert">
      {message}
    </p>
  );
}

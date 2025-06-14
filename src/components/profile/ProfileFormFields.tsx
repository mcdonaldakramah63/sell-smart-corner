
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  type?: string;
  rows?: number;
  description?: string;
  showCharCount?: boolean;
}

export const FormField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  required,
  maxLength,
  type = 'text',
  rows,
  description,
  showCharCount
}: FormFieldProps) => {
  const isTextarea = rows !== undefined;
  
  return (
    <div>
      <Label htmlFor={id}>
        {label} {required && '*'}
      </Label>
      {isTextarea ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`mt-1 ${error ? 'border-red-500' : ''}`}
          rows={rows}
          maxLength={maxLength}
        />
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`mt-1 ${error ? 'border-red-500' : ''}`}
          required={required}
          maxLength={maxLength}
        />
      )}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
      {showCharCount && maxLength && (
        <p className="text-xs text-muted-foreground mt-1">
          {value.length}/{maxLength} characters
        </p>
      )}
    </div>
  );
};

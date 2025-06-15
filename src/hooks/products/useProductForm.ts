
import { useState } from "react";
import { validateTextContent, validatePrice } from "@/utils/validation";

export interface ProductFormFields {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  location: string;
}

export const useProductForm = (initial: ProductFormFields) => {
  const [fields, setFields] = useState<ProductFormFields>(initial);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const handleInputChange = (field: keyof ProductFormFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!fields.title || fields.title.length < 3) newErrors.title = "Title too short";
    if (!fields.price || !validatePrice(fields.price).isValid) newErrors.price = "Invalid price";
    if (!fields.category) newErrors.category = "Choose category";
    if (!fields.condition) newErrors.condition = "Choose condition";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  return {
    fields,
    errors,
    setFields,
    setErrors,
    handleInputChange,
    validateForm,
  };
};

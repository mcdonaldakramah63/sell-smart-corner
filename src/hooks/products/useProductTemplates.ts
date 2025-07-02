import { useState } from 'react';

interface ProductTemplate {
  id: string;
  name: string;
  category: string;
  fields: {
    title: string;
    description: string;
    condition: string;
    tags?: string[];
    customFields?: Record<string, any>;
  };
}

export function useProductTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<ProductTemplate | null>(null);

  const applyTemplate = (template: ProductTemplate, currentFields: any) => {
    return {
      ...currentFields,
      description: template.fields.description,
      condition: template.fields.condition,
      // Keep existing title if already filled
      title: currentFields.title || template.fields.title,
    };
  };

  const clearTemplate = () => {
    setSelectedTemplate(null);
  };

  return {
    selectedTemplate,
    setSelectedTemplate,
    applyTemplate,
    clearTemplate
  };
}

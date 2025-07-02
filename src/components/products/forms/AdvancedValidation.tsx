
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

interface ValidationRule {
  id: string;
  field: string;
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  passed: boolean;
}

interface AdvancedValidationProps {
  fields: any;
  images: File[];
}

export default function AdvancedValidation({ fields, images }: AdvancedValidationProps) {
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);

  useEffect(() => {
    const rules: ValidationRule[] = [
      {
        id: 'title-length',
        field: 'title',
        type: fields.title.length >= 10 ? 'success' : fields.title.length >= 3 ? 'warning' : 'error',
        message: fields.title.length >= 10 ? 'Good title length' : fields.title.length >= 3 ? 'Consider a longer, more descriptive title' : 'Title too short (minimum 3 characters)',
        passed: fields.title.length >= 3
      },
      {
        id: 'description-quality',
        field: 'description',
        type: fields.description.length >= 50 ? 'success' : fields.description.length >= 20 ? 'warning' : 'error',
        message: fields.description.length >= 50 ? 'Good description length' : fields.description.length >= 20 ? 'Add more details to help buyers' : 'Description should be more detailed',
        passed: fields.description.length >= 20
      },
      {
        id: 'price-validation',
        field: 'price',
        type: parseFloat(fields.price) > 0 ? 'success' : 'error',
        message: parseFloat(fields.price) > 0 ? 'Valid price' : 'Price must be greater than 0',
        passed: parseFloat(fields.price) > 0
      },
      {
        id: 'category-selected',
        field: 'category',
        type: fields.category ? 'success' : 'error',
        message: fields.category ? 'Category selected' : 'Please select a category',
        passed: !!fields.category
      },
      {
        id: 'condition-selected',
        field: 'condition',
        type: fields.condition ? 'success' : 'error',
        message: fields.condition ? 'Condition specified' : 'Please specify item condition',
        passed: !!fields.condition
      },
      {
        id: 'images-count',
        field: 'images',
        type: images.length >= 3 ? 'success' : images.length >= 1 ? 'warning' : 'error',
        message: images.length >= 3 ? `${images.length} images uploaded` : images.length >= 1 ? 'Consider adding more images' : 'At least one image required',
        passed: images.length >= 1
      },
      {
        id: 'location-info',
        field: 'location',
        type: fields.location ? 'info' : 'info',
        message: fields.location ? 'Location helps buyers find you' : 'Consider adding location for better visibility',
        passed: true
      }
    ];

    setValidationRules(rules);
  }, [fields, images]);

  const getIcon = (type: ValidationRule['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getBadgeVariant = (type: ValidationRule['type']) => {
    switch (type) {
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
      case 'info':
        return 'outline';
    }
  };

  const errorCount = validationRules.filter(rule => rule.type === 'error').length;
  const warningCount = validationRules.filter(rule => rule.type === 'warning').length;
  const successCount = validationRules.filter(rule => rule.type === 'success').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Listing Quality Check</span>
          <div className="flex gap-2">
            {errorCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {errorCount} errors
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {warningCount} warnings
              </Badge>
            )}
            <Badge variant="default" className="text-xs">
              {successCount} passed
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {validationRules.map((rule) => (
            <div key={rule.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
              {getIcon(rule.type)}
              <span className="text-sm flex-1">{rule.message}</span>
              {rule.type !== 'info' && (
                <Badge variant={getBadgeVariant(rule.type)} className="text-xs">
                  {rule.type}
                </Badge>
              )}
            </div>
          ))}
        </div>
        
        {errorCount === 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-green-800">
                Ready to publish! Your listing meets all requirements.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

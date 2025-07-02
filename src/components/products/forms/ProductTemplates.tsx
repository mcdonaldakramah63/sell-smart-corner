
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Smartphone, Car, Home, Shirt, Package } from 'lucide-react';

interface ProductTemplate {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  fields: {
    title: string;
    description: string;
    condition: string;
    tags?: string[];
    customFields?: Record<string, any>;
  };
}

interface ProductTemplatesProps {
  onSelectTemplate: (template: ProductTemplate) => void;
}

const templates: ProductTemplate[] = [
  {
    id: 'electronics-phone',
    name: 'Smartphone',
    category: 'Electronics',
    icon: <Smartphone className="h-4 w-4" />,
    fields: {
      title: '',
      description: 'Excellent condition smartphone with original charger and case included.',
      condition: 'like-new',
      tags: ['smartphone', 'mobile', 'phone'],
      customFields: {
        brand: '',
        model: '',
        storage: '',
        color: ''
      }
    }
  },
  {
    id: 'automotive-car',
    name: 'Vehicle',
    category: 'Automotive',
    icon: <Car className="h-4 w-4" />,
    fields: {
      title: '',
      description: 'Well-maintained vehicle with service history. Non-smoking owner.',
      condition: 'good',
      tags: ['car', 'vehicle', 'transport'],
      customFields: {
        make: '',
        model: '',
        year: '',
        mileage: '',
        transmission: ''
      }
    }
  },
  {
    id: 'home-furniture',
    name: 'Furniture',
    category: 'Home & Garden',
    icon: <Home className="h-4 w-4" />,
    fields: {
      title: '',
      description: 'Beautiful furniture piece in great condition. Perfect for modern homes.',
      condition: 'good',
      tags: ['furniture', 'home', 'decor'],
      customFields: {
        material: '',
        dimensions: '',
        color: ''
      }
    }
  },
  {
    id: 'fashion-clothing',
    name: 'Clothing',
    category: 'Fashion',
    icon: <Shirt className="h-4 w-4" />,
    fields: {
      title: '',
      description: 'Stylish clothing item in excellent condition. Rarely worn.',
      condition: 'like-new',
      tags: ['fashion', 'clothing', 'style'],
      customFields: {
        size: '',
        brand: '',
        color: '',
        material: ''
      }
    }
  },
  {
    id: 'books-textbook',
    name: 'Textbook',
    category: 'Books',
    icon: <BookOpen className="h-4 w-4" />,
    fields: {
      title: '',
      description: 'Academic textbook in good condition. No highlighting or writing inside.',
      condition: 'good',
      tags: ['book', 'textbook', 'education'],
      customFields: {
        author: '',
        edition: '',
        isbn: '',
        subject: ''
      }
    }
  },
  {
    id: 'general-item',
    name: 'General Item',
    category: 'General',
    icon: <Package className="h-4 w-4" />,
    fields: {
      title: '',
      description: 'Quality item in good condition. Well-maintained and ready for new owner.',
      condition: 'good',
      tags: ['item', 'general']
    }
  }
];

export default function ProductTemplates({ onSelectTemplate }: ProductTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];
  
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Product Templates
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose a template to get started quickly with pre-filled information
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Electronics">Electronics</TabsTrigger>
            <TabsTrigger value="Fashion">Fashion</TabsTrigger>
          </TabsList>
          
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20"
                onClick={() => onSelectTemplate(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {template.icon}
                      <h3 className="font-medium">{template.name}</h3>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {template.fields.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.fields.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}

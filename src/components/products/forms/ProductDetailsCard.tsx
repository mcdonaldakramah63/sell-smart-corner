
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DollarSign, MapPin, Tag } from "lucide-react";
import { Category } from "@/lib/types";

export interface ProductDetailsCardProps {
  fields: any;
  errors: Record<string, string | undefined>;
  handleInputChange: (field: string, value: string) => void;
  categories: Category[];
  categoriesLoading: boolean;
}

export default function ProductDetailsCard({
  fields,
  errors,
  handleInputChange,
  categories,
  categoriesLoading,
}: ProductDetailsCardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Product Title *</Label>
          <Input
            id="title"
            value={fields.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            maxLength={100}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" /> Price (GHS) *
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₵</span>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={fields.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              className="pl-8"
              placeholder="0.00"
            />
          </div>
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={fields.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows={4}
          maxLength={2000}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Category *</Label>
          {categoriesLoading ? (
            <div className="py-2 text-muted-foreground">Loading categories…</div>
          ) : (
            <Select value={fields.category} onValueChange={(v) => handleInputChange("category", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>
        <div className="space-y-2">
          <Label>Condition *</Label>
          <Select value={fields.condition} onValueChange={(v) => handleInputChange("condition", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="like-new">Like New</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
          {errors.condition && <p className="text-red-500 text-sm">{errors.condition}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" /> Location
          </Label>
          <Input
            id="location"
            value={fields.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            maxLength={100}
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
        </div>
      </div>
    </div>
  );
}

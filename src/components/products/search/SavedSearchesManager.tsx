
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Search, Bell, Trash2, Edit } from "lucide-react";
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { useNavigate } from 'react-router-dom';

export function SavedSearchesManager() {
  const { savedSearches, loading, deleteSavedSearch, updateAlertSettings } = useSavedSearches();
  const navigate = useNavigate();

  const handleSearchClick = (search: any) => {
    // Navigate to products page with saved search parameters
    const params = new URLSearchParams();
    
    if (search.search_query) params.set('search', search.search_query);
    if (search.category_id) params.set('category', search.category_id);
    if (search.location_filters?.location) params.set('location', search.location_filters.location);
    if (search.price_range_min) params.set('min_price', search.price_range_min.toString());
    if (search.price_range_max) params.set('max_price', search.price_range_max.toString());
    if (search.filters?.condition) params.set('condition', search.filters.condition);
    if (search.filters?.sortBy) params.set('sort', search.filters.sortBy);
    
    navigate(`/products?${params.toString()}`);
  };

  const handleToggleAlert = async (searchId: string, enabled: boolean, frequency: string) => {
    await updateAlertSettings(searchId, enabled, frequency as 'immediate' | 'daily' | 'weekly');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (savedSearches.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No saved searches yet</h3>
          <p className="text-muted-foreground mb-4">
            Save your searches to get notified when new matching items are posted
          </p>
          <Button onClick={() => navigate('/products')}>
            Start Searching
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Saved Searches</h2>
      
      {savedSearches.map((search) => (
        <Card key={search.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{search.search_name}</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearchClick(search)}
                >
                  <Search className="h-4 w-4 mr-1" />
                  Run Search
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete saved search?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your saved search "{search.search_name}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => deleteSavedSearch(search.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Details */}
            <div className="flex flex-wrap gap-2">
              {search.search_query && (
                <Badge variant="secondary">Query: {search.search_query}</Badge>
              )}
              {search.location_filters?.location && (
                <Badge variant="secondary">Location: {search.location_filters.location}</Badge>
              )}
              {search.price_range_min && search.price_range_max && (
                <Badge variant="secondary">
                  Price: ${search.price_range_min} - ${search.price_range_max}
                </Badge>
              )}
              {search.filters?.condition && (
                <Badge variant="secondary">Condition: {search.filters.condition}</Badge>
              )}
            </div>

            {/* Alert Settings */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <Label htmlFor={`alert-${search.id}`}>Email alerts</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Select 
                  value={search.alert_frequency} 
                  onValueChange={(frequency) => 
                    handleToggleAlert(search.id, search.alert_enabled, frequency)
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
                <Switch
                  id={`alert-${search.id}`}
                  checked={search.alert_enabled}
                  onCheckedChange={(enabled) => 
                    handleToggleAlert(search.id, enabled, search.alert_frequency)
                  }
                />
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Created: {new Date(search.created_at).toLocaleDateString()}
              {search.last_alerted_at && (
                <span className="ml-4">
                  Last alert: {new Date(search.last_alerted_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

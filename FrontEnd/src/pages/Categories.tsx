import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { equipmentCategories } from '@/data/mockData';
import { SmartButton } from '@/components/ui/SmartButton';
import { Plus, Tag, Trash2, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(equipmentCategories);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    const newCategory = {
      id: `cat${Date.now()}`,
      name: newCategoryName.trim(),
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    
    toast({
      title: "Success",
      description: `Category "${newCategoryName}" has been added.`,
    });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    toast({
      title: "Deleted",
      description: `Category "${name}" has been removed.`,
    });
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/equipment')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Equipment
        </button>

        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title font-display">Equipment Categories</h1>
            <p className="text-muted-foreground mt-1 hidden sm:block">Manage equipment categories</p>
          </div>
        </div>

        {/* Add Category Form */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="categoryName" className="sr-only">Category Name</Label>
              <Input
                id="categoryName"
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <SmartButton type="submit" icon={<Plus className="w-4 h-4" />}>
              Add Category
            </SmartButton>
          </form>
        </div>

        {/* Categories List */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold">All Categories ({categories.length})</h2>
          </div>
          <div className="divide-y divide-border">
            {categories.map((category, index) => (
              <div 
                key={category.id} 
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Tag className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{category.name}</p>
                    {category.description && (
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteCategory(category.id, category.name)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          {categories.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No categories found. Add one above.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

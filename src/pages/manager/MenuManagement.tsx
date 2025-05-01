
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { getAllMenuItems, mockMenuItems } from "@/services/mockData";
import { MenuItem, NutritionInfo } from "@/types";
import {
  Search,
  Plus,
  Trash2,
  Pencil,
  Filter,
  MoreVertical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  
  // Form state for adding/editing items
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    category: string;
    isVeg: boolean;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    available: boolean;
    popular: boolean;
  }>({
    name: "",
    description: "",
    price: "",
    category: "",
    isVeg: true,
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    available: true,
    popular: false,
  });
  
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const items = await getAllMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuItems();
  }, []);
  
  // Reset form when opening the dialog
  useEffect(() => {
    if (isFormOpen && !editingItem) {
      // Reset form for new item
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        isVeg: true,
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        available: true,
        popular: false,
      });
    } else if (isFormOpen && editingItem) {
      // Populate form for editing
      setFormData({
        name: editingItem.name,
        description: editingItem.description,
        price: editingItem.price.toString(),
        category: editingItem.category,
        isVeg: editingItem.nutrition.isVeg,
        calories: editingItem.nutrition.calories.toString(),
        protein: editingItem.nutrition.protein.toString(),
        carbs: editingItem.nutrition.carbs.toString(),
        fat: editingItem.nutrition.fat.toString(),
        available: editingItem.available,
        popular: !!editingItem.popular,
      });
    }
  }, [isFormOpen, editingItem]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };
  
  const handleSubmit = () => {
    // Validate form
    const requiredFields = [
      "name",
      "description",
      "price",
      "category",
      "calories",
      "protein",
      "carbs",
      "fat",
    ];
    
    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in all required fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }
    
    const nutritionInfo: NutritionInfo = {
      calories: parseInt(formData.calories),
      protein: parseInt(formData.protein),
      carbs: parseInt(formData.carbs),
      fat: parseInt(formData.fat),
      isVeg: formData.isVeg,
    };
    
    if (editingItem) {
      // Update existing item
      const updatedItem: MenuItem = {
        ...editingItem,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        nutrition: nutritionInfo,
        available: formData.available,
        popular: formData.popular,
      };
      
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editingItem.id ? updatedItem : item
        )
      );
      
      toast({
        title: "Menu Item Updated",
        description: `${updatedItem.name} has been updated successfully.`,
      });
    } else {
      // Add new item
      const newItem: MenuItem = {
        id: `m${Math.floor(Math.random() * 10000)}`,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        nutrition: nutritionInfo,
        available: formData.available,
        popular: formData.popular,
        canteenId: "c1", // Default canteen ID
      };
      
      setMenuItems((prevItems) => [...prevItems, newItem]);
      
      toast({
        title: "Menu Item Added",
        description: `${newItem.name} has been added to your menu.`,
      });
    }
    
    setIsFormOpen(false);
    setEditingItem(null);
  };
  
  const handleDeleteItem = (itemId: string) => {
    setMenuItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    
    toast({
      title: "Menu Item Deleted",
      description: "The menu item has been removed from your menu.",
    });
  };
  
  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };
  
  const toggleItemAvailability = (itemId: string, available: boolean) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, available } : item
      )
    );
    
    toast({
      title: available ? "Item Available" : "Item Unavailable",
      description: `The item is now ${available ? "available" : "unavailable"} on your menu.`,
    });
  };
  
  // Filter menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    
    const matchesDietary =
      dietaryFilter === "all" ||
      (dietaryFilter === "veg" && item.nutrition.isVeg) ||
      (dietaryFilter === "non-veg" && !item.nutrition.isVeg);
    
    return matchesSearch && matchesCategory && matchesDietary;
  });
  
  // Get unique categories
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Menu Management</h1>
          <p className="text-muted-foreground">
            Manage your canteen menu items and categories
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Veggie Burger"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the item"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">+ Add New Category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <h3 className="font-medium">Nutrition Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    name="calories"
                    value={formData.calories}
                    onChange={handleInputChange}
                    type="number"
                    placeholder="0"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    name="protein"
                    value={formData.protein}
                    onChange={handleInputChange}
                    type="number"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    name="carbs"
                    value={formData.carbs}
                    onChange={handleInputChange}
                    type="number"
                    placeholder="0"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    name="fat"
                    value={formData.fat}
                    onChange={handleInputChange}
                    type="number"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isVeg"
                  checked={formData.isVeg}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("isVeg", checked)
                  }
                />
                <Label htmlFor="isVeg">Vegetarian</Label>
              </div>
              
              <Separator />
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("available", checked)
                  }
                />
                <Label htmlFor="available">Available Now</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="popular"
                  checked={formData.popular}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("popular", checked)
                  }
                />
                <Label htmlFor="popular">Mark as Popular</Label>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSubmit}>
                {editingItem ? "Save Changes" : "Add Item"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={dietaryFilter}
          onValueChange={(value) => setDietaryFilter(value as any)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Dietary filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="veg">Vegetarian Only</SelectItem>
            <SelectItem value="non-veg">Non-Vegetarian Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Menu Items */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className={!item.available ? "opacity-60" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditItem(item)}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          toggleItemAvailability(item.id, !item.available)
                        }
                        className="cursor-pointer"
                      >
                        {item.available ? (
                          <>
                            <Filter className="mr-2 h-4 w-4" /> Mark Unavailable
                          </>
                        ) : (
                          <>
                            <Filter className="mr-2 h-4 w-4" /> Mark Available
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-destructive cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-bold">${item.price.toFixed(2)}</div>
                  <div className="space-x-2">
                    <Badge variant={item.nutrition.isVeg ? "default" : "outline"}>
                      {item.nutrition.isVeg ? "Veg" : "Non-veg"}
                    </Badge>
                    <Badge variant="secondary">{item.category}</Badge>
                    {item.popular && (
                      <Badge className="bg-amber-500">Popular</Badge>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <div className="font-medium">Calories</div>
                      <div>{item.nutrition.calories}</div>
                    </div>
                    <div>
                      <div className="font-medium">Protein</div>
                      <div>{item.nutrition.protein}g</div>
                    </div>
                    <div>
                      <div className="font-medium">Carbs</div>
                      <div>{item.nutrition.carbs}g</div>
                    </div>
                    <div>
                      <div className="font-medium">Fat</div>
                      <div>{item.nutrition.fat}g</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditItem(item)}
                >
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-card rounded-lg">
          <h2 className="text-xl font-medium mb-2">No menu items found</h2>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or add new items to your menu
          </p>
          <Dialog onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add Item
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      )}
    </div>
  );
}

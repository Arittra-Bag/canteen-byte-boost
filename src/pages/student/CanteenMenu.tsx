
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/CartContext";
import {
  getMenuItemsByCanteen,
  getCanteenById,
} from "@/services/supabaseData";
import { MenuItem, Canteen } from "@/types";
import { ChevronLeft, ShoppingCart, Plus, Minus, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function CanteenMenu() {
  const { canteenId } = useParams<{ canteenId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem, items: cartItems, updateQuantity } = useCart();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [canteen, setCanteen] = useState<Canteen | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "veg" | "non-veg">("all");
  
  useEffect(() => {
    if (!canteenId) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const [menuData, canteenData] = await Promise.all([
          getMenuItemsByCanteen(canteenId),
          getCanteenById(canteenId),
        ]);
        
        setMenuItems(menuData);
        
        if (canteenData) {
          setCanteen(canteenData);
          document.title = `${canteenData.name} | ByteBoost`;
        } else {
          toast({
            title: "Canteen Not Found",
            description: "The requested canteen could not be found.",
            variant: "destructive",
          });
        }
        
        // Set the first category as active
        if (menuData.length > 0) {
          const categories = Array.from(
            new Set(menuData.map((item) => item.category))
          );
          setActiveCategory(categories[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load canteen data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [canteenId, toast]);
  
  // Extract categories from menu items
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );
  
  // Filter menu items by category and type
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory ? item.category === activeCategory : true;
    
    // Filter by veg or non-veg
    const matchesType =
      filterType === "all" ||
      (filterType === "veg" && item.nutrition.isVeg) ||
      (filterType === "non-veg" && !item.nutrition.isVeg);
    
    return matchesCategory && matchesType;
  });
  
  // Helper to find item in cart
  const getCartQuantity = (menuItemId: string) => {
    const item = cartItems.find((item) => item.menuItemId === menuItemId);
    return item ? item.quantity : 0;
  };

  // Check if canteen is currently open
  const isCanteenOpen = () => {
    if (!canteen) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [openHours, openMinutes] = canteen.openingTime.split(":").map(Number);
    const [closeHours, closeMinutes] = canteen.closingTime.split(":").map(Number);
    
    const openingTime = openHours * 60 + openMinutes;
    const closingTime = closeHours * 60 + closeMinutes;
    
    return currentTime >= openingTime && currentTime <= closingTime;
  };

  return (
    <div>
      {/* Back button and header */}
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold">{canteen?.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{canteen?.location}</span>
              <span>•</span>
              {isCanteenOpen() ? (
                <span className="text-teal-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Open
                </span>
              ) : (
                <span className="text-amber-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Closed
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Filter Tabs */}
      <div className="mb-6">
        <Tabs
          defaultValue="all"
          value={filterType}
          onValueChange={(v) => setFilterType(v as any)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="veg">Vegetarian</TabsTrigger>
            <TabsTrigger value="non-veg">Non-Vegetarian</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Categories Horizontal Scroll */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-2 pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className="whitespace-nowrap"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Menu Items */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <Skeleton className="h-32 w-32 rounded-l" />
                <CardContent className="flex-1 p-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredMenuItems.length > 0 ? (
        <div className="space-y-4">
          {filteredMenuItems.map((item) => {
            const cartQuantity = getCartQuantity(item.id);
            
            return (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div
                    className="h-32 md:w-32 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${item.image || "https://images.unsplash.com/photo-1546069901-5ec6a79120b0"})`,
                    }}
                  >
                    {item.nutrition.isVeg ? (
                      <div className="m-2 w-5 h-5 bg-teal-500 flex items-center justify-center rounded-sm">
                        <div className="w-3 h-3 bg-white rounded-sm" />
                      </div>
                    ) : (
                      <div className="m-2 w-5 h-5 bg-amber-500 flex items-center justify-center rounded-sm">
                        <div className="w-3 h-3 bg-white rounded-sm" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <CardContent className="flex-1 p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="outline">
                              {item.nutrition.calories} cal
                            </Badge>
                            
                            {item.popular && (
                              <Badge className="bg-amber-500">Popular</Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${item.price.toFixed(2)}</div>
                        </div>
                      </div>
                      
                      {/* Nutrition bar */}
                      <div className="mt-4 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Protein: {item.nutrition.protein}g</span>
                          <span>Carbs: {item.nutrition.carbs}g</span>
                          <span>Fat: {item.nutrition.fat}g</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <Progress value={item.nutrition.protein * 2} className="h-1.5" />
                          <Progress value={item.nutrition.carbs} className="h-1.5" />
                          <Progress value={item.nutrition.fat * 2} className="h-1.5" />
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-4 pt-0 flex justify-end">
                      {cartQuantity > 0 ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, cartQuantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{cartQuantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => addItem(item, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="gap-2"
                          onClick={() => addItem(item)}
                        >
                          <ShoppingCart className="h-4 w-4" /> Add
                        </Button>
                      )}
                    </CardFooter>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 glass-card rounded-lg">
          <p className="text-xl text-muted-foreground">
            No items found for this category
          </p>
          <Button
            variant="link"
            onClick={() => {
              setActiveCategory(categories[0]);
              setFilterType("all");
            }}
          >
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );
}

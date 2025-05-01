
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, ChevronLeft, ShoppingCart, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, totalAmount } = useCart();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checking out",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Mock checkout process
    try {
      // In a real app, this would create an order in the backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been placed and will be ready soon.",
      });
      
      clearCart();
      navigate("/orders");
    } catch (error) {
      toast({
        title: "Checkout Failed",
        description: "There was an issue processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Group items by canteen
  const groupedItems = items.reduce((acc, item) => {
    const { canteenId } = item.menuItem;
    
    if (!acc[canteenId]) {
      acc[canteenId] = {
        canteenName: item.menuItem.canteenId,
        items: [],
      };
    }
    
    acc[canteenId].items.push(item);
    return acc;
  }, {} as Record<string, { canteenName: string; items: typeof items }>);

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Your Cart</h1>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2">
            <Card className="mb-4">
              <CardContent className="p-6">
                {Object.values(groupedItems).map((group, index) => (
                  <div key={group.canteenName}>
                    <h3 className="font-medium text-lg mb-4">
                      Canteen: {group.canteenName}
                    </h3>
                    
                    {group.items.map((item) => (
                      <div 
                        key={item.menuItemId} 
                        className="flex justify-between items-center py-4"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="h-16 w-16 rounded bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${item.menuItem.image || "https://images.unsplash.com/photo-1546069901-5ec6a79120b0"})`,
                            }}
                          />
                          
                          <div>
                            <h4 className="font-medium">{item.menuItem.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              ${item.menuItem.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.menuItemId)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          
                          <div className="w-20 text-right">
                            ${(item.menuItem.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {index < Object.values(groupedItems).length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => clearCart()}
                  className="text-muted-foreground"
                >
                  Clear Cart
                </Button>
                
                <Button onClick={() => navigate("/")}>Add More Items</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Order Summary</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service Fee</span>
                    <span>$0.50</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${(totalAmount + 0.5).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                  disabled={items.length === 0 || isProcessing}
                  onClick={handleCheckout}
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" /> Checkout
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 glass-card rounded-lg">
          <div className="flex justify-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
          </div>
          <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some delicious items to your cart!
          </p>
          <Button onClick={() => navigate("/")}>Browse Canteens</Button>
        </div>
      )}
    </div>
  );
}

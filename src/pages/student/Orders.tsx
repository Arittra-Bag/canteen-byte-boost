
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getOrdersByUser, getMenuItemById, getCanteenById } from "@/services/mockData";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { MenuItem, Order, Canteen } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, Clock, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Helper type for order with menu items and canteen info
type OrderWithDetails = Order & {
  menuItems: (MenuItem | undefined)[];
  canteen?: Canteen;
};

export default function Orders() {
  const { currentUser } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        const orderData = await getOrdersByUser(currentUser.id);
        
        // Fetch all menu items and canteen info for each order
        const ordersWithDetails = await Promise.all(
          orderData.map(async (order) => {
            const menuItems = await Promise.all(
              order.items.map(async (item) => {
                const menuItem = await getMenuItemById(item.menuItemId);
                return menuItem;
              })
            );
            
            const canteen = await getCanteenById(order.canteenId);
            
            return {
              ...order,
              menuItems,
              canteen,
            };
          })
        );
        
        // Sort orders by date (newest first)
        const sortedOrders = ordersWithDetails.sort(
          (a, b) =>
            new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
        );
        
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentUser]);
  
  const filterOrders = (orders: OrderWithDetails[]) => {
    if (filter === "active") {
      return orders.filter((order) => ["pending", "preparing", "ready"].includes(order.status));
    } else if (filter === "completed") {
      return orders.filter((order) => ["completed", "cancelled"].includes(order.status));
    }
    return orders;
  };
  
  const filteredOrders = filterOrders(orders);
  
  const reorderItems = (order: OrderWithDetails) => {
    // Add all items from the order to the cart
    order.menuItems.forEach((menuItem, index) => {
      if (menuItem) {
        addItem(menuItem, order.items[index].quantity);
      }
    });
    
    navigate("/cart");
  };
  
  const getOrderStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "preparing":
        return <Badge className="bg-amber-500">Preparing</Badge>;
      case "ready":
        return <Badge className="bg-teal-500">Ready</Badge>;
      case "completed":
        return <Badge className="bg-secondary">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
    }
  };

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
        <h1 className="text-2xl font-bold">Your Orders</h1>
      </div>
      
      <Tabs
        defaultValue="all"
        value={filter}
        onValueChange={(v) => setFilter(v as any)}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-6 w-1/4" />
                </div>
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{order.canteen?.name}</h3>
                    {getOrderStatusBadge(order.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(order.placedAt).toLocaleDateString()} at{" "}
                    {new Date(order.placedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {order.pickupTime ? (
                    <span>
                      Pickup: {new Date(order.pickupTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  ) : (
                    <span>Order will be ready soon</span>
                  )}
                </div>
                
                <div className="space-y-2">
                  {order.menuItems.map((item, index) =>
                    item ? (
                      <div
                        key={`${order.id}-${item.id}-${index}`}
                        className="flex justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="h-12 w-12 rounded bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${item.image || "https://images.unsplash.com/photo-1546069901-5ec6a79120b0"})`,
                            }}
                          />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ${item.price.toFixed(2)} × {order.items[index].quantity}
                            </div>
                          </div>
                        </div>
                        <div className="font-medium">
                          ${(item.price * order.items[index].quantity).toFixed(2)}
                        </div>
                      </div>
                    ) : (
                      <div key={`${order.id}-unknown-${index}`}>Item unavailable</div>
                    )
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="p-6 pt-0 flex justify-between items-center border-t border-border mt-4">
                <div className="font-medium">
                  Total: ${order.totalAmount.toFixed(2)}
                </div>
                
                {["completed", "cancelled"].includes(order.status) && (
                  <Button
                    variant="outline"
                    onClick={() => reorderItems(order)}
                    className="gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" /> Reorder
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-card rounded-lg">
          <h2 className="text-xl font-medium mb-2">No orders found</h2>
          <p className="text-muted-foreground mb-6">
            {filter === "all"
              ? "You haven't placed any orders yet."
              : filter === "active"
              ? "You don't have any active orders."
              : "You don't have any completed orders."}
          </p>
          {filter !== "all" ? (
            <Button onClick={() => setFilter("all")}>View All Orders</Button>
          ) : (
            <Button onClick={() => navigate("/")}>Browse Canteens</Button>
          )}
        </div>
      )}
    </div>
  );
}

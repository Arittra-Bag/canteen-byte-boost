
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockOrders, mockCanteens, mockMenuItems } from "@/services/mockData";
import { Order, MenuItem } from "@/types";
import { 
  ShoppingCart, 
  Clock, 
  Check, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  Utensils
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

export default function ManagerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "preparing" | "ready">("all");
  const { toast } = useToast();
  
  // Calculate summary stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  
  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        // In a real app, we'd fetch the canteen manager's orders
        // For demo, just use the mock orders
        const today = new Date().toISOString().split("T")[0];
        
        const ordersData = mockOrders;
        
        // Calculate stats
        const todayOrders = ordersData.filter((order) =>
          order.placedAt.startsWith(today)
        );
        
        const pendingOrders = ordersData.filter(
          (order) => order.status === "pending" || order.status === "preparing" || order.status === "ready"
        );
        
        const completedOrders = ordersData.filter(
          (order) => order.status === "completed"
        );
        
        setStats({
          totalOrders: ordersData.length,
          todayOrders: todayOrders.length,
          pendingOrders: pendingOrders.length,
          completedOrders: completedOrders.length,
        });
        
        setOrders(ordersData);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboard();
  }, []);
  
  const getOrdersByStatus = (status?: Order["status"]) => {
    if (!status || status === "all") {
      return orders.filter(order => 
        order.status === "pending" || 
        order.status === "preparing" || 
        order.status === "ready"
      );
    }
    return orders.filter((order) => order.status === status);
  };

  const getMenuItemName = (menuItemId: string) => {
    const item = mockMenuItems.find((item) => item.id === menuItemId);
    return item ? item.name : "Unknown Item";
  };
  
  const getCanteenName = (canteenId: string) => {
    const canteen = mockCanteens.find((canteen) => canteen.id === canteenId);
    return canteen ? canteen.name : "Unknown Canteen";
  };
  
  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    // Display success message
    toast({
      title: "Order Updated",
      description: `Order status changed to ${newStatus}`,
    });
    
    // Update stats
    if (newStatus === "completed") {
      setStats((prev) => ({
        ...prev,
        completedOrders: prev.completedOrders + 1,
        pendingOrders: prev.pendingOrders - 1,
      }));
    }
  };
  
  const getOrderDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your canteen orders and menu
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-secondary/50 rounded-full p-3">
              <ShoppingCart className="h-6 w-6 text-teal-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              {loading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-secondary/50 rounded-full p-3">
              <Calendar className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today's Orders</p>
              {loading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <h3 className="text-2xl font-bold">{stats.todayOrders}</h3>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-secondary/50 rounded-full p-3">
              <Clock className="h-6 w-6 text-teal-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              {loading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <h3 className="text-2xl font-bold">{stats.pendingOrders}</h3>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-secondary/50 rounded-full p-3">
              <Check className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              {loading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <h3 className="text-2xl font-bold">{stats.completedOrders}</h3>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Order Progress */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle>Today's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Order Completion</span>
                  {loading ? (
                    <Skeleton className="h-4 w-8" />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {stats.completedOrders} / {stats.totalOrders}
                    </span>
                  )}
                </div>
                {loading ? (
                  <Skeleton className="h-4 w-12" />
                ) : (
                  <span className="text-sm font-medium">
                    {stats.totalOrders > 0
                      ? Math.round((stats.completedOrders / stats.totalOrders) * 100)
                      : 0}
                    %
                  </span>
                )}
              </div>
              {loading ? (
                <Skeleton className="h-2 w-full" />
              ) : (
                <Progress
                  value={
                    stats.totalOrders > 0
                      ? (stats.completedOrders / stats.totalOrders) * 100
                      : 0
                  }
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Orders Management */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Active Orders</CardTitle>
            <Tabs
              defaultValue="all"
              value={filter}
              onValueChange={(v) => setFilter(v as any)}
              className="hidden md:block"
            >
              <TabsList className="grid w-[400px] grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="preparing">Preparing</TabsTrigger>
                <TabsTrigger value="ready">Ready</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <Tabs
            defaultValue="all"
            value={filter}
            onValueChange={(v) => setFilter(v as any)}
            className="md:hidden mt-2"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
            <div className="h-2"></div>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preparing">Preparing</TabsTrigger>
              <TabsTrigger value="ready">Ready</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 border border-border rounded-md space-y-2"
                >
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-5 w-1/4" />
                  </div>
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : getOrdersByStatus(filter).length > 0 ? (
            <div className="space-y-4">
              {getOrdersByStatus(filter).map((order) => (
                <div
                  key={order.id}
                  className="p-4 border border-border rounded-md"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex flex-col mb-2 md:mb-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Order #{order.id.split("-")[0]}</h3>
                        <Badge
                          className={
                            order.status === "pending"
                              ? "bg-secondary text-secondary-foreground"
                              : order.status === "preparing"
                              ? "bg-amber-500"
                              : "bg-teal-500"
                          }
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {getCanteenName(order.canteenId)} • {getOrderDate(order.placedAt)}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {order.status === "pending" && (
                        <Button
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, "preparing")}
                          className="text-xs h-8"
                        >
                          Start Preparing
                        </Button>
                      )}
                      
                      {order.status === "preparing" && (
                        <Button
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, "ready")}
                          className="text-xs h-8"
                        >
                          Mark as Ready
                        </Button>
                      )}
                      
                      {order.status === "ready" && (
                        <Button
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, "completed")}
                          className="text-xs h-8"
                        >
                          Mark as Completed
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Customer: User #{order.userId}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-muted-foreground" />
                      <span>Items:</span>
                    </div>
                    
                    <ul className="pl-6 space-y-1">
                      {order.items.map((item) => (
                        <li key={`${order.id}-${item.menuItemId}`} className="list-disc">
                          {getMenuItemName(item.menuItemId)} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="font-medium pt-2">
                      Total: ${order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No active orders found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

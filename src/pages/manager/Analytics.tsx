
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockOrders, mockMenuItems } from "@/services/mockData";
import { MenuItem } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#2DD4BF", "#14B8A6", "#0D9488", "#0F766E", "#115E59"];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  
  // Calculate sales data for different time ranges
  const getSalesData = () => {
    // In a real app, this would filter based on actual dates
    // For this demo, we'll just generate some reasonable data
    
    const getRandomSales = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    if (timeRange === "week") {
      return [
        { name: "Sun", sales: getRandomSales(30, 50) },
        { name: "Mon", sales: getRandomSales(40, 60) },
        { name: "Tue", sales: getRandomSales(35, 55) },
        { name: "Wed", sales: getRandomSales(50, 70) },
        { name: "Thu", sales: getRandomSales(60, 80) },
        { name: "Fri", sales: getRandomSales(70, 90) },
        { name: "Sat", sales: getRandomSales(65, 85) },
      ];
    } else if (timeRange === "month") {
      return Array(4)
        .fill(0)
        .map((_, i) => ({
          name: `Week ${i + 1}`,
          sales: getRandomSales(200, 350),
        }));
    } else {
      return Array(12)
        .fill(0)
        .map((_, i) => ({
          name: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ][i],
          sales: getRandomSales(800, 1200),
        }));
    }
  };
  
  // Calculate popular menu items
  const getPopularItems = () => {
    const items = mockMenuItems;
    const orders = mockOrders;
    
    // Count item occurrences in orders
    const itemCounts: Record<string, number> = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (itemCounts[item.menuItemId]) {
          itemCounts[item.menuItemId] += item.quantity;
        } else {
          itemCounts[item.menuItemId] = item.quantity;
        }
      });
    });
    
    // Get top items
    const topItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => {
        const menuItem = items.find((item) => item.id === id) as MenuItem;
        return {
          name: menuItem?.name || "Unknown Item",
          value: count,
        };
      });
    
    return topItems;
  };
  
  // Calculate wastage estimates (items marked available but not ordered)
  const getWastageData = () => {
    if (timeRange === "week") {
      return [
        { name: "Sun", wastage: 2 },
        { name: "Mon", wastage: 1 },
        { name: "Tue", wastage: 3 },
        { name: "Wed", wastage: 0 },
        { name: "Thu", wastage: 1 },
        { name: "Fri", wastage: 2 },
        { name: "Sat", wastage: 4 },
      ];
    } else if (timeRange === "month") {
      return Array(4)
        .fill(0)
        .map((_, i) => ({
          name: `Week ${i + 1}`,
          wastage: Math.floor(Math.random() * 10) + 5,
        }));
    } else {
      return Array(12)
        .fill(0)
        .map((_, i) => ({
          name: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ][i],
          wastage: Math.floor(Math.random() * 30) + 10,
        }));
    }
  };
  
  // Calculate dietary preferences (veg vs non-veg)
  const getDietaryData = () => {
    // Count veg and non-veg items in orders
    const orders = mockOrders;
    const items = mockMenuItems;
    
    let vegCount = 0;
    let nonVegCount = 0;
    
    orders.forEach((order) => {
      order.items.forEach((orderItem) => {
        const menuItem = items.find((i) => i.id === orderItem.menuItemId);
        if (menuItem) {
          if (menuItem.nutrition.isVeg) {
            vegCount += orderItem.quantity;
          } else {
            nonVegCount += orderItem.quantity;
          }
        }
      });
    });
    
    return [
      { name: "Vegetarian", value: vegCount },
      { name: "Non-Vegetarian", value: nonVegCount },
    ];
  };
  
  // Calculate order fulfillment rate
  const getOrderFulfillmentData = () => {
    const orders = mockOrders;
    const total = orders.length;
    const completed = orders.filter(
      (order) => order.status === "completed"
    ).length;
    const cancelled = orders.filter(
      (order) => order.status === "cancelled"
    ).length;
    const pending = total - completed - cancelled;
    
    return [
      { name: "Completed", value: completed },
      { name: "Pending", value: pending },
      { name: "Cancelled", value: cancelled },
    ];
  };
  
  // Prepare data
  const salesData = getSalesData();
  const popularItems = getPopularItems();
  const wastageData = getWastageData();
  const dietaryData = getDietaryData();
  const fulfillmentData = getOrderFulfillmentData();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track your canteen performance and optimize your menu
        </p>
      </div>
      
      <div className="mb-6 flex justify-end">
        <Tabs
          defaultValue="week"
          value={timeRange}
          onValueChange={(v) => setTimeRange(v as any)}
        >
          <TabsList>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trends</CardTitle>
            <CardDescription>
              Order volume over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis
                    stroke="#888"
                    label={{
                      value: "Orders",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#888" },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(30, 30, 30, 0.9)",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Bar dataKey="sales" name="Orders" fill="#2DD4BF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Popular Items */}
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Items</CardTitle>
            <CardDescription>
              Top selling menu items by order count
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={popularItems}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#2DD4BF"
                    label={true}
                  >
                    {popularItems.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(30, 30, 30, 0.9)",
                      border: "none",
                      borderRadius: "4px",
                    }}
                    formatter={(value: any) => [`${value} orders`, ""]}
                  />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wastage Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Wastage Analysis</CardTitle>
            <CardDescription>
              Estimated food wastage from unfulfilled orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={wastageData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis
                    stroke="#888"
                    label={{
                      value: "Items",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#888" },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(30, 30, 30, 0.9)",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  />
                  <Bar dataKey="wastage" name="Wasted Items" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Dietary Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
            <CardDescription>
              Dietary preferences and order fulfillment metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[280px]">
                <h3 className="text-sm font-medium text-center mb-2">
                  Dietary Preferences
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dietaryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={50}
                      fill="#2DD4BF"
                      label={true}
                    >
                      <Cell fill="#2DD4BF" />
                      <Cell fill="#F59E0B" />
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(30, 30, 30, 0.9)",
                        border: "none",
                        borderRadius: "4px",
                      }}
                      formatter={(value: any) => [`${value} items`, ""]}
                    />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-[280px]">
                <h3 className="text-sm font-medium text-center mb-2">
                  Order Fulfillment
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fulfillmentData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={50}
                      fill="#2DD4BF"
                      label={true}
                    >
                      <Cell fill="#2DD4BF" />
                      <Cell fill="#A1A1AA" />
                      <Cell fill="#EF4444" />
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(30, 30, 30, 0.9)",
                        border: "none",
                        borderRadius: "4px",
                      }}
                      formatter={(value: any) => [`${value} orders`, ""]}
                    />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

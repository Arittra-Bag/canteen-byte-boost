import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  getNutritionRecommendations,
  getOrdersByUser,
  getMenuItemById,
} from "@/services/mockData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface NutrientTotal {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DailyNutrients {
  [date: string]: NutrientTotal;
}

export default function Nutrition() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [dailyIntake, setDailyIntake] = useState<DailyNutrients>({});
  const [chartView, setChartView] = useState<"week" | "month">("week");
  
  const targetDailyIntake = {
    calories: 2000,
    protein: 50,
    carbs: 275,
    fat: 78,
  };
  
  useEffect(() => {
    const fetchNutritionData = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        // Fetch recommendations
        const recommendationsData = await getNutritionRecommendations(currentUser.id);
        setRecommendations(recommendationsData);
        
        // Fetch orders and calculate nutrition intake
        const orders = await getOrdersByUser(currentUser.id);
        
        const dailyNutrients: DailyNutrients = {};
        
        // Process each order
        for (const order of orders) {
          // Group by date (ignoring time)
          const orderDate = new Date(order.placedAt).toISOString().split("T")[0];
          
          // Initialize if this date doesn't exist
          if (!dailyNutrients[orderDate]) {
            dailyNutrients[orderDate] = {
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
            };
          }
          
          // Add nutrients from each menu item
          for (const item of order.items) {
            const menuItem = await getMenuItemById(item.menuItemId);
            
            if (menuItem) {
              dailyNutrients[orderDate].calories += menuItem.nutrition.calories * item.quantity;
              dailyNutrients[orderDate].protein += menuItem.nutrition.protein * item.quantity;
              dailyNutrients[orderDate].carbs += menuItem.nutrition.carbs * item.quantity;
              dailyNutrients[orderDate].fat += menuItem.nutrition.fat * item.quantity;
            }
          }
        }
        
        setDailyIntake(dailyNutrients);
      } catch (error) {
        console.error("Error fetching nutrition data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNutritionData();
  }, [currentUser]);
  
  // Prepare chart data
  const prepareChartData = () => {
    const dates = Object.keys(dailyIntake).sort();
    
    // Get the last N days
    const limit = chartView === "week" ? 7 : 30;
    const recentDates = dates.slice(-limit);
    
    return recentDates.map((date) => ({
      date: new Date(date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      calories: dailyIntake[date].calories,
      protein: dailyIntake[date].protein,
      carbs: dailyIntake[date].carbs,
      fat: dailyIntake[date].fat,
    }));
  };
  
  // Calculate today's intake or most recent day
  const getTodayIntake = () => {
    const today = new Date().toISOString().split("T")[0];
    
    // If there's data for today, use it
    if (dailyIntake[today]) {
      return dailyIntake[today];
    }
    
    // Otherwise, find the most recent day with data
    const dates = Object.keys(dailyIntake).sort();
    if (dates.length > 0) {
      const mostRecent = dates[dates.length - 1];
      return dailyIntake[mostRecent];
    }
    
    // Fallback to empty values
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  };
  
  const todayIntake = getTodayIntake();
  const chartData = prepareChartData();

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
        <h1 className="text-2xl font-bold">Nutrition Dashboard</h1>
      </div>
      
      {/* Today's Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Today's Nutrition Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <div className="text-sm">Calories</div>
                  <div className="text-sm">
                    {todayIntake.calories} / {targetDailyIntake.calories} kcal
                  </div>
                </div>
                <Progress
                  value={(todayIntake.calories / targetDailyIntake.calories) * 100}
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <div className="text-sm">Protein</div>
                  <div className="text-sm">
                    {todayIntake.protein} / {targetDailyIntake.protein} g
                  </div>
                </div>
                <Progress
                  value={(todayIntake.protein / targetDailyIntake.protein) * 100}
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <div className="text-sm">Carbohydrates</div>
                  <div className="text-sm">
                    {todayIntake.carbs} / {targetDailyIntake.carbs} g
                  </div>
                </div>
                <Progress
                  value={(todayIntake.carbs / targetDailyIntake.carbs) * 100}
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <div className="text-sm">Fat</div>
                  <div className="text-sm">
                    {todayIntake.fat} / {targetDailyIntake.fat} g
                  </div>
                </div>
                <Progress
                  value={(todayIntake.fat / targetDailyIntake.fat) * 100}
                  className="h-2"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Nutrition History Chart */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Nutrition History</CardTitle>
          <Tabs
            defaultValue="week"
            value={chartView}
            onValueChange={(v) => setChartView(v as any)}
          >
            <TabsList className="grid w-48 grid-cols-2">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : chartData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(30, 30, 30, 0.9)",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  />
                  <Bar
                    dataKey="calories"
                    name="Calories"
                    fill="#2DD4BF"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No nutrition data available for the selected period
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* AI Recommendations */}
      <h2 className="text-xl font-bold mb-4">Personalized Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="glass-card">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
        ) : (
          recommendations.map((rec) => (
            <Card key={rec.id} className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">{rec.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {rec.description}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

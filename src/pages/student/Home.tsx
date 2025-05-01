
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCanteens } from "@/services/supabaseData";
import { Canteen } from "@/types";
import { SearchIcon, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [filteredCanteens, setFilteredCanteens] = useState<Canteen[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCanteens = async () => {
      setLoading(true);
      try {
        const data = await getCanteens();
        setCanteens(data);
        setFilteredCanteens(data);
      } catch (error) {
        console.error("Error fetching canteens:", error);
        toast({
          title: "Error",
          description: "Failed to load canteens. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCanteens();
  }, [toast]);
  
  useEffect(() => {
    let result = canteens;
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (canteen) =>
          canteen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          canteen.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply cuisine filter
    if (cuisineFilter) {
      result = result.filter((canteen) =>
        canteen.cuisine.includes(cuisineFilter)
      );
    }
    
    setFilteredCanteens(result);
  }, [searchQuery, cuisineFilter, canteens]);
  
  // Get unique cuisines from all canteens
  const allCuisines = Array.from(
    new Set(canteens.flatMap((canteen) => canteen.cuisine))
  );
  
  const handleCanteenClick = (canteenId: string) => {
    navigate(`/canteen/${canteenId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome to ByteBoost</h1>
        <p className="text-muted-foreground mb-6">
          Order ahead from your favorite campus canteens
        </p>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search canteens or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {cuisineFilter || "Filter by Cuisine"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setCuisineFilter(null)}
              className="cursor-pointer"
            >
              All Cuisines
            </DropdownMenuItem>
            {allCuisines.map((cuisine) => (
              <DropdownMenuItem
                key={cuisine}
                onClick={() => setCuisineFilter(cuisine)}
                className="cursor-pointer"
              >
                {cuisine}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Canteen Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCanteens.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCanteens.map((canteen) => (
            <Card
              key={canteen.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleCanteenClick(canteen.id)}
            >
              <div
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${canteen.image || "https://images.unsplash.com/photo-1581515286348-98549702050f"})`,
                }}
              >
                <div className="h-full w-full bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <div>
                    <div className="inline-block px-2 py-1 bg-amber-500 text-white text-xs rounded mb-2">
                      {canteen.rating.toFixed(1)} ★
                    </div>
                    <h3 className="text-white text-xl font-bold">{canteen.name}</h3>
                  </div>
                </div>
              </div>
              <CardContent className="p-4 space-y-2">
                <div className="text-sm text-muted-foreground">{canteen.location}</div>
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    {canteen.openingTime} - {canteen.closingTime}
                  </div>
                  <div className="flex gap-1">
                    {canteen.cuisine.slice(0, 2).map((type) => (
                      <div
                        key={type}
                        className="text-xs bg-secondary px-2 py-0.5 rounded-full"
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No canteens found matching your criteria</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery("");
              setCuisineFilter(null);
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}

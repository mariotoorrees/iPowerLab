import { useState, useEffect } from "react";
import { useDailyNutrition } from "@/hooks/use-metrics";
import { useUser } from "@/hooks/use-metrics";
import { Flame, Flag, Drumstick } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

export function CalorieProgress() {
  const currentDate = new Date();
  const { data: user } = useUser();
  const { data: nutrition } = useDailyNutrition(1, currentDate);
  const [progress, setProgress] = useState(0);
  
  // Default goals and values
  const calorieGoal: number = user?.calorieGoal ?? 2000;
  const caloriesConsumed: number = nutrition?.calories || 0;
  const exerciseCalories: number = 150; // Mock exercise calories burned
  const caloriesRemaining: number = calorieGoal - caloriesConsumed + exerciseCalories;

  // Calculate calorie progress
  useEffect(() => {
    if (nutrition && user?.calorieGoal) {
      const percentage = Math.min(100, Math.round((nutrition.calories / user.calorieGoal) * 100));
      setProgress(percentage);
    }
  }, [nutrition, user]);
  
  // Prepare data for calorie pie chart
  const calorieData = [
    { name: 'Consumed', value: caloriesConsumed, color: '#bbbbbb' }, // Gray
    { name: 'Remaining', value: caloriesRemaining > 0 ? caloriesRemaining : 0, color: '#027eb3' }, // Primary color
  ];

  return (
    <div className="flex flex-col space-y-3">
      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-700 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Macros Section with Calorie Pie Chart */}
      <div className="flex mt-1">
        <div className="w-1/2 h-[170px] relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={calorieData}
                cx="40%"
                cy="50%"
                innerRadius={45}
                outerRadius={60}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                strokeWidth={1}
                startAngle={90}
                endAngle={-270}
              >
                {calorieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Calories remaining in the center of the pie chart */}
          <div className="absolute top-1/2 left-[40%] transform -translate-x-1/2 -translate-y-1/2 text-center w-28 flex flex-col items-center justify-center">
            <h3 className="text-2xl font-medium">{caloriesRemaining.toLocaleString('de-DE', { maximumFractionDigits: 0 })}</h3>
            <p className="text-[10px] text-gray-400">Remaining</p>
          </div>
        </div>
        
        <div className="w-1/2 flex flex-col justify-center space-y-2">
          <div>
            <div className="flex justify-between">
              <p className="text-xs text-gray-500">Protein</p>
              <p className="text-xs text-gray-500">{nutrition?.protein || 0}g</p>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${Math.min(100, Math.round(((nutrition?.protein || 0) / (user?.proteinGoal || 120)) * 100))}%`,
                  backgroundColor: '#777777'
                }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between">
              <p className="text-xs text-gray-500">Carbs</p>
              <p className="text-xs text-gray-500">{nutrition?.carbs || 0}g</p>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${Math.min(100, Math.round(((nutrition?.carbs || 0) / (user?.carbsGoal || 200)) * 100))}%`,
                  backgroundColor: '#999999'
                }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between">
              <p className="text-xs text-gray-500">Fat</p>
              <p className="text-xs text-gray-500">{nutrition?.fat || 0}g</p>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${Math.min(100, Math.round(((nutrition?.fat || 0) / (user?.fatGoal || 60)) * 100))}%`,
                  backgroundColor: '#BBBBBB'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

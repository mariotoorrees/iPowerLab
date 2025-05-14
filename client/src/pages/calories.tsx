import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useUser } from "@/hooks/use-metrics";
import { useDailyNutrition } from "@/hooks/use-metrics";
import { DatePicker } from "@/components/ui/date-picker";
import { MealSection } from "@/components/calories/meal-section";
import { NutritionBreakdown } from "@/components/calories/nutrition-breakdown";
import { Skeleton } from "@/components/ui/skeleton";

export default function Calories() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: user } = useUser();
  const { data: nutrition } = useDailyNutrition(1, selectedDate);
  const userId = user?.id || 1; // Default to 1 for demo

  return (
    <div className="animate-in fade-in duration-300">
      <div className="px-5 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Calorie Counter</h1>
          <button className="text-primary">
            <PlusCircle className="h-6 w-6" />
          </button>
        </div>

        {/* Date Picker */}
        <DatePicker 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* Daily Calorie Summary */}
        <div className="bg-white rounded-[12px] shadow-card p-4 mb-6">
          <div className="flex text-center">
            <div className="flex-1 border-r border-divider">
              <p className="text-sm text-on-surface-variant mb-1">Consumed</p>
              <p className="text-xl font-semibold">{nutrition?.calories || 0}</p>
            </div>
            <div className="flex-1 border-r border-divider">
              <p className="text-sm text-on-surface-variant mb-1">Goal</p>
              <p className="text-xl font-semibold">{user?.calorieGoal || 2000}</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-on-surface-variant mb-1">Remaining</p>
              <p className="text-xl font-semibold text-primary">
                {user && nutrition 
                  ? Math.max(0, user.calorieGoal - nutrition.calories)
                  : <Skeleton className="h-7 w-12 mx-auto" />
                }
              </p>
            </div>
          </div>
        </div>

        {/* Meal Sections */}
        <MealSection userId={userId} mealType="breakfast" date={selectedDate} />
        <MealSection userId={userId} mealType="lunch" date={selectedDate} />
        <MealSection userId={userId} mealType="dinner" date={selectedDate} />
        <MealSection userId={userId} mealType="snack" date={selectedDate} />

        {/* Nutrition Breakdown */}
        <NutritionBreakdown userId={userId} date={selectedDate} />
      </div>
    </div>
  );
}

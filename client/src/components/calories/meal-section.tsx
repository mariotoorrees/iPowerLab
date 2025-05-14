import { PlusCircle } from "lucide-react";
import { useMealsByType, useAddMealDialog } from "@/hooks/use-meals";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { capitalize } from "@/lib/utils";
import { AddMealDialog } from "@/components/calories/add-meal-dialog";

type MealSectionProps = {
  userId: number;
  mealType: string;
  date: Date;
};

export function MealSection({ userId, mealType, date }: MealSectionProps) {
  const { data: meals, isLoading } = useMealsByType(userId, mealType, date);
  const { open, setOpen } = useAddMealDialog(userId, mealType, date);

  const totalCalories = meals?.reduce((sum, meal) => {
    return sum + (meal.food.calories * meal.servings);
  }, 0) || 0;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">{capitalize(mealType)}</h2>
        <div className="text-right">
          <span className="text-sm text-on-surface-variant block">{totalCalories} cal</span>
          <Button 
            variant="link" 
            size="sm" 
            className="text-primary p-0 h-auto"
            onClick={() => setOpen(true)}
          >
            <PlusCircle className="h-3 w-3 mr-1" /> Add Food
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[12px] shadow-card divide-y divide-divider">
        {isLoading ? (
          // Loading skeleton
          Array(2).fill(0).map((_, index) => (
            <div key={index} className="p-4 flex justify-between items-center">
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-5 w-12" />
            </div>
          ))
        ) : meals && meals.length > 0 ? (
          // Meal items
          meals.map((meal) => (
            <div key={meal.id} className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{meal.food.name}</h3>
                <p className="text-sm text-on-surface-variant">
                  {meal.servings} {meal.servings === 1 ? meal.food.servingUnit : `${meal.food.servingUnit}s`}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{Math.round(meal.food.calories * meal.servings)} cal</p>
              </div>
            </div>
          ))
        ) : (
          // Empty state
          <div className="p-6 text-center">
            <p className="text-on-surface-variant text-sm mb-2">No foods added yet</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Your First Item
            </Button>
          </div>
        )}
      </div>

      {/* Add meal dialog */}
      <AddMealDialog 
        userId={userId} 
        mealType={mealType} 
        date={date} 
        open={open} 
        setOpen={setOpen} 
      />
    </div>
  );
}

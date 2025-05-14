import { useDailyNutrition } from "@/hooks/use-metrics";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type NutritionBreakdownProps = {
  userId: number;
  date: Date;
};

export function NutritionBreakdown({ userId, date }: NutritionBreakdownProps) {
  const { data: nutrition, isLoading } = useDailyNutrition(userId, date);

  const macros = [
    { name: "Protein", value: nutrition?.protein || 0, unit: "g" },
    { name: "Fat", value: nutrition?.fat || 0, unit: "g" },
    { name: "Carbs", value: nutrition?.carbs || 0, unit: "g" },
    { name: "Fiber", value: 0, unit: "g" }, // This would be calculated in a real app
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3">Nutrition Breakdown</h2>
      <div className="bg-white rounded-[12px] shadow-card p-4">
        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-6 w-12 mx-auto mb-1" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </div>
              ))}
            </div>
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {macros.map((macro) => (
                <div key={macro.name} className="text-center">
                  <div className="text-lg font-semibold">
                    {macro.value}{macro.unit}
                  </div>
                  <div className="text-xs text-on-surface-variant">
                    {macro.name}
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full">
              View Detailed Nutrition
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

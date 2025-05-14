import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useFoods, useAddMeal } from "@/hooks/use-meals";
import { queryClient } from "@/lib/queryClient";
import type { Food } from "@shared/schema";

type AddMealDialogProps = {
  userId: number;
  mealType: string;
  date: Date;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function AddMealDialog({ userId, mealType, date, open, setOpen }: AddMealDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: foods = [], isLoading: isLoadingFoods } = useFoods(searchQuery) as { data: Food[], isLoading: boolean };
  const addMealMutation = useAddMeal();
  const { toast } = useToast();

  // Form schema using zod
  const formSchema = z.object({
    foodId: z.number().min(1, "Please select a food"),
    servings: z.number().min(0.1, "Servings must be at least 0.1").max(10, "Servings cannot exceed 10"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foodId: 0,
      servings: 1,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addMealMutation.mutate({
      userId,
      foodId: values.foodId,
      mealType,
      servings: values.servings,
      date,
    }, {
      onSuccess: () => {
        toast({
          title: "Meal added",
          description: "Your meal has been added successfully",
        });
        setOpen(false);
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to add meal: " + (error as Error).message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Food to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</DialogTitle>
          <DialogDescription>
            Search for a food item and add it to your meal log.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="space-y-2">
              <FormLabel>Search Foods</FormLabel>
              <Input
                type="text"
                placeholder="Search for a food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {searchQuery && (
              <div className="max-h-[200px] overflow-y-auto border rounded-md">
                {isLoadingFoods ? (
                  <div className="p-4 text-center">Loading...</div>
                ) : foods.length > 0 ? (
                  <div className="divide-y">
                    {foods.map((food) => (
                      <div
                        key={food.id}
                        className={`p-3 cursor-pointer hover:bg-slate-50 ${
                          form.getValues().foodId === food.id ? "bg-slate-100" : ""
                        }`}
                        onClick={() => form.setValue("foodId", food.id)}
                      >
                        <div className="font-medium">{food.name}</div>
                        <div className="text-sm text-gray-500">
                          {food.calories} cal | P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center">No foods found</div>
                )}
              </div>
            )}
            
            <FormField
              control={form.control}
              name="servings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servings</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="10"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={form.getValues().foodId === 0 || addMealMutation.isPending}
              >
                {addMealMutation.isPending ? "Adding..." : "Add Food"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
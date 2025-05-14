import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { useState } from "react";
import type { MealWithFood, Food } from "@shared/schema";

// Hooks for fetching meals
export function useMeals(userId: number, date: Date) {
  const dateStr = format(date, "yyyy-MM-dd");
  return useQuery<MealWithFood[]>({
    queryKey: [`/api/users/${userId}/meals?date=${dateStr}`],
  });
}

export function useMealsByType(userId: number, mealType: string, date: Date) {
  const dateStr = format(date, "yyyy-MM-dd");
  return useQuery<MealWithFood[]>({
    queryKey: [`/api/users/${userId}/meals/type/${mealType}?date=${dateStr}`],
  });
}

// Hook for fetching food items
export function useFoods(query?: string) {
  const queryParams = query ? `?q=${encodeURIComponent(query)}` : "";
  return useQuery({
    queryKey: [`/api/foods${queryParams}`],
    // Don't fetch automatically if no query
    enabled: !!query,
  });
}

// Hook for adding a meal
export function useAddMeal() {
  return useMutation({
    mutationFn: async (data: { userId: number; foodId: number; mealType: string; servings: number; date: Date }) => {
      const res = await apiRequest("POST", "/api/meals", data);
      return res.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: [`/api/users/${variables.userId}/meals`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/users/${variables.userId}/meals/type/${variables.mealType}`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/users/${variables.userId}/nutrition`] 
      });
    },
  });
}

// Hook for removing a meal
export function useRemoveMeal() {
  return useMutation({
    mutationFn: async ({ id, userId, mealType }: { id: number; userId: number; mealType: string }) => {
      const res = await apiRequest("DELETE", `/api/meals/${id}`);
      return { id, userId, mealType };
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: [`/api/users/${data.userId}/meals`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/users/${data.userId}/meals/type/${data.mealType}`] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/users/${data.userId}/nutrition`] 
      });
    },
  });
}

// Custom hook for the add meal dialog state
export function useAddMealDialog(userId: number, mealType: string, date: Date) {
  const [open, setOpen] = useState(false);
  
  return { 
    open, 
    setOpen 
  };
}

import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import type { User, Weight, DailyNutrition } from "@shared/schema";

// User hooks
export function useUser(id: number = 1) {
  return useQuery<User>({
    queryKey: [`/api/users/${id}`],
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<User> }) => {
      const res = await apiRequest("PATCH", `/api/users/${id}`, updates);
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${variables.id}`] });
    },
  });
}

// Weight hooks
export function useWeights(userId: number, limit?: number) {
  const queryParams = limit ? `?limit=${limit}` : "";
  return useQuery<Weight[]>({
    queryKey: [`/api/users/${userId}/weights${queryParams}`],
  });
}

export function useAddWeight() {
  return useMutation({
    mutationFn: async (data: { userId: number; weight: number; date?: Date }) => {
      const res = await apiRequest("POST", "/api/weights", data);
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${variables.userId}/weights`] });
    },
  });
}

// Nutrition hooks
export function useDailyNutrition(userId: number, date: Date) {
  const dateStr = format(date, "yyyy-MM-dd");
  return useQuery<DailyNutrition>({
    queryKey: [`/api/users/${userId}/nutrition?date=${dateStr}`],
  });
}

// Create a custom hook for theme management
export function useTheme() {
  // This would integrate with a real theme system in a full app
  const getTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const [theme, setThemeState] = useState<"dark" | "light">(getTheme() as "dark" | "light");

  const setTheme = (newTheme: "dark" | "light") => {
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);

    // Update root class for Tailwind dark mode
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // This would update the user preference on the server in a real app
    // if (user && user.id) {
    //   updateUser({
    //     id: user.id,
    //     updates: { useDarkMode: newTheme === "dark" }
    //   });
    // }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (!localStorage.getItem("theme")) {
        setThemeState(mediaQuery.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return { theme, setTheme };
}

import { useState, useEffect } from "react";

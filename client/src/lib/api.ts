import { apiRequest } from "@/lib/queryClient";
import type { User, Weight, Food, Meal, ChatMessage } from "@shared/schema";

// User API
export async function getUserById(id: number): Promise<User> {
  const res = await apiRequest("GET", `/api/users/${id}`);
  return res.json();
}

export async function createUser(userData: Partial<User>): Promise<User> {
  const res = await apiRequest("POST", "/api/users", userData);
  return res.json();
}

export async function updateUser(id: number, updates: Partial<User>): Promise<User> {
  const res = await apiRequest("PATCH", `/api/users/${id}`, updates);
  return res.json();
}

// Weight API
export async function getWeights(userId: number, limit?: number): Promise<Weight[]> {
  const params = limit ? `?limit=${limit}` : "";
  const res = await apiRequest("GET", `/api/users/${userId}/weights${params}`);
  return res.json();
}

export async function addWeight(data: { userId: number; weight: number; date?: Date }): Promise<Weight> {
  const res = await apiRequest("POST", "/api/weights", data);
  return res.json();
}

// Food API
export async function searchFoods(query?: string, limit?: number): Promise<Food[]> {
  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (limit) params.append("limit", limit.toString());
  
  const queryString = params.toString() ? `?${params.toString()}` : "";
  const res = await apiRequest("GET", `/api/foods${queryString}`);
  return res.json();
}

export async function getFoodById(id: number): Promise<Food> {
  const res = await apiRequest("GET", `/api/foods/${id}`);
  return res.json();
}

export async function createFood(foodData: Partial<Food>): Promise<Food> {
  const res = await apiRequest("POST", "/api/foods", foodData);
  return res.json();
}

// Meal API
export async function getMeals(userId: number, date?: Date): Promise<Meal[]> {
  const params = date ? `?date=${date.toISOString()}` : "";
  const res = await apiRequest("GET", `/api/users/${userId}/meals${params}`);
  return res.json();
}

export async function getMealsByType(userId: number, mealType: string, date?: Date): Promise<Meal[]> {
  const params = date ? `?date=${date.toISOString()}` : "";
  const res = await apiRequest("GET", `/api/users/${userId}/meals/type/${mealType}${params}`);
  return res.json();
}

export async function addMeal(mealData: {
  userId: number;
  foodId: number;
  mealType: string;
  servings: number;
  date?: Date;
}): Promise<Meal> {
  const res = await apiRequest("POST", "/api/meals", mealData);
  return res.json();
}

export async function removeMeal(id: number): Promise<void> {
  await apiRequest("DELETE", `/api/meals/${id}`);
}

export async function getDailyNutrition(userId: number, date?: Date): Promise<{
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}> {
  const params = date ? `?date=${date.toISOString()}` : "";
  const res = await apiRequest("GET", `/api/users/${userId}/nutrition${params}`);
  return res.json();
}

// Chat API
export async function getChatMessages(userId: number, limit?: number): Promise<ChatMessage[]> {
  const params = limit ? `?limit=${limit}` : "";
  const res = await apiRequest("GET", `/api/users/${userId}/chat${params}`);
  return res.json();
}

export async function sendChatMessage(messageData: {
  userId: number;
  content: string;
  isUserMessage: boolean;
}): Promise<ChatMessage | ChatMessage[]> {
  const res = await apiRequest("POST", "/api/chat", messageData);
  return res.json();
}

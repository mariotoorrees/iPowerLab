import { pgTable, text, serial, integer, boolean, timestamp, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  weight: real("weight"),
  weightUnit: text("weight_unit").default("lbs"),
  height: real("height"),
  heightUnit: text("height_unit").default("in"),
  age: integer("age"),
  activityLevel: text("activity_level").default("moderate"),
  targetWeight: real("target_weight"),
  weeklyGoal: text("weekly_goal").default("maintain"),
  calorieGoal: integer("calorie_goal").default(2000),
  proteinGoal: integer("protein_goal").default(120),
  carbsGoal: integer("carbs_goal").default(200),
  fatGoal: integer("fat_goal").default(60),
  useDarkMode: boolean("use_dark_mode").default(false),
  units: text("units").default("imperial"),
  notificationsEnabled: boolean("notifications_enabled").default(true),
});

// Weight logs for tracking user progress
export const weights = pgTable("weights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  weight: real("weight").notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

// Food items database
export const foods = pgTable("foods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  calories: integer("calories").notNull(),
  protein: real("protein").notNull(),
  carbs: real("carbs").notNull(),
  fat: real("fat").notNull(),
  servingSize: real("serving_size").notNull(),
  servingUnit: text("serving_unit").notNull(),
});

// User meal entries
export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  foodId: integer("food_id").notNull(),
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner, snack
  servings: real("servings").notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

// Chat messages for AI nutritionist
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  isUserMessage: boolean("is_user_message").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  weight: true,
  weightUnit: true,
  height: true,
  heightUnit: true,
  age: true,
  activityLevel: true,
  targetWeight: true,
  weeklyGoal: true,
  calorieGoal: true,
  proteinGoal: true,
  carbsGoal: true,
  fatGoal: true,
  useDarkMode: true,
  units: true,
  notificationsEnabled: true,
});

export const insertWeightSchema = createInsertSchema(weights).pick({
  userId: true,
  weight: true,
  date: true,
});

export const insertFoodSchema = createInsertSchema(foods).pick({
  name: true,
  calories: true,
  protein: true,
  carbs: true,
  fat: true,
  servingSize: true,
  servingUnit: true,
});

export const insertMealSchema = createInsertSchema(meals).pick({
  userId: true,
  foodId: true,
  mealType: true,
  servings: true,
  date: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  content: true,
  isUserMessage: true,
});

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWeight = z.infer<typeof insertWeightSchema>;
export type Weight = typeof weights.$inferSelect;

export type InsertFood = z.infer<typeof insertFoodSchema>;
export type Food = typeof foods.$inferSelect;

export type InsertMeal = z.infer<typeof insertMealSchema>;
export type Meal = typeof meals.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Extended types for frontend
export type MealWithFood = Meal & {
  food: Food;
};

export type DailyNutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

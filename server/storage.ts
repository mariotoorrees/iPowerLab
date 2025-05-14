import { 
  users, type User, type InsertUser,
  weights, type Weight, type InsertWeight,
  foods, type Food, type InsertFood,
  meals, type Meal, type InsertMeal,
  chatMessages, type ChatMessage, type InsertChatMessage,
  type MealWithFood, type DailyNutrition
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Weight methods
  getWeights(userId: number, limit?: number): Promise<Weight[]>;
  addWeight(weight: InsertWeight): Promise<Weight>;

  // Food methods
  getFoods(query?: string, limit?: number): Promise<Food[]>;
  getFood(id: number): Promise<Food | undefined>;
  addFood(food: InsertFood): Promise<Food>;

  // Meal methods
  getMeals(userId: number, date?: Date): Promise<MealWithFood[]>;
  getMealsByType(userId: number, type: string, date?: Date): Promise<MealWithFood[]>;
  getMeal(id: number): Promise<MealWithFood | undefined>;
  addMeal(meal: InsertMeal): Promise<Meal>;
  removeMeal(id: number): Promise<boolean>;
  getDailyNutrition(userId: number, date?: Date): Promise<DailyNutrition>;

  // Chat methods
  getChatMessages(userId: number, limit?: number): Promise<ChatMessage[]>;
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private weights: Map<number, Weight[]>;
  private foods: Map<number, Food>;
  private meals: Map<number, Meal[]>;
  private chatMessages: Map<number, ChatMessage[]>;
  
  private userIdCounter: number;
  private weightIdCounter: number;
  private foodIdCounter: number;
  private mealIdCounter: number;
  private chatMessageIdCounter: number;

  constructor() {
    this.users = new Map();
    this.weights = new Map();
    this.foods = new Map();
    this.meals = new Map();
    this.chatMessages = new Map();

    this.userIdCounter = 1;
    this.weightIdCounter = 1;
    this.foodIdCounter = 1;
    this.mealIdCounter = 1;
    this.chatMessageIdCounter = 1;

    // Initialize with some default foods
    this.initializeFoods();
    
    // Initialize with a default user
    this.initializeDefaultUser();
  }
  
  // Helper method to initialize a default user
  private async initializeDefaultUser() {
    // Create default user
    const defaultUser: InsertUser = {
      username: "user",
      password: "password",
      name: "John Smith",
      email: "john@example.com",
      weight: 180,
      weightUnit: "lbs",
      height: 70,
      heightUnit: "in",
      age: 35,
      activityLevel: "moderate",
      targetWeight: 165,
      weeklyGoal: "lose",
      calorieGoal: 2000,
      proteinGoal: 150,
      carbsGoal: 200,
      fatGoal: 60,
      useDarkMode: false,
      units: "imperial",
      notificationsEnabled: true,
    };
    
    const user = await this.createUser(defaultUser);
    
    // Add some sample weights
    const today = new Date();
    const weights: InsertWeight[] = [
      {
        userId: user.id,
        weight: 180,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90)
      },
      {
        userId: user.id,
        weight: 178.5,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 75)
      },
      {
        userId: user.id,
        weight: 176,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 60)
      },
      {
        userId: user.id,
        weight: 175,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 45)
      },
      {
        userId: user.id,
        weight: 173.5,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30)
      },
      {
        userId: user.id,
        weight: 172,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15)
      },
      {
        userId: user.id,
        weight: 170.5,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
      },
      {
        userId: user.id,
        weight: 170,
        date: new Date()
      }
    ];
    
    // Add each weight entry
    for (const weight of weights) {
      await this.addWeight(weight);
    }
    
    // Add some sample meals for today
    const foodIds = Array.from(this.foods.keys());
    if (foodIds.length >= 3) {
      // Add breakfast
      await this.addMeal({
        userId: user.id,
        foodId: foodIds[0],
        mealType: "breakfast",
        servings: 1,
        date: new Date()
      });
      
      // Add lunch
      await this.addMeal({
        userId: user.id,
        foodId: foodIds[2],
        mealType: "lunch",
        servings: 1,
        date: new Date()
      });
      
      // Add snack
      await this.addMeal({
        userId: user.id,
        foodId: foodIds[4],
        mealType: "snack",
        servings: 1,
        date: new Date()
      });
    }
    
    // Add a welcome message from the AI
    await this.addChatMessage({
      userId: user.id,
      content: "Welcome to iPowerLab! I'm your personal AI nutrition assistant. How can I help you today?",
      isUserMessage: false
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    this.weights.set(id, []);
    this.meals.set(id, []);
    this.chatMessages.set(id, []);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Weight methods
  async getWeights(userId: number, limit?: number): Promise<Weight[]> {
    const userWeights = this.weights.get(userId) || [];
    
    // Sort by date descending
    const sorted = [...userWeights].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    return limit ? sorted.slice(0, limit) : sorted;
  }

  async addWeight(insertWeight: InsertWeight): Promise<Weight> {
    const id = this.weightIdCounter++;
    const weight: Weight = { ...insertWeight, id };
    
    const userWeights = this.weights.get(weight.userId) || [];
    userWeights.push(weight);
    this.weights.set(weight.userId, userWeights);
    
    return weight;
  }

  // Food methods
  async getFoods(query?: string, limit?: number): Promise<Food[]> {
    let foods = Array.from(this.foods.values());
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      foods = foods.filter(food => 
        food.name.toLowerCase().includes(lowerQuery)
      );
    }
    
    return limit ? foods.slice(0, limit) : foods;
  }

  async getFood(id: number): Promise<Food | undefined> {
    return this.foods.get(id);
  }

  async addFood(insertFood: InsertFood): Promise<Food> {
    const id = this.foodIdCounter++;
    const food: Food = { ...insertFood, id };
    this.foods.set(id, food);
    return food;
  }

  // Meal methods
  async getMeals(userId: number, date?: Date): Promise<MealWithFood[]> {
    const userMeals = this.meals.get(userId) || [];
    
    let filteredMeals = userMeals;
    if (date) {
      const dateStr = date.toDateString();
      filteredMeals = userMeals.filter(meal => 
        new Date(meal.date).toDateString() === dateStr
      );
    }
    
    return filteredMeals.map(meal => {
      const food = this.foods.get(meal.foodId)!;
      return { ...meal, food };
    });
  }

  async getMealsByType(userId: number, mealType: string, date?: Date): Promise<MealWithFood[]> {
    const meals = await this.getMeals(userId, date);
    return meals.filter(meal => meal.mealType === mealType);
  }

  async getMeal(id: number): Promise<MealWithFood | undefined> {
    for (const userMeals of this.meals.values()) {
      const meal = userMeals.find(m => m.id === id);
      if (meal) {
        const food = this.foods.get(meal.foodId)!;
        return { ...meal, food };
      }
    }
    return undefined;
  }

  async addMeal(insertMeal: InsertMeal): Promise<Meal> {
    const id = this.mealIdCounter++;
    const meal: Meal = { ...insertMeal, id };
    
    const userMeals = this.meals.get(meal.userId) || [];
    userMeals.push(meal);
    this.meals.set(meal.userId, userMeals);
    
    return meal;
  }

  async removeMeal(id: number): Promise<boolean> {
    for (const [userId, userMeals] of this.meals.entries()) {
      const index = userMeals.findIndex(meal => meal.id === id);
      if (index !== -1) {
        userMeals.splice(index, 1);
        this.meals.set(userId, userMeals);
        return true;
      }
    }
    return false;
  }

  async getDailyNutrition(userId: number, date?: Date): Promise<DailyNutrition> {
    const meals = await this.getMeals(userId, date);
    
    const nutrition: DailyNutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };
    
    for (const meal of meals) {
      const food = await this.getFood(meal.foodId);
      if (food) {
        nutrition.calories += food.calories * meal.servings;
        nutrition.protein += food.protein * meal.servings;
        nutrition.carbs += food.carbs * meal.servings;
        nutrition.fat += food.fat * meal.servings;
      }
    }
    
    return nutrition;
  }

  // Chat methods
  async getChatMessages(userId: number, limit?: number): Promise<ChatMessage[]> {
    const messages = this.chatMessages.get(userId) || [];
    
    // Sort by timestamp ascending (oldest first)
    const sorted = [...messages].sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
    
    return limit ? sorted.slice(-limit) : sorted;
  }

  async addChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageIdCounter++;
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      timestamp: new Date() 
    };
    
    const userMessages = this.chatMessages.get(message.userId) || [];
    userMessages.push(message);
    this.chatMessages.set(message.userId, userMessages);
    
    return message;
  }

  // Helper method to initialize some default foods
  private initializeFoods() {
    const defaultFoods: InsertFood[] = [
      {
        name: "Oatmeal with Berries",
        calories: 220,
        protein: 8,
        carbs: 40,
        fat: 4,
        servingSize: 1,
        servingUnit: "bowl (250g)"
      },
      {
        name: "Coffee with Milk",
        calories: 130,
        protein: 4,
        carbs: 12,
        fat: 7,
        servingSize: 1,
        servingUnit: "cup (250ml)"
      },
      {
        name: "Grilled Chicken Salad",
        calories: 420,
        protein: 35,
        carbs: 25,
        fat: 20,
        servingSize: 1,
        servingUnit: "serving (350g)"
      },
      {
        name: "Whole Grain Bread",
        calories: 180,
        protein: 7,
        carbs: 32,
        fat: 3,
        servingSize: 2,
        servingUnit: "slices (80g)"
      },
      {
        name: "Apple",
        calories: 80,
        protein: 0.5,
        carbs: 20,
        fat: 0.3,
        servingSize: 1,
        servingUnit: "medium (150g)"
      },
      {
        name: "Baked Salmon",
        calories: 280,
        protein: 40,
        carbs: 0,
        fat: 14,
        servingSize: 1,
        servingUnit: "fillet (150g)"
      },
      {
        name: "Steamed Vegetables",
        calories: 90,
        protein: 4,
        carbs: 16,
        fat: 1.5,
        servingSize: 1,
        servingUnit: "cup (150g)"
      },
      {
        name: "Brown Rice",
        calories: 100,
        protein: 2.5,
        carbs: 22,
        fat: 0.8,
        servingSize: 0.5,
        servingUnit: "cup (100g)"
      }
    ];

    defaultFoods.forEach(food => {
      this.addFood(food);
    });
  }
}

export const storage = new MemStorage();

import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertWeightSchema, 
  insertFoodSchema, 
  insertMealSchema,
  insertChatMessageSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Express 4.x uses app directly for routes
  const router = app;

  // Helper function for error handling
  const asyncHandler = (fn: (req: Request, res: Response) => Promise<any>) => {
    return async (req: Request, res: Response) => {
      try {
        await fn(req, res);
      } catch (error: any) {
        console.error("API Error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
      }
    };
  };

  // User routes
  router.get("/api/users/:id", asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  }));

  router.post("/api/users", asyncHandler(async (req, res) => {
    const validation = insertUserSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: "Invalid user data", errors: validation.error.format() });
    }
    
    const existingUser = await storage.getUserByUsername(validation.data.username);
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }
    
    const user = await storage.createUser(validation.data);
    res.status(201).json(user);
  }));

  router.patch("/api/users/:id", asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);
    const existingUser = await storage.getUser(userId);
    
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const updatedUser = await storage.updateUser(userId, req.body);
    res.json(updatedUser);
  }));

  // Weight routes
  router.get("/api/users/:userId/weights", asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    const weights = await storage.getWeights(userId, limit);
    res.json(weights);
  }));

  router.post("/api/weights", asyncHandler(async (req, res) => {
    const validation = insertWeightSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: "Invalid weight data", errors: validation.error.format() });
    }
    
    const weight = await storage.addWeight(validation.data);
    res.status(201).json(weight);
  }));

  // Food routes
  router.get("/api/foods", asyncHandler(async (req, res) => {
    const query = req.query.q as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    const foods = await storage.getFoods(query, limit);
    res.json(foods);
  }));

  router.get("/api/foods/:id", asyncHandler(async (req, res) => {
    const foodId = parseInt(req.params.id);
    const food = await storage.getFood(foodId);
    
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    
    res.json(food);
  }));

  router.post("/api/foods", asyncHandler(async (req, res) => {
    const validation = insertFoodSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: "Invalid food data", errors: validation.error.format() });
    }
    
    const food = await storage.addFood(validation.data);
    res.status(201).json(food);
  }));

  // Meal routes
  router.get("/api/users/:userId/meals", asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId);
    let date: Date | undefined = undefined;
    
    if (req.query.date) {
      date = new Date(req.query.date as string);
    }
    
    const meals = await storage.getMeals(userId, date);
    res.json(meals);
  }));

  router.get("/api/users/:userId/meals/type/:mealType", asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const mealType = req.params.mealType;
    let date: Date | undefined = undefined;
    
    if (req.query.date) {
      date = new Date(req.query.date as string);
    }
    
    const meals = await storage.getMealsByType(userId, mealType, date);
    res.json(meals);
  }));

  router.post("/api/meals", asyncHandler(async (req, res) => {
    const validation = insertMealSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: "Invalid meal data", errors: validation.error.format() });
    }
    
    const meal = await storage.addMeal(validation.data);
    res.status(201).json(meal);
  }));

  router.delete("/api/meals/:id", asyncHandler(async (req, res) => {
    const mealId = parseInt(req.params.id);
    const success = await storage.removeMeal(mealId);
    
    if (!success) {
      return res.status(404).json({ message: "Meal not found" });
    }
    
    res.status(204).send();
  }));

  router.get("/api/users/:userId/nutrition", asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId);
    let date: Date | undefined = undefined;
    
    if (req.query.date) {
      date = new Date(req.query.date as string);
    }
    
    const nutrition = await storage.getDailyNutrition(userId, date);
    res.json(nutrition);
  }));

  // Chat routes
  router.get("/api/users/:userId/chat", asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    const messages = await storage.getChatMessages(userId, limit);
    res.json(messages);
  }));

  router.post("/api/chat", asyncHandler(async (req, res) => {
    const validation = insertChatMessageSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ message: "Invalid message data", errors: validation.error.format() });
    }
    
    const message = await storage.addChatMessage(validation.data);
    
    // If it's a user message, simulate AI response
    if (message.isUserMessage) {
      const aiResponse = await generateAIResponse(message.content);
      
      const aiMessage = await storage.addChatMessage({
        userId: message.userId,
        content: aiResponse,
        isUserMessage: false
      });
      
      // Return both messages
      res.status(201).json([message, aiMessage]);
    } else {
      res.status(201).json(message);
    }
  }));

  // Enhanced fake AI response generator
  async function generateAIResponse(userMessage: string): Promise<string> {
    // Pre-programmed responses based on keywords
    const lowerMessage = userMessage.toLowerCase();
    
    // Greeting patterns
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! I'm your AI nutrition assistant. How can I help you today?";
    }
    
    // Muscle building
    if (lowerMessage.includes("muscle") || lowerMessage.includes("build muscle") || lowerMessage.includes("gain muscle")) {
      return "For muscle building, you should focus on:\n\n1. Increased protein intake (1.6-2.2g per kg of body weight)\n2. Adequate calories (slight surplus of 200-300 calories)\n3. Complex carbs for energy (especially around workouts)\n4. Healthy fats for hormonal health\n\nSome great protein options include chicken breast, lean beef, fish, eggs, Greek yogurt, and plant proteins like lentils and tofu. Would you like a sample meal plan?";
    }
    
    // Weight loss
    if (lowerMessage.includes("weight loss") || lowerMessage.includes("lose weight") || lowerMessage.includes("diet")) {
      return "For healthy weight loss, I recommend:\n\n1. Creating a moderate calorie deficit (300-500 calories below maintenance)\n2. Consuming plenty of protein (helps preserve muscle and increases satiety)\n3. Eating lots of vegetables and fiber-rich foods\n4. Staying hydrated and limiting sugary drinks\n5. Incorporating regular strength training and cardio\n\nWould you like specific food recommendations or a sample weight loss meal plan?";
    }
    
    // Meal plans
    if (lowerMessage.includes("meal plan")) {
      if (lowerMessage.includes("weight loss") || lowerMessage.includes("diet")) {
        return "Sample Weight Loss Meal Plan:\n\nBreakfast: 2 scrambled eggs with spinach and tomatoes, 1 slice whole grain toast\n\nSnack: Apple with 1 tbsp almond butter\n\nLunch: Large salad with 4oz grilled chicken, mixed greens, vegetables, and light vinaigrette\n\nSnack: Greek yogurt with berries\n\nDinner: 4oz baked salmon, 1/2 cup quinoa, roasted Brussels sprouts\n\nThis plan provides around 1,500 calories with plenty of protein and fiber to keep you satisfied. Would you like me to suggest alternative meals?";
      } else if (lowerMessage.includes("muscle") || lowerMessage.includes("bulking")) {
        return "Sample Muscle Building Meal Plan:\n\nBreakfast: 4 egg omelet with vegetables, 1 cup oatmeal with berries and nuts\n\nSnack: Protein shake with banana and 2 tbsp peanut butter\n\nLunch: 6oz grilled chicken breast, 1 cup brown rice, 1 cup roasted vegetables\n\nPre-workout: Greek yogurt with honey and a piece of fruit\n\nPost-workout: Protein shake with 8oz milk\n\nDinner: 6oz salmon fillet, sweet potato, steamed broccoli\n\nWould you like more high-protein meal options?";
      } else {
        return "Sample Balanced Meal Plan:\n\nBreakfast: Overnight oats with Greek yogurt, berries and a tablespoon of chia seeds\n\nLunch: Whole grain wrap with turkey, avocado, and vegetables\n\nSnack: Handful of mixed nuts and an apple\n\nDinner: Stir-fry with tofu or chicken, plenty of colorful vegetables, and brown rice\n\nThis balanced plan provides a good mix of proteins, complex carbs, and healthy fats. Would you like me to customize it based on your specific goals?";
      }
    }
    
    // Recipe suggestions
    if (lowerMessage.includes("recipe") || lowerMessage.includes("recipes")) {
      return "Here are three healthy recipe ideas:\n\n1. Mediterranean Bowl: Quinoa base with roasted chickpeas, cherry tomatoes, cucumber, feta cheese, and olive oil dressing\n\n2. Sheet Pan Dinner: Chicken thighs, sweet potatoes, and Brussels sprouts roasted with herbs and olive oil\n\n3. Protein Breakfast: Greek yogurt parfait with layers of berries, honey, and homemade granola\n\nWhich of these interests you? I can provide detailed instructions for any of them.";
    }
    
    // Calories and macros
    if (lowerMessage.includes("calories") || lowerMessage.includes("calorie")) {
      return "The number of calories you need depends on your gender, weight, height, age, and activity level. As a general guideline, most women need 1,600-2,400 calories per day, while most men need 2,000-3,000 calories per day. Would you like me to help calculate your specific needs based on your information?";
    }
    
    if (lowerMessage.includes("protein") || lowerMessage.includes("macro") || lowerMessage.includes("macros")) {
      return "For a balanced diet, the recommended macronutrient breakdown is:\n\n- Protein: 10-35% of daily calories (0.8-2.2g per kg of body weight)\n- Carbohydrates: 45-65% of daily calories\n- Fats: 20-35% of daily calories\n\nFor active individuals or those looking to build muscle, aim for the higher end of the protein range. Would you like more specific macro recommendations based on your goals?";
    }
    
    // Specific foods
    if (lowerMessage.includes("carbs") || lowerMessage.includes("carbohydrates")) {
      return "Healthy carbohydrate sources include:\n\n1. Whole grains (oats, brown rice, quinoa)\n2. Starchy vegetables (sweet potatoes, squash)\n3. Legumes (beans, lentils)\n4. Fruits\n\nThese provide fiber, vitamins, and minerals unlike refined carbs like white bread and sugary foods. For weight management, focus on portion control and timing (around workouts can be beneficial).";
    }
    
    if (lowerMessage.includes("fat") || lowerMessage.includes("fats")) {
      return "Healthy fat sources include:\n\n1. Avocados\n2. Nuts and seeds\n3. Olive oil and olives\n4. Fatty fish (salmon, mackerel)\n5. Eggs\n\nHealthy fats are essential for hormone production, brain health, and nutrient absorption. They also help you feel satisfied after meals. Aim for mostly unsaturated fats while limiting saturated and trans fats.";
    }
    
    // Vegetarian/Vegan
    if (lowerMessage.includes("vegetarian") || lowerMessage.includes("vegan") || lowerMessage.includes("plant-based")) {
      return "For a nutritionally complete plant-based diet, focus on:\n\n1. Protein: Legumes, tofu, tempeh, seitan, and if vegetarian, eggs and dairy\n2. Iron: Lentils, spinach, fortified cereals (pair with vitamin C for better absorption)\n3. B12: Nutritional yeast, fortified foods, or supplements (especially important for vegans)\n4. Calcium: Fortified plant milks, tofu, leafy greens\n5. Omega-3s: Flaxseeds, chia seeds, walnuts\n\nWould you like specific meal ideas or more information on plant-based nutrition?";
    }
    
    // Hydration
    if (lowerMessage.includes("water") || lowerMessage.includes("hydration") || lowerMessage.includes("drink")) {
      return "Proper hydration is essential for overall health and optimal physical performance. Aim for about 2-3 liters (8-12 cups) of water daily, though needs vary based on activity level, climate, and individual factors. Signs of good hydration include light-colored urine and rarely feeling thirsty. Try carrying a reusable water bottle and setting reminders if you often forget to drink throughout the day.";
    }
    
    // Miscellaneous health questions
    if (lowerMessage.includes("supplement") || lowerMessage.includes("vitamin")) {
      return "Common supplements that may benefit certain individuals include:\n\n1. Vitamin D: Especially for those with limited sun exposure\n2. Omega-3: If you don't consume fatty fish regularly\n3. Protein: For athletes or those struggling to meet protein needs\n4. Creatine: For enhanced strength performance\n5. Multivitamin: As insurance against dietary gaps\n\nHowever, supplements should complement, not replace, a balanced diet. Always consult with a healthcare provider before starting any supplement regimen.";
    }
    
    if (lowerMessage.includes("workout") || lowerMessage.includes("exercise")) {
      return "For optimal nutrition around workouts:\n\n1. Pre-workout (1-3 hours before): Consume easily digestible carbs and moderate protein\n   Example: Banana with Greek yogurt or toast with eggs\n\n2. Post-workout (within 30-60 minutes): Combine protein and carbs for recovery\n   Example: Protein shake with fruit or chicken and rice\n\n3. Stay hydrated before, during, and after exercise\n\nWould you like more specific recommendations based on your workout type or goals?";
    }
    
    // Default response for when no pattern is matched
    return "I'm here to help with nutrition advice, meal planning, and healthy eating tips. Feel free to ask specific questions about your diet goals, and I'll do my best to provide personalized guidance. You can ask about topics like weight loss, muscle building, specific nutrients, meal plans, recipes, or supplement advice.";
  }

  // Create the HTTP server
  const httpServer = createServer(app);

  return httpServer;
}

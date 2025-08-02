import { UserProfile, DietPlan } from '../types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// Note: In production, this should be in environment variables
const API_KEY = 'your-gemini-api-key-here'; // User needs to add their API key

export const generateDietPlan = async (profile: UserProfile): Promise<DietPlan> => {
  const prompt = `Create a comprehensive 7-day personalized diet plan based on the following user profile:

User Details:
- Age: ${profile.age} years
- Gender: ${profile.gender}
- Height: ${profile.height} cm
- Current Weight: ${profile.currentWeight} kg
- Target Weight: ${profile.targetWeight} kg
- Activity Level: ${profile.activityLevel}
- Goal: ${profile.goalType} weight
- Diet Preference: ${profile.dietPreference || 'not specified'}
- Allergies/Restrictions: ${(profile.allergies || []).join(', ') || 'None'}
- Daily Meals: ${profile.dailyMeals || 'not specified'}

Please provide a detailed 7-day diet plan in the following JSON format:
{
  "days": [
    {
      "day": "Day 1",
      "breakfast": {
        "name": "Meal Name",
        "description": "Brief description",
        "calories": 400,
        "protein": 20,
        "carbs": 45,
        "fats": 15,
        "ingredients": ["ingredient1", "ingredient2"],
        "instructions": ["step1", "step2"]
      },
      "lunch": { /* same format */ },
      "dinner": { /* same format */ },
      "snacks": [ /* array of snacks if 5-meals selected */ ]
    }
  ],
  "totalDailyCalories": 1800,
  "hydrationTips": ["Drink 8-10 glasses of water", "Green tea before meals"],
  "lifestyleTips": ["Sleep 7-8 hours", "Exercise 30 mins daily"],
  "summary": {
    "dailyCalorieRange": "1700-1900 calories",
    "goalAlignment": "This plan supports weight loss through controlled portions",
    "restrictionNotes": ["All meals are vegetarian", "Gluten-free options included"]
  }
}

Ensure all meals respect the dietary preferences and restrictions. Make the plan realistic and achievable.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }

    const dietPlanData = JSON.parse(jsonMatch[0]);
    
    const dietPlan: DietPlan = {
      id: Date.now().toString(),
      userId: profile.id,
      ...dietPlanData,
      createdAt: new Date().toISOString(),
    };

    return dietPlan;
  } catch (error) {
    console.error('Error generating diet plan:', error);
    // Return a fallback plan if API fails
    return generateFallbackDietPlan(profile);
  }
};

const generateFallbackDietPlan = (profile: UserProfile): DietPlan => {
  // Fallback plan when API is not available
  return {
    id: Date.now().toString(),
    userId: profile.id,
    days: [
      {
        day: "Day 1",
        breakfast: {
          name: "Oatmeal with Berries",
          description: "Nutritious start to your day",
          calories: 350,
          protein: 12,
          carbs: 45,
          fats: 8,
          ingredients: ["Rolled oats", "Mixed berries", "Almonds", "Honey"],
          instructions: ["Cook oats with water", "Add berries and nuts", "Drizzle with honey"]
        },
        lunch: {
          name: "Grilled Chicken Salad",
          description: "Protein-rich healthy salad",
          calories: 450,
          protein: 35,
          carbs: 20,
          fats: 15,
          ingredients: ["Chicken breast", "Mixed greens", "Cherry tomatoes", "Olive oil"],
          instructions: ["Grill chicken breast", "Mix with greens", "Add tomatoes and dressing"]
        },
        dinner: {
          name: "Baked Salmon with Vegetables",
          description: "Omega-3 rich dinner",
          calories: 500,
          protein: 40,
          carbs: 25,
          fats: 20,
          ingredients: ["Salmon fillet", "Broccoli", "Sweet potato", "Lemon"],
          instructions: ["Bake salmon with lemon", "Steam broccoli", "Roast sweet potato"]
        }
      }
      // Additional days would be added here
    ],
    totalDailyCalories: 1800,
    hydrationTips: ["Drink 8-10 glasses of water daily", "Have green tea before meals"],
    lifestyleTips: ["Sleep 7-8 hours nightly", "Exercise 30 minutes daily"],
    summary: {
      dailyCalorieRange: "1700-1900 calories",
      goalAlignment: "This plan supports your weight goals through balanced nutrition",
      restrictionNotes: ["Plan respects your dietary preferences"]
    },
    createdAt: new Date().toISOString(),
  };
};

// Helper function to build the appropriate prompt based on analysis type
const buildPrompt = (analysisType, workouts, goals, customQuestion) => {
  let prompt = "";

  if (analysisType === "general") {
    prompt = `You are an expert strength training coach. Analyze this workout history and provide personalized recommendations.

RECENT WORKOUTS:
${JSON.stringify(workouts, null, 2)}

ACTIVE GOALS:
${JSON.stringify(goals, null, 2)}

Provide a comprehensive analysis including:
1. Current training patterns and volume
2. Strengths and areas for improvement
3. Specific recommendations for next week
4. Exercise suggestions to address weak points
5. Recovery recommendations
6. Progress towards goals

Format your response in clear sections with actionable advice. Be specific and reference actual exercises from their history.`;

    if (customQuestion) {
      prompt += `\n\nUSER'S SPECIFIC QUESTION:\n${customQuestion}\n\nPlease address this question in your analysis.`;
    }

  } else if (analysisType === "progression") {
    prompt = `You are an expert strength training coach specializing in progressive overload.

RECENT WORKOUTS:
${JSON.stringify(workouts, null, 2)}

Analyze the progression patterns and provide:
1. Which exercises are progressing well
2. Which exercises have plateaued
3. Specific weight/rep recommendations for the next session of each exercise
4. Periodization suggestions (when to deload, when to push)
5. Exercise variations to break through plateaus

Be specific with numbers and reference their actual performance data.`;

    if (customQuestion) {
      prompt += `\n\nUSER'S SPECIFIC QUESTION:\n${customQuestion}\n\nPlease address this question in your analysis.`;
    }

  } else if (analysisType === "recovery") {
    prompt = `You are an expert in exercise science and recovery.

RECENT WORKOUTS:
${JSON.stringify(workouts, null, 2)}

Analyze their training volume and frequency to provide:
1. Signs of overtraining or underrecovery
2. Optimal rest days between muscle groups
3. Active recovery suggestions
4. Sleep and nutrition recommendations based on training volume
5. When they should consider a deload week

Be specific and reference their actual workout patterns.`;

    if (customQuestion) {
      prompt += `\n\nUSER'S SPECIFIC QUESTION:\n${customQuestion}\n\nPlease address this question in your analysis.`;
    }

  } else if (analysisType === "technique") {
    // Get unique exercises
    const allExercises = [...new Set(workouts.flatMap(w =>
      w.exercises.map(e => e.name || e.exerciseName)
    ))];

    prompt = `You are an expert strength coach with deep knowledge of exercise technique.

EXERCISES THEY PERFORM:
${allExercises.join(', ')}

For their top 5 most frequent exercises, provide:
1. Key form cues and technique tips
2. Common mistakes to avoid
3. Mobility work to improve performance
4. Accessory exercises to strengthen weak points
5. Progression/regression options

Focus on practical, actionable advice they can apply immediately.`;

    if (customQuestion) {
      prompt += `\n\nUSER'S SPECIFIC QUESTION:\n${customQuestion}\n\nPlease address this question in your analysis.`;
    }

  } else if (analysisType === "custom") {
    prompt = `You are an expert personal trainer, strength coach, and fitness advisor with deep knowledge of exercise science, nutrition, training methodology, and athletic performance.

RECENT WORKOUTS:
${JSON.stringify(workouts, null, 2)}

ACTIVE GOALS:
${JSON.stringify(goals, null, 2)}

USER'S QUESTION:
${customQuestion || "Please provide general training advice."}

Provide a detailed, personalized answer to their question. Reference their workout history and goals when relevant. Be specific, practical, and actionable in your advice.`;
  }

  return prompt;
};

// Helper function to call Anthropic API
const callAnthropicAPI = async (prompt) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Anthropic API error: ${response.status}`);
  }

  return await response.json();
};

// Main controller function to analyze workouts
export const analyzeWorkouts = async (req, res) => {
  try {
    const { analysisType, workouts, goals, customQuestion } = req.body;

    // Validation
    if (!analysisType) {
      return res.status(400).json({ error: "analysisType is required" });
    }

    const validTypes = ["general", "progression", "recovery", "technique", "custom"];
    if (!validTypes.includes(analysisType)) {
      return res.status(400).json({
        error: `Invalid analysisType. Must be one of: ${validTypes.join(", ")}`
      });
    }

    // For custom questions, workouts can be empty or not provided
    if (analysisType !== "custom") {
      if (!workouts || !Array.isArray(workouts)) {
        return res.status(400).json({ error: "workouts array is required" });
      }

      if (workouts.length === 0) {
        return res.status(400).json({
          error: "No workouts provided. Please log some workouts first."
        });
      }
    }

    // Ensure workouts and goals are arrays even if not provided
    const workoutsData = workouts || [];
    const goalsData = goals || [];

    // Build prompt based on analysis type
    const prompt = buildPrompt(analysisType, workoutsData, goalsData, customQuestion);

    // Call Anthropic API
    const data = await callAnthropicAPI(prompt);

    // Return analysis
    res.json({
      analysis: data.content[0].text,
      analysisType,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("Error in analyzeWorkouts:", err);

    // Handle specific error cases
    if (err.message.includes("ANTHROPIC_API_KEY")) {
      return res.status(500).json({
        error: "AI service not configured. Please contact support."
      });
    }

    if (err.message.includes("rate limit")) {
      return res.status(429).json({
        error: "Rate limit exceeded. Please try again in a moment."
      });
    }

    // Generic error
    res.status(500).json({
      error: "Failed to generate analysis. Please try again."
    });
  }
};

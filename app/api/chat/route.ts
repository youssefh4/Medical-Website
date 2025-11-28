import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    // Check for API keys (prioritize Gemini, then OpenAI)
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const openAiApiKey = process.env.OPENAI_API_KEY;

    if (geminiApiKey) {
      // Use Gemini API if key is available
      return await handleGeminiRequest(message, context, geminiApiKey);
    } else if (openAiApiKey) {
      // Use OpenAI API if key is available
      return await handleOpenAIRequest(message, context, openAiApiKey);
    } else {
      // Fallback to rule-based responses
      return NextResponse.json({
        response: generateResponse(message, context),
      });
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}

async function handleGeminiRequest(
  message: string,
  context: any,
  apiKey: string
) {
  const systemPrompt = `You are a helpful AI health assistant for a medical profile management website. 
You can help users understand their medical records, medications, conditions, and scans.
You can also provide general health information and answer questions about medical conditions, symptoms, treatments, and health topics.

When answering general medical questions:
- Provide accurate, evidence-based information
- Explain symptoms, causes, treatments, and prevention when relevant
- Use clear, easy-to-understand language
- Always include appropriate medical disclaimers

User's Medical Context (for personalized questions):
- Conditions: ${JSON.stringify(context.conditions || [])}
- Medications: ${JSON.stringify(context.medications || [])}
- Scans: ${JSON.stringify(context.scans || [])}
- Profile: ${JSON.stringify(context.profile || {})}

CRITICAL: Always remind users that you provide informational assistance only and cannot replace professional medical advice, diagnosis, or treatment. Users should consult with qualified healthcare professionals for medical decisions.`;

  try {
    // Try OpenAI-compatible endpoint first
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemini-1.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    if (data.choices && data.choices[0]?.message?.content) {
      return NextResponse.json({
        response: data.choices[0].message.content,
      });
    }

    // Fallback to direct Gemini API if OpenAI-compatible endpoint doesn't work
    throw new Error("OpenAI-compatible endpoint failed, trying direct API");
  } catch (error) {
    console.error("Gemini API error (OpenAI-compatible):", error);
    
    // Try direct Gemini API as fallback
    try {
      const directResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemPrompt}\n\nUser question: ${message}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            },
          }),
        }
      );

      const directData = await directResponse.json();

      if (directData.error) {
        throw new Error(directData.error.message);
      }

      const text = directData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return NextResponse.json({
          response: text,
        });
      }
    } catch (directError) {
      console.error("Gemini API error (direct):", directError);
    }

    // Fallback to rule-based response
    return NextResponse.json({
      response: generateResponse(message, context),
    });
  }
}

async function handleOpenAIRequest(
  message: string,
  context: any,
  apiKey: string
) {
  const systemPrompt = `You are a helpful AI health assistant for a medical profile management website. 
You can help users understand their medical records, medications, conditions, and scans.
You can also provide general health information and answer questions about medical conditions, symptoms, treatments, and health topics.

When answering general medical questions:
- Provide accurate, evidence-based information
- Explain symptoms, causes, treatments, and prevention when relevant
- Use clear, easy-to-understand language
- Always include appropriate medical disclaimers

User's Medical Context (for personalized questions):
- Conditions: ${JSON.stringify(context.conditions || [])}
- Medications: ${JSON.stringify(context.medications || [])}
- Scans: ${JSON.stringify(context.scans || [])}
- Profile: ${JSON.stringify(context.profile || {})}

CRITICAL: Always remind users that you provide informational assistance only and cannot replace professional medical advice, diagnosis, or treatment. Users should consult with qualified healthcare professionals for medical decisions.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return NextResponse.json({
      response: data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.",
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    // Fallback to rule-based response
    return NextResponse.json({
      response: generateResponse(message, context),
    });
  }
}

// Medical knowledge database for common conditions
const medicalKnowledge: Record<string, { symptoms: string[]; causes?: string; treatment?: string; prevention?: string }> = {
  chickenpox: {
    symptoms: [
      "Fever",
      "Rash that turns into itchy, fluid-filled blisters",
      "Fatigue",
      "Loss of appetite",
      "Headache"
    ],
    causes: "Caused by the varicella-zoster virus, highly contagious",
    treatment: "Rest, fluids, over-the-counter pain relievers, calamine lotion for itching. Antiviral medication may be prescribed for high-risk individuals.",
    prevention: "Vaccination is the best prevention. Avoid contact with infected individuals."
  },
  flu: {
    symptoms: [
      "Fever or chills",
      "Cough",
      "Sore throat",
      "Runny or stuffy nose",
      "Muscle or body aches",
      "Headaches",
      "Fatigue"
    ],
    causes: "Caused by influenza viruses",
    treatment: "Rest, fluids, antiviral medications if started early, over-the-counter symptom relief",
    prevention: "Annual flu vaccination, frequent handwashing, avoid close contact with sick people"
  },
  cold: {
    symptoms: [
      "Runny or stuffy nose",
      "Sneezing",
      "Sore throat",
      "Cough",
      "Mild headache",
      "Mild body aches"
    ],
    causes: "Caused by various viruses, most commonly rhinoviruses",
    treatment: "Rest, fluids, over-the-counter cold medications, saline nasal spray",
    prevention: "Frequent handwashing, avoid touching face, avoid close contact with sick people"
  },
  covid19: {
    symptoms: [
      "Fever or chills",
      "Cough",
      "Shortness of breath or difficulty breathing",
      "Fatigue",
      "Muscle or body aches",
      "Loss of taste or smell",
      "Sore throat",
      "Congestion or runny nose",
      "Nausea or vomiting",
      "Diarrhea"
    ],
    causes: "Caused by SARS-CoV-2 virus",
    treatment: "Rest, fluids, over-the-counter medications for symptoms. Antiviral treatments available for high-risk individuals. Seek medical care if symptoms are severe.",
    prevention: "Vaccination, wearing masks in crowded places, frequent handwashing, social distancing"
  },
  diabetes: {
    symptoms: [
      "Increased thirst",
      "Frequent urination",
      "Extreme hunger",
      "Unexplained weight loss",
      "Fatigue",
      "Blurred vision",
      "Slow-healing sores"
    ],
    causes: "Type 1: Autoimmune condition. Type 2: Insulin resistance, often related to lifestyle factors",
    treatment: "Blood sugar monitoring, medication (insulin or oral medications), diet management, regular exercise",
    prevention: "Type 2: Healthy diet, regular exercise, maintaining healthy weight"
  },
  hypertension: {
    symptoms: [
      "Often no symptoms (silent condition)",
      "Headaches",
      "Shortness of breath",
      "Nosebleeds",
      "Dizziness"
    ],
    causes: "Can be genetic or lifestyle-related (diet, lack of exercise, stress, smoking)",
    treatment: "Lifestyle changes (diet, exercise), medications as prescribed by doctor, regular monitoring",
    prevention: "Healthy diet (low sodium), regular exercise, maintaining healthy weight, limiting alcohol, not smoking"
  }
};

function generateResponse(message: string, context: any): string {
  const lowerMessage = message.toLowerCase();
  const conditions = context.conditions || [];
  const medications = context.medications || [];
  const scans = context.scans || [];
  const profile = context.profile || {};

  // Check for general medical questions about specific conditions
  for (const [condition, info] of Object.entries(medicalKnowledge)) {
    if (lowerMessage.includes(condition) || lowerMessage.includes(condition.replace("19", ""))) {
      let response = `Here's information about ${condition}:\n\n`;
      response += `**Symptoms:**\n${info.symptoms.map(s => `- ${s}`).join("\n")}\n\n`;
      if (info.causes) {
        response += `**Causes:** ${info.causes}\n\n`;
      }
      if (info.treatment) {
        response += `**Treatment:** ${info.treatment}\n\n`;
      }
      if (info.prevention) {
        response += `**Prevention:** ${info.prevention}\n\n`;
      }
      response += `⚠️ **Important:** This is general information only. If you're experiencing these symptoms or have concerns, please consult with a healthcare professional for proper diagnosis and treatment.`;
      return response;
    }
  }

  // Questions about symptoms
  if (lowerMessage.includes("symptom") && !lowerMessage.includes("my")) {
    return `I can help you understand symptoms of various medical conditions. Try asking about a specific condition, for example:
- "What are the symptoms of chickenpox?"
- "What are flu symptoms?"
- "Tell me about COVID-19 symptoms"

⚠️ **Important:** If you're experiencing symptoms, please consult with a healthcare professional for proper evaluation and diagnosis.`;
  }

  // Questions about conditions
  if (
    lowerMessage.includes("condition") ||
    lowerMessage.includes("diagnosis") ||
    lowerMessage.includes("disease")
  ) {
    if (conditions.length === 0) {
      return "You don't have any medical conditions recorded yet. You can add conditions in your Profile page. Would you like help adding one?";
    }
    const activeConditions = conditions.filter((c: any) => c.status === "active");
    if (activeConditions.length > 0) {
      return `You have ${activeConditions.length} active condition(s): ${activeConditions.map((c: any) => c.condition).join(", ")}. You can view and manage all your conditions in your Profile page. Remember to consult with your healthcare provider about any concerns.`;
    }
    return `You have ${conditions.length} recorded condition(s). You can view and manage them in your Profile page.`;
  }

  // Questions about medications
  if (
    lowerMessage.includes("medication") ||
    lowerMessage.includes("medicine") ||
    lowerMessage.includes("drug") ||
    lowerMessage.includes("prescription")
  ) {
    if (medications.length === 0) {
      return "You don't have any medications recorded yet. You can add medications in your Profile page. Would you like help adding one?";
    }
    const activeMeds = medications.filter((m: any) => m.status === "active");
    if (activeMeds.length > 0) {
      const medList = activeMeds
        .map((m: any) => `${m.name} (${m.dosage}, ${m.frequency})`)
        .join("\n- ");
      return `You have ${activeMeds.length} active medication(s):\n- ${medList}\n\nYou can view and manage all your medications in your Profile page. Always follow your doctor's instructions and never stop taking medications without consulting your healthcare provider.`;
    }
    return `You have ${medications.length} recorded medication(s). You can view and manage them in your Profile page.`;
  }

  // Questions about scans
  if (
    lowerMessage.includes("scan") ||
    lowerMessage.includes("x-ray") ||
    lowerMessage.includes("mri") ||
    lowerMessage.includes("ct")
  ) {
    if (scans.length === 0) {
      return "You don't have any medical scans uploaded yet. You can upload scans in your Profile page. Would you like help uploading one?";
    }
    return `You have ${scans.length} medical scan(s) recorded. You can view and manage them in your Profile page.`;
  }

  // Questions about allergies
  if (lowerMessage.includes("allerg") || lowerMessage.includes("allergic")) {
    const allergies = profile.allergies || [];
    if (allergies.length === 0) {
      return "You don't have any allergies recorded. You can add allergies in your Profile page by editing your profile information.";
    }
    return `You have recorded allergies to: ${allergies.join(", ")}. Make sure to inform healthcare providers about these allergies. You can update this information in your Profile page.`;
  }

  // General help
  if (
    lowerMessage.includes("help") ||
    lowerMessage.includes("what can you do") ||
    lowerMessage.includes("how")
  ) {
    return `I can help you with:
- Understanding your medical conditions
- Reviewing your medications and dosages
- Information about your medical scans
- General health questions (remember, I'm not a substitute for professional medical advice)

You can ask me questions like:
- "What medications am I taking?"
- "Tell me about my conditions"
- "Do I have any allergies?"

Always remember to consult with healthcare professionals for medical decisions.`;
  }

  // Check if it's a general medical question (not about user's personal records)
  const isGeneralQuestion = 
    !lowerMessage.includes("my") && 
    !lowerMessage.includes("i ") &&
    !lowerMessage.includes("me") &&
    (lowerMessage.includes("what") || 
     lowerMessage.includes("how") || 
     lowerMessage.includes("tell me about") ||
     lowerMessage.includes("explain") ||
     lowerMessage.includes("symptoms of") ||
     lowerMessage.includes("treatment for") ||
     lowerMessage.includes("causes of"));

  if (isGeneralQuestion) {
    return `I can help answer general medical questions! Try asking about specific conditions or topics, such as:
- "What are the symptoms of chickenpox?"
- "Tell me about the flu"
- "What causes diabetes?"
- "How is hypertension treated?"

I have information about common conditions like chickenpox, flu, cold, COVID-19, diabetes, and hypertension.

⚠️ **Important:** For comprehensive medical information and personalized advice, I recommend adding an OpenAI API key to enable advanced AI responses. Otherwise, I can provide basic information about common conditions.

**Remember:** This is informational only and cannot replace professional medical advice. Always consult with healthcare professionals for medical decisions.`;
  }

  // Default response
  return `I understand you're asking about "${message}". I can help you with:
- **Your personal medical records:** conditions, medications, scans, allergies
- **General medical questions:** symptoms, treatments, and information about common conditions

Try asking:
- About your records: "What medications am I taking?" or "Tell me about my conditions"
- General questions: "What are the symptoms of chickenpox?" or "Tell me about the flu"

⚠️ **Note:** I provide informational assistance only and cannot replace professional medical advice. Always consult with your healthcare provider for medical decisions.

**Tip:** For more comprehensive answers to general medical questions, consider adding an OpenAI API key to enable advanced AI responses.`;
}


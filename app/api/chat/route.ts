import { NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Input validation schema
const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.string(),
});

const ChatRequestSchema = z.object({
  messages: z.array(MessageSchema),
  profile: z.object({
    academic: z.object({
      examType: z.string(),
      targetScore: z.string(),
    }),
    lifestyle: z.any(),
  }),
  mentalDNA: z.object({
    primaryStressors: z.array(z.string()),
    confidencePattern: z.string(),
    burnoutSusceptibility: z.string(),
    emotionalResilience: z.number(),
  }),
});

// High-quality local chat engine if Gemini is offline/missing API Key
function getLocalEmpatheticResponse(
  message: string,
  examType: string,
  stressors: string[],
  resilience: number
): string {
  const text = message.toLowerCase();
  
  // Sensitive trigger check for medical disclaimer
  const sensitiveWords = ['depressed', 'suicide', 'self harm', 'kill myself', 'die', 'end it', 'clinical', 'diagnose', 'medication', 'therapy', 'counselor'];
  const isSensitive = sensitiveWords.some(w => text.includes(w));
  
  const disclaimer = "\n\n*Disclaimer: I am an AI wellness companion, not a medical professional. If you are experiencing severe distress or thoughts of self-harm, please connect with a professional counselor or contact a helpline immediately.*";

  if (isSensitive) {
    return `I hear how incredibly heavy things feel for you right now, and I want you to know you're not alone. The pressure of preparing for ${examType} can feel overwhelming, but please prioritize your safety and well-being above all else.${disclaimer}`;
  }

  // Common exam student themes
  if (text.includes('physics') || text.includes('math') || text.includes('chemistry') || text.includes('syllabus')) {
    return `Dreading specific subjects or dealing with a mounting backlog is one of the most common stressors for ${examType} aspirants. Since your Mental DNA shows you struggle with ${stressors.join(', ') || 'exam pressure'}, let's break this down. Try selecting just one sub-topic today. Solve 5 basic questions. Can we focus on that small step together?`;
  }

  if (text.includes('mock') || text.includes('score') || text.includes('marks') || text.includes('rank')) {
    return `Mock test scores are diagnostic tools, not a final verdict on your potential. A drop in scores is simply feedback showing where your concept gaps are. Let's list 2 topics you scored well in, and then list exactly 2 errors we can review. How does that sound?`;
  }

  if (text.includes('parent') || text.includes('dad') || text.includes('mom') || text.includes('expectations') || text.includes('family')) {
    return `Navigating parental expectations while dealing with the intense syllabus of ${examType} adds a heavy layer of stress. Often, parents voice their anxiety because they care, but it translates as pressure. Would you like to practice drafting a short update message to send them, or do a quick 4-minute box breathing session to reset?`;
  }

  if (text.includes('burnout') || text.includes('tired') || text.includes('exhausted') || text.includes('give up') || text.includes('sleep')) {
    return `Your exhaustion is real, and pushing through when you are empty only yields diminishing returns. Resilience is not just about studying; it is also about knowing when to rest. I suggest setting a hard stop time for study tonight. Get 7 hours of sleep. Your brain needs rest to store what you studied!`;
  }

  if (text.includes('hello') || text.includes('hi ') || text.includes('hey')) {
    return `Hello! I am your MindPilot co-pilot. I am here to help you navigate the academic pressure of ${examType}. How are you feeling today, and what is currently occupying your mind?`;
  }

  return `I understand. Preparing for ${examType} is a long marathon, and it is completely normal to have days where you feel stuck or anxious. Given your current resilience score is ${resilience}%, let's focus on what we can control. What is one small task we can tackle in the next hour to make you feel a bit more in control?`;
}

export async function POST(request: Request) {
  let body: any = null;
  try {
    body = await request.json();
    
    // Validate request
    const validationResult = ChatRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request format", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { messages, profile, mentalDNA } = validationResult.data;
    const latestUserMessage = messages[messages.length - 1]?.parts || '';

    // Check for sensitive queries to inject disclaimer on server side
    const sensitiveWords = ['depressed', 'suicide', 'self harm', 'kill myself', 'die', 'end it', 'clinical', 'diagnose', 'medication', 'therapy', 'counselor'];
    const requiresDisclaimer = sensitiveWords.some(w => latestUserMessage.toLowerCase().includes(w));

    if (!genAI) {
      // Fallback response
      const reply = getLocalEmpatheticResponse(
        latestUserMessage,
        profile.academic.examType,
        mentalDNA.primaryStressors,
        mentalDNA.emotionalResilience
      );
      return NextResponse.json({ text: reply, isDisclaimer: requiresDisclaimer });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemInstruction = `
You are MindPilot AI, an empathetic and supportive AI Mental Resilience Co-Pilot for competitive exam aspirants.
The student is preparing for ${profile.academic.examType} (Target Score: ${profile.academic.targetScore}).
Stated Stressors: ${mentalDNA.primaryStressors.join(', ')}.
Confidence Pattern: ${mentalDNA.confidencePattern}.
Burnout Susceptibility: ${mentalDNA.burnoutSusceptibility}.
Emotional Resilience Score: ${mentalDNA.emotionalResilience}/100.

Guidelines:
1. Be encouraging, warm, practical, and action-oriented.
2. Use active listening: validate their struggles before offering advice.
3. NEVER provide clinical medical diagnoses or suggest medications.
4. If the user mentions self-harm, depression, suicidal thoughts, or clinical terms, you MUST include the exact warning: "I am an AI wellness companion, not a medical professional." and advise them to seek professional support.
5. Keep responses concise (under 3 short paragraphs) to respect the student's study time. Suggest concrete micro-actions.
`;

    // format messages history for gemini API
    // Gemini chat API requires that history starts with a 'user' message.
    // We filter out any leading messages that are from the model (like the welcome message).
    const firstUserIdx = messages.findIndex(msg => msg.role === 'user');
    const filteredMessages = firstUserIdx !== -1 ? messages.slice(firstUserIdx) : [];

    const chatHistory = filteredMessages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.parts }]
    }));

    const chat = model.startChat({
      history: chatHistory,
      systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
    });

    const response = await chat.sendMessage(latestUserMessage);
    let replyText = response.response.text();

    if (requiresDisclaimer && !replyText.includes("not a medical professional")) {
      replyText += "\n\n*I am an AI wellness companion, not a medical professional. If you are experiencing severe distress, please reach out to a professional counselor or helpline.*";
    }

    return NextResponse.json({
      text: replyText,
      isDisclaimer: requiresDisclaimer
    });

  } catch (error: any) {
    console.error("API error during chat: ", error);
    
    // Graceful fallback to local response instead of crashing with a 500 error
    try {
      const { messages, profile, mentalDNA } = body || {};
      const latestUserMessage = messages?.[messages.length - 1]?.parts || '';
      
      const sensitiveWords = ['depressed', 'suicide', 'self harm', 'kill myself', 'die', 'end it', 'clinical', 'diagnose', 'medication', 'therapy', 'counselor'];
      const requiresDisclaimer = sensitiveWords.some(w => latestUserMessage.toLowerCase().includes(w));
      
      const reply = getLocalEmpatheticResponse(
        latestUserMessage,
        profile?.academic?.examType || 'exam',
        mentalDNA?.primaryStressors || [],
        mentalDNA?.emotionalResilience || 50
      );
      
      return NextResponse.json({
        text: reply + "\n\n*(Co-pilot operating in localized fallback mode)*",
        isDisclaimer: requiresDisclaimer
      });
    } catch (fallbackError) {
      return NextResponse.json(
        { error: "Internal Server Error", message: error.message },
        { status: 500 }
      );
    }
  }
}

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
console.log('key is ', process.env.NEXT_PUBLIC_GEMINI_API_KEY)

export async function generateQuiz(profile) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const gradeLevel = parseInt(profile.grade);
    const includeImages = gradeLevel <= 2;

    const prompt = `
    Generate a pre-assessment quiz for a student with the following profile:
    - Grade: ${profile.grade}
    - Language: ${profile.language}
    - Favorite Subject: ${profile.subject}
    
    IMPORTANT: Adjust the difficulty level to be appropriate for Grade ${profile.grade} students.
    ${includeImages ? 'For Grade 1-2 students, include simple, visual questions that can be represented with emojis or simple descriptions.' : ''}
    
    Create 5 multiple-choice questions to assess their foundational knowledge in Literacy and Numeracy suitable for Grade ${profile.grade} level.
    
    ${includeImages ? `
    For younger students (Grade 1-2):
    - Use very simple language
    - Include counting questions with emojis (e.g., "How many apples? 🍎🍎🍎")
    - Use basic shape recognition (e.g., "Which is a circle? ⭕ 🔺 ⬜")
    - Simple word recognition with pictures
    ` : `
    For older students (Grade 3+):
    - Use age-appropriate vocabulary
    - Include word problems for math
    - Reading comprehension questions
    - Basic grammar and sentence structure
    `}
    
    Return the response in strictly valid JSON format with this structure:
    {
      "questions": [
        {
          "id": 1,
          "question": "Question text ${includeImages ? '(can include emojis for visual representation)' : ''}",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option A"
        }
      ]
    }
    Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Error generating quiz:", error);
        return {
            questions: [
                {
                    id: 1,
                    question: "What is 5 + 7?",
                    options: ["10", "11", "12", "13"],
                    correctAnswer: "12"
                },
                {
                    id: 2,
                    question: "Which word is a noun?",
                    options: ["Run", "Happy", "Cat", "Quickly"],
                    correctAnswer: "Cat"
                }
            ]
        };
    }
}

export async function generateModuleQuiz(moduleContent, grade, language) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const gradeLevel = parseInt(grade);
    const isPictorial = gradeLevel <= 2;
    const questionCount = isPictorial ? 5 : (gradeLevel <= 5 ? 8 : 10);

    const prompt = `
    Generate a quiz based on this learning module content:
    "${moduleContent}"
    
    Student Grade: ${grade}
    Language: ${language}
    
    ${isPictorial ? `
    For Grade 1-2 students:
    - Create ${questionCount} multiple-choice questions with emojis and simple words
    - Use VERY simple language
    - Include visual elements (emojis)
    - Make questions fun and engaging
    - Each question should have 3-4 options
    ` : `
    For Grade 3+ students:
    - Create ${questionCount} questions with mixed types:
      * ${Math.floor(questionCount * 0.6)} multiple-choice questions (4 options each)
      * ${Math.floor(questionCount * 0.2)} short answer questions (2-3 lines)
      * ${Math.floor(questionCount * 0.2)} paragraph questions (4-5 lines)
    - Questions should test understanding, not just memory
    - Include application-based questions
    - Vary difficulty from easy to challenging
    `}
    
    Return in this JSON format:
    {
      "questions": [
        {
          "id": 1,
          "type": "multiple-choice",
          "question": "Question text",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "A"
        },
        {
          "id": 2,
          "type": "short-answer",
          "question": "Question text",
          "correctAnswer": "Expected answer"
        }
      ]
    }
    
    Do not include markdown formatting.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Error generating module quiz:", error);
        return {
            questions: [
                {
                    id: 1,
                    type: "multiple-choice",
                    question: "What did you learn from this module?",
                    options: ["A lot", "Some things", "A little", "Nothing"],
                    correctAnswer: "A lot"
                }
            ]
        };
    }
}

export async function evaluateQuiz(answers, questions) {
    let score = 0;
    questions.forEach(q => {
        if (answers[q.id] === q.correctAnswer) {
            score++;
        }
    });

    const percentage = (score / questions.length) * 100;
    let level = "Beginner";
    if (percentage > 80) level = "Advanced";
    else if (percentage > 50) level = "Intermediate";

    return { score, percentage, level };
}

export async function reassessWithPeers(studentAnswers, allClassmatesData, moduleId) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
    You are an AI educational assessor. Analyze this student's performance in context of their peers.
    
    Student's Quiz Results:
    ${JSON.stringify(studentAnswers)}
    
    Classmates' Performance Data (anonymized):
    ${JSON.stringify(allClassmatesData)}
    
    Module ID: ${moduleId}
    
    Provide:
    1. A reassessed score (0-100) based on relative performance
    2. Detailed justification explaining:
       - How the student compares to peers
       - Strengths identified
       - Areas for improvement
       - Personalized recommendations
    
    Return in JSON format:
    {
      "reassessedScore": 85,
      "justification": "Detailed explanation...",
      "strengths": ["strength1", "strength2"],
      "improvements": ["area1", "area2"],
      "recommendations": ["rec1", "rec2"]
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Error in peer reassessment:", error);
        return {
            reassessedScore: studentAnswers.score || 70,
            justification: "Unable to perform peer comparison at this time.",
            strengths: ["Completed the assessment"],
            improvements: ["Continue practicing"],
            recommendations: ["Review the module content"]
        };
    }
}

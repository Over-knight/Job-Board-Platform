// import { GoogleGenAI } from "@google/genai";

// const apiKey = process.env.API_KEY;
// if (!apiKey) {
//     throw new Error("Missing Google API KEY in environment");
// } 

// const genAI = new GoogleGenAI({ apiKey });
// export const textModel = genAI.models;

// src/utils/geminiClient.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export default genAI;

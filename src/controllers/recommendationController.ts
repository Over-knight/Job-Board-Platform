import { Request, response, Response } from "express";
// import { textModel } from "../lib/genaiClient";
import genAI from "../lib/genaiClient";
export const getJobRecommendation = async (req: Request, res: Response): Promise<void> => {
    try{
        const model = genAI.getGenerativeModel({ model: 'gemini-pro'});
        const prompt = `
        I am looking for job recommendations based on past applications in backend engineering and Node.js.
        Please return 5 recommended job titles and short descriptions as a JSON array.
        `;

        const result = await model.generateContent( [prompt] );
        const response = await result.response;
        const text = response.text();

        console.log("Raw Gemini response:", text);

        const recommendations = JSON.parse(text);
        res.status(200).json({ recommendations });
    } catch (error) {
        console.error("Gemini error",error);
        res.status(500).json({ message: "Failed to get recommendations"});
    }
};
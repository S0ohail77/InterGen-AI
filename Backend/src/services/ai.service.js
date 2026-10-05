const { GoogleGenAI } = require("@google/genai");
const {z} = require('zod');



let ai

function getAiClient() {
    if (!process.env.GOOGLE_GENAI_API_KEY) {
        const error = new Error("GOOGLE_GENAI_API_KEY is not defined in the environment variables.")
        error.statusCode = 503
        throw error
    }

    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })
    }

    return ai
}

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription}){
    const client = getAiClient()

    const prompt = `Generate an interview report for a candidate with the following details
                    Resume : ${resume},
                    Self Description : ${selfDescription},
                    Job Description : ${jobDescription}`
    
    const response = await client.models.generateContent({
        model : "gemini-3.5-flash-lite",
        contents : prompt,
        config :{
            responseMimeType: "application/json",
            responseSchema : z.toJSONSchema(interviewReportSchema),
        }
    })

        return JSON.parse(response.text)
    
}
async function invokeGenAi(){
    const client = getAiClient()

    const response = await client.models.generateContent({
        model : "gemini-3.5-flash-lite",
        contents : "Hi gemini ! explain what is interview?"
    })


}

module.exports = generateInterviewReport

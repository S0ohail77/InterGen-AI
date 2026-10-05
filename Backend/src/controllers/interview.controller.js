const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description Controller to generate interview report based on user sefl description, resume, and job description 
 */

async function generateInterviewReportController(req, res) {
    const { jobDescription, selfDescription } = req.body || {}

    if (!jobDescription || !jobDescription.trim()) {
        return res.status(400).json({
            message: "Job description is required."
        })
    }

    const hasSelfDescription = typeof selfDescription === "string" && selfDescription.trim().length > 0
    const hasResume = Boolean(req.file && req.file.buffer && req.file.buffer.length > 0)

    if (!hasSelfDescription && !hasResume) {
        return res.status(400).json({
            message: "Please provide either a resume or a self description."
        })
    }

    let resumeText = ""

    if (hasResume) {
        const fileName = String(req.file.originalname || "").toLowerCase()
        if (!fileName.endsWith(".pdf")) {
            return res.status(400).json({
                message: "Please upload a PDF resume."
            })
        }

        let parser
        try {
            parser = new pdfParse.PDFParse({ data: new Uint8Array(req.file.buffer) })
            const parsedPdf = await parser.getText()
            resumeText = parsedPdf.text || ""
        } catch (error) {
            return res.status(400).json({
                message: "The uploaded PDF could not be read. Please try another PDF."
            })
        } finally {
            if (parser) {
                await parser.destroy()
            }
        }

        if (!resumeText.trim()) {
            return res.status(400).json({
                message: "No readable text was found in the uploaded PDF. Please provide a self-description instead."
            })
        }
    }

    const normalizedSelfDescription = hasSelfDescription ? selfDescription.trim() : ""
    const normalizedResumeText = resumeText.trim()

    let interviewReport
    try {
        const interviewReportAi = await generateInterviewReport({
            resume: normalizedResumeText || normalizedSelfDescription,
            selfDescription: normalizedSelfDescription,
            jobDescription: jobDescription.trim()
        })

        interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: normalizedResumeText || normalizedSelfDescription,
            selfDescription: normalizedSelfDescription,
            jobDescription: jobDescription.trim(),
            ...interviewReportAi
        })
    } catch (error) {
        console.error("Interview report generation failed:", error)
        return res.status(error.statusCode || 500).json({
            message: error.statusCode === 503
                ? error.message
                : "Interview report generation failed. Please check the server logs and try again."
        })
    }

    return res.status(201).json({
        message: "Interview report generated successfully",
        interviewReport
    })
}

/**
 * @description Controller to get interview report by interviewId
 */

async function getInterviewReportByIdController(req, res) {
    const {interviewId} = req.params 
    const interviewReport = await interviewReportModel.findOne({_id : interviewId, user : req.user.id})

    if(!interviewReport){
        return res.status(404).json({
            message : "Interview report not found."
         
        })
    }

    res.status(200).json({
        message : "interview report fetched successfully",
        interviewReport
    })
} 

/**
 * @description Controller to get all interview reports of logged in user
 */
async function getAllInterviewReportsController(req, res){
    const interviewReports = await interviewReportModel.find({user : req.user.id}).sort({ createdAt : -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestion -behavioralQestion -skillGaps -preparationPlan")

    res.status(200).json({
        message : "Interview reports fetched successfully",
        interviewReports
    })
}


module.exports = {generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController}

import { getAllInterviewReports, generateInterviewReport, getInterviewReportById } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { interviewContext } from "../interview.context"
import { useParams } from "react-router"



export const useInterview = () => {
    const context = useContext(interviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setloading, report, setreport, reports, setreports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setloading(true)

        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            const interviewReport = response?.interviewReport ?? response

            if (interviewReport) {
                setreport(interviewReport)
            }

            return interviewReport
        } catch (err) {
            throw err
        } finally {
            setloading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setloading(true)

        try {
            const response = await getInterviewReportById(interviewId)
            const interviewReport = response?.interviewReport ?? response

            if (interviewReport) {
                setreport(interviewReport)
            }

            return interviewReport
        } catch (err) {
            console.log(err)
            return null
        } finally {
            setloading(false)
        }
    }

    const getReports = async () => {
        setloading(true)

        try {
            const response = await getAllInterviewReports()
            const interviewReports = response?.interviewReports ?? []
            setreports(interviewReports)
            return interviewReports
        } catch (err) {
            console.log(err)
            return []
        } finally {
            setloading(false)
        }
    }

    useEffect(()=>{
        if(interviewId){
            getReportById(interviewId)
        }else{
            getReports()
        }
    }, [interviewId])

    return { loading, report, reports, generateReport, getReportById, getReports }
}
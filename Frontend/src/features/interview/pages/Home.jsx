import React, { useRef, useState } from 'react';
import '../style/home.scss';
import { useInterview} from "../hooks/useInterview"
import { useNavigate } from 'react-router';


const Home = () => {

  const {loading, generateReport} = useInterview()

  const [jobDescription, setjobDescription] = useState("")
  const [selfDescription, setselfDescription] = useState("")
  const [selectedResumeName, setSelectedResumeName] = useState("")
  const [error, setError] = useState("")
  const resumeInputRef= useRef()

  const navigate = useNavigate()

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0]
    setError("")

    if (file && file.size > 3 * 1024 * 1024) {
      event.target.value = ""
      setSelectedResumeName("")
      setError("Resume files must be 3 MB or smaller.")
      return
    }

    setSelectedResumeName(file ? file.name : "")
  }

  const handleGenerateReport = async () =>{
   const resumeFile = resumeInputRef.current?.files?.[0]
   setError("")

   if (!jobDescription.trim()) {
     setError("Please enter the target job description.")
     return
   }

   if (!selfDescription.trim() && !resumeFile) {
     setError("Please upload a PDF resume or enter a self-description.")
     return
   }

   try {
     const data = await generateReport({jobDescription, selfDescription, resumeFile})
     if (data?._id) {
       navigate(`/interview/${data._id}`)
     } else {
       setError("The report could not be generated. Please try again.")
     }
   } catch (err) {
     setError(err.response?.data?.message || "Unable to generate the report. Please try again.")
   }
  }
  return (
    <main className="interview-plan-page">
      <div className="page-container">
        <h1 className="page-title">
          Create Your Custom <span>Interview Plan</span>
        </h1>

        <p className="page-subtitle">
          Let our AI analyze the job requirements and your unique profile to
          <br />
          build a winning strategy.
        </p>

        <section className="plan-layout">
          <div className="panel left-panel">
            <div className="panel-header">
              <div className="panel-title">
                <span className="panel-icon document-icon" aria-hidden="true" />
                <label htmlFor="jobDescription">Target Job Description</label>
              </div>
              <span className="required-badge">REQUIRED</span>
            </div>

            <textarea
            onChange={(e) =>{setjobDescription(e.target.value)}}
              id="jobDescription"
              name="jobDescription"
              value={jobDescription}
              placeholder="Paste the full job description here... e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."
            />

            <div className="panel-footer">
              <span>0 / 5000 chars</span>
            </div>
          </div>

          <div className="panel right-panel">
            <div className="panel-header profile-header">
              <div className="panel-title">
                <span className="panel-icon profile-icon" aria-hidden="true" />
                <label htmlFor="resume">Your Profile</label>
              </div>
            </div>

            <div className="profile-actions">
              <button type="button" className="chip-btn muted">Upload Resume</button>
              <button type="button" className="chip-btn accent">Best Results</button>
            </div>

            <div className="upload-box">
              <input
                ref={resumeInputRef}
                hidden
                type="file"
                name="resume"
                id="resume"
                accept=".pdf,application/pdf"
                onChange={handleResumeChange}
              />
              <label htmlFor="resume" className="upload-label">
                <span className="upload-mark" aria-hidden="true">↑</span>
                <span>
                  {selectedResumeName ? selectedResumeName : 'Click to upload or drag & drop'}
                  <small>{selectedResumeName ? 'Resume selected' : 'PDF only (Max 3MB)'}</small>
                </span>
              </label>
            </div>

            <div className="divider-text">OR</div>

            <div className="self-box">
              <div className="self-title">Quick Self-Description</div>
              <textarea

              onChange={(e)=>{setselfDescription(e.target.value)}}
                id="selfDescription"
                name="selfDescription"
                value={selfDescription}
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              />
            </div>

            <div className="info-banner">
              <span className="info-dot" aria-hidden="true" />
              Either a Resume or a Self Description is required to generate a personalized plan.
            </div>
          </div>
        </section>

        <div className="bottom-bar">
          <div className="strategy-meta">AI-Powered Strategy Generation • Approx 30s</div>
          <button
           onClick={handleGenerateReport}
           type="button" className="generate-button" disabled={loading}>
            <span className="star">✦</span>
            {loading ? 'Generating...' : 'Generate My Interview Strategy'}
          </button>
        </div>

        {error && <p role="alert">{error}</p>}

        <footer className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help Center</a>
        </footer>
      </div>
    </main>
  );
};

export default Home;

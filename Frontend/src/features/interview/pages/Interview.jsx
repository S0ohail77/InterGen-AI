import React, { useState } from 'react'
import '../style/interview.scss'
import { useNavigate, useParams } from 'react-router'
import { useInterview } from '../hooks/useInterview'

const NAV_ITEMS = [
    {
        id: 'technical',
        label: 'Technical Questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        )
    },
    {
        id: 'behavioral',
        label: 'Behavioral Questions',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        id: 'roadmap',
        label: 'Road Map',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
        )
    },
]

const EMPTY_REPORT = {
    matchScore: 0,
    technicalQuestions: [],
    behavioralQuestions: [],
    skillGaps: [],
    preparationPlan: [],
}

const getSafeReport = (value = EMPTY_REPORT) => ({
    ...EMPTY_REPORT,
    ...(value ?? {}),
    technicalQuestions: Array.isArray(value?.technicalQuestions) ? value.technicalQuestions : [],
    behavioralQuestions: Array.isArray(value?.behavioralQuestions) ? value.behavioralQuestions : [],
    skillGaps: Array.isArray(value?.skillGaps) ? value.skillGaps : [],
    preparationPlan: Array.isArray(value?.preparationPlan) ? value.preparationPlan : [],
})

const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen((previous) => !previous)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item?.question ?? 'Question unavailable'}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item?.intention ?? 'No intention provided.'}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
                        <p>{item?.answer ?? 'No answer available yet.'}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day?.day ?? 1}</span>
            <h3 className='roadmap-day__focus'>{day?.focus ?? 'Daily focus'}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {(day?.tasks ?? []).map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

const Interview = () => {
    const { interviewId } = useParams()
    const navigate = useNavigate()
    const { report, loading } = useInterview()
    const [activeNav, setActiveNav] = useState('technical')

    const safeReport = getSafeReport(report)
    const scoreColor =
        safeReport.matchScore >= 80 ? 'score--high' :
        safeReport.matchScore >= 60 ? 'score--mid' : 'score--low'

    if (loading && interviewId) {
        return (
            <div className='interview-page'>
                <div className='interview-layout'>
                    <div style={{ padding: '2rem', color: '#fff' }}>
                        <h2>Loading interview report...</h2>
                    </div>
                </div>
            </div>
        )
    }

    if ((!interviewId || (interviewId && !safeReport.technicalQuestions.length && !safeReport.behavioralQuestions.length)) && !loading) {
        return (
            <div className='interview-page'>
                <div className='interview-layout'>
                    <div style={{ padding: '2rem', color: '#fff' }}>
                        <h2>Interview report not found</h2>
                        <button onClick={() => navigate('/')} className='button primary-button'>Back to home</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='interview-page'>
            <div className='interview-layout'>
                <nav className='interview-nav'>
                    <div className='nav-content'>
                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className='button primary-button'
                    >
                        Back to Home
                    </button>
                </nav>

                <div className='interview-divider' />

                <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-header__count'>{safeReport.technicalQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {safeReport.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={`${q?.question ?? 'question'}-${i}`} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='content-header__count'>{safeReport.behavioralQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {safeReport.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={`${q?.question ?? 'behavioral'}-${i}`} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='content-header__count'>{safeReport.preparationPlan.length}-day plan</span>
                            </div>
                            <div className='roadmap-list'>
                                {safeReport.preparationPlan.map((day) => (
                                    <RoadMapDay key={day?.day ?? Math.random()} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <div className='interview-divider' />

                <aside className='interview-sidebar'>
                    <div className='match-score'>
                        <p className='match-score__label'>Match Score</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className='match-score__value'>{safeReport.matchScore}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <p className='match-score__sub'>Strong match for this role</p>
                    </div>

                    <div className='sidebar-divider' />

                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {safeReport.skillGaps.map((gap, i) => (
                                <span key={`${gap?.skill ?? 'skill'}-${i}`} className={`skill-tag skill-tag--${gap?.severity ?? 'low'}`}>
                                    {gap?.skill ?? 'No gaps identified'}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Interview
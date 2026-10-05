import { createContext, useState } from "react";

export const interviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [loading, setloading] = useState(false);
  const [report, setreport] = useState(null);
  const [reports, setreports] = useState([]);

  return (
    <interviewContext.Provider value={{ loading, setloading, report, setreport, reports, setreports }}>
      {children}
    </interviewContext.Provider>
  );
};
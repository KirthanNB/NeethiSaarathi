"use client";

import React, { useState, useEffect } from "react";
import EditQuestion from '../assets/Edit-question.gif';

interface QuestionnaireProps {
  sessionId: string;
  onComplete: () => void;
  onSave: (data: any) => Promise<boolean>;
}

// Custom hook for responsive styles
const useResponsiveStyles = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  const container = {
    width: "100%",
    maxWidth: isMobile ? '95%' : '700px',
    margin: isMobile ? '16px auto' : '20px auto',
  };

  const card = {
    background: "rgba(255,255,255,0.9)",
    borderRadius: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: isMobile ? '24px' : '32px',
  };

  const header: React.CSSProperties = {
    textAlign: "center",
    marginBottom: isMobile ? '24px' : '32px',
  };

  const iconContainer = {
    width: isMobile ? '64px' : '80px',
    height: isMobile ? '64px' : '80px',
    borderRadius: "50%",
    background: "linear-gradient(to bottom right, #f97316, #22c55e)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  };

  const iconText = {
    fontSize: isMobile ? '20px' : '28px',
  };

  const title = {
    fontSize: isMobile ? '22px' : '28px',
    fontWeight: "bold",
    background: "linear-gradient(to right, #ea580c, #16a34a)",
    WebkitBackgroundClip: "text",
    color: "transparent",
    marginBottom: "8px",
  };

  const subtitle = {
    color: "#4b5563",
    fontSize: isMobile ? '14px' : 'inherit',
  };

  const progressBar = {
    display: "flex",
    justifyContent: "center",
    marginTop: "16px",
  };

  const progressSegment = {
    width: isMobile ? '24px' : '32px',
    height: '8px',
    borderRadius: "4px",
    margin: "0 4px",
  };

  const formSection = {
    display: "flex",
    flexDirection: "column" as "column",
    gap: isMobile ? '16px' : '20px',
  };

  const formField = {
    display: "flex",
    flexDirection: "column" as "column",
    gap: "6px",
  };

  const label = {
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
  };

  const requiredStar = {
    color: "#ef4444",
    marginLeft: "4px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    border: "1px solid #fbbf24",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.8)",
    fontSize: isMobile ? '14px' : 'inherit',
  };

  const buttonBase: React.CSSProperties = {
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    fontWeight: "bold",
    fontSize: isMobile ? '14px' : 'inherit',
  };

  const booleanButtonContainer: React.CSSProperties = {
    display: "flex",
    flexDirection: isMobile ? 'column' : 'row',
    gap: "12px",
  };

  const fullWidthButton = {
    ...buttonBase,
    width: "100%",
    padding: "14px",
  };

  const phase2Title = {
    fontSize: isMobile ? '18px' : '20px',
    fontWeight: 600,
    color: "#1f2937",
  };

  const phase2Subtitle = {
    color: "#4b5563",
    fontSize: isMobile ? '12px' : 'inherit',
  };

  return {
    isMobile,
    container,
    card,
    header,
    iconContainer,
    iconText,
    title,
    subtitle,
    progressBar,
    progressSegment,
    formSection,
    formField,
    label,
    requiredStar,
    inputStyle,
    buttonBase,
    booleanButtonContainer,
    fullWidthButton,
    phase2Title,
    phase2Subtitle,
  };
};

const Questionnaire: React.FC<QuestionnaireProps> = ({
  sessionId,
  onComplete,
  onSave,
}) => {
  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const responsiveStyles = useResponsiveStyles();

  const phase1Questions = [
    { id: "state", question: "What is your State of Domicile?", type: "text", required: true },
    { id: "gender", question: "What is your Gender?", type: "select", options: ["Male", "Female", "Transgender", "Other"], required: true },
    { id: "social_category", question: "What is your Social Category?", type: "select", options: ["General", "OBC", "SC", "ST", "Other"], required: true },
    { id: "annual_income", question: "What is your approximate Annual Family Income?", type: "select", options: ["Less than ₹1 lakh", "₹1-3 lakh", "₹3-8 lakh", "Above ₹8 lakh"], required: true },
    { id: "has_disability", question: "Do you have any disabilities?", type: "boolean", required: true },
    { id: "occupation", question: "What is your primary occupation or status?", type: "select", options: ["Student", "Farmer", "Self-Employed/Artisan", "Unemployed", "Salaried Employee", "Senior Citizen", "Other"], required: true },
  ];

  const phase2Questions: Record<string, any[]> = {
    Student: [
      { id: "education_level", question: "What is your current level of education?", type: "select", options: ["Below Class 10", "Class 10-12", "Undergraduate", "Postgraduate"], required: true },
      { id: "field_of_study", question: "What is your field of study?", type: "text", required: true },
      { id: "grades", question: "What was your percentage/CGPA in your last major exam?", type: "text", required: true },
    ],
    Farmer: [
      { id: "land_ownership", question: "Do you own the land you cultivate?", type: "boolean", required: true },
      { id: "land_size", question: "What is the size of your land holding?", type: "text", required: true },
      { id: "crop_type", question: "What type of crops or farming do you practice?", type: "text", required: true },
    ],
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmitPhase = async () => {
    setLoading(true);
    const success = await onSave(formData);
    setLoading(false);

    if (success) {
      if (currentPhase === 1) {
        if (formData.occupation in phase2Questions) {
          setCurrentPhase(2);
        } else {
          onComplete();
        }
      } else {
        onComplete();
      }
    }
  };

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case "text":
        return (
          <input
            type="text"
            value={formData[question.id] || ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            style={responsiveStyles.inputStyle}
            required={question.required}
          />
        );
      case "select":
        return (
          <select
            value={formData[question.id] || ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            style={responsiveStyles.inputStyle}
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.options.map((opt: string) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case "boolean":
        return (
          <div style={responsiveStyles.booleanButtonContainer}>
            <button
              type="button"
              onClick={() => handleInputChange(question.id, true)}
              style={{
                ...responsiveStyles.buttonBase,
                backgroundColor: formData[question.id] === true ? "#22c55e" : "rgba(255,255,255,0.8)",
                color: formData[question.id] === true ? "white" : "#374151",
                border: "1px solid #22c55e",
              }}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleInputChange(question.id, false)}
              style={{
                ...responsiveStyles.buttonBase,
                backgroundColor: formData[question.id] === false ? "#ef4444" : "rgba(255,255,255,0.8)",
                color: formData[question.id] === false ? "white" : "#374151",
                border: "1px solid #ef4444",
              }}
            >
              No
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={responsiveStyles.container}>
      <div style={responsiveStyles.card}>
        {/* Header */}
        <div style={responsiveStyles.header}>
          <div style={responsiveStyles.iconContainer}>
            <span style={responsiveStyles.iconText}>
              <img
                src={EditQuestion}
                alt="Questionnaire"
                style={{
                  width: responsiveStyles.isMobile ? 36 : 55,
                  height: responsiveStyles.isMobile ? 36 : 55,
                  objectFit: 'cover',
                  borderRadius: '40%',
                  background: 'Transparent'
                }}
  /></span>
          </div>
          <h1 style={responsiveStyles.title}>Personalize Your Experience</h1>
          <p style={responsiveStyles.subtitle}>
            Help us provide better legal assistance tailored to your needs
          </p>
          <div style={responsiveStyles.progressBar}>
            <div
              style={{
                ...responsiveStyles.progressSegment,
                backgroundColor: currentPhase >= 1 ? "#f97316" : "#d1d5db",
              }}
            />
            <div
              style={{
                ...responsiveStyles.progressSegment,
                backgroundColor: currentPhase >= 2 ? "#22c55e" : "#d1d5db",
              }}
            />
          </div>
        </div>

        {/* Phase 1 */}
        {currentPhase === 1 && (
          <div style={responsiveStyles.formSection}>
            {phase1Questions.map((q) => (
              <div key={q.id} style={responsiveStyles.formField}>
                <label style={responsiveStyles.label}>
                  {q.question}
                  {q.required && <span style={responsiveStyles.requiredStar}>*</span>}
                </label>
                {renderQuestion(q)}
              </div>
            ))}
            <button
              onClick={handleSubmitPhase}
              disabled={loading || !formData.occupation}
              style={{
                ...responsiveStyles.fullWidthButton,
                background: "linear-gradient(to right, #f97316, #22c55e)",
                color: "white",
                opacity: loading || !formData.occupation ? 0.5 : 1,
              }}
            >
              {loading ? "Saving..." : "Continue →"}
            </button>
          </div>
        )}

        {/* Phase 2 */}
        {currentPhase === 2 && formData.occupation && phase2Questions[formData.occupation] && (
          <div style={responsiveStyles.formSection}>
            <div style={{ textAlign: "center" }}>
              <h2 style={responsiveStyles.phase2Title}>
                Tell us more about your {formData.occupation} background
              </h2>
              <p style={responsiveStyles.phase2Subtitle}>This helps us provide more accurate assistance</p>
            </div>
            {phase2Questions[formData.occupation].map((q) => (
              <div key={q.id} style={responsiveStyles.formField}>
                <label style={responsiveStyles.label}>
                  {q.question}
                  {q.required && <span style={responsiveStyles.requiredStar}>*</span>}
                </label>
                {renderQuestion(q)}
              </div>
            ))}
            <button
              onClick={handleSubmitPhase}
              disabled={loading}
              style={{
                ...responsiveStyles.fullWidthButton,
                background: "linear-gradient(to right, #22c55e, #16a34a)",
                color: "white",
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? "Completing..." : "Complete Profile ✓"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
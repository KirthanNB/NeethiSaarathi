"use client";

import React, { useState } from 'react';

interface QuestionnaireProps {
  sessionId: string;
  onComplete: () => void;
  onSave: (data: any) => Promise<boolean>;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ sessionId, onComplete, onSave }) => {
  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const phase1Questions = [
    { id: 'state', question: 'What is your State of Domicile?', type: 'text', required: true },
    { id: 'gender', question: 'What is your Gender?', type: 'select', options: ['Male', 'Female', 'Transgender', 'Other'], required: true },
    { id: 'social_category', question: 'What is your Social Category?', type: 'select', options: ['General', 'OBC', 'SC', 'ST', 'Other'], required: true },
    { id: 'annual_income', question: 'What is your approximate Annual Family Income?', type: 'select', options: ['Less than ₹1 lakh', '₹1-3 lakh', '₹3-8 lakh', 'Above ₹8 lakh'], required: true },
    { id: 'has_disability', question: 'Do you have any disabilities?', type: 'boolean', required: true },
    { id: 'occupation', question: 'What is your primary occupation or status?', type: 'select', options: ['Student', 'Farmer', 'Self-Employed/Artisan', 'Unemployed', 'Salaried Employee', 'Senior Citizen', 'Other'], required: true }
  ];

  const phase2Questions: Record<string, any[]> = {
    Student: [
      { id: 'education_level', question: 'What is your current level of education?', type: 'select', options: ['Below Class 10', 'Class 10-12', 'Undergraduate', 'Postgraduate'], required: true },
      { id: 'field_of_study', question: 'What is your field of study?', type: 'text', required: true },
      { id: 'grades', question: 'What was your percentage/CGPA in your last major exam?', type: 'text', required: true }
    ],
    Farmer: [
      { id: 'land_ownership', question: 'Do you own the land you cultivate?', type: 'boolean', required: true },
      { id: 'land_size', question: 'What is the size of your land holding?', type: 'text', required: true },
      { id: 'crop_type', question: 'What type of crops or farming do you practice?', type: 'text', required: true }
    ],
    // Add other occupations as needed
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
        setCurrentPhase(2);
      } else {
        onComplete();
      }
    }
  };

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={formData[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
            required={question.required}
          />
        );
      case 'select':
        return (
          <select
            value={formData[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.options.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'boolean':
        return (
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleInputChange(question.id, true)}
              className={`px-6 py-2 rounded-lg transition-all ${
                formData[question.id] === true 
                  ? 'bg-green-500 text-white shadow-lg' 
                  : 'bg-white/80 text-gray-700 border border-green-300 hover:bg-green-50'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleInputChange(question.id, false)}
              className={`px-6 py-2 rounded-lg transition-all ${
                formData[question.id] === false 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'bg-white/80 text-gray-700 border border-red-300 hover:bg-red-50'
              }`}
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
    <div className="w-full max-w-2xl mx-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">📝</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent mb-2">
            Personalize Your Experience
          </h1>
          <p className="text-gray-600">
            Help us provide better legal assistance tailored to your needs
          </p>
          <div className="flex justify-center mt-4">
            <div className={`w-8 h-2 rounded-full mx-1 ${currentPhase >= 1 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-2 rounded-full mx-1 ${currentPhase >= 2 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>
        </div>

        {/* Phase 1 Questions */}
        {currentPhase === 1 && (
          <div className="space-y-6">
            {phase1Questions.map((q) => (
              <div key={q.id} className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {q.question}
                  {q.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderQuestion(q)}
              </div>
            ))}
            
            <button
              onClick={handleSubmitPhase}
              disabled={loading || !formData.occupation}
              className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Continue →'}
            </button>
          </div>
        )}

        {/* Phase 2 Questions */}
        {currentPhase === 2 && formData.occupation && phase2Questions[formData.occupation] && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Tell us more about your {formData.occupation} background
              </h2>
              <p className="text-gray-600">This helps us provide more accurate assistance</p>
            </div>
            
            {phase2Questions[formData.occupation].map((q) => (
              <div key={q.id} className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {q.question}
                  {q.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderQuestion(q)}
              </div>
            ))}
            
            <button
              onClick={handleSubmitPhase}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Completing...' : 'Complete Profile ✓'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
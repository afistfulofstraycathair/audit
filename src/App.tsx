import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronDown,
  Save,
  Download,
  Printer,
  FileText,
  RotateCcw,
} from "lucide-react";
import "./styles/App.css";

// Components
import CompanyInfoSection from "./components/CompanyInfoSection";
import QuestionCard from "./components/QuestionCard";
import PDFExport from "./components/PDFExport";

// Types and Data
import {
  AuditFormData,
  CompanyInfo,
  AuditSection,
  AuditQuestion,
} from "./types/audit";
import { auditSections } from "./data/auditQuestions";

// Utils
import {
  saveFormData,
  loadFormData,
  autoSave,
  calculateCompletionPercentage,
  formatDate,
  clearFormData,
} from "./utils/storage";

const App: React.FC = () => {
  const [formData, setFormData] = useState<AuditFormData>(() => {
    const saved = loadFormData();
    return (
      saved || {
        companyInfo: {
          auditeeName: "",
          auditeeAddress: "",
          auditorName: "",
          auditorAddress: "",
          auditStartDate: "",
          auditEndDate: "",
          auditeeContactName: "",
          auditeeContactFunction: "",
          qualityAuditorNames: "",
        },
        sections: auditSections,
        lastSaved: null,
        completionPercentage: 0,
      }
    );
  });

  const [lastSavedMessage, setLastSavedMessage] = useState<string>("");

  // Auto-save functionality
  useEffect(() => {
    autoSave(formData);
    setLastSavedMessage(`Auto-saved at ${formatDate(new Date())}`);
  }, [formData]);

  // Company info handlers
  const handleCompanyInfoChange = useCallback(
    (field: keyof CompanyInfo, value: string) => {
      setFormData((prev) => ({
        ...prev,
        companyInfo: {
          ...prev.companyInfo,
          [field]: value,
        },
      }));
    },
    []
  );

  // Section handlers
  const toggleSection = useCallback((sectionId: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      ),
    }));
  }, []);

  // Question handlers
  const handleQuestionChange = useCallback(
    (
      sectionId: string,
      questionId: string,
      updates: Partial<AuditQuestion>
    ) => {
      setFormData((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                questions: section.questions.map((question) =>
                  question.id === questionId
                    ? { ...question, ...updates }
                    : question
                ),
              }
            : section
        ),
      }));
    },
    []
  );

  // Action handlers
  const handleManualSave = () => {
    const updatedData = {
      ...formData,
      completionPercentage: calculateCompletionPercentage(formData),
    };
    saveFormData(updatedData);
    setLastSavedMessage(`Manually saved at ${formatDate(new Date())}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all form data? This action cannot be undone."
      )
    ) {
      clearFormData();
      setFormData({
        companyInfo: {
          auditeeName: "",
          auditeeAddress: "",
          auditorName: "",
          auditorAddress: "",
          auditStartDate: "",
          auditEndDate: "",
          auditeeContactName: "",
          auditeeContactFunction: "",
          qualityAuditorNames: "",
        },
        sections: auditSections,
        lastSaved: null,
        completionPercentage: 0,
      });
    }
  };

  const completionPercentage = calculateCompletionPercentage(formData);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1 className="header-title">
          GMP Quality Audit Interactive Checklist
        </h1>
        <p className="header-subtitle">
          Comprehensive pharmaceutical quality audit documentation system
        </p>
      </header>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-text">
          Form Completion: {completionPercentage}%
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        {lastSavedMessage && (
          <div className="auto-save-indicator">{lastSavedMessage}</div>
        )}
      </div>

      {/* Company Information */}
      <CompanyInfoSection
        companyInfo={formData.companyInfo}
        onChange={handleCompanyInfoChange}
      />

      {/* Audit Sections */}
      {formData.sections.map((section) => (
        <div key={section.id} className="section-card">
          <div
            className="section-header"
            onClick={() => toggleSection(section.id)}
          >
            <h2 className="section-title">{section.title}</h2>
            <span
              className={`section-toggle ${
                section.isExpanded ? "expanded" : ""
              }`}
            >
              <ChevronDown size={20} />
            </span>
          </div>

          <div
            className={`section-content ${
              section.isExpanded ? "expanded" : "collapsed"
            }`}
          >
            {section.isExpanded &&
              section.questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onChange={(updates) =>
                    handleQuestionChange(section.id, question.id, updates)
                  }
                />
              ))}
          </div>
        </div>
      ))}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="action-button secondary"
          onClick={handleManualSave}
          title="Manually save progress"
        >
          <Save size={16} />
          Save Progress
        </button>

        <PDFExport
          formData={formData}
          onExport={() =>
            setLastSavedMessage(`PDF exported at ${formatDate(new Date())}`)
          }
        />

        <button
          className="action-button secondary"
          onClick={handlePrint}
          title="Print checklist"
        >
          <Printer size={16} />
          Print
        </button>

        <button className="action-button primary" title="View summary">
          <FileText size={16} />
          Summary
        </button>

        <button
          className="action-button secondary"
          onClick={handleReset}
          title="Reset all data"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
};

export default App;

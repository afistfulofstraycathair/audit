import React from "react";
import { AuditQuestion, ComplianceStatus } from "../types/audit";
import PhotoUpload from "./PhotoUpload";

interface QuestionCardProps {
  question: AuditQuestion;
  onChange: (updates: Partial<AuditQuestion>) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onChange }) => {
  const handleComplianceChange = (compliance: ComplianceStatus) => {
    onChange({ compliance });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ notes: e.target.value });
  };

  const handleObservationCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({ observationCategory: e.target.value });
  };

  const handlePhotosChange = (photos: AuditQuestion["photos"]) => {
    onChange({ photos });
  };

  const complianceOptions: {
    value: ComplianceStatus;
    label: string;
    className: string;
  }[] = [
    { value: "compliant", label: "Compliant", className: "compliant" },
    {
      value: "not-compliant",
      label: "Not Compliant",
      className: "not-compliant",
    },
    {
      value: "not-applicable",
      label: "Not Applicable",
      className: "not-applicable",
    },
  ];

  return (
    <div className="question-card">
      <div className="question-header">
        <div className="question-id">{question.subsectionId.toUpperCase()}</div>
        <div className="question-text">{question.questionText}</div>
      </div>

      <div className="regulatory-reference">
        Regulatory Reference: {question.regulatoryReference}
      </div>

      {/* Compliance Options */}
      <div className="compliance-options">
        {complianceOptions.map((option) => (
          <div
            key={option.value}
            className={`compliance-option ${option.className} ${
              question.compliance === option.value ? "selected" : ""
            }`}
            onClick={() => handleComplianceChange(option.value)}
          >
            <input
              type="radio"
              name={`compliance-${question.id}`}
              value={option.value}
              checked={question.compliance === option.value}
              onChange={() => handleComplianceChange(option.value)}
              className="compliance-radio"
            />
            <label className="compliance-label">{option.label}</label>
          </div>
        ))}
      </div>

      {/* Observation Category */}
      <div className="form-group">
        <label htmlFor={`observation-${question.id}`} className="form-label">
          Observation Category
        </label>
        <input
          type="text"
          id={`observation-${question.id}`}
          className="form-input"
          value={question.observationCategory}
          onChange={handleObservationCategoryChange}
          placeholder="Enter observation category (optional)"
        />
      </div>

      {/* Notes */}
      <div className="form-group">
        <label htmlFor={`notes-${question.id}`} className="form-label">
          Notes
        </label>
        <textarea
          id={`notes-${question.id}`}
          className="form-textarea"
          value={question.notes}
          onChange={handleNotesChange}
          placeholder="Enter any additional notes or observations..."
          rows={4}
        />
      </div>

      {/* Photo Upload */}
      <PhotoUpload
        questionId={question.id}
        photos={question.photos}
        onChange={handlePhotosChange}
      />
    </div>
  );
};

export default QuestionCard;

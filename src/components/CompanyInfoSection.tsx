import React from "react";
import { CompanyInfo } from "../types/audit";

interface CompanyInfoSectionProps {
  companyInfo: CompanyInfo;
  onChange: (field: keyof CompanyInfo, value: string) => void;
}

const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({
  companyInfo,
  onChange,
}) => {
  const handleInputChange =
    (field: keyof CompanyInfo) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(field, e.target.value);
    };

  return (
    <div className="company-info-section">
      <h2 className="company-info-title">Company Information</h2>

      <div className="company-info-grid">
        <div className="form-group">
          <label htmlFor="auditeeName" className="form-label">
            Company (Auditee) Name *
          </label>
          <input
            type="text"
            id="auditeeName"
            className="form-input"
            value={companyInfo.auditeeName}
            onChange={handleInputChange("auditeeName")}
            placeholder="Enter company name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="auditorName" className="form-label">
            Company (Auditor) Name *
          </label>
          <input
            type="text"
            id="auditorName"
            className="form-input"
            value={companyInfo.auditorName}
            onChange={handleInputChange("auditorName")}
            placeholder="Enter auditor company name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="auditeeAddress" className="form-label">
            Company (Auditee) Address
          </label>
          <textarea
            id="auditeeAddress"
            className="form-textarea"
            value={companyInfo.auditeeAddress}
            onChange={handleInputChange("auditeeAddress")}
            placeholder="Enter auditee address"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="auditorAddress" className="form-label">
            Company (Auditor) Address
          </label>
          <textarea
            id="auditorAddress"
            className="form-textarea"
            value={companyInfo.auditorAddress}
            onChange={handleInputChange("auditorAddress")}
            placeholder="Enter auditor address"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="auditStartDate" className="form-label">
            Quality Audit Start Date *
          </label>
          <input
            type="date"
            id="auditStartDate"
            className="form-input"
            value={companyInfo.auditStartDate}
            onChange={handleInputChange("auditStartDate")}
          />
        </div>

        <div className="form-group">
          <label htmlFor="auditEndDate" className="form-label">
            Quality Audit End Date *
          </label>
          <input
            type="date"
            id="auditEndDate"
            className="form-input"
            value={companyInfo.auditEndDate}
            onChange={handleInputChange("auditEndDate")}
          />
        </div>

        <div className="form-group">
          <label htmlFor="auditeeContactName" className="form-label">
            Company (Auditee) Contact Name(s)
          </label>
          <input
            type="text"
            id="auditeeContactName"
            className="form-input"
            value={companyInfo.auditeeContactName}
            onChange={handleInputChange("auditeeContactName")}
            placeholder="Enter contact name(s)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="auditeeContactFunction" className="form-label">
            Contact Function
          </label>
          <input
            type="text"
            id="auditeeContactFunction"
            className="form-input"
            value={companyInfo.auditeeContactFunction}
            onChange={handleInputChange("auditeeContactFunction")}
            placeholder="Enter contact function/role"
          />
        </div>

        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="qualityAuditorNames" className="form-label">
            Quality Auditor Name(s) *
          </label>
          <textarea
            id="qualityAuditorNames"
            className="form-textarea"
            value={companyInfo.qualityAuditorNames}
            onChange={handleInputChange("qualityAuditorNames")}
            placeholder="Enter quality auditor name(s)"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoSection;

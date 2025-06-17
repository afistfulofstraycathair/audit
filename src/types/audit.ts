export type ComplianceStatus =
  | "compliant"
  | "not-compliant"
  | "not-applicable"
  | "";

export interface PhotoUpload {
  id: string;
  file: File | null;
  preview: string | null;
  uploadDate: Date | null;
}

export interface AuditQuestion {
  id: string;
  sectionId: string;
  subsectionId: string;
  questionText: string;
  regulatoryReference: string;
  compliance: ComplianceStatus;
  notes: string;
  observationCategory: string;
  photos: PhotoUpload[];
}

export interface CompanyInfo {
  auditeeName: string;
  auditeeAddress: string;
  auditorName: string;
  auditorAddress: string;
  auditStartDate: string;
  auditEndDate: string;
  auditeeContactName: string;
  auditeeContactFunction: string;
  qualityAuditorNames: string;
}

export interface AuditSection {
  id: string;
  title: string;
  isExpanded: boolean;
  questions: AuditQuestion[];
}

export interface AuditFormData {
  companyInfo: CompanyInfo;
  sections: AuditSection[];
  lastSaved: Date | null;
  completionPercentage: number;
}

export interface ExportOptions {
  includePDFSummary: boolean;
  includePhotos: boolean;
  includeEmptyFields: boolean;
}

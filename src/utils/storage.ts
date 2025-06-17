import { AuditFormData, CompanyInfo } from "../types/audit";

const STORAGE_KEY = "audit-form-data";
const COMPANY_INFO_KEY = "audit-company-info";

export const saveFormData = (data: AuditFormData): void => {
  try {
    const serializedData = JSON.stringify({
      ...data,
      lastSaved: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    console.error("Failed to save form data:", error);
  }
};

export const loadFormData = (): AuditFormData | null => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (!serializedData) return null;

    const data = JSON.parse(serializedData);
    return {
      ...data,
      lastSaved: data.lastSaved ? new Date(data.lastSaved) : null,
    };
  } catch (error) {
    console.error("Failed to load form data:", error);
    return null;
  }
};

export const saveCompanyInfo = (companyInfo: CompanyInfo): void => {
  try {
    localStorage.setItem(COMPANY_INFO_KEY, JSON.stringify(companyInfo));
  } catch (error) {
    console.error("Failed to save company info:", error);
  }
};

export const loadCompanyInfo = (): CompanyInfo | null => {
  try {
    const serializedData = localStorage.getItem(COMPANY_INFO_KEY);
    return serializedData ? JSON.parse(serializedData) : null;
  } catch (error) {
    console.error("Failed to load company info:", error);
    return null;
  }
};

export const clearFormData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(COMPANY_INFO_KEY);
  } catch (error) {
    console.error("Failed to clear form data:", error);
  }
};

export const calculateCompletionPercentage = (data: AuditFormData): number => {
  const totalFields = data.sections.reduce((total, section) => {
    return total + section.questions.length;
  }, 0);

  const completedFields = data.sections.reduce((completed, section) => {
    return (
      completed + section.questions.filter((q) => q.compliance !== "").length
    );
  }, 0);

  // Add company info fields to calculation
  const companyInfoFields = (
    Object.keys(data.companyInfo) as Array<keyof CompanyInfo>
  ).filter((key) => {
    const value = data.companyInfo[key];
    return value && value.toString().trim() !== "";
  }).length;

  const totalCompanyInfoFields = Object.keys(data.companyInfo).length;

  const totalAllFields = totalFields + totalCompanyInfoFields;
  const completedAllFields = completedFields + companyInfoFields;

  return Math.round((completedAllFields / totalAllFields) * 100);
};

// Debounced auto-save function
let saveTimeout: ReturnType<typeof setTimeout>;

export const autoSave = (data: AuditFormData): void => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    const updatedData = {
      ...data,
      completionPercentage: calculateCompletionPercentage(data),
    };
    saveFormData(updatedData);
  }, 1000); // Save after 1 second of inactivity
};

export const formatDate = (date: Date | null): string => {
  if (!date) return "";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

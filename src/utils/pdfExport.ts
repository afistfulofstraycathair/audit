import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { AuditFormData, CompanyInfo, AuditQuestion } from "../types/audit";

interface PDFExportOptions {
  includePhotos?: boolean;
  includeEmptyFields?: boolean;
  companyLogo?: string;
  pageOrientation?: "portrait" | "landscape";
  pageSize?: "a4" | "letter";
}

export class PDFExporter {
  private pdf: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;
  private currentY: number = 20;
  private lineHeight: number = 8;

  constructor(options: PDFExportOptions = {}) {
    this.pdf = new jsPDF({
      orientation: options.pageOrientation || "portrait",
      unit: "mm",
      format: options.pageSize || "a4",
    });

    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
  }

  async exportAuditReport(
    formData: AuditFormData,
    options: PDFExportOptions = {}
  ): Promise<void> {
    try {
      // Reset position
      this.currentY = this.margin;

      // Add header
      this.addHeader(formData.companyInfo, options.companyLogo);

      // Add company information
      this.addCompanyInfo(formData.companyInfo);

      // Add audit sections
      this.addAuditSections(formData, options);

      // Add summary
      this.addSummary(formData);

      // Add footer to all pages
      this.addFooters();

      // Save the PDF
      const fileName = this.generateFileName(formData.companyInfo);
      this.pdf.save(fileName);
    } catch (error) {
      console.error("PDF export failed:", error);
      throw new Error("Failed to generate PDF report");
    }
  }

  private addHeader(companyInfo: CompanyInfo, logo?: string): void {
    // Title
    this.pdf.setFontSize(20);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(
      "GMP Quality Audit Report",
      this.pageWidth / 2,
      this.currentY,
      { align: "center" }
    );
    this.currentY += 15;

    // Audit date and info
    this.pdf.setFontSize(12);
    this.pdf.setFont("helvetica", "normal");
    const auditDate =
      companyInfo.auditStartDate || new Date().toISOString().split("T")[0];
    this.pdf.text(
      `Audit Date: ${auditDate}`,
      this.pageWidth / 2,
      this.currentY,
      { align: "center" }
    );
    this.currentY += 10;

    // Company name
    if (companyInfo.auditeeName) {
      this.pdf.setFontSize(14);
      this.pdf.setFont("helvetica", "bold");
      this.pdf.text(
        `Company: ${companyInfo.auditeeName}`,
        this.pageWidth / 2,
        this.currentY,
        { align: "center" }
      );
      this.currentY += 15;
    }

    this.addLine();
  }

  private addCompanyInfo(companyInfo: CompanyInfo): void {
    this.pdf.setFontSize(14);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text("Company Information", this.margin, this.currentY);
    this.currentY += 10;

    this.pdf.setFontSize(10);
    this.pdf.setFont("helvetica", "normal");

    const infoItems = [
      ["Auditee Name:", companyInfo.auditeeName],
      ["Auditee Address:", companyInfo.auditeeAddress],
      ["Contact Name:", companyInfo.auditeeContactName],
      ["Auditor Name:", companyInfo.auditorName],
      ["Auditor Address:", companyInfo.auditorAddress],
      ["Quality Auditor:", companyInfo.qualityAuditorNames],
      ["Audit Start Date:", companyInfo.auditStartDate],
      ["Audit End Date:", companyInfo.auditEndDate],
    ];

    infoItems.forEach(([label, value]) => {
      if (value) {
        this.checkPageBreak();
        this.pdf.setFont("helvetica", "bold");
        this.pdf.text(label, this.margin, this.currentY);
        this.pdf.setFont("helvetica", "normal");

        // Handle long text with wrapping
        const text = this.wrapText(value, this.pageWidth - 60);
        this.pdf.text(text, this.margin + 40, this.currentY);
        this.currentY += text.length * this.lineHeight;
      }
    });

    this.currentY += 10;
    this.addLine();
  }

  private addAuditSections(
    formData: AuditFormData,
    options: PDFExportOptions
  ): void {
    formData.sections.forEach((section) => {
      this.addSectionHeader(section.title);

      section.questions.forEach((questionData) => {
        if (
          !options.includeEmptyFields &&
          !questionData.compliance &&
          !questionData.notes
        ) {
          return; // Skip empty questions if option is set
        }

        this.addQuestion(questionData.id, questionData, options.includePhotos);
      });
    });
  }

  private addSectionHeader(title: string): void {
    this.checkPageBreak(20);

    this.pdf.setFontSize(16);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.setFillColor(240, 240, 240);
    this.pdf.rect(
      this.margin,
      this.currentY - 5,
      this.pageWidth - 2 * this.margin,
      12,
      "F"
    );
    this.pdf.text(title, this.margin + 5, this.currentY + 3);
    this.currentY += 15;
  }

  private addQuestion(
    questionId: string,
    questionData: any,
    includePhotos: boolean = true
  ): void {
    this.checkPageBreak(30);

    // Question header
    this.pdf.setFontSize(12);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(`${questionId.toUpperCase()}:`, this.margin, this.currentY);
    this.currentY += 8;

    // Question text (you'll need to add the actual question text to your data structure)
    this.pdf.setFontSize(10);
    this.pdf.setFont("helvetica", "normal");

    // Compliance status
    if (questionData.compliance) {
      this.pdf.setFont("helvetica", "bold");
      const statusText = `Status: ${questionData.compliance}`;
      this.pdf.text(statusText, this.margin + 5, this.currentY);

      // Color coding
      if (questionData.compliance === "Compliant") {
        this.pdf.setTextColor(0, 150, 0);
      } else if (questionData.compliance === "Not Compliant") {
        this.pdf.setTextColor(200, 0, 0);
      } else {
        this.pdf.setTextColor(150, 150, 0);
      }

      this.pdf.text("●", this.margin + 45, this.currentY);
      this.pdf.setTextColor(0, 0, 0); // Reset color
      this.currentY += 8;
    }

    // Observation category
    if (questionData.observationCategory) {
      this.pdf.setFont("helvetica", "normal");
      this.pdf.text(
        `Category: ${questionData.observationCategory}`,
        this.margin + 5,
        this.currentY
      );
      this.currentY += 8;
    }

    // Notes
    if (questionData.notes) {
      this.pdf.setFont("helvetica", "bold");
      this.pdf.text("Notes:", this.margin + 5, this.currentY);
      this.currentY += 6;

      this.pdf.setFont("helvetica", "normal");
      const wrappedNotes = this.wrapText(
        questionData.notes,
        this.pageWidth - 40
      );
      wrappedNotes.forEach((line) => {
        this.checkPageBreak();
        this.pdf.text(line, this.margin + 10, this.currentY);
        this.currentY += this.lineHeight;
      });
    }

    // Photos
    if (
      includePhotos &&
      questionData.photos &&
      questionData.photos.length > 0
    ) {
      this.currentY += 5;
      this.pdf.setFont("helvetica", "bold");
      this.pdf.text(
        `Photos (${questionData.photos.length}):`,
        this.margin + 5,
        this.currentY
      );
      this.currentY += 8;

      // Add photo placeholders (actual photo embedding would require base64 conversion)
      questionData.photos.forEach((photo: any, index: number) => {
        this.checkPageBreak();
        this.pdf.setFont("helvetica", "normal");
        this.pdf.text(
          `• Photo ${index + 1}: ${photo.file?.name || "Image"}`,
          this.margin + 10,
          this.currentY
        );
        this.currentY += 6;
      });
    }

    this.currentY += 5;

    // Add light separator line
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(
      this.margin,
      this.currentY,
      this.pageWidth - this.margin,
      this.currentY
    );
    this.pdf.setDrawColor(0, 0, 0); // Reset color
    this.currentY += 8;
  }

  private addSummary(formData: AuditFormData): void {
    this.checkPageBreak(50);

    this.pdf.setFontSize(16);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text("Audit Summary", this.margin, this.currentY);
    this.currentY += 15;

    // Calculate compliance statistics
    const stats = this.calculateComplianceStats(formData);

    this.pdf.setFontSize(12);
    this.pdf.setFont("helvetica", "normal");

    const summaryItems = [
      ["Total Questions:", stats.total.toString()],
      ["Compliant:", `${stats.compliant} (${stats.compliantPercentage}%)`],
      [
        "Not Compliant:",
        `${stats.notCompliant} (${stats.notCompliantPercentage}%)`,
      ],
      [
        "Not Applicable:",
        `${stats.notApplicable} (${stats.notApplicablePercentage}%)`,
      ],
      ["Unanswered:", `${stats.unanswered} (${stats.unansweredPercentage}%)`],
    ];

    summaryItems.forEach(([label, value]) => {
      this.checkPageBreak();
      this.pdf.setFont("helvetica", "bold");
      this.pdf.text(label, this.margin, this.currentY);
      this.pdf.setFont("helvetica", "normal");
      this.pdf.text(value, this.margin + 40, this.currentY);
      this.currentY += 8;
    });

    // Overall compliance
    this.currentY += 5;
    this.pdf.setFontSize(14);
    this.pdf.setFont("helvetica", "bold");
    const overallStatus =
      stats.compliantPercentage >= 80
        ? "SATISFACTORY"
        : stats.compliantPercentage >= 60
        ? "NEEDS IMPROVEMENT"
        : "UNSATISFACTORY";

    this.pdf.setTextColor(
      overallStatus === "SATISFACTORY"
        ? 0
        : overallStatus === "NEEDS IMPROVEMENT"
        ? 150
        : 200,
      overallStatus === "SATISFACTORY" ? 150 : 0,
      0
    );
    this.pdf.text(
      `Overall Assessment: ${overallStatus}`,
      this.margin,
      this.currentY
    );
    this.pdf.setTextColor(0, 0, 0); // Reset color
  }

  private calculateComplianceStats(formData: AuditFormData) {
    const allQuestions = formData.sections.flatMap(
      (section) => section.questions
    );

    const total = allQuestions.length;
    const compliant = allQuestions.filter(
      (q) => q.compliance === "compliant"
    ).length;
    const notCompliant = allQuestions.filter(
      (q) => q.compliance === "not-compliant"
    ).length;
    const notApplicable = allQuestions.filter(
      (q) => q.compliance === "not-applicable"
    ).length;
    const unanswered = total - compliant - notCompliant - notApplicable;

    return {
      total,
      compliant,
      notCompliant,
      notApplicable,
      unanswered,
      compliantPercentage: Math.round((compliant / total) * 100),
      notCompliantPercentage: Math.round((notCompliant / total) * 100),
      notApplicablePercentage: Math.round((notApplicable / total) * 100),
      unansweredPercentage: Math.round((unanswered / total) * 100),
    };
  }

  private addFooters(): void {
    const pageCount = this.pdf.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);

      // Footer line
      this.pdf.setDrawColor(150, 150, 150);
      this.pdf.line(
        this.margin,
        this.pageHeight - 15,
        this.pageWidth - this.margin,
        this.pageHeight - 15
      );

      // Page number
      this.pdf.setFontSize(8);
      this.pdf.setFont("helvetica", "normal");
      this.pdf.text(
        `Page ${i} of ${pageCount}`,
        this.pageWidth / 2,
        this.pageHeight - 8,
        { align: "center" }
      );

      // Generated timestamp
      this.pdf.text(
        `Generated: ${new Date().toLocaleString()}`,
        this.pageWidth - this.margin,
        this.pageHeight - 8,
        { align: "right" }
      );
    }
  }

  private checkPageBreak(requiredSpace: number = 20): void {
    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }
  }

  private addLine(): void {
    this.pdf.setDrawColor(100, 100, 100);
    this.pdf.line(
      this.margin,
      this.currentY,
      this.pageWidth - this.margin,
      this.currentY
    );
    this.pdf.setDrawColor(0, 0, 0); // Reset color
    this.currentY += 8;
  }

  private wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine + (currentLine ? " " : "") + word;
      const textWidth = this.pdf.getTextWidth(testLine);

      if (textWidth < maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  private generateFileName(companyInfo: CompanyInfo): string {
    const date = new Date().toISOString().split("T")[0];
    const companyName = companyInfo.auditeeName || "Company";
    const safeName = companyName.replace(/[^a-zA-Z0-9]/g, "_");
    return `GMP_Audit_${safeName}_${date}.pdf`;
  }
}

// Enhanced PDF export with HTML capture
export class AdvancedPDFExporter {
  static async exportFromHTML(
    elementId: string,
    fileName?: string,
    options: PDFExportOptions = {}
  ): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID '${elementId}' not found`);
      }

      // Capture the HTML element as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        removeContainer: true,
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: options.pageOrientation || "portrait",
        unit: "mm",
        format: options.pageSize || "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdf.internal.pageSize.getWidth() - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

      // Save
      const pdfFileName =
        fileName ||
        `audit_export_${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(pdfFileName);
    } catch (error) {
      console.error("HTML to PDF export failed:", error);
      throw new Error("Failed to export HTML to PDF");
    }
  }
}

// Utility functions
export const showPDFPreview = async (
  formData: AuditFormData,
  options: PDFExportOptions = {}
): Promise<string> => {
  const exporter = new PDFExporter(options);
  // This would return a blob URL for preview
  // Implementation depends on your preview requirements
  return "preview-url";
};

export const validateExportData = (
  formData: AuditFormData
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!formData.companyInfo.auditeeName) {
    errors.push("Company name is required for export");
  }

  if (!formData.companyInfo.auditStartDate) {
    errors.push("Audit start date is required for export");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default PDFExporter;

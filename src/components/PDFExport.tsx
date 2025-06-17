import React from "react";
import { Download, FileText } from "lucide-react";

interface PDFExportProps {
  formData: any;
  onExport: () => void;
}

const PDFExport: React.FC<PDFExportProps> = ({ formData, onExport }) => {
  const handleSimpleExport = () => {
    // Create a new window with print-friendly content
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = generatePrintContent(formData);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GMP Audit Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 30px; page-break-inside: avoid; }
            .section-title { background: #f0f0f0; padding: 10px; font-weight: bold; font-size: 16px; }
            .question { margin: 15px 0; padding: 10px; border-left: 3px solid #ddd; }
            .compliant { border-left-color: #22c55e; }
            .not-compliant { border-left-color: #ef4444; }
            .not-applicable { border-left-color: #f59e0b; }
            .status { font-weight: bold; margin-bottom: 5px; }
            .notes { margin-top: 10px; font-style: italic; }
            .company-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .info-item { margin-bottom: 10px; }
            .label { font-weight: bold; }
            @media print { 
              body { margin: 0; } 
              .no-print { display: none; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    onExport();
  };

  const generatePrintContent = (data: any) => {
    const companyInfo = data.companyInfo || {};
    const sections = data.sections || [];

    let content = `
      <div class="header">
        <h1>GMP Quality Audit Report</h1>
        <p>Generated: ${new Date().toLocaleDateString()}</p>
        ${
          companyInfo.auditeeName
            ? `<p><strong>Company:</strong> ${companyInfo.auditeeName}</p>`
            : ""
        }
      </div>

      <div class="company-info">
        <div>
          ${
            companyInfo.auditeeName
              ? `<div class="info-item"><span class="label">Auditee:</span> ${companyInfo.auditeeName}</div>`
              : ""
          }
          ${
            companyInfo.auditeeAddress
              ? `<div class="info-item"><span class="label">Address:</span> ${companyInfo.auditeeAddress}</div>`
              : ""
          }
          ${
            companyInfo.auditeeContactName
              ? `<div class="info-item"><span class="label">Contact:</span> ${companyInfo.auditeeContactName}</div>`
              : ""
          }
          ${
            companyInfo.auditStartDate
              ? `<div class="info-item"><span class="label">Start Date:</span> ${companyInfo.auditStartDate}</div>`
              : ""
          }
        </div>
        <div>
          ${
            companyInfo.auditorName
              ? `<div class="info-item"><span class="label">Auditor:</span> ${companyInfo.auditorName}</div>`
              : ""
          }
          ${
            companyInfo.auditorAddress
              ? `<div class="info-item"><span class="label">Auditor Address:</span> ${companyInfo.auditorAddress}</div>`
              : ""
          }
          ${
            companyInfo.qualityAuditorNames
              ? `<div class="info-item"><span class="label">Quality Auditor:</span> ${companyInfo.qualityAuditorNames}</div>`
              : ""
          }
          ${
            companyInfo.auditEndDate
              ? `<div class="info-item"><span class="label">End Date:</span> ${companyInfo.auditEndDate}</div>`
              : ""
          }
        </div>
      </div>
    `;

    sections.forEach((section: any) => {
      content += `
        <div class="section">
          <div class="section-title">${section.title}</div>
      `;

      section.questions.forEach((question: any) => {
        if (question.compliance || question.notes) {
          const statusClass =
            question.compliance === "compliant"
              ? "compliant"
              : question.compliance === "not-compliant"
              ? "not-compliant"
              : question.compliance === "not-applicable"
              ? "not-applicable"
              : "";

          content += `
            <div class="question ${statusClass}">
              <div><strong>${question.id.toUpperCase()}:</strong> ${
            question.questionText || ""
          }</div>
              ${
                question.compliance
                  ? `<div class="status">Status: ${question.compliance
                      .replace("-", " ")
                      .toUpperCase()}</div>`
                  : ""
              }
              ${
                question.observationCategory
                  ? `<div>Category: ${question.observationCategory}</div>`
                  : ""
              }
              ${
                question.notes
                  ? `<div class="notes">Notes: ${question.notes}</div>`
                  : ""
              }
              ${
                question.photos && question.photos.length > 0
                  ? `<div>Photos: ${question.photos.length} attached</div>`
                  : ""
              }
            </div>
          `;
        }
      });

      content += "</div>";
    });

    // Add summary
    const stats = calculateStats(sections);
    content += `
      <div class="section">
        <div class="section-title">Audit Summary</div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
          <div>
            <div class="info-item">Total Questions: ${stats.total}</div>
            <div class="info-item">Compliant: ${stats.compliant} (${Math.round(
      (stats.compliant / stats.total) * 100
    )}%)</div>
          </div>
          <div>
            <div class="info-item">Not Compliant: ${stats.notCompliant}</div>
            <div class="info-item">Not Applicable: ${stats.notApplicable}</div>
          </div>
        </div>
        <div style="margin-top: 20px; font-size: 18px; font-weight: bold;">
          Overall Status: ${
            stats.compliant / stats.total >= 0.8
              ? "SATISFACTORY"
              : stats.compliant / stats.total >= 0.6
              ? "NEEDS IMPROVEMENT"
              : "UNSATISFACTORY"
          }
        </div>
      </div>
    `;

    return content;
  };

  const calculateStats = (sections: any[]) => {
    const allQuestions = sections.flatMap((s) => s.questions);
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

    return { total, compliant, notCompliant, notApplicable };
  };

  return (
    <button
      onClick={handleSimpleExport}
      className="action-button"
      title="Export as PDF"
    >
      <FileText size={20} />
      Export PDF
    </button>
  );
};

export default PDFExport;

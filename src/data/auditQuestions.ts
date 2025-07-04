import { AuditSection } from "../types/audit";

export const auditSections: AuditSection[] = [
  {
    id: "section-1",
    title: "Section 1: Organization and Personnel",
    isExpanded: false,
    questions: [
      {
        id: "1a",
        sectionId: "section-1",
        subsectionId: "1a",
        questionText:
          "Does a Quality Assurance unit (department) exist as a separate organizational entity?",
        regulatoryReference: "CFR 211.22(a)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "1b",
        sectionId: "section-1",
        subsectionId: "1b",
        questionText:
          "Does the Quality Assurance unit alone have both the authority and responsibility to approve or reject all components, drug product containers and closures, in-process materials, packaging materials, labeling and drug products?",
        regulatoryReference: "CFR 211.22(a)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "1c",
        sectionId: "section-1",
        subsectionId: "1c",
        questionText:
          "Does the QA unit review and approve or reject all production records (including contracted manufacturing by another company)?",
        regulatoryReference: "CFR 211.22(a)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "1d",
        sectionId: "section-1",
        subsectionId: "1d",
        questionText:
          "Are Manufacturing and QA personnel adequately trained in both their function and in cGMP on a continuing basis? Does each employee receive retraining in an SOP (procedures) if critical changes have been made in the procedure? Is this training documented?",
        regulatoryReference: "CFR 211.25(a)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "1e",
        sectionId: "section-1",
        subsectionId: "1e",
        questionText:
          "Are employees trained on proper gowning and aseptic technique?",
        regulatoryReference: "CFR 211.28(a)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "1f",
        sectionId: "section-1",
        subsectionId: "1f",
        questionText:
          "Are manufacturing personnel shown to have an apparent illness or open lesions excluded from contact with drug product until corrected? Are employees instructed to report to supervisory personnel any applicable health conditions?",
        regulatoryReference: "CFR 211.28(d)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
    ],
  },
  {
    id: "section-2",
    title: "Section 2: Facilities",
    isExpanded: false,
    questions: [
      {
        id: "2a",
        sectionId: "section-2",
        subsectionId: "2a",
        questionText:
          "Does the manufacturing facility have adequate space to maintain the orderly placement and flow of equipment and materials to prevent mixups and cross-contamination?",
        regulatoryReference: "CFR 211.42(b)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "2b",
        sectionId: "section-2",
        subsectionId: "2b",
        questionText:
          "Is the manufacturing facility of suitable size and construction to facilitate cleaning, maintenance, and proper operations?",
        regulatoryReference: "CFR 211.42(a)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "2c",
        sectionId: "section-2",
        subsectionId: "2c",
        questionText:
          "Does the facility have an adequate pest control system for both insects and rodents? Is there a SOP for pest control? Is trash held and disposed of in a timely and sanitary manner?",
        regulatoryReference: "CFR 211.56(a)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "2d",
        sectionId: "section-2",
        subsectionId: "2d",
        questionText:
          "Are adequate washing facilities provided, including hot and cold water, soap or detergent, air dryers or single-service towels, and clean toilet facilities?",
        regulatoryReference: "CFR 211.58",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "2e",
        sectionId: "section-2",
        subsectionId: "2e",
        questionText:
          "Are separate or defined areas or such other control systems provided for the firm's operations as are necessary to prevent contamination or mixups?",
        regulatoryReference: "CFR 211.42(c)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "2f",
        sectionId: "section-2",
        subsectionId: "2f",
        questionText:
          "Are lighting, ventilation, air filtration, air heating and cooling adequate and do they provide suitable environmental conditions for drug manufacturing and control?",
        regulatoryReference: "CFR 211.46",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
    ],
  },
  {
    id: "section-3",
    title: "Section 3: Buildings and Facilities",
    isExpanded: false,
    questions: [
      {
        id: "3a",
        sectionId: "section-3",
        subsectionId: "3a",
        questionText:
          "Is there an adequate water system to provide water for pharmaceutical use? Does the water meet USP standards for purified water? Is the system validated and monitored?",
        regulatoryReference: "CFR 211.65",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "3b",
        sectionId: "section-3",
        subsectionId: "3b",
        questionText:
          "Are buildings maintained in a clean and orderly manner and free of infestation by rodents, birds, insects, and other vermin?",
        regulatoryReference: "CFR 211.56(a)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "3c",
        sectionId: "section-3",
        subsectionId: "3c",
        questionText:
          "Is there adequate segregation between different manufacturing operations to prevent contamination or mix-ups?",
        regulatoryReference: "CFR 211.42(c)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "3d",
        sectionId: "section-3",
        subsectionId: "3d",
        questionText:
          "Are manufacturing areas designed to facilitate cleaning and maintenance?",
        regulatoryReference: "CFR 211.42(a)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "3e",
        sectionId: "section-3",
        subsectionId: "3e",
        questionText:
          "Are appropriate environmental monitoring and control systems in place for critical manufacturing areas?",
        regulatoryReference: "CFR 211.46",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "3f",
        sectionId: "section-3",
        subsectionId: "3f",
        questionText:
          "Are there adequate procedures for cleaning and sanitizing manufacturing facilities and equipment?",
        regulatoryReference: "CFR 211.67",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
    ],
  },
  {
    id: "section-4",
    title: "Section 4: Equipment",
    isExpanded: false,
    questions: [
      {
        id: "4a",
        sectionId: "section-4",
        subsectionId: "4a",
        questionText:
          "Is equipment of appropriate design and adequate size, and suitably located to facilitate operations for its intended use?",
        regulatoryReference: "CFR 211.63",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "4b",
        sectionId: "section-4",
        subsectionId: "4b",
        questionText:
          "Are equipment surfaces that contact components, in-process materials, or drug products not reactive, additive, or absorptive?",
        regulatoryReference: "CFR 211.65(a)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "4c",
        sectionId: "section-4",
        subsectionId: "4c",
        questionText:
          "Is there a written program of preventive maintenance for equipment?",
        regulatoryReference: "CFR 211.67(b)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "4d",
        sectionId: "section-4",
        subsectionId: "4d",
        questionText:
          "Are all automatic, mechanical, or electronic equipment used in manufacture routinely calibrated, inspected, or checked according to an appropriate SOP? Are there records of all calibration and maintenance checks?",
        regulatoryReference: "CFR 211.68(a)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "4e",
        sectionId: "section-4",
        subsectionId: "4e",
        questionText:
          "What type of product sterilizing filters are used? How are these filters sterilized? Is the sterilization process validated?",
        regulatoryReference: "CFR 211.113(b)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "4f",
        sectionId: "section-4",
        subsectionId: "4f",
        questionText:
          "During manufacture, are all compounding equipment and processing lines properly identified as to product content and stage of processing? Is major equipment identified by a distinctive ID No. or Name in the batch record?",
        regulatoryReference: "CFR 211.105",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
    ],
  },
  {
    id: "section-5",
    title: "Section 5: Control of Components and Drug Product Containers",
    isExpanded: false,
    questions: [
      {
        id: "5a",
        sectionId: "section-5",
        subsectionId: "5a",
        questionText:
          "Are components and drug product containers and closures received, identified, stored, sampled, tested, and approved or rejected?",
        regulatoryReference: "CFR 211.80(a)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "5b",
        sectionId: "section-5",
        subsectionId: "5b",
        questionText:
          "Are components stored and handled in a manner to prevent contamination?",
        regulatoryReference: "CFR 211.80(b)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "5c",
        sectionId: "section-5",
        subsectionId: "5c",
        questionText:
          "Are drug product containers and closures not reactive, additive, or absorptive so as to alter the safety, identity, strength, quality, or purity of the drug?",
        regulatoryReference: "CFR 211.94(a)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "5d",
        sectionId: "section-5",
        subsectionId: "5d",
        questionText:
          "Are container closure systems suitable for their intended use and provide adequate protection against foreseeable external factors?",
        regulatoryReference: "CFR 211.94(b)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "5e",
        sectionId: "section-5",
        subsectionId: "5e",
        questionText:
          "Are standards or specifications established for each component and drug product container and closure used in production?",
        regulatoryReference: "CFR 211.84(a)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
      {
        id: "5f",
        sectionId: "section-5",
        subsectionId: "5f",
        questionText:
          "Is there a system for storage and identification of each lot of components and drug product containers and closures?",
        regulatoryReference: "CFR 211.80(c)",
        compliance: "",
        notes: "",
        observationCategory: "",
        photos: [],
      },
    ],
  },
];

var CV = window.CV || {};

CV.data = {
  profile: {
    name: "Mateusz Golebiewski",
    location: "United Kingdom",
    linkedin: "in/mateuszgoleb",
    email: "mateuszgolebiewski@icloud.com",
    summary:
      "Experienced Senior Platform Engineer with a strong background in developing bespoke solutions, " +
      "managing cloud infrastructure, and implementing CI/CD pipelines. Proven ability to design and " +
      "deploy secure and scalable solutions using technologies like Terraform, Azure, Kubernetes, and " +
      "Python. Adept at collaborating with engineering teams and mentoring operations teams through " +
      "cloud transitions.",
  },

  experience: [
    {
      slug: "capgemini",
      role: "Senior Platform Engineer",
      company: "Capgemini UK",
      start: "July 2025",
      end: "Present",
      bullets: [
        "Developed an AI-powered search tool that utilised Retrieval-Augmented Generation to provide responses to HMRC's tax-related questions.",
        "Developed APIM policies enforcing authentication to safely expose LLM services to internal and external consumers.",
        "Supported the adoption of stronger engineering practices across the team, fostering better collaboration, quality and maintainability.",
        "Provided targeted mentorship to junior engineers, improving their technical output and streamlining the onboarding experience.",
        "Reviewed High-Level and Low-Level Design documents and Statements of Work to ensure architectural consistency and adherence to best practices across multiple projects.",
        "Aggregated data to build monitoring dashboards in Grafana to improve system visibility, root-cause analysis, and operational reliability.",
        "Developed and presented internal bootcamps on Kubernetes and Azure services to the engineering practice, upskilling engineers on cloud-native technologies.",
      ],
    },
    {
      slug: "bjss-aviation",
      role: "Senior Platform Engineer",
      company: "BJSS (Aviation Industry)",
      start: "September 2024",
      end: "July 2025",
      bullets: [
        "Developed bespoke subscription vending solution using Terraform, Azure Container Apps, Python, and Service Bus integrated with ServiceNow.",
        "Built a custom PIM access management application leveraging Python, Graph API, Azure Container Apps, and Service Bus orchestrated via ServiceNow.",
        "Produced High-Level and Low-Level Design documents (HLD/LLD) to effectively communicate architecture to internal teams and clients.",
        "Deployed Azure Baseline Metric Alerts aligned with the Azure Landing Zone (ALZ) pattern, using a secure webhook for ServiceNow integration.",
        "Created reusable GitHub Actions CI/CD pipelines for container builds, Terraform deployments, and Python app deployments, including linting and security scanning with Trivy, flake8, and black.",
      ],
    },
    {
      slug: "bjss-financial",
      role: "Senior Platform Engineer",
      company: "BJSS (Financial Services)",
      start: "April 2023",
      end: "August 2024",
      bullets: [
        "Designed and implemented secure Databricks workspaces with a strong focus on robust configuration and secure networking for the client's internal data engineering team.",
        "Designed and deployed the client's Azure landing zone, collaborating with third-party vendors and developing migration strategies for ExpressRoute circuits and VPNs to ensure secure, reliable hybrid cloud connectivity.",
        "Automated virtual machine deployment using Bicep and Desired State Configuration (DSC) for seamless onboarding to Entra, Configuration Manager, Operations Manager, and Qualys.",
        "Automated golden image creation for Windows and Linux servers and self-hosted runners, using Packer to build CIS Level 1 compliant images.",
        "Provided mentorship and guided the Infrastructure Operations team through the transition to a cloud-based environment, ensuring successful adoption of new technologies and practices.",
      ],
    },
    {
      slug: "bjss-transport",
      role: "Platform Engineer",
      company: "BJSS (Government Transport)",
      start: "October 2022",
      end: "April 2023",
      bullets: [
        "Implemented ELT pipelines in Azure Data Factory to ingest and transform data from multiple sources for reporting and analytics.",
        "Authored Infrastructure-as-Code (IaC) using ARM Templates to define and deploy Azure Data Factory, Databricks, Storage Accounts, and other data platform components.",
        "Developed integration scripts in Python, PowerShell, and Bash to interact with various APIs.",
        "Migrated 6TB of historical data from on-premises data centre using Azure Data Box and established ongoing ingestion processes for delta files to SQL Datawarehouse.",
      ],
    },
    {
      slug: "corelogic",
      role: "DevOps Engineer",
      company: "CoreLogic UK",
      start: "March 2020",
      end: "August 2022",
      bullets: [
        "Defined branching strategies and managed permissions to streamline access and collaboration across multiple engineering projects.",
        "Orchestrated and maintained Kubernetes cluster deployments across various environments for frontend and back-end services, auto-scaling, CI/CD for images to Docker Hub.",
        "Collaborated with engineering teams to integrate operational best practices, focusing on scalability, maintainability, and deployment strategies.",
        "Implemented monitoring solutions by integrating Azure Monitor with New Relic, enhancing observability and reducing alert fatigue.",
        "Contributed to the design of an Azure Landing Zone following Microsoft's Well-Architected Framework principles.",
      ],
    },
  ],

  education: [
    {
      degree: "B.Sc. Computer Science",
      institution: "Coventry University",
      date: "September 2016",
    },
  ],

  certifications: [
    "SC-300 - Identity and Access Administrator Associate",
    "AZ-104 - Azure Administrator Associate",
    "AZ-305 - Azure Solutions Architect Expert",
    "AZ-500 - Azure Security Engineer Associate",
    "AZ-400 - DevOps Engineer Expert",
    "AZ-700 - Azure Network Engineer Associate",
    "Hashicorp - Terraform Associate",
    "Certified Kubernetes Administrator (CKA)",
    "Certified Kubernetes Application Developer (CKAD)",
    "Certified Kubernetes Security Specialist (CKS)",
  ],

  skills: {
    "Programming Languages": ["Python", "Golang"],
    "Scripting Languages": ["PowerShell", "Bash"],
    "Infrastructure-as-Code": ["Terraform", "Bicep"],
    "CI/CD Tools": ["Azure DevOps", "GitHub Actions", "GitLab"],
    Cloud: ["Azure", "AWS"],
  },

  meta: {
    resumePdfPath: "assets/cv.pdf",
  },
};

window.CV = CV;

export const beneficiaryForm = {
  formName: "Beneficiary Support Request Form",
  pride_bhutan: {
    sections: [
      {
        section_number: 1,
        title: "Personal Information",
        questions: [
          { question_number: "1", question: "Full Name", type: "text", placeholder: "Enter your full name", required: true, editable: true },
          { question_number: "2", question: "Gender", type: "select", options: ["Male", "Female", "Other"], placeholder: "Select your gender", required: true, editable: true },
          { question_number: "3", question: "Date of Birth", type: "date", placeholder: "Select your date of birth", required: true, editable: true },
          { question_number: "4", question: "Age", type: "number", placeholder: "Enter your age", required: true, editable: true },
          { question_number: "5", question: "CID Number", type: "number", placeholder: "Enter your 11-digit CID number", required: true, editable: true },
          { question_number: "6", question: "Occupation", type: "text", placeholder: "Enter your current occupation", required: true, editable: true },
          { question_number: "7", question: "Marital Status", type: "text", placeholder: "Enter your marital status", required: true, editable: true },
          { question_number: "8", question: "Educational Qualification", type: "text", placeholder: "Enter your highest qualification", required: true, editable: true },
          { question_number: "9", question: "Contact Number", type: "number", placeholder: "Enter your phone number", required: true, editable: true },
          { question_number: "10", question: "Email Address", type: "email", placeholder: "Enter your email address (e.g., you@example.com)", required: true, editable: true },
          { question_number: "11", question: "Present Address(Village, Gewog, Dzongkhag)", type: "text", placeholder: "Enter your current address", required: true, editable: true },
          { question_number: "12", question: "Permanent Address(Village, Gewog, Dzongkhag)", type: "text", placeholder: "Enter your permanent address", required: true, editable: true }
        ]
      },
      {
        section_number: 2,
        title: "Demographic and Socioeconomic Information",
        questions: [
          { question_number: "13", question: "Household Size (number of family members)", type: "number", placeholder: "Enter total number of family members", required: true, editable: true },
          { question_number: "14", question: "Number of Dependents", type: "number", placeholder: "Enter number of dependents", required: true, editable: true },
          { question_number: "15", question: "Monthly Household Income (Nu)", type: "number", placeholder: "Enter monthly household income in Nu.", required: true, editable: true },
          { question_number: "16", question: "Source of Income", type: "text", placeholder: "Enter your main source of income", required: true, editable: true },
          { question_number: "17", question: "Type of Housing", type: "select", options: ["Owned", "Rented", "Temporary Shelter"], placeholder: "Select your housing type", required: true, editable: true },
          { question_number: "18", question: "Any Disability?", type: "radio", options: ["Yes", "No"], required: true, editable: true },
          { question_number: "19", question: "If yes, specify", type: "text", conditionalOn: { question: "18", value: "Yes" }, placeholder: "Specify type of disability", required: false, editable: true }
        ]
      },
      {
        section_number: 3,
        title: "Description of the Issue",
        questions: [
          { question_number: "20", question: "Describe your current issue or situation", type: "textarea", placeholder: "Briefly describe your current issue or challenge", required: true, editable: true }
        ]
      },
      {
        section_number: 4,
        title: "Type of Support Needed",
        questions: [
          { question_number: "21", question: "Support needed", type: "checkbox", options: ["Economic Support", "Health Support", "Legal Support", "Psychosocial Support", "Educational Support", "Others"], required: true, editable: true },
          { question_number: "22", question: "If Others, specify", type: "text", conditionalOn: { question: "21", value: "Others" }, placeholder: "Specify other type of support", required: false, editable: true }
        ]
      },
      {
        section_number: 5,
        title: "Additional Information",
        questions: [
          { question_number: "23", question: "Please provide any other information that may help us understand your situation better:", type: "textarea", placeholder: "Provide any additional details here...", required: false, editable: true }
        ]
      },
      {
        section_number: 6,
        title: "KPO Selection",
        questions: [
          { question_number: "24", question: "From which KPO you want the support from?", type: "checkbox", options: ["Lhak-Sam", "Pride Bhutan", "Chithuen Phendhey Association", "Red Purse Network"], required: true, editable: true }
        ]
      },
      {
        section_number: 7,
        title: "Declaration",
        questions: [
          { question_number: "25", question: "I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that providing false information may result in disqualification from receiving support.", type: "checkbox", options: ["I Agree"], required: true, editable: true },
          { question_number: "26", question: "Date", type: "date", default: new Date().toISOString().split("T")[0], placeholder: "Select date", required: true, editable: true }
        ]
      }
    ]
  },
  lhak_sam: {
    sections: [
      {
        section_number: 1,
        title: "Personal Information",
        questions: [
          { question_number: "1", question: "Full Name", type: "text", placeholder: "Enter your full name", required: true, editable: true },
          { question_number: "2", question: "Gender", type: "select", options: ["Male", "Female", "Other"], placeholder: "Select your gender", required: true, editable: true },
          { question_number: "3", question: "Date of Birth", type: "date", placeholder: "Select your date of birth", required: true, editable: true },
          { question_number: "4", question: "Age", type: "number", placeholder: "Enter your age", required: true, editable: true },
          { question_number: "5", question: "CID Number", type: "number", placeholder: "Enter your 11-digit CID number", required: true, editable: true },
          { question_number: "6", question: "Occupation", type: "text", placeholder: "Enter your current occupation", required: true, editable: true },
          { question_number: "7", question: "Marital Status", type: "text", placeholder: "Enter your marital status", required: true, editable: true },
          { question_number: "8", question: "Educational Qualification", type: "text", placeholder: "Enter your highest qualification", required: true, editable: true },
          { question_number: "9", question: "Contact Number", type: "number", placeholder: "Enter your phone number", required: true, editable: true },
          { question_number: "10", question: "Email Address", type: "email", placeholder: "Enter your email address (e.g., you@example.com)", required: true, editable: true },
          { question_number: "11", question: "Present Address(Village, Gewog, Dzongkhag)", type: "text", placeholder: "Enter your current address", required: true, editable: true },
          { question_number: "12", question: "Permanent Address(Village, Gewog, Dzongkhag)", type: "text", placeholder: "Enter your permanent address", required: true, editable: true }
        ]
      },
      {
        section_number: 2,
        title: "Demographic and Socioeconomic Information",
        questions: [
          { question_number: "13", question: "Household Size (number of family members)", type: "number", placeholder: "Enter total number of family members", required: true, editable: true },
          { question_number: "14", question: "Number of Dependents", type: "number", placeholder: "Enter number of dependents", required: true, editable: true },
          { question_number: "15", question: "Monthly Household Income (Nu)", type: "number", placeholder: "Enter monthly household income in Nu.", required: true, editable: true },
          { question_number: "16", question: "Source of Income", type: "text", placeholder: "Enter your main source of income", required: true, editable: true },
          { question_number: "17", question: "Type of Housing", type: "select", options: ["Owned", "Rented", "Temporary Shelter"], placeholder: "Select your housing type", required: true, editable: true },
          { question_number: "18", question: "Any Disability?", type: "radio", options: ["Yes", "No"], required: true, editable: true },
          { question_number: "19", question: "If yes, specify", type: "text", conditionalOn: { question: "18", value: "Yes" }, placeholder: "Specify type of disability", required: false, editable: true }
        ]
      },
      {
        section_number: 3,
        title: "Description of the Issue",
        questions: [
          { question_number: "20", question: "Describe your current issue or situation", type: "textarea", placeholder: "Briefly describe your current issue or challenge", required: true, editable: true }
        ]
      },
      {
        section_number: 4,
        title: "Type of Support Needed",
        questions: [
          { question_number: "21", question: "Support needed", type: "checkbox", options: ["Economic Support", "Health Support", "Legal Support", "Psychosocial Support", "Educational Support", "Others"], required: true, editable: true },
          { question_number: "22", question: "If Others, specify", type: "text", conditionalOn: { question: "21", value: "Others" }, placeholder: "Specify other type of support", required: false, editable: true }
        ]
      },
      {
        section_number: 5,
        title: "Additional Information",
        questions: [
          { question_number: "23", question: "Please provide any other information that may help us understand your situation better:", type: "textarea", placeholder: "Provide any additional details here...", required: false, editable: true }
        ]
      },
      {
        section_number: 6,
        title: "KPO Selection",
        questions: [
          { question_number: "24", question: "From which KPO you want the support from?", type: "checkbox", options: ["Lhak-Sam", "Pride Bhutan", "Chithuen Phendhey Association", "Red Purse Network"], required: true, editable: true }
        ]
      },
      {
        section_number: 7,
        title: "Declaration",
        questions: [
          { question_number: "25", question: "I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that providing false information may result in disqualification from receiving support.", type: "checkbox", options: ["I Agree"], required: true, editable: true },
          { question_number: "26", question: "Date", type: "date", default: new Date().toISOString().split("T")[0], placeholder: "Select date", required: true, editable: true }
        ]
      }
    ]
  },
  chithuen_phendhey: {
    sections: [
      {
        section_number: 1,
        title: "Personal Information",
        questions: [
          { question_number: "1", question: "Full Name", type: "text", placeholder: "Enter your full name", required: true, editable: true },
          { question_number: "2", question: "Gender", type: "select", options: ["Male", "Female", "Other"], placeholder: "Select your gender", required: true, editable: true },
          { question_number: "3", question: "Date of Birth", type: "date", placeholder: "Select your date of birth", required: true, editable: true },
          { question_number: "4", question: "Age", type: "number", placeholder: "Enter your age", required: true, editable: true },
          { question_number: "5", question: "CID Number", type: "number", placeholder: "Enter your 11-digit CID number", required: true, editable: true },
          { question_number: "6", question: "Occupation", type: "text", placeholder: "Enter your current occupation", required: true, editable: true },
          { question_number: "7", question: "Marital Status", type: "text", placeholder: "Enter your marital status", required: true, editable: true },
          { question_number: "8", question: "Educational Qualification", type: "text", placeholder: "Enter your highest qualification", required: true, editable: true },
          { question_number: "9", question: "Contact Number", type: "number", placeholder: "Enter your phone number", required: true, editable: true },
          { question_number: "10", question: "Email Address", type: "email", placeholder: "Enter your email address (e.g., you@example.com)", required: true, editable: true },
          { question_number: "11", question: "Present Address(Village, Gewog, Dzongkhag)", type: "text", placeholder: "Enter your current address", required: true, editable: true },
          { question_number: "12", question: "Permanent Address(Village, Gewog, Dzongkhag)", type: "text", placeholder: "Enter your permanent address", required: true, editable: true }
        ]
      },
      {
        section_number: 2,
        title: "Demographic and Socioeconomic Information",
        questions: [
          { question_number: "13", question: "Household Size (number of family members)", type: "number", placeholder: "Enter total number of family members", required: true, editable: true },
          { question_number: "14", question: "Number of Dependents", type: "number", placeholder: "Enter number of dependents", required: true, editable: true },
          { question_number: "15", question: "Monthly Household Income (Nu)", type: "number", placeholder: "Enter monthly household income in Nu.", required: true, editable: true },
          { question_number: "16", question: "Source of Income", type: "text", placeholder: "Enter your main source of income", required: true, editable: true },
          { question_number: "17", question: "Type of Housing", type: "select", options: ["Owned", "Rented", "Temporary Shelter"], placeholder: "Select your housing type", required: true, editable: true },
          { question_number: "18", question: "Any Disability?", type: "radio", options: ["Yes", "No"], required: true, editable: true },
          { question_number: "19", question: "If yes, specify", type: "text", conditionalOn: { question: "18", value: "Yes" }, placeholder: "Specify type of disability", required: false, editable: true }
        ]
      },
      {
        section_number: 3,
        title: "Description of the Issue",
        questions: [
          { question_number: "20", question: "Describe your current issue or situation", type: "textarea", placeholder: "Briefly describe your current issue or challenge", required: true, editable: true }
        ]
      },
      {
        section_number: 4,
        title: "Type of Support Needed",
        questions: [
          { question_number: "21", question: "Support needed", type: "checkbox", options: ["Economic Support", "Health Support", "Legal Support", "Psychosocial Support", "Educational Support", "Others"], required: true, editable: true },
          { question_number: "22", question: "If Others, specify", type: "text", conditionalOn: { question: "21", value: "Others" }, placeholder: "Specify other type of support", required: false, editable: true }
        ]
      },
      {
        section_number: 5,
        title: "Additional Information",
        questions: [
          { question_number: "23", question: "Please provide any other information that may help us understand your situation better:", type: "textarea", placeholder: "Provide any additional details here...", required: false, editable: true }
        ]
      },
      {
        section_number: 6,
        title: "KPO Selection",
        questions: [
          { question_number: "24", question: "From which KPO you want the support from?", type: "checkbox", options: ["Lhak-Sam", "Pride Bhutan", "Chithuen Phendhey Association", "Red Purse Network"], required: true, editable: true }
        ]
      },
      {
        section_number: 7,
        title: "Declaration",
        questions: [
          { question_number: "25", question: "I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that providing false information may result in disqualification from receiving support.", type: "checkbox", options: ["I Agree"], required: true, editable: true },
          { question_number: "26", question: "Date", type: "date", default: new Date().toISOString().split("T")[0], placeholder: "Select date", required: true, editable: true }
        ]
      }
    ]
  },
  red_purse_network: {
    sections: [
      {
        section_number: 1,
        title: "Personal Information",
        questions: [
          { question_number: "1", question: "Full Name", type: "text", placeholder: "Enter your full name", required: true, editable: true },
          { question_number: "2", question: "Gender", type: "select", options: ["Male", "Female", "Other"], placeholder: "Select your gender", required: true, editable: true },
          { question_number: "3", question: "Date of Birth", type: "date", placeholder: "Select your date of birth", required: true, editable: true },
          { question_number: "4", question: "Age", type: "number", placeholder: "Enter your age", required: true, editable: true },
          { question_number: "5", question: "CID Number", type: "number", placeholder: "Enter your 11-digit CID number", required: true, editable: true },
          { question_number: "6", question: "Occupation", type: "text", placeholder: "Enter your current occupation", required: true, editable: true },
          { question_number: "7", question: "Marital Status", type: "text", placeholder: "Enter your marital status", required: true, editable: true },
          { question_number: "8", question: "Educational Qualification", type: "text", placeholder: "Enter your highest qualification", required: true, editable: true },
          { question_number: "9", question: "Contact Number", type: "number", placeholder: "Enter your phone number", required: true, editable: true },
          { question_number: "10", question: "Email Address", type: "email", placeholder: "Enter your email address (e.g., you@example.com)", required: true, editable: true },
          { question_number: "11", question: "Present Address(Village, Gewog, Dzongkhag)", type: "text", placeholder: "Enter your current address", required: true, editable: true },
          { question_number: "12", question: "Permanent Address(Village, Gewog, Dzongkhag)", type: "text", placeholder: "Enter your permanent address", required: true, editable: true }
        ]
      },
      {
        section_number: 2,
        title: "Demographic and Socioeconomic Information",
        questions: [
          { question_number: "13", question: "Household Size (number of family members)", type: "number", placeholder: "Enter total number of family members", required: true, editable: true },
          { question_number: "14", question: "Number of Dependents", type: "number", placeholder: "Enter number of dependents", required: true, editable: true },
          { question_number: "15", question: "Monthly Household Income (Nu)", type: "number", placeholder: "Enter monthly household income in Nu.", required: true, editable: true },
          { question_number: "16", question: "Source of Income", type: "text", placeholder: "Enter your main source of income", required: true, editable: true },
          { question_number: "17", question: "Type of Housing", type: "select", options: ["Owned", "Rented", "Temporary Shelter"], placeholder: "Select your housing type", required: true, editable: true },
          { question_number: "18", question: "Any Disability?", type: "radio", options: ["Yes", "No"], required: true, editable: true },
          { question_number: "19", question: "If yes, specify", type: "text", conditionalOn: { question: "18", value: "Yes" }, placeholder: "Specify type of disability", required: false, editable: true }
        ]
      },
      {
        section_number: 3,
        title: "Description of the Issue",
        questions: [
          { question_number: "20", question: "Describe your current issue or situation", type: "textarea", placeholder: "Briefly describe your current issue or challenge", required: true, editable: true }
        ]
      },
      {
        section_number: 4,
        title: "Type of Support Needed",
        questions: [
          { question_number: "21", question: "Support needed", type: "checkbox", options: ["Economic Support", "Health Support", "Legal Support", "Psychosocial Support", "Educational Support", "Others"], required: true, editable: true },
          { question_number: "22", question: "If Others, specify", type: "text", conditionalOn: { question: "21", value: "Others" }, placeholder: "Specify other type of support", required: false, editable: true }
        ]
      },
      {
        section_number: 5,
        title: "Additional Information",
        questions: [
          { question_number: "23", question: "Please provide any other information that may help us understand your situation better:", type: "textarea", placeholder: "Provide any additional details here...", required: false, editable: true }
        ]
      },
      {
        section_number: 6,
        title: "KPO Selection",
        questions: [
          { question_number: "24", question: "From which KPO you want the support from?", type: "checkbox", options: ["Lhak-Sam", "Pride Bhutan", "Chithuen Phendhey Association", "Red Purse Network"], required: true, editable: true }
        ]
      },
      {
        section_number: 7,
        title: "Declaration",
        questions: [
          { question_number: "25", question: "I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that providing false information may result in disqualification from receiving support.", type: "checkbox", options: ["I Agree"], required: true, editable: true },
          { question_number: "26", question: "Date", type: "date", default: new Date().toISOString().split("T")[0], placeholder: "Select date", required: true, editable: true }
        ]
      }
    ]
  },
  others: {
    sections: [
      {
        section_number: 1,
        title: "Personal Information",
        questions: [
          { question_number: "1", question: "Full Name", type: "text", placeholder: "Enter your full name", required: true, editable: true },
          { question_number: "2", question: "Gender", type: "select", options: ["Male", "Female", "Other"], placeholder: "Select your gender", required: true, editable: true },
          { question_number: "3", question: "Date of Birth", type: "date", placeholder: "Select your date of birth", required: true, editable: true },
          { question_number: "4", question: "Age", type: "number", placeholder: "Enter your age ", required: true, editable: true },
          { question_number: "5", question: "CID Number", type: "number", placeholder: "Enter your 11-digit CID number", required: true, editable: true },
          { question_number: "6", question: "Occupation", type: "text", placeholder: "Enter your current occupation", required: true, editable: true },
          { question_number: "7", question: "Marital Status", type: "text", placeholder: "Enter your marital status", required: true, editable: true },
          { question_number: "8", question: "Educational Qualification", type: "text", placeholder: "Enter your highest qualification", required: true, editable: true },
          { question_number: "9", question: "Contact Number", type: "number", placeholder: "Enter your phone number", required: true, editable: true },
          { question_number: "10", question: "Email Address", type: "email", placeholder: "Enter your email address (e.g., you@example.com)", required: true, editable: true },
          { question_number: "11", question: "Present Address(Village, Gewog, Dzongkhag)", type: "text", placeholder: "Enter your current address", required: true, editable: true },
          { question_number: "12", question: "Permanent Address(Village, Gewog, Dzongkhag)", type: "text", placeholder: "Enter your permanent address", required: true, editable: true }
        ]
      },
      {
        section_number: 2,
        title: "Demographic and Socioeconomic Information",
        questions: [
          { question_number: "13", question: "Household Size (number of family members)", type: "number", placeholder: "Enter total number of family members", required: true, editable: true },
          { question_number: "14", question: "Number of Dependents", type: "number", placeholder: "Enter number of dependents", required: true, editable: true },
          { question_number: "15", question: "Monthly Household Income (Nu)", type: "number", placeholder: "Enter monthly household income in Nu.", required: true, editable: true },
          { question_number: "16", question: "Source of Income", type: "text", placeholder: "Enter your main source of income", required: true, editable: true },
          { question_number: "17", question: "Type of Housing", type: "select", options: ["Owned", "Rented", "Temporary Shelter"], placeholder: "Select your housing type", required: true, editable: true },
          { question_number: "18", question: "Any Disability?", type: "radio", options: ["Yes", "No"], required: true, editable: true },
          { question_number: "19", question: "If yes, specify", type: "text", conditionalOn: { question: "18", value: "Yes" }, placeholder: "Specify type of disability", required: false, editable: true }
        ]
      },
      {
        section_number: 3,
        title: "Description of the Issue",
        questions: [
          { question_number: "20", question: "Describe your current issue or situation", type: "textarea", placeholder: "Briefly describe your current issue or challenge", required: true, editable: true }
        ]
      },
      {
        section_number: 4,
        title: "Type of Support Needed",
        questions: [
          { question_number: "21", question: "Support needed", type: "checkbox", options: ["Economic Support", "Health Support", "Legal Support", "Psychosocial Support", "Educational Support", "Others"], required: true, editable: true },
          { question_number: "22", question: "If Others, specify", type: "text", conditionalOn: { question: "21", value: "Others" }, placeholder: "Specify other type of support", required: false, editable: true }
        ]
      },
      {
        section_number: 5,
        title: "Additional Information",
        questions: [
          { question_number: "23", question: "Please provide any other information that may help us understand your situation better:", type: "textarea", placeholder: "Provide any additional details here...", required: false, editable: true }
        ]
      },
      {
        section_number: 6,
        title: "KPO Selection",
        questions: [
          { question_number: "24", question: "From which KPO you want the support from?", type: "checkbox", options: ["Lhak-Sam", "Pride Bhutan", "Chithuen Phendhey Association", "Red Purse Network"], required: true, editable: true }
        ]
      },
      {
        section_number: 7,
        title: "Declaration",
        questions: [
          { question_number: "25", question: "I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that providing false information may result in disqualification from receiving support.", type: "checkbox", options: ["I Agree"], required: true, editable: true },
          { question_number: "26", question: "Date", type: "date", default: new Date().toISOString().split("T")[0], placeholder: "Select date", required: true, editable: true }
        ]
      }
    ]
  }
};



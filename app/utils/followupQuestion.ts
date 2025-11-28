export const follow_up_question = {
    section1: {
        title: "Section 1: Follow-up details",
        questions: [
            {
                question_number: "1",
                question: "Location Of The Facility",
                type: "text",
                editable: false,
                required: true,
            },
            {
                question_number: "2",
                question: "Region",
                type: "text",
                editable: false,
                required: true,
            },
            {
                question_number: "3",
                question: "Date Of CLM Report",
                type: "date",
                required: true,
            },
            {
                question_number: "4",
                question: "Date Of This Follow-Up",
                type: "date",
                required: true,
            },
            {
                question_number: "5a",
                question: "Name",
                type: "text",
                required: true,
            },
            {
                question_number: "5b",
                question: "Designation",
                type: "text",
                required: true,
            },
            {
                question_number: "5c",
                question: "Organization",
                type: "text",
                required: true,
            },
            {
                question_number: "5d",
                question: "Contact Details",
                type: "text",
                required: true,
            },
            {
                question_number: "6",
                question: "Client's Age",
                type: "number",
                required: true,
            },
            {
                question_number: "7",
                question: "Client's Gender",
                type: "text",
                editable: false,

            },
            {
                question_number: "8",
                question: "Client's Key Population Identity",
                type: "text",
                editable: false,

            },
        ],
    },
    section2: {
        title: "Section 2: Follow-up attempts [Tick box]",
        questions: [
            {
                question_number: "9",
                question: "Is This The First Contact Related To This Complaint Or A Follow-Up?",
                type: "radio",
                required: true,
                label: ["First", "Follow-Up"],
            },
            {
                question_number: "10",
                question: "How Are You Following Up The Client?",
                type: "radio",
                required: true,
                label: ["Phone", "E-Mail", "Face To Face", "Other"],
            },
            {
                question_number: "11",
                question: "Did You Reach The Client?",
                type: "radio",
                required: true,
                label: [
                    "Yes, On Attempt 1",
                    "Yes, On Attempt 2",
                    "Yes, On Attempt 3",
                    "No, On All 3 Attempts",
                ],
            },
        ],
    },
    section3: {
        title: "Section 3: Recap of incident they reported experiencing at the service.",
        questions: [
            {
                question_number: "12",
                question: "What Was The Incident They Reported Experiencing At The Service?",
                type: "multiple-select",
                required: false,
                label: [
                    "Stigma And Discrimination",
                    "Violence",
                    "Harassment From The Service Staff Or Other Clients",
                    "Breach Of Privacy Or Confidentiality",
                    "Refused Service Because Of Gender, Identity, Race, Risk Behaviour Or Other",
                    "Pain Or Distress",
                    "Other",
                ],
            },
            {
                question_number: "13",
                question: "After Discussing With The Client, Was This A Serious Incident As Above?",
                type: "radio",
                required: true,
                label: ["Yes", "No"],
            },
            {
                question_number: "13a",
                question: "Enter Any More Relevant Details Here To Assist Understanding Or Resolution Of The Issue:",
                type: "textarea",
                required: false,
            },
        ],
    },
    section4: {
        title: "Section 4: Information following successful contact with the client",
        questions: [
            {
                question_number: "14a",
                question: "Did you refer the client to HIV Or Health Services?",
                type: "radio",
                required: true,
                label: ["Yes", "No"],
                yesquestion: [
                    {
                        question_number: "14aa",
                        question: "If Yes, Which Facility?",
                        type: "text",
                        required: false,
                    },
                ]
            },
            {
                question_number: "14b",
                question: "Did you refer the client to Counselling Services?",
                type: "radio",
                required: true,
                label: ["Yes", "No"],
            },
            {
                question_number: "14c",
                question: "Did you refer the client to Legal Services Including Police?",
                type: "radio",
                required: true,
                label: ["Yes", "No"],
            },
            {
                question_number: "14d",
                question: "Did you refer the client to Social Welfare Services?",
                type: "radio",
                required: true,
                label: ["Yes", "No"],
                yesquestion: [
                    {
                        question_number: "14dd",
                        question: "Specify Agency Name",
                        type: "text",
                        required: false,
                    }
                ]
            },
            {
                question_number: "14e",
                question: "Others, Please Specify",
                type: "text",
                required: false,
            },
        ],
    },
    section5: {
        title: "Section 5: Final result from this follow-up attempt [Tick box]",
        questions: [
            {
                question_number: "15a",
                question: "Is The Case Still Ongoing Or Is It Now Resolved/Closed?",
                type: "radio",
                required: true,
                label: ["Ongoing", "Closed"],
            },
            {
                question_number: "15b",
                question: "Case Resolved Or Closed Because",
                type: "radio",
                required: false,
                label: [
                    "Could Not Reach Client",
                    "Successful Resolution Accepted By Client",
                    "Client Refused To Continue The Case",
                    "Couldn't Successfully Resolve The Case",
                    "Other Situation Specify",
                ],
            },
            {
                question_number: "16",
                question: "Please Explain In A Few Words The Nature Of The Follow-Up Contact, Your Recommendation For Any Follow Up Actions For The Client And The KPO Or Health Center, And The Result:",
                type: "textarea",
                required: false,
            },
        ],
    }
}
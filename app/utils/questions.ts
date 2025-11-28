
const getToday = () => new Date().toISOString().split('T')[0];

export const questions = {
    pride_Bhutan: {

        section1: {
            title: "HIV/ Health Service and Visit Date ",
            questions: [
                {
                    question_number: '1',
                    question: "Today's Date",
                    type: "date",
                    default: getToday(),
                    editable: false,
                    required: true,
                },
                {
                    question_number: '2',
                    question: " Date of Clinic Visit",
                    type: "date",
                    editable: true,
                    required: true,
                },
                {
                    question_number: '3',
                    question: "Location of the facility (Dzongkhag) ",
                    type: "select",
                    options: [],
                    required: true,
                },
                {
                    question_number: '4',
                    question: "Region",
                    type: "text",
                    editable: false,
                    required: true,
                },
                {
                    question_number: '5',
                    question: " Facility Name",
                    type: "select",
                    options: [],
                    required: true,
                }
            ]

        },
        section2: {
            title: "Feedback on the service [Tick each option] ",
            questions: [

                {
                    question_number: '6a',
                    question: "Condom supply sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6aa',
                            question: "Condom supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        }
                    ],
                },
                {
                    question_number: '6b',
                    question: "Lubricant supply sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6bb',
                            question: "Lubricant supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        }
                    ],
                },
                {
                    question_number: "6c",
                    question: "PrEP initiation sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: "6cc",
                            question: "PrEP initiation supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        },
                    ],
                },
                {
                    question_number: "6d",
                    question: "PrEP refill sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    required: true,
                    editable: true,
                    yesquestion: [
                        {
                            question_number: "6dd",
                            question: "PrEP refill supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        },
                    ],
                },
                {
                    question_number: '6e',
                    question: "HIV Testing sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ee',
                            question: "HIV Testing received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        },

                    ],
                },

                {
                    question_number: '6f',
                    question: " HIV Confirmation Test sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ff',
                            question: "HIV Confirmation Test received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6g',
                    question: " HIV counseling sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6gg',
                            question: " HIV counseling received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6h',
                    question: "STI testing/diagnosis sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6hh',
                            question: " STI testing/diagnosis received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6i',
                    question: " Antiretroviral therapy(ART) Initiation sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ii',
                            question: " Antiretroviral therapy(ART) Initiation received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6j',
                    question: "  Antiretroviral therapy (ART) Counselling Sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6jj',
                            question: " Antiretroviral therapy (ART) counselling received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6k',
                    question: "Antiretroviral therapy (ART) Refill sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6kk',
                            question: " Antiretroviral therapy (ART) refill received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6l',
                    question: "Other STI Treatment sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ll',
                            question: " Other STI Treatment received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6m',
                    question: "Viral Load Testing sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6mm',
                            question: "Viral Load Testing received ?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6n',
                    question: "CD4 Testing Sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6nn',
                            question: "CD4 Testing receive?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6o',
                    question: "Opportunistic infection management and medicine sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6oo',
                            question: "Opportunistic infection management and medicine received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6p',
                    question: "Detoxification for drugs and alcohol sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6pp',
                            question: " Detoxification for drugs and alcohol received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6q',
                    question: "Rehabilatition services for drugs and alcohol sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6qq',
                            question: "Rehabilatition services for drugs and alcohol received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6r',
                    question: "Hospital based SUD treatment sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6rr',
                            question: "Hospital based SUD treatment received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6s',
                    question: " Other HIV services sought?  ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ss',
                            question: "Other HIV services received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                        {
                            question_number: '6sss',
                            question: "Please specify other HIV services",
                            type: "text",
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6t',
                    question: "TB Services Sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6tt',
                            question: "TB Services received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6u',
                    question: "Other Health conditions [Services sought]?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6uu',
                            question: "Other Health conditions [Services received]?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },
                        {
                            question_number: '6uuu',
                            question: "Please specify other health conditions services",
                            type: "text",
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '7',
                    question: "Was the service location safe for you",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '8',
                    question: "Was the location very far or hard to travel to?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '9',
                    question: "Are the opening hours and days of operations okay for you?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '10a',
                    question: "Did you incur any out-of-pocket expense while availing the health services? (if yes - please look at questions 10b)",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '10b',
                            question: " What did you have to spend money on to receive the health services (i.e. travel, supplement medication, logistics)?",
                            type: "text",
                            editable: true,
                        }
                    ],
                },
                {
                    question_number: '10c',
                    question: "If yes, were you able to afford these services?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                },
                {
                    question_number: '11',
                    question: "Were you treated respectfully by the staff, regardless of your gender, sexual orientation, age or religion, HIV status, and Profession (applicable for SW only)?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '12',
                    question: " Did the staff/health care provider seek your consent for any procedures (examinations, tests, etc.)? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '13',
                    question: " Did you receive all the information you need?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '14',
                    question: "Were all your questions answered and clarified properly? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '15',
                    question: "Did you receive the items (medicine, condoms, information, lubricant, etc.) you need/require?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '16',
                    question: "How long did you have to wait to see the health care provider? (In Minutes) *",
                    type: "text",
                    editable: true,
                    required: true,
                },
                {
                    question_number: '17',
                    question: "Out of 5, how would you rate your satisfaction level? [Where 1 is for lowest and 5 is for highest satisfaction where 5= Very satisfied and 1= very dissatisfied]",
                    type: "radio",
                    label: ['1', '2', '3', '4', '5'],
                    editable: true,
                    required: true,
                },
            ]
        },
        section3: {
            title: "Section 3: Reports of any serious incidents experienced [Select all that apply]",
            questions: [

                {
                    question_number: '18',
                    question: "Did you experience any serious incidents (such as stigma, discrimination, violence, harassment, breach of privacy or confidentiality, refused services, etc) linked to your visit?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '18a',
                            question: "select which one you have faced ",
                            type: "multiple-select",
                            options: [

                                'Stigma and discrimination (negative attitude towards you or treated you unfairly by health worker during your visit because of your identity as Key Population',
                                'Violence (such as verbal abuse, physical abuse, sexual abuse, negligence by staff or person at the health facility)',
                                'Harassment (including sexual) from the service staff or other clients',
                                'Breach of privacy (physical privacy maintained)',
                                'Breach of confidentiality was your information shared with others without your consent)',
                                'Refused service because of gender, identity case, risk behaviors or other',
                                'Physical pain or mental distress',
                                'Other'
                            ],
                            editable: true,
                            required: true,
                        },



                        {
                            question_number: '19',
                            question: "Can you please provide some more details to assist our follow-up? ",
                            type: "text",
                            editable: true,
                        },
                        {
                            question_number: '20',
                            question: "Do you consent to having a trained staff member or volunteer contact you to help resolve this?  ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },
                        {
                            question_number: '21',
                            question: "Please provide your preferred mode of contact and details (Phone Number)",
                            type: "text",
                            editable: true,
                            required: true,
                        },
                    ]
                },

                // {
                //     question_number: '18a',
                //     question: " Stigma and discrimination (negative attitude towards you or treated you unfairly by health worker during your visit because of your identity as Key Population)",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18b',
                //     question: " Violence (such as verbal abuse, physical abuse, sexual abuse, negligence by staff or person at the health facility) ",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18c',
                //     question: " Harassment (including sexual) from the service staff or other clients ",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18d',
                //     question: "Breach of privacy (physical privacy maintained)",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18e',
                //     question: "Breach of confidentiality &nbsp;(was your information shared with others without your consent)",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18f',
                //     question: "Refused service because of gender, identity case, risk behaviors or other",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // // {
                // //     question_number: '18g',
                // //     question: "Refused service because of gender, identity case, risk behaviors or other",
                // //     type: "radio",
                // //     label: ['Yes', 'No'],
                // //     editable: true,
                // //     required: true,
                // // },
                // {
                //     question_number: '18g',
                //     question: "Physical pain or mental distress",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18h',
                //     question: "Other ",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                //     yesquestion: [
                //         {
                //             question_number: '18hh',
                //             question: "Specify",
                //             type: "text",
                //             editable: true,
                //             required: true,
                //         }
                //     ]
                // },




            ]
        },
        section4: {
            title: "Client Profile",
            questions: [
                {
                    question_number: '22',
                    question: " When did you last complete this form?",
                    type: "radio",
                    label: ['Never', 'Less than 6 months ago', 'More than 6 months ago'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '23',
                    question: "What is your age? ",
                    type: "text",
                    editable: true,
                    required: true,
                },
                {
                    question_number: '24',
                    question: "What is your gender?",
                    type: "multiple-select",
                    options: [
                        'Man',
                        'Woman',
                        'Transgender Man',
                        'Transgender Woman',
                        'Others',
                        'Do not want to disclose',
                    ],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '25',
                    question: "Please select any Key Population identity you belong to (you may select more than 1):",
                    type: "multiple-select",
                    options: [
                        'Men who have sex with men',
                        'Sex worker',
                        'Transgender person',
                        'People who use drugs and alcohol',
                        'People living with HIV',
                        'Do not want to disclose'
                    ],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '26',
                    question: " What was the best part of your experience(s) at this health facility while availing service?",
                    type: "text",
                    editable: true,
                    required: true,

                },
                {
                    question_number: '27',
                    question: "Do you have any advice, recommendations or requests for this service?",
                    type: "text",
                    editable: true,
                    required: true,

                },

            ]
        }

    },

    lhak_sam: {

        section1: {
            title: "HIV/ Health Service and Visit Date ",
            questions: [
                {
                    question_number: '1',
                    question: "Today's Date",
                    type: "date",
                    default: getToday(),
                    editable: false,
                    required: true,
                },
                {
                    question_number: '2',
                    question: " Date of Clinic Visit",
                    type: "date",
                    editable: true,
                    required: true,
                },
                {
                    question_number: '3',
                    question: "Location of the facility (Dzongkhag) ",
                    type: "select",
                    options: [],
                    required: true,
                },
                {
                    question_number: '4',
                    question: "Region",
                    type: "text",
                    editable: false,
                    required: true,
                },
                {
                    question_number: '5',
                    question: " Facility Name",
                    type: "select",
                    options: [],
                    required: true,
                }
            ]

        },
        section2: {
            title: "Feedback on the service [Tick each option] ",
            questions: [

                {
                    question_number: '6a',
                    question: "Condom supply sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6aa',
                            question: "Condom supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        }
                    ],
                },
                {
                    question_number: '6b',
                    question: "Lubricant supply sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6bb',
                            question: "Lubricant supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        }
                    ],
                },
                {
                    question_number: "6c",
                    question: "PrEP initiation sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: "6cc",
                            question: "PrEP initiation supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        },
                    ],
                },
                {
                    question_number: "6d",
                    question: "PrEP refill sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    required: true,
                    editable: true,
                    yesquestion: [
                        {
                            question_number: "6dd",
                            question: "PrEP refill supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        },
                    ],
                },
                {
                    question_number: '6e',
                    question: "HIV Testing sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ee',
                            question: "HIV Testing received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        },

                    ],
                },

                {
                    question_number: '6f',
                    question: " HIV Confirmation Test sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ff',
                            question: "HIV Confirmation Test received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6g',
                    question: " HIV counseling sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6gg',
                            question: " HIV counseling received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6h',
                    question: "STI testing/diagnosis sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6hh',
                            question: " STI testing/diagnosis received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6i',
                    question: " Antiretroviral therapy(ART) Initiation sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ii',
                            question: " Antiretroviral therapy(ART) Initiation received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6j',
                    question: "  Antiretroviral therapy (ART) Counselling Sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6jj',
                            question: " Antiretroviral therapy (ART) counselling received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6k',
                    question: "Antiretroviral therapy (ART) Refill sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6kk',
                            question: " Antiretroviral therapy (ART) refill received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6l',
                    question: "Other STI Treatment sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ll',
                            question: " Other STI Treatment received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6m',
                    question: "Viral Load Testing sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6mm',
                            question: "Viral Load Testing received ?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6n',
                    question: "CD4 Testing Sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6nn',
                            question: "CD4 Testing receive?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6o',
                    question: "Opportunistic infection management and medicine sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6oo',
                            question: "Opportunistic infection management and medicine received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6p',
                    question: "Detoxification for drugs and alcohol sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6pp',
                            question: " Detoxification for drugs and alcohol received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6q',
                    question: "Rehabilatition services for drugs and alcohol sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6qq',
                            question: "Rehabilatition services for drugs and alcohol received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6r',
                    question: "Hospital based SUD treatment sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6rr',
                            question: "Hospital based SUD treatment received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6s',
                    question: " Other HIV services sought?  ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ss',
                            question: "Other HIV services received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                        {
                            question_number: '6sss',
                            question: "Please specify other HIV services",
                            type: "text",
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6t',
                    question: "TB Services Sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6tt',
                            question: "TB Services received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6u',
                    question: "Other Health conditions [Services sought]?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6uu',
                            question: "Other Health conditions [Services received]?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },
                        {
                            question_number: '6uuu',
                            question: "Please specify other health conditions services",
                            type: "text",
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '7',
                    question: "Was the service location safe for you",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '8',
                    question: "Was the location  very far or hard to travel to?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '9',
                    question: "Are the opening hours and days of operations okay for you?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '10a',
                    question: "Did you incur any out-of-pocket expense while availing the health services? (if yes - please look at questions 10b)",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '10b',
                            question: " What did you have to spend money on to receive the health services (i.e. travel, supplement medication, logistics)?",
                            type: "text",
                            editable: true,
                        }
                    ],
                },
                {
                    question_number: '10c',
                    question: "If yes, were you able to afford these services?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                },
                {
                    question_number: '11',
                    question: "Were you treated respectfully by the staff, regardless of your gender, sexual orientation, age or religion, HIV status, and Profession (applicable for SW only)?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '12',
                    question: " Did the staff/health care provider seek your consent for any procedures (examinations, tests, etc.)? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '13',
                    question: " Did you receive all the information you need?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '14',
                    question: "Were all your questions answered and clarified properly? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '15',
                    question: "Did you receive the items (medicine, condoms, information, lubricant, etc.) you need/require?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '16',
                    question: "How long did you have to wait to see the health care provider? (In Minutes) *",
                    type: "text",
                    editable: true,
                    required: true,
                },
                {
                    question_number: '17',
                    question: "Out of 5, how would you rate your satisfaction level? [Where 1 is for lowest and 5 is for highest satisfaction where 5= Very satisfied and 1= very dissatisfied]",
                    type: "radio",
                    label: ['1', '2', '3', '4', '5'],
                    editable: true,
                    required: true,
                },
            ]
        },
        section3: {
            title: "Section 3: Reports of any serious incidents experienced [Select all that apply]",
            questions: [

                {
                    question_number: '18',
                    question: "Did you experience any serious incidents (such as stigma, discrimination, violence, harassment, breach of privacy or confidentiality, refused services, etc) linked to your visit?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '18a',
                            question: "select which one you have faced ",
                            type: "multiple-select",
                            options: [

                                'Stigma and discrimination (negative attitude towards you or treated you unfairly by health worker during your visit because of your identity as Key Population',
                                'Violence (such as verbal abuse, physical abuse, sexual abuse, negligence by staff or person at the health facility)',
                                'Harassment (including sexual) from the service staff or other clients',
                                'Breach of privacy (physical privacy maintained)',
                                'Breach of confidentiality was your information shared with others without your consent)',
                                'Refused service because of gender, identity case, risk behaviors or other',
                                'Physical pain or mental distress',
                                'Other'
                            ],
                            editable: true,
                            required: true,
                        },



                        {
                            question_number: '19',
                            question: "Can you please provide some more details to assist our follow-up? ",
                            type: "text",
                            editable: true,
                        },
                        {
                            question_number: '20',
                            question: "Do you consent to having a trained staff member or volunteer contact you to help resolve this?  ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },
                        {
                            question_number: '21',
                            question: "Please provide your preferred mode of contact and details (Phone Number)",
                            type: "text",
                            editable: true,
                            required: true,
                        },
                    ]
                },

                // {
                //     question_number: '18a',
                //     question: " Stigma and discrimination (negative attitude towards you or treated you unfairly by health worker during your visit because of your identity as Key Population)",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18b',
                //     question: " Violence (such as verbal abuse, physical abuse, sexual abuse, negligence by staff or person at the health facility) ",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18c',
                //     question: " Harassment (including sexual) from the service staff or other clients ",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18d',
                //     question: "Breach of privacy (physical privacy maintained)",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18e',
                //     question: "Breach of confidentiality &nbsp;(was your information shared with others without your consent)",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18f',
                //     question: "Refused service because of gender, identity case, risk behaviors or other",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // // {
                // //     question_number: '18g',
                // //     question: "Refused service because of gender, identity case, risk behaviors or other",
                // //     type: "radio",
                // //     label: ['Yes', 'No'],
                // //     editable: true,
                // //     required: true,
                // // },
                // {
                //     question_number: '18g',
                //     question: "Physical pain or mental distress",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18h',
                //     question: "Other ",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                //     yesquestion: [
                //         {
                //             question_number: '18hh',
                //             question: "Specify",
                //             type: "text",
                //             editable: true,
                //             required: true,
                //         }
                //     ]
                // },




            ]
        },
        section4: {
            title: "Client Profile",
            questions: [
                {
                    question_number: '22',
                    question: " When did you last complete this form?",
                    type: "radio",
                    label: ['Never', 'Less than 6 months ago', 'More than 6 months ago'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '23',
                    question: "What is your age? ",
                    type: "text",
                    editable: true,
                    required: true,
                },
                {
                    question_number: '24',
                    question: "What is your gender?",
                    type: "multiple-select",
                    options: [
                        'Man',
                        'Woman',
                        'Transgender Man',
                        'Transgender Woman',
                        'Others',
                        'Do not want to disclose',
                    ],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '25',
                    question: "Please select any Key Population identity you belong to (you may select more than 1):",
                    type: "multiple-select",
                    options: [
                        'Men who have sex with men',
                        'Sex worker',
                        'Transgender person',
                        'People who use drugs and alcohol',
                        'People living with HIV',
                        'Do not want to disclose'
                    ],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '26',
                    question: " What was the best part of your experience(s) at this health facility while availing service?",
                    type: "text",
                    editable: true,
                    required: true,

                },
                {
                    question_number: '27',
                    question: "Do you have any advice, recommendations or requests for this service?",
                    type: "text",
                    editable: true,
                    required: true,

                },

            ]
        }
    },


    chithuen_phendhey: {

        section1: {
            title: "HIV/ Health Service and Visit Date ",
            questions: [
                {
                    question_number: '1',
                    question: "Today's Date",
                    type: "date",
                    default: getToday(),
                    editable: false,
                    required: true,
                },
                {
                    question_number: '2',
                    question: " Date of Clinic Visit",
                    type: "date",
                    editable: true,
                    required: true,
                },
                {
                    question_number: '3',
                    question: "Location of the facility (Dzongkhag) ",
                    type: "select",
                    options: [],
                    required: true,
                },
                {
                    question_number: '4',
                    question: "Region",
                    type: "text",
                    editable: false,
                    required: true,
                },
                {
                    question_number: '5',
                    question: " Facility Name",
                    type: "select",
                    options: [],
                    required: true,
                }
            ]

        },
        section2: {
            title: "Feedback on the service [Tick each option] ",
            questions: [

                {
                    question_number: '6a',
                    question: "Condom supply sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6aa',
                            question: "Condom supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        }
                    ],
                },
                {
                    question_number: '6b',
                    question: "Lubricant supply sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6bb',
                            question: "Lubricant supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        }
                    ],
                },
                {
                    question_number: "6c",
                    question: "PrEP initiation sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: "6cc",
                            question: "PrEP initiation supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        },
                    ],
                },
                {
                    question_number: "6d",
                    question: "PrEP refill sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    required: true,
                    editable: true,
                    yesquestion: [
                        {
                            question_number: "6dd",
                            question: "PrEP refill supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        },
                    ],
                },
                {
                    question_number: '6e',
                    question: "HIV Testing sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ee',
                            question: "HIV Testing received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        },

                    ],
                },

                {
                    question_number: '6f',
                    question: " HIV Confirmation Test sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ff',
                            question: "HIV Confirmation Test received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6g',
                    question: " HIV counseling sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6gg',
                            question: " HIV counseling received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6h',
                    question: "STI testing/diagnosis sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6hh',
                            question: " STI testing/diagnosis received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6i',
                    question: " Antiretroviral therapy(ART) Initiation sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ii',
                            question: " Antiretroviral therapy(ART) Initiation received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6j',
                    question: "  Antiretroviral therapy (ART) Counselling Sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6jj',
                            question: " Antiretroviral therapy (ART) counselling received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6k',
                    question: "Antiretroviral therapy (ART) Refill sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6kk',
                            question: " Antiretroviral therapy (ART) refill received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6l',
                    question: "Other STI Treatment sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ll',
                            question: " Other STI Treatment received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6m',
                    question: "Viral Load Testing sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6mm',
                            question: "Viral Load Testing received ?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6n',
                    question: "CD4 Testing Sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6nn',
                            question: "CD4 Testing receive?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6o',
                    question: "Opportunistic infection management and medicine sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6oo',
                            question: "Opportunistic infection management and medicine received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6p',
                    question: "Detoxification for drugs and alcohol sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6pp',
                            question: " Detoxification for drugs and alcohol received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6q',
                    question: "Rehabilatition services for drugs and alcohol sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6qq',
                            question: "Rehabilatition services for drugs and alcohol received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6r',
                    question: "Hospital based SUD treatment sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6rr',
                            question: "Hospital based SUD treatment received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6s',
                    question: " Other HIV services sought?  ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ss',
                            question: "Other HIV services received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                        {
                            question_number: '6sss',
                            question: "Please specify other HIV services",
                            type: "text",
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6t',
                    question: "TB Services Sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6tt',
                            question: "TB Services received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6u',
                    question: "Other Health conditions [Services sought]?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6uu',
                            question: "Other Health conditions [Services received]?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },
                        {
                            question_number: '6uuu',
                            question: "Please specify other health conditions services",
                            type: "text",
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '7',
                    question: "Was the service location safe for you",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '8',
                    question: "Was the location not very far or hard to travel to?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '9',
                    question: "Are the opening hours and days of operations okay for you?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '10a',
                    question: "Did you incur any out-of-pocket expense while availing the health services? (if yes - please look at questions 10b)",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '10b',
                            question: " What did you have to spend money on to receive the health services (i.e. travel, supplement medication, logistics)?",
                            type: "text",
                            editable: true,
                        }
                    ],
                },
                {
                    question_number: '10c',
                    question: "If yes, were you able to afford these services?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                },
                {
                    question_number: '11',
                    question: "Were you treated respectfully by the staff, regardless of your gender, sexual orientation, age or religion, HIV status, and Profession (applicable for SW only)?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '12',
                    question: " Did the staff/health care provider seek your consent for any procedures (examinations, tests, etc.)? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '13',
                    question: " Did you receive all the information you need?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '14',
                    question: "Were all your questions answered and clarified properly? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '15',
                    question: "Did you receive the items (medicine, condoms, information, lubricant, etc.) you need/require?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '16',
                    question: "How long did you have to wait to see the health care provider? (In Minutes) *",
                    type: "text",
                    editable: true,
                    required: true,
                },
                {
                    question_number: '17',
                    question: "Out of 5, how would you rate your satisfaction level? [Where 1 is for lowest and 5 is for highest satisfaction where 5= Very satisfied and 1= very dissatisfied]",
                    type: "radio",
                    label: ['1', '2', '3', '4', '5'],
                    editable: true,
                    required: true,
                },
            ]
        },
        section3: {
            title: "Section 3: Reports of any serious incidents experienced [Select all that apply]",
            questions: [

                {
                    question_number: '18',
                    question: "Did you experience any serious incidents (such as stigma, discrimination, violence, harassment, breach of privacy or confidentiality, refused services, etc) linked to your visit?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '18a',
                            question: "select which one you have faced ",
                            type: "multiple-select",
                            options: [

                                'Stigma and discrimination (negative attitude towards you or treated you unfairly by health worker during your visit because of your identity as Key Population',
                                'Violence (such as verbal abuse, physical abuse, sexual abuse, negligence by staff or person at the health facility)',
                                'Harassment (including sexual) from the service staff or other clients',
                                'Breach of privacy (physical privacy maintained)',
                                'Breach of confidentiality was your information shared with others without your consent)',
                                'Refused service because of gender, identity case, risk behaviors or other',
                                'Physical pain or mental distress',
                                'Other'
                            ],
                            editable: true,
                            required: true,
                        },



                        {
                            question_number: '19',
                            question: "Can you please provide some more details to assist our follow-up? ",
                            type: "text",
                            editable: true,
                        },
                        {
                            question_number: '20',
                            question: "Do you consent to having a trained staff member or volunteer contact you to help resolve this?  ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },
                        {
                            question_number: '21',
                            question: "Please provide your preferred mode of contact and details (Phone Number)",
                            type: "text",
                            editable: true,
                            required: true,
                        },
                    ]
                },

                // {
                //     question_number: '18a',
                //     question: " Stigma and discrimination (negative attitude towards you or treated you unfairly by health worker during your visit because of your identity as Key Population)",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18b',
                //     question: " Violence (such as verbal abuse, physical abuse, sexual abuse, negligence by staff or person at the health facility) ",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18c',
                //     question: " Harassment (including sexual) from the service staff or other clients ",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18d',
                //     question: "Breach of privacy (physical privacy maintained)",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18e',
                //     question: "Breach of confidentiality &nbsp;(was your information shared with others without your consent)",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18f',
                //     question: "Refused service because of gender, identity case, risk behaviors or other",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // // {
                // //     question_number: '18g',
                // //     question: "Refused service because of gender, identity case, risk behaviors or other",
                // //     type: "radio",
                // //     label: ['Yes', 'No'],
                // //     editable: true,
                // //     required: true,
                // // },
                // {
                //     question_number: '18g',
                //     question: "Physical pain or mental distress",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18h',
                //     question: "Other ",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                //     yesquestion: [
                //         {
                //             question_number: '18hh',
                //             question: "Specify",
                //             type: "text",
                //             editable: true,
                //             required: true,
                //         }
                //     ]
                // },




            ]
        },
        section4: {
            title: "Client Profile",
            questions: [
                {
                    question_number: '22',
                    question: " When did you last complete this form?",
                    type: "radio",
                    label: ['Never', 'Less than 6 months ago', 'More than 6 months ago'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '23',
                    question: "What is your age? ",
                    type: "text",
                    editable: true,
                    required: true,
                },
                {
                    question_number: '24',
                    question: "What is your gender?",
                    type: "multiple-select",
                    options: [
                        'Man',
                        'Woman',
                        'Transgender Man',
                        'Transgender Woman',
                        'Others',
                        'Do not want to disclose',
                    ],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '25',
                    question: "Please select any Key Population identity you belong to (you may select more than 1):",
                    type: "multiple-select",
                    options: [
                        'Men who have sex with men',
                        'Sex worker',
                        'Transgender person',
                        'People who use drugs and alcohol',
                        'People living with HIV',
                        'Do not want to disclose'
                    ],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '26',
                    question: " What was the best part of your experience(s) at this health facility while availing service?",
                    type: "text",
                    editable: true,
                    required: true,

                },
                {
                    question_number: '27',
                    question: "Do you have any advice, recommendations or requests for this service?",
                    type: "text",
                    editable: true,
                    required: true,

                },

            ]
        }


    },
    red_purse_network: {
        section1: {
            title: "HIV/ Health Service and Visit Date ",
            questions: [
                {
                    question_number: '1',
                    question: "Today's Date",
                    type: "date",
                    default: getToday(),
                    editable: false,
                    required: true,
                },
                {
                    question_number: '2',
                    question: " Date of Clinic Visit",
                    type: "date",
                    editable: true,
                    required: true,
                },
                {
                    question_number: '3',
                    question: "Location of the facility (Dzongkhag) ",
                    type: "select",
                    options: [],
                    required: true,
                },
                {
                    question_number: '4',
                    question: "Region",
                    type: "text",
                    editable: false,
                    required: true,
                },
                {
                    question_number: '5',
                    question: " Facility Name",
                    type: "select",
                    options: [],
                    required: true,
                }
            ]

        },
        section2: {
            title: "Feedback on the service [Tick each option] ",
            questions: [

                {
                    question_number: '6a',
                    question: "Condom supply sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6aa',
                            question: "Condom supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        }
                    ],
                },
                {
                    question_number: '6b',
                    question: "Lubricant supply sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6bb',
                            question: "Lubricant supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        }
                    ],
                },
                {
                    question_number: "6c",
                    question: "PrEP initiation sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: "6cc",
                            question: "PrEP initiation supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        },
                    ],
                },
                {
                    question_number: "6d",
                    question: "PrEP refill sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    required: true,
                    editable: true,
                    yesquestion: [
                        {
                            question_number: "6dd",
                            question: "PrEP refill supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        },
                    ],
                },
                {
                    question_number: '6e',
                    question: "HIV Testing sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ee',
                            question: "HIV Testing received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        },

                    ],
                },

                {
                    question_number: '6f',
                    question: " HIV Confirmation Test sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ff',
                            question: "HIV Confirmation Test received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6g',
                    question: " HIV counseling sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6gg',
                            question: " HIV counseling received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6h',
                    question: "STI testing/diagnosis sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6hh',
                            question: " STI testing/diagnosis received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6i',
                    question: " Antiretroviral therapy(ART) Initiation sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ii',
                            question: " Antiretroviral therapy(ART) Initiation received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6j',
                    question: "  Antiretroviral therapy (ART) Counselling Sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6jj',
                            question: " Antiretroviral therapy (ART) counselling received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6k',
                    question: "Antiretroviral therapy (ART) Refill sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6kk',
                            question: " Antiretroviral therapy (ART) refill received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6l',
                    question: "Other STI Treatment sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ll',
                            question: " Other STI Treatment received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6m',
                    question: "Viral Load Testing sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6mm',
                            question: "Viral Load Testing received ?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6n',
                    question: "CD4 Testing Sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6nn',
                            question: "CD4 Testing receive?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6o',
                    question: "Opportunistic infection management and medicine sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6oo',
                            question: "Opportunistic infection management and medicine received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6p',
                    question: "Detoxification for drugs and alcohol sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6pp',
                            question: " Detoxification for drugs and alcohol received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6q',
                    question: "Rehabilatition services for drugs and alcohol sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6qq',
                            question: "Rehabilatition services for drugs and alcohol received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6r',
                    question: "Hospital based SUD treatment sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6rr',
                            question: "Hospital based SUD treatment received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6s',
                    question: " Other HIV services sought?  ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ss',
                            question: "Other HIV services received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                        {
                            question_number: '6sss',
                            question: "Please specify other HIV services",
                            type: "text",
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6t',
                    question: "TB Services Sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6tt',
                            question: "TB Services received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6u',
                    question: "Other Health conditions [Services sought]?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6uu',
                            question: "Other Health conditions [Services received]?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },
                        {
                            question_number: '6uuu',
                            question: "Please specify other health conditions services",
                            type: "text",
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '7',
                    question: "Was the service location safe for you",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '8',
                    question: "Was the location not very far or hard to travel to?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '9',
                    question: "Are the opening hours and days of operations okay for you?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '10a',
                    question: "Did you incur any out-of-pocket expense while availing the health services? (if yes - please look at questions 10b)",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '10b',
                            question: " What did you have to spend money on to receive the health services (i.e. travel, supplement medication, logistics)?",
                            type: "text",
                            editable: true,
                        }
                    ],
                },
                {
                    question_number: '10c',
                    question: "If yes, were you able to afford these services?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                },
                {
                    question_number: '11',
                    question: "Were you treated respectfully by the staff, regardless of your gender, sexual orientation, age or religion, HIV status, and Profession (applicable for SW only)?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '12',
                    question: " Did the staff/health care provider seek your consent for any procedures (examinations, tests, etc.)? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '13',
                    question: " Did you receive all the information you need?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '14',
                    question: "Were all your questions answered and clarified properly? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '15',
                    question: "Did you receive the items (medicine, condoms, information, lubricant, etc.) you need/require?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '16',
                    question: "How long did you have to wait to see the health care provider? (In Minutes) *",
                    type: "text",
                    editable: true,
                    required: true,
                },
                {
                    question_number: '17',
                    question: "Out of 5, how would you rate your satisfaction level? [Where 1 is for lowest and 5 is for highest satisfaction where 5= Very satisfied and 1= very dissatisfied]",
                    type: "radio",
                    label: ['1', '2', '3', '4', '5'],
                    editable: true,
                    required: true,
                },
            ]
        },
        section3: {
            title: "Section 3: Reports of any serious incidents experienced [Select all that apply]",
            questions: [

                {
                    question_number: '18',
                    question: "Did you experience any serious incidents (such as stigma, discrimination, violence, harassment, breach of privacy or confidentiality, refused services, etc) linked to your visit?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '18a',
                            question: "select which one you have faced ",
                            type: "multiple-select",
                            options: [

                                'Stigma and discrimination (negative attitude towards you or treated you unfairly by health worker during your visit because of your identity as Key Population',
                                'Violence (such as verbal abuse, physical abuse, sexual abuse, negligence by staff or person at the health facility)',
                                'Harassment (including sexual) from the service staff or other clients',
                                'Breach of privacy (physical privacy maintained)',
                                'Breach of confidentiality was your information shared with others without your consent)',
                                'Refused service because of gender, identity case, risk behaviors or other',
                                'Physical pain or mental distress',
                                'Other'
                            ],
                            editable: true,
                            required: true,
                        },



                        {
                            question_number: '19',
                            question: "Can you please provide some more details to assist our follow-up? ",
                            type: "text",
                            editable: true,
                        },
                        {
                            question_number: '20',
                            question: "Do you consent to having a trained staff member or volunteer contact you to help resolve this?  ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },
                        {
                            question_number: '21',
                            question: "Please provide your preferred mode of contact and details (Phone Number)",
                            type: "text",
                            editable: true,
                            required: true,
                        },
                    ]
                },

                // {
                //     question_number: '18a',
                //     question: " Stigma and discrimination (negative attitude towards you or treated you unfairly by health worker during your visit because of your identity as Key Population)",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18b',
                //     question: " Violence (such as verbal abuse, physical abuse, sexual abuse, negligence by staff or person at the health facility) ",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18c',
                //     question: " Harassment (including sexual) from the service staff or other clients ",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18d',
                //     question: "Breach of privacy (physical privacy maintained)",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18e',
                //     question: "Breach of confidentiality &nbsp;(was your information shared with others without your consent)",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18f',
                //     question: "Refused service because of gender, identity case, risk behaviors or other",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // // {
                // //     question_number: '18g',
                // //     question: "Refused service because of gender, identity case, risk behaviors or other",
                // //     type: "radio",
                // //     label: ['Yes', 'No'],
                // //     editable: true,
                // //     required: true,
                // // },
                // {
                //     question_number: '18g',
                //     question: "Physical pain or mental distress",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18h',
                //     question: "Other ",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                //     yesquestion: [
                //         {
                //             question_number: '18hh',
                //             question: "Specify",
                //             type: "text",
                //             editable: true,
                //             required: true,
                //         }
                //     ]
                // },




            ]
        },
        section4: {
            title: "Client Profile",
            questions: [
                {
                    question_number: '22',
                    question: " When did you last complete this form?",
                    type: "radio",
                    label: ['Never', 'Less than 6 months ago', 'More than 6 months ago'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '23',
                    question: "What is your age? ",
                    type: "text",
                    editable: true,
                    required: true,
                },
                {
                    question_number: '24',
                    question: "What is your gender?",
                    type: "multiple-select",
                    options: [
                        'Man',
                        'Woman',
                        'Transgender Man',
                        'Transgender Woman',
                        'Others',
                        'Do not want to disclose',
                    ],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '25',
                    question: "Please select any Key Population identity you belong to (you may select more than 1):",
                    type: "multiple-select",
                    options: [
                        'Men who have sex with men',
                        'Sex worker',
                        'Transgender person',
                        'People who use drugs and alcohol',
                        'People living with HIV',
                        'Do not want to disclose'
                    ],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '26',
                    question: " What was the best part of your experience(s) at this health facility while availing service?",
                    type: "text",
                    editable: true,
                    required: true,

                },
                {
                    question_number: '27',
                    question: "Do you have any advice, recommendations or requests for this service?",
                    type: "text",
                    editable: true,
                    required: true,

                },

            ]
        }
    },

    others: {

        section1: {
            title: "HIV/ Health Service and Visit Date ",
            questions: [
                {
                    question_number: '1',
                    question: "Today's Date",
                    type: "date",
                    default: getToday(),
                    editable: false,
                    required: true,
                },
                {
                    question_number: '2',
                    question: " Date of Clinic Visit",
                    type: "date",
                    editable: true,
                    required: true,
                },
                {
                    question_number: '3',
                    question: "Location of the facility (Dzongkhag) ",
                    type: "select",
                    options: [],
                    required: true,
                },
                {
                    question_number: '4',
                    question: "Region",
                    type: "text",
                    editable: false,
                    required: true,
                },
                {
                    question_number: '5',
                    question: " Facility Name",
                    type: "select",
                    options: [],
                    required: true,
                }
            ]

        },
        section2: {
            title: "Feedback on the service [Tick each option] ",
            questions: [

                {
                    question_number: '6a',
                    question: "Condom supply sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6aa',
                            question: "Condom supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        }
                    ],
                },
                {
                    question_number: '6b',
                    question: "Lubricant supply sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6bb',
                            question: "Lubricant supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        }
                    ],
                },
                {
                    question_number: "6c",
                    question: "PrEP initiation sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: "6cc",
                            question: "PrEP initiation supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        },
                    ],
                },
                {
                    question_number: "6d",
                    question: "PrEP refill sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    required: true,
                    editable: true,
                    yesquestion: [
                        {
                            question_number: "6dd",
                            question: "PrEP refill supply received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        },
                    ],
                },
                {
                    question_number: '6e',
                    question: "HIV Testing sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ee',
                            question: "HIV Testing received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            required: true,
                            editable: true,
                        },

                    ],
                },

                {
                    question_number: '6f',
                    question: " HIV Confirmation Test sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ff',
                            question: "HIV Confirmation Test received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6g',
                    question: " HIV counseling sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6gg',
                            question: " HIV counseling received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6h',
                    question: "STI testing/diagnosis sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6hh',
                            question: " STI testing/diagnosis received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6i',
                    question: " Antiretroviral therapy(ART) Initiation sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ii',
                            question: " Antiretroviral therapy(ART) Initiation received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6j',
                    question: "  Antiretroviral therapy (ART) Counselling Sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6jj',
                            question: " Antiretroviral therapy (ART) counselling received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6k',
                    question: "Antiretroviral therapy (ART) Refill sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6kk',
                            question: " Antiretroviral therapy (ART) refill received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6l',
                    question: "Other STI Treatment sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ll',
                            question: " Other STI Treatment received? ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6m',
                    question: "Viral Load Testing sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6mm',
                            question: "Viral Load Testing received ?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6n',
                    question: "CD4 Testing Sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6nn',
                            question: "CD4 Testing receive?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6o',
                    question: "Opportunistic infection management and medicine sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6oo',
                            question: "Opportunistic infection management and medicine received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6p',
                    question: "Detoxification for drugs and alcohol sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6pp',
                            question: " Detoxification for drugs and alcohol received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6q',
                    question: "Rehabilatition services for drugs and alcohol sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6qq',
                            question: "Rehabilatition services for drugs and alcohol received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6r',
                    question: "Hospital based SUD treatment sought? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6rr',
                            question: "Hospital based SUD treatment received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6s',
                    question: " Other HIV services sought?  ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6ss',
                            question: "Other HIV services received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                        {
                            question_number: '6sss',
                            question: "Please specify other HIV services",
                            type: "text",
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6t',
                    question: "TB Services Sought?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6tt',
                            question: "TB Services received?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '6u',
                    question: "Other Health conditions [Services sought]?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '6uu',
                            question: "Other Health conditions [Services received]?",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },
                        {
                            question_number: '6uuu',
                            question: "Please specify other health conditions services",
                            type: "text",
                            editable: true,
                            required: true,
                        },

                    ],
                },
                {
                    question_number: '7',
                    question: "Was the service location safe for you",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '8',
                    question: "Was the location not very far or hard to travel to?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '9',
                    question: "Are the opening hours and days of operations okay for you?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '10a',
                    question: "Did you incur any out-of-pocket expense while availing the health services? (if yes - please look at questions 10b)",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '10b',
                            question: " What did you have to spend money on to receive the health services (i.e. travel, supplement medication, logistics)?",
                            type: "text",
                            editable: true,
                        }
                    ],
                },
                {
                    question_number: '10c',
                    question: "If yes, were you able to afford these services?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                },
                {
                    question_number: '11',
                    question: "Were you treated respectfully by the staff, regardless of your gender, sexual orientation, age or religion, HIV status, and Profession (applicable for SW only)?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '12',
                    question: " Did the staff/health care provider seek your consent for any procedures (examinations, tests, etc.)? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '13',
                    question: " Did you receive all the information you need?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '14',
                    question: "Were all your questions answered and clarified properly? ",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '15',
                    question: "Did you receive the items (medicine, condoms, information, lubricant, etc.) you need/require?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '16',
                    question: "How long did you have to wait to see the health care provider? (In Minutes) *",
                    type: "text",
                    editable: true,
                    required: true,
                },
                {
                    question_number: '17',
                    question: "Out of 5, how would you rate your satisfaction level? [Where 1 is for lowest and 5 is for highest satisfaction where 5= Very satisfied and 1= very dissatisfied]",
                    type: "radio",
                    label: ['1', '2', '3', '4', '5'],
                    editable: true,
                    required: true,
                },
            ]
        },
        section3: {
            title: "Section 3: Reports of any serious incidents experienced [Select all that apply]",
            questions: [

                {
                    question_number: '18',
                    question: "Did you experience any serious incidents (such as stigma, discrimination, violence, harassment, breach of privacy or confidentiality, refused services, etc) linked to your visit?",
                    type: "radio",
                    label: ['Yes', 'No'],
                    editable: true,
                    required: true,
                    yesquestion: [
                        {
                            question_number: '18a',
                            question: "select which one you have faced ",
                            type: "multiple-select",
                            options: [

                                'Stigma and discrimination (negative attitude towards you or treated you unfairly by health worker during your visit because of your identity as Key Population',
                                'Violence (such as verbal abuse, physical abuse, sexual abuse, negligence by staff or person at the health facility)',
                                'Harassment (including sexual) from the service staff or other clients',
                                'Breach of privacy (physical privacy maintained)',
                                'Breach of confidentiality was your information shared with others without your consent)',
                                'Refused service because of gender, identity case, risk behaviors or other',
                                'Physical pain or mental distress',
                                'Other'
                            ],
                            editable: true,
                            required: true,
                        },



                        {
                            question_number: '19',
                            question: "Can you please provide some more details to assist our follow-up? ",
                            type: "text",
                            editable: true,
                        },
                        {
                            question_number: '20',
                            question: "Do you consent to having a trained staff member or volunteer contact you to help resolve this?  ",
                            type: "radio",
                            label: ['Yes', 'No'],
                            editable: true,
                            required: true,
                        },
                        {
                            question_number: '21',
                            question: "Please provide your preferred mode of contact and details (Phone Number)",
                            type: "text",
                            editable: true,
                            required: true,
                        },
                    ]
                },

                // {
                //     question_number: '18a',
                //     question: " Stigma and discrimination (negative attitude towards you or treated you unfairly by health worker during your visit because of your identity as Key Population)",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18b',
                //     question: " Violence (such as verbal abuse, physical abuse, sexual abuse, negligence by staff or person at the health facility) ",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18c',
                //     question: " Harassment (including sexual) from the service staff or other clients ",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18d',
                //     question: "Breach of privacy (physical privacy maintained)",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18e',
                //     question: "Breach of confidentiality &nbsp;(was your information shared with others without your consent)",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18f',
                //     question: "Refused service because of gender, identity case, risk behaviors or other",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // // {
                // //     question_number: '18g',
                // //     question: "Refused service because of gender, identity case, risk behaviors or other",
                // //     type: "radio",
                // //     label: ['Yes', 'No'],
                // //     editable: true,
                // //     required: true,
                // // },
                // {
                //     question_number: '18g',
                //     question: "Physical pain or mental distress",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                // },
                // {
                //     question_number: '18h',
                //     question: "Other ",
                //     type: "radio",
                //     label: ['Yes', 'No'],
                //     editable: true,
                //     required: true,
                //     yesquestion: [
                //         {
                //             question_number: '18hh',
                //             question: "Specify",
                //             type: "text",
                //             editable: true,
                //             required: true,
                //         }
                //     ]
                // },




            ]
        },
        section4: {
            title: "Client Profile",
            questions: [
                {
                    question_number: '22',
                    question: " When did you last complete this form?",
                    type: "radio",
                    label: ['Never', 'Less than 6 months ago', 'More than 6 months ago'],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '23',
                    question: "What is your age? ",
                    type: "text",
                    editable: true,
                    required: true,
                },
                {
                    question_number: '24',
                    question: "What is your gender?",
                    type: "multiple-select",
                    options: [
                        'Man',
                        'Woman',
                        'Transgender Man',
                        'Transgender Woman',
                        'Others',
                        'Do not want to disclose',
                    ],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '25',
                    question: "Please select any Key Population identity you belong to (you may select more than 1):",
                    type: "multiple-select",
                    options: [
                        'Men who have sex with men',
                        'Sex worker',
                        'Transgender person',
                        'People who use drugs and alcohol',
                        'People living with HIV',
                        'Do not want to disclose'
                    ],
                    editable: true,
                    required: true,
                },
                {
                    question_number: '26',
                    question: " What was the best part of your experience(s) at this health facility while availing service?",
                    type: "text",
                    editable: true,
                    required: true,

                },
                {
                    question_number: '27',
                    question: "Do you have any advice, recommendations or requests for this service?",
                    type: "text",
                    editable: true,
                    required: true,

                },

            ]
        }
    }
}
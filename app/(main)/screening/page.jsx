'use client'
import { useSearchParams } from 'next/navigation';
import { questions } from "../../utils/questions.ts"
import { useEffect, useState } from 'react';
import { useThemeStore } from "../../store/themeStore.ts";
import { supabase } from '../../../lib/supabaseClinent.ts'; // Make sure the import path is correct
import React, { Suspense } from "react";


const FacilityVisitPopup = ({ isVisible, onYes, onNo, isDarkMode }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-4">
            <div className={`p-8 rounded-xl border shadow-2xl max-w-md w-full relative overflow-hidden ${isDarkMode
                ? "bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700 backdrop-blur-sm"
                : "bg-gradient-to-br from-amber-50/90 to-orange-50/90 border-orange-200 backdrop-blur-sm"
                }`}>
                <div className="relative z-10">
                    <h4 className={`text-2xl font-bold text-transparent bg-clip-text mb-4 text-center ${isDarkMode
                        ? "bg-gradient-to-r from-cyan-400 to-blue-400"
                        : "bg-gradient-to-r from-amber-600 to-orange-600"
                        }`}>
                        Have you visited a facility in the past 6 months?
                    </h4>
                    <p className={`mb-6 text-center ${isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}>
                        Please confirm to proceed with the questionnaire.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={onYes}
                            className={`text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-lg ${isDarkMode
                                ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 hover:shadow-cyan-500/30"
                                : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 hover:shadow-orange-500/30"
                                }`}
                        >
                            Yes
                        </button>
                        <button
                            onClick={onNo}
                            className={`font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-lg ${isDarkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:shadow-gray-700/30"
                                : "bg-orange-100 text-orange-700 hover:bg-orange-200 hover:shadow-orange-200/30"
                                }`}
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ScreeningForm />
        </Suspense>
    );
};

function ScreeningForm() {
    'use client';
    const searchParams = useSearchParams();
    const networkParam = searchParams.get('network');
    const { isDarkMode } = useThemeStore();

    const [formData, setFormData] = useState({});
    const [conditionalQuestions, setConditionalQuestions] = useState({});
    const [showFacilityPopup, setShowFacilityPopup] = useState(false);
    const [hasVisitedFacility, setHasVisitedFacility] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [validationErrors, setValidationErrors] = useState({});

    const [facilityOptions, setFacilityOptions] = useState([]);
    const [facilityMap, setFacilityMap] = useState({});
    const [dzongkhagFacilities, setDzongkhagFacilities] = useState({});
    const [dzongkhagRegion, setDzongkhagRegion] = useState({});
    const [isLoading, setIsLoading] = useState(false)


    // // Fetch facility names and mapping on mount
    // useEffect(() => {
    //     async function fetchFacilities() {
    //         const { data, error } = await supabase
    //             .from('facility_name')
    //             .select(`
    //             id, name,
    //             facility_location (
    //                 id, name,
    //                 region:region_id (
    //                     id, name
    //                 )
    //             )
    //         `);

    //         if (data) {
    //             console.log(data);

    //             setFacilityOptions(data.map(f => ({ id: f.id, name: f.name })));
    //             const map = {};
    //             data.forEach(f => {
    //                 map[f.id] = {
    //                     location: f.facility_location?.name || '',
    //                     region: f.facility_location?.region?.name || ''
    //                 };
    //             });
    //             setFacilityMap(map);
    //             console.log(facilityMap);

    //         }
    //     }
    //     fetchFacilities();

    // }, []);




    // useEffect(() => {
    //     async function fetchFacilities() {
    //         const { data, error } = await supabase
    //             .from('facility_name')
    //             .select(`
    //             id, name,
    //             facility_location (
    //                 id, name,
    //                 region:region_id (
    //                     id, name
    //                 )
    //             )
    //         `);

    //         if (data) {
    //             setFacilityOptions(data.map(f => ({ id: f.id, name: f.name })));
    //             const map = {};
    //             const dzkFacilities = {};
    //             const dzkRegion = {};
    //             data.forEach(f => {
    //                 const dzongkhag = f.facility_location?.name || '';
    //                 const region = f.facility_location?.region?.name || '';
    //                 map[f.id] = { location: dzongkhag, region };
    //                 // Build Dzongkhag → Facilities
    //                 if (dzongkhag) {
    //                     if (!dzkFacilities[dzongkhag]) dzkFacilities[dzongkhag] = [];
    //                     dzkFacilities[dzongkhag].push({ id: f.id, name: f.name });
    //                     dzkRegion[dzongkhag] = region;
    //                 }
    //             });
    //             setFacilityMap(map);
    //             setDzongkhagFacilities(dzkFacilities);
    //             setDzongkhagRegion(dzkRegion);
    //         }
    //     }
    //     fetchFacilities();
    // }, []);
useEffect(() => {
    async function fetchFacilities() {
        const { data, error } = await supabase
            .from('facility_name')
            .select(`
                id, 
                name, 
                service_facility(name),
                facility_location (
                    id, 
                    name,
                    region:region_id (
                        id, 
                        name
                    )
                )
            `);

        if (error) {
            console.error("Error fetching facilities:", error);
            return;
        }

        if (data) {
            // Map for dropdown: "Facility Name + Service Type"
            setFacilityOptions(
                data.map(f => ({
                    id: f.id,
                    name: `${f.name} ${f.service_facility?.name || ""}`.trim()
                }))
            );

            const dzkFacilities = {};
            const dzkRegion = {};

            data.forEach(f => {
                const dzongkhag = f.facility_location?.name || '';
                const region = f.facility_location?.region?.name || '';

                if (dzongkhag) {
                    if (!dzkFacilities[dzongkhag]) dzkFacilities[dzongkhag] = [];

                    // Combine Facility Name + Service Type
                    const displayName = `${f.name} ${f.service_facility?.name || ""}`.trim();

                    dzkFacilities[dzongkhag].push({ id: f.id, name: displayName });
                    dzkRegion[dzongkhag] = region;
                }
            });

            setDzongkhagFacilities(dzkFacilities);
            setDzongkhagRegion(dzkRegion);
        }
    }

    fetchFacilities();
}, []);



    useEffect(() => {
        if (networkParam && questions[networkParam]) {
            const networkQuestions = questions[networkParam];
            const initialData = {};
            Object.keys(networkQuestions).forEach(sectionKey => {
                networkQuestions[sectionKey].questions.forEach(question => {
                    if (question.default) {
                        initialData[question.question_number] = question.default;
                    }
                });
            });
            setFormData(initialData);
            setShowFacilityPopup(true);
        }
    }, [networkParam]);

    const handleInputChange = (questionNumber, value, hasYesQuestions = false) => {
        setFormData(prev => {
            let updated = { ...prev, [questionNumber]: value };
            // If Facility Name (Q5) changes, set Dzongkhag (Q3) and Region (Q4)
            if (questionNumber === '5' && facilityMap[value]) {
                updated['3'] = facilityMap[value].location;
                updated['4'] = facilityMap[value].region;
            }
            return updated;
        });

        // Clear validation error when user inputs data
        if (validationErrors[questionNumber]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[questionNumber];
                return newErrors;
            });
        }

        if (hasYesQuestions) {
            setConditionalQuestions(prev => ({
                ...prev,
                [questionNumber]: value === 'Yes'
            }));
        }
    };

    const handleFacilityVisitYes = () => {
        setHasVisitedFacility(true);
        setShowFacilityPopup(false);
    };

    const handleFacilityVisitNo = () => {
        setHasVisitedFacility(false);
        setShowFacilityPopup(false);
        alert("Thank you for your response. This questionnaire is only for those who have visited a facility in the past 6 months.");
        window.location.href = "/";
    };

    // Get sections for current network
    // const getCurrentSections = () => {
    //     if (!networkParam || !questions[networkParam]) return [];
    //     return Object.keys(questions[networkParam]).map(sectionKey => ({
    //         key: sectionKey,
    //         ...questions[networkParam][sectionKey]
    //     }));
    // };


    const getCurrentSections = () => {
        if (!networkParam || !questions[networkParam]) return [];

        const networkQuestions = questions[networkParam];

        // Get all sections as before
        const sections = Object.keys(networkQuestions).map(sectionKey => ({
            key: sectionKey,
            ...networkQuestions[sectionKey]
        }));

        // Find Section 2 and split its questions
        const section2 = sections.find(s => s.key === 'section2');
        if (!section2) return sections;

        // Split Q6a–6s and Q7–Q17
        const q6EndIndex = section2.questions.findIndex(q => q.question_number === '6u');
        const q17Index = section2.questions.findIndex(q => q.question_number === '17');

        // Defensive: If not found, fallback to original
        if (q6EndIndex === -1 || q17Index === -1) return sections;

        // Create two "virtual" sections for Section 2
        const section2a = {
            ...section2,
            title: section2.title + " (Part 1)",
            questions: section2.questions.slice(0, q6EndIndex + 1)
        };
        const section2b = {
            ...section2,
            title: section2.title + " (Part 2)",
            questions: section2.questions.slice(q6EndIndex + 1, q17Index + 1)
        };

        // Rebuild the sections array:
        // [section1, section2a, section2b, section3, section4]
        const newSections = [];
        for (const s of sections) {
            if (s.key === 'section2') {
                newSections.push(section2a, section2b);
            } else {
                newSections.push(s);
            }
        }
        return newSections;
    };

    // Validate current page
    const validateCurrentPage = () => {
        const sections = getCurrentSections();
        if (sections.length === 0) return true;

        const currentSection = sections[currentPage - 1];
        if (!currentSection) return true;

        const errors = {};
        let isValid = true;

        currentSection.questions.forEach(question => {
            if (question.required) {
                const value = formData[question.question_number];

                // Check if question has a value
                if (!value || (Array.isArray(value) && value.length === 0) || value === '') {
                    errors[question.question_number] = 'This field is required';
                    isValid = false;
                }
            }

            // Check conditional yes questions
            if (question.yesquestion && conditionalQuestions[question.question_number]) {
                question.yesquestion.forEach(yesQ => {
                    if (yesQ.required) {
                        const yesValue = formData[yesQ.question_number];
                        if (!yesValue || yesValue === '') {
                            errors[yesQ.question_number] = 'This field is required';
                            isValid = false;
                        }
                    }
                    if (['21'].includes(yesQ.question_number)) {
                        const yesValue = formData[yesQ.question_number];
                        if (yesValue && !/^\d+$/.test(yesValue)) {
                            errors[yesQ.question_number] = 'Please enter a valid number';
                            isValid = false;
                        }
                    }
                });
            }
        });

        setValidationErrors(errors);
        return isValid;
    };

    const handleNextPage = () => {
        if (validateCurrentPage()) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async () => {
        if (validateCurrentPage()) {
            setIsLoading(true);
            // Prepare the data
            const submission = {
                network: networkParam,
                answers: formData
            };

            // Insert into Supabase
            const { data, error } = await supabase
                .from('Submission')
                .insert([submission]);

            if (error) {
                alert('Submission failed: ' + error.message);
                return;
            }

            // --- NEW FEATURE: Send email if Q18 is "Yes" ---
            if (formData['18'] === 'Yes') {
                // Fetch admin emails
                const { data: adminProfiles } = await supabase
                    .from('Profile')
                    .select('email')
                    .eq('role', 'admin');

                    let sendEmailKpo;

                    if(networkParam === "pride_Bhutan"){
                        sendEmailKpo = "pride_bhutan"
                    } else {
                        sendEmailKpo = networkParam
                    }

                // Fetch KPO emails for the current network
                const { data: kpoProfiles } = await supabase
                    .from('Profile')
                    .select('email')
                    .eq('kpo_name', sendEmailKpo);

                // Combine emails, filter out any falsy values, and deduplicate
                const adminEmails = adminProfiles?.map(p => p.email).filter(Boolean) || [];
                const kpoEmails = kpoProfiles?.map(p => p.email).filter(Boolean) || [];
                const allEmails = Array.from(new Set([...adminEmails, ...kpoEmails]));

                if (allEmails.length > 0) {
                    try {
                        await fetch('/api/email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                toEmails: allEmails,
                                subject: "Serious Incident Alert Received",
                                body: `
Dear Team,<br><br>
A serious incident alert has been received and requires immediate attention. Please review the details in the incident tracking system and take necessary action as per the escalation protocol.<br><br>
Kindly acknowledge receipt and update the status at the earliest.<br><br>
Thank You<br>
DrukCLM Serious Incident Alert Team
                    `
                            })
                        });
                    } catch (mailError) {
                        console.error("Failed to send serious incident email:", mailError);
                    }
                }
            }
            // --- END FEATURE ---

            setFormData({ 1: new Date().toISOString().split('T')[0] });
            setConditionalQuestions({});
            setCurrentPage(1);
            setValidationErrors({});
            window.scrollTo(0, 0);
            setIsLoading(false);

            alert('Form submitted successfully!');
        }
    };

    const renderQuestion = (question) => {
        const { question_number, question: questionText, type, label, options, required, editable = true, yesquestion } = question;
        const value = formData[question_number] || (type === 'multiple-select' ? [] : '');
        const hasError = validationErrors[question_number];

        const baseClasses = `w-full p-3 border rounded focus:outline-none focus:ring-2 transition-colors duration-300 ${hasError ? 'border-red-500' : ''
            }`;
        const darkClasses = isDarkMode
            ? "bg-gray-900 border-cyan-700 text-cyan-100 focus:ring-cyan-400"
            : "bg-white border-purple-300 text-gray-900 focus:ring-purple-500";

        const disabledClasses = !editable
            ? (isDarkMode ? "bg-gray-900 cursor-not-allowed text-gray-500 border-gray-700" : "bg-gray-100 cursor-not-allowed text-gray-400 border-gray-200")
            : "";
        // if (question_number === '5') {
        //     return (
        //         <div key={question_number} className="mb-6">
        //             <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
        //                 {`${question_number}. ${questionText}`}
        //                 {required && <span className="text-red-500 ml-1">*</span>}
        //             </label>
        //             <select
        //                 value={formData['5'] || ''}
        //                 onChange={e => handleInputChange('5', e.target.value)}
        //                 className={`${baseClasses} ${darkClasses}`}
        //                 required={required}
        //             >
        //                 <option value="">Select Facility Name</option>
        //                 {facilityOptions.map(opt => (
        //                     <option key={opt.id} value={opt.id}>{opt.name}</option>
        //                 ))}
        //             </select>
        //             {hasError && <p className="text-red-500 text-sm mt-1">{hasError}</p>}
        //         </div>
        //     );
        // }

        // if (question_number === '3') {
        //     return (
        //         <div key={question_number} className="mb-6">
        //             <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
        //                 {`${question_number}. ${questionText}`}
        //                 {required && <span className="text-red-500 ml-1">*</span>}
        //             </label>
        //             <input
        //                 type="text"
        //                 value={formData['3'] || ''}
        //                 disabled
        //                 className={`${baseClasses} bg-gray-100 text-gray-700 cursor-not-allowed`}
        //                 required={required}
        //                 placeholder="Dzongkhag will be auto-filled"
        //             />
        //         </div>
        //     );
        // }

        // if (question_number === '4') {
        //     return (
        //         <div key={question_number} className="mb-6">
        //             <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
        //                 {`${question_number}. ${questionText}`}
        //                 {required && <span className="text-red-500 ml-1">*</span>}
        //             </label>
        //             <input
        //                 type="text"
        //                 value={formData['4'] || ''}
        //                 disabled
        //                 className={`${baseClasses} bg-gray-100 text-gray-700 cursor-not-allowed`}
        //                 required={required}
        //                 placeholder="Region will be auto-filled"
        //             />
        //         </div>
        //     );
        // }

        // Q3: Dzongkhag selection
        if (question_number === '3') {
            const dzongkhags = Object.keys(dzongkhagFacilities);
            return (
                <div key={question_number} className="mb-6">
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {`${question_number}. ${questionText}`}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <select
                        value={formData['3'] || ''}
                        onChange={e => {
                            handleInputChange('3', e.target.value);
                            // Auto-fill region and clear facility
                            setFormData(prev => ({
                                ...prev,
                                '3': e.target.value,
                                '4': dzongkhagRegion[e.target.value] || '',
                                '5': ''
                            }));
                        }}
                        className={`${baseClasses} ${darkClasses}`}
                        required={required}
                    >
                        <option value="">Select Dzongkhag</option>
                        {dzongkhags.map(dz => (
                            <option key={dz} value={dz}>{dz}</option>
                        ))}
                    </select>
                    {hasError && <p className="text-red-500 text-sm mt-1">{hasError}</p>}
                </div>
            );
        }

        // Q4: Region (auto-filled)
        if (question_number === '4') {
            return (
                <div key={question_number} className="mb-6">
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {`${question_number}. ${questionText}`}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                        type="text"
                        value={formData['4'] || ''}
                        disabled
                        className={`${baseClasses} bg-gray-100 text-gray-700 cursor-not-allowed`}
                        required={required}
                        placeholder="Region will be auto-filled"
                    />
                </div>
            );
        }

        // Q5: Facility Name (filtered by Dzongkhag)
        if (question_number === '5') {
            const dzongkhag = formData['3'];
            const facilities = dzongkhagFacilities[dzongkhag] || [];
            return (
                <div key={question_number} className="mb-6">
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {`${question_number}. ${questionText}`}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <select
                        value={formData['5'] || ''}
                        onChange={e => handleInputChange('5', e.target.value)}
                        className={`${baseClasses} ${darkClasses}`}
                        required={required}
                        disabled={!dzongkhag}
                    >
                        <option value="">Select Facility Name</option>
                        {facilities.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                        ))}
                    </select>
                    {hasError && <p className="text-red-500 text-sm mt-1">{hasError}</p>}
                </div>
            );
        }

        return (
            <div key={question_number} className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {`${question_number}. ${questionText}`}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {type === 'date' && (
                    <input
                        type="date"
                        value={value}
                        onChange={(e) => handleInputChange(question_number, e.target.value)}
                        disabled={!editable}
                        className={`${baseClasses} ${darkClasses} ${disabledClasses}`}
                        required={required}
                        max={question_number === '2' ? new Date().toISOString().split('T')[0] : undefined}

                    />
                )}

                {type === 'text' && (
                    <input
                        type={['16', '23'].includes(question_number) ? 'number' : 'text'}
                        value={value}
                        onChange={(e) => {
                            if (['16', '23'].includes(question_number)) {
                                const val = e.target.value;
                                // Only allow numbers up to 1000 for question 16
                                if (question_number === '16') {
                                    if (val === '' || (/^\d+$/.test(val) && Number(val) <= 1000)) {
                                        handleInputChange(question_number, val);
                                    }
                                } else {
                                    // For question 23, allow any number
                                    if (val === '' || /^\d+$/.test(val)) {
                                        handleInputChange(question_number, val);
                                    }
                                }
                            } else {
                                handleInputChange(question_number, e.target.value);
                            }
                        }}
                        disabled={!editable}
                        className={`${baseClasses} ${darkClasses} ${disabledClasses}`}
                        required={required}
                        placeholder={['16', '23'].includes(question_number) ? "Enter a number" : "Enter your answer"}
                        min={['16', '23'].includes(question_number) ? 0 : undefined}
                        max={question_number === '16' ? 1000 : undefined}
                        inputMode={['16', '23'].includes(question_number) ? "numeric" : undefined}
                    />
                )}





                {type === 'select' && (
                    <select
                        value={value}
                        onChange={(e) => handleInputChange(question_number, e.target.value)}
                        disabled={!editable}
                        className={`${baseClasses} ${darkClasses} ${disabledClasses}`}
                        required={required}
                    >
                        <option value="">Select Your Option</option>
                        {options?.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                )}

                {type === 'radio' && (
                    <div className="flex gap-6">
                        {label?.map((option, index) => (
                            <label key={index} className={`flex items-center cursor-pointer ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                <input
                                    type="radio"
                                    name={question_number}
                                    value={option}
                                    checked={value === option}
                                    onChange={(e) => handleInputChange(question_number, e.target.value, !!yesquestion)}
                                    disabled={!editable}
                                    className={`mr-2 ${isDarkMode ? "text-cyan-400 focus:ring-cyan-400" : "text-purple-600 focus:ring-purple-500"}`}
                                />
                                <span className="text-sm">{option}</span>
                            </label>
                        ))}
                    </div>
                )}

                {type === 'checkbox' && (
                    <div className="flex gap-6">
                        {label?.map((option, index) => (
                            <label key={index} className={`flex items-center cursor-pointer ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                <input
                                    type="checkbox"
                                    name={question_number}
                                    value={option}
                                    checked={Array.isArray(value) && value.includes(option)}
                                    onChange={(e) => {
                                        let newValue = Array.isArray(value) ? [...value] : [];
                                        if (e.target.checked) {
                                            newValue.push(option);
                                        } else {
                                            newValue = newValue.filter(v => v !== option);
                                        }
                                        handleInputChange(question_number, newValue, !!yesquestion);
                                    }}
                                    disabled={!editable}
                                    className={`mr-2 ${isDarkMode ? "text-cyan-400 focus:ring-cyan-400" : "text-purple-600 focus:ring-purple-500"}`}
                                />
                                <span className="text-sm">{option}</span>
                            </label>
                        ))}
                    </div>
                )}

                {type === 'multiple-select' && (
                    <div className="flex flex-wrap gap-2">
                        {options?.map((option, index) => {
                            const isChecked = Array.isArray(value) && value.includes(option);
                            return (
                                <label key={index} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        value={option}
                                        checked={isChecked}
                                        onChange={(e) => {
                                            let newSelected = Array.isArray(value) ? [...value] : [];

                                            if (e.target.checked) {
                                                newSelected.push(option);
                                            } else {
                                                newSelected = newSelected.filter(val => val !== option);
                                            }

                                            handleInputChange(question_number, newSelected, !!yesquestion);
                                        }}
                                        disabled={!editable}
                                    />
                                    {option}
                                </label>
                            );
                        })}
                    </div>
                )}

                {hasError && (
                    <p className="text-red-500 text-sm mt-1">{hasError}</p>
                )}

                {/* Render conditional yes-questions */}
                {yesquestion && conditionalQuestions[question_number] && (
                    <div className={`ml-8 mt-4 p-4 rounded-lg border-l-4 ${isDarkMode ? "bg-gray-800 border-cyan-400" : "bg-gray-50 border-purple-500"}`}>
                        {yesquestion.map((yesQ) => (
                            <div key={yesQ.question_number} className="mb-4">
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                    {`${yesQ.question_number}. ${yesQ.question}`}
                                    {yesQ.required && <span className="text-red-500 ml-1">*</span>}                                </label>

                                {yesQ.type === 'radio' && (
                                    <div className="flex gap-6">
                                        {yesQ.label?.map((option, optIndex) => (
                                            <label key={optIndex} className={`flex items-center cursor-pointer ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                <input
                                                    type="radio"
                                                    name={yesQ.question_number}
                                                    value={option}
                                                    checked={formData[yesQ.question_number] === option}
                                                    onChange={(e) => handleInputChange(yesQ.question_number, e.target.value)}
                                                    className={`mr-2 ${isDarkMode ? "text-cyan-400 focus:ring-cyan-400" : "text-purple-600 focus:ring-purple-500"}`}
                                                />
                                                <span className="text-sm">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                                {yesQ.type === 'multiple-select' && (
                                    <div className="flex flex-wrap gap-2">
                                        {yesQ.options?.map((option, index) => {
                                            const isChecked = Array.isArray(formData[yesQ.question_number]) && formData[yesQ.question_number].includes(option);
                                            return (
                                                <label key={index} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        value={option}
                                                        checked={isChecked}
                                                        onChange={(e) => {
                                                            let newSelected = Array.isArray(formData[yesQ.question_number]) ? [...formData[yesQ.question_number]] : [];
                                                            if (e.target.checked) {
                                                                newSelected.push(option);
                                                            } else {
                                                                newSelected = newSelected.filter(val => val !== option);
                                                            }
                                                            handleInputChange(yesQ.question_number, newSelected, !!yesQ.yesquestion);
                                                        }}
                                                        disabled={yesQ.editable === false}
                                                    />
                                                    {option}
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}

                                {yesQ.type === 'text' && (
                                    <input
                                        type={['21'].includes(yesQ.question_number) ? 'number' : 'text'}
                                        value={formData[yesQ.question_number] || ''}
                                        onChange={(e) => {
                                            if (['21'].includes(yesQ.question_number)) {
                                                const val = e.target.value;
                                                if (val === '' || /^\d+$/.test(val)) {
                                                    handleInputChange(yesQ.question_number, val);
                                                }
                                            } else {
                                                handleInputChange(yesQ.question_number, e.target.value);
                                            }
                                        }}
                                        className={`${baseClasses} ${darkClasses}`}
                                        placeholder={['21'].includes(yesQ.question_number) ? "Enter a number" : "Please specify"}
                                        min={['21'].includes(yesQ.question_number) ? 0 : undefined}
                                        inputMode={['21'].includes(yesQ.question_number) ? "numeric" : undefined}
                                    />
                                )}

                                {validationErrors[yesQ.question_number] && (
                                    <p className="text-red-500 text-sm mt-1">{validationErrors[yesQ.question_number]}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const getNetworkDisplayName = (networkKey) => {
        const names = {
            pride_Bhutan: 'Pride-Bhutan',
            lhak_sam: 'Lhak-Sam',
            chithuen_phendhey: 'Chithuen Phendhey',
            red_purse_network: 'Red Purse Network',
            others: 'Others'
        };
        return names[networkKey] || networkKey;
    };

    // Handle case where network parameter is not found
    if (!networkParam || !questions[networkParam]) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                <div className="text-center">
                    <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>Network Not Found</h1>
                    <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>The network parameter "{networkParam}" is not valid.</p>
                </div>
            </div>
        );
    }

    // Don't show the form if user hasn't answered the facility visit question or answered no
    if (hasVisitedFacility === false || showFacilityPopup) {
        return (
            <FacilityVisitPopup
                isVisible={showFacilityPopup}
                onYes={handleFacilityVisitYes}
                onNo={handleFacilityVisitNo}
                isDarkMode={isDarkMode}
            />
        );
    }

    const sections = getCurrentSections();
    const currentSection = sections[currentPage - 1];
    const totalPages = sections.length;

    if (!currentSection) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                <div className="text-center">
                    <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>Page Not Found</h1>
                    <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>The requested page does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? "bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900" : "bg-gradient-to-br from-orange-50 via-amber-100 to-pink-100"}`}>            {/* Form Container */}
            <div className="max-w-4xl mx-auto p-6">
                <div className={`rounded-lg shadow-lg overflow-hidden border transition-colors duration-500 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-orange-200"}`}>                    {/* Form Header */}
                    <div className={`p-6 ${isDarkMode ? "bg-gradient-to-r from-cyan-700 to-blue-700" : "bg-gradient-to-r from-purple-500 to-pink-500"} text-white`}>                        <h1 className="text-2xl font-bold text-center">
                        {getNetworkDisplayName(networkParam)} Client Form
                    </h1>
                        <div className="flex justify-center items-center mt-4">
                            <div className="text-sm opacity-80">
                                Page {currentPage} of {totalPages}
                            </div>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-8 flex flex-col min-h-[70vh]">
                        <div className="mb-6">
                            <h2 className={`text-xl font-semibold mb-6 pb-2 border-b-2 transition-colors duration-500 ${isDarkMode ? "text-cyan-200 border-cyan-700" : "text-purple-700 border-purple-200"}`}>                                {currentSection.title}
                            </h2>

                            <div className="space-y-6">
                                {currentSection.questions.map(question =>
                                    renderQuestion(question)
                                )}
                            </div>
                        </div>

                        {/* Navigation Buttons - Inside Form */}
                        <div className="mt-auto pt-8">
                            <div className="flex justify-between items-center">
                                {/* Previous Button (hidden on first page) */}
                                {currentPage > 1 && (
                                    <button
                                        onClick={handlePrevPage}
                                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center ${isDarkMode
                                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-1"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Previous
                                    </button>
                                )}

                                {/* Page Indicators */}
                                <div className="flex space-x-2 mx-auto">
                                    {Array.from({ length: totalPages }).map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-2 h-2 rounded-full transition-all ${currentPage === index + 1
                                                ? isDarkMode
                                                    ? 'bg-cyan-400 w-4'
                                                    : 'bg-purple-600 w-4'
                                                : isDarkMode
                                                    ? 'bg-gray-600'
                                                    : 'bg-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Next/Submit Button */}
                                {currentPage < totalPages ? (
                                    <button
                                        onClick={handleNextPage}
                                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center ${isDarkMode
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600'
                                            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                                            }`}
                                    >
                                        Next
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 ml-1"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled = {isLoading}
                                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center disabled:cursor-not-allowed ${isDarkMode
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                                            : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'}
                                        `}
                                    >
                                        {isLoading?"Submitting":"Submit"}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 ml-1"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;

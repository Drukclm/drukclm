"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { follow_up_question } from "@/app/utils/followupQuestion";
import { supabase } from "@/lib/supabaseClinent";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/app/store/themeStore";
import clsx from "clsx";


// --- Types ---
type Question = {
    question_number: string;
    question: string;
    type: string;
    required: boolean;
    editable?: boolean;
    label?: string[]; // for select, radio, checkbox, multiple-select
    options?: string[]; // for select
    yesquestion?: Question[];
};

type Section = {
    title: string;
    questions: Question[];
};

type FollowUpQuestion = {
    [key: string]: Section;
};

type FormData = { [key: string]: string | string[] };
type Errors = { [key: string]: string };
type Conditional = { [key: string]: boolean };

// --- Map follow-up auto fields to submission question numbers or functions ---
const AUTO_FIELD_MAP: Record<string, string | (() => string)> = {
    "1": "3", // Location Of The Facility <- submission.answers["3"]
    "2": "4", // Region <- submission.answers["4"]
    "3": "1", // Date Of CLM Report <- submission.answers["1"]
    "4": () => new Date().toISOString().split("T")[0], // Date Of This Follow-Up <- today
    "6": "23", // Clients Age <- submission.answers["23"]
    "7": "24", // Clients Gender <- submission.answers["24"]
    "8": "25", // Client's key population identity <- submission.answers["25"]
};

async function fetchFollowUp(submissionId: string) {
    
    const { data, error } = await supabase
        .from("Follow_up")
        .select("id, follow_up_submission")
        .eq("submission_id", submissionId)
        .single();
    if (error && error.code !== "PGRST116") throw error; // PGRST116: No rows found
    return data;
}

// --- Helper to fetch submission by id ---
async function fetchSubmission(submissionId: string) {
    const { data, error } = await supabase
        .from("Submission")
        .select("id, network, answers")
        .eq("id", submissionId)
        .single();

    if (error || !data) throw new Error("Failed to fetch submission");
    return data;
}

// --- Main Component ---
const FollowUpFormPage = () => {
    const params = useParams();
    const router = useRouter();
    const submissionId = params.id as string;

    const fq = follow_up_question as FollowUpQuestion;
    const sectionKeys = Object.keys(fq);
    const [currentSection, setCurrentSection] = useState<number>(0);

    const [formData, setFormData] = useState<FormData>({});
    const [conditional, setConditional] = useState<Conditional>({});
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState(true);
    const [followUpId, setFollowUpId] = useState<number | null>(null);


    // Store submission answers for auto fields
    const [submissionAnswers, setSubmissionAnswers] = useState<FormData>({});
    const [network, setNetwork] = useState<string>("");

    const isDarkMode = useThemeStore();

    // Fetch submission data on mount
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const submission = await fetchSubmission(submissionId);
                setSubmissionAnswers(submission.answers || {});
                setNetwork(submission.network || "");

                const followUp = await fetchFollowUp(submissionId);
                if (followUp) {
                    setFollowUpId(followUp.id);
                    setFormData(followUp.follow_up_submission || {});
                }
            } catch (err) {
                // handle error
            }
            setLoading(false);
        }
        if (submissionId) loadData();
    }, [submissionId]);

    useEffect(() => {
        if (Object.keys(submissionAnswers).length > 0) {
            setFormData((prev) => ({
                ...prev,
                ...Object.entries(AUTO_FIELD_MAP).reduce((acc, [followupQn, submissionQnOrFn]) => {
                    if (typeof submissionQnOrFn === "function") {
                        acc[followupQn] = submissionQnOrFn();
                    } else if (submissionAnswers[submissionQnOrFn] !== undefined) {
                        if (
                            (submissionQnOrFn === "24" || submissionQnOrFn === "25") &&
                            Array.isArray(submissionAnswers[submissionQnOrFn])
                        ) {
                            acc[followupQn] = submissionAnswers[submissionQnOrFn][0] || "";
                        } else {
                            acc[followupQn] = submissionAnswers[submissionQnOrFn];
                        }
                    }
                    return acc;
                }, {} as FormData),
            }));
        }
    }, [submissionAnswers]);

    const section = fq[sectionKeys[currentSection]];

    // Handle input changes
    const handleInputChange = (
        q: Question,
        value: string | string[],
        hasYesQuestions = false
    ) => {
        setFormData((prev) => ({ ...prev, [q.question_number]: value }));
        if (errors[q.question_number]) {
            setErrors((prev) => {
                const newErr = { ...prev };
                delete newErr[q.question_number];
                return newErr;
            });
        }
        if (hasYesQuestions) {
            setConditional((prev) => ({
                ...prev,
                [q.question_number]: value === "Yes",
            }));
        }
    };

    // Validate current section
    const validateSection = () => {
        const newErrors: Errors = {};
        let valid = true;
        section.questions.forEach((q) => {
            const v = formData[q.question_number];
            if (
                q.required &&
                (v === undefined ||
                    v === "" ||
                    (Array.isArray(v) && v.length === 0))
            ) {
                newErrors[q.question_number] = "This field is required";
                valid = false;
            }
            if (q.yesquestion && conditional[q.question_number]) {
                q.yesquestion.forEach((yq) => {
                    const yv = formData[yq.question_number];
                    if (
                        yq.required &&
                        (yv === undefined || yv === "" || (Array.isArray(yv) && yv.length === 0))
                    ) {
                        newErrors[yq.question_number] = "This field is required";
                        valid = false;
                    }
                });
            }
        });
        setErrors(newErrors);
        return valid;
    };

    // Navigation
    const handleNext = () => {
        if (validateSection()) {
            setCurrentSection((prev) => prev + 1);
            window.scrollTo(0, 0);
        }
    };
    const handlePrev = () => {
        setCurrentSection((prev) => prev - 1);
        window.scrollTo(0, 0);
    };

    // Submit handler (implement your own logic)
    // ...existing code...

    const handleSubmit = async () => {
        if (validateSection()) {
            setLoading(true);
            let error;
            if (followUpId) {
                // Update existing follow-up
                ({ error } = await supabase
                    .from("Follow_up")
                    .update({ follow_up_submission: formData })
                    .eq("id", followUpId));
            } else {
                // Insert new follow-up
                const { error: insertError, data } = await supabase
                    .from("Follow_up")
                    .insert([
                        {
                            submission_id: Number(submissionId),
                            follow_up_submission: formData,
                        },
                    ])
                    .select("id")
                    .single();
                error = insertError;
                if (!error && data) setFollowUpId(data.id);
            }
            setLoading(false);

            if (error) {
                alert("Failed to submit follow-up: " + error.message);
            } else {
                alert("Follow-up submitted successfully!");
                // Navigate back to the previous page
                router.back();
            }
        }
    };

    // Render a question
    const renderQuestion = (q: Question) => {
        // If auto field, use value from formData and disable input
        const isAuto = Object.keys(AUTO_FIELD_MAP).includes(q.question_number);
        const value = formData[q.question_number] ?? (q.type === "multiple-select" ? [] : "");
        const hasError = errors[q.question_number];
        // For multi-select, ensure value is always an array
        const multiValue =
            q.type === "multiple-select"
                ? (Array.isArray(value) ? value : value ? [value] : [])
                : value;

        return (
            <div key={q.question_number} className="mb-6">
                <label className="block font-medium mb-2">
                    {q.question}
                    {q.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {q.type === "text" && (
                    <input
                        type="text"
                        value={typeof value === "string" ? value : ""}
                        onChange={(e) => handleInputChange(q, e.target.value)}
                        disabled={isAuto || q.editable === false}
                        className="w-full border rounded p-2"
                    />
                )}
                {q.type === "number" && (
                    <input
                        type="number"
                        value={typeof value === "string" ? value : ""}
                        onChange={(e) => handleInputChange(q, e.target.value)}
                        disabled={isAuto || q.editable === false}
                        className="w-full border rounded p-2"
                    />
                )}
                {q.type === "date" && (
                    <input
                        type="date"
                        value={typeof value === "string" ? value : ""}
                        onChange={(e) => handleInputChange(q, e.target.value)}
                        disabled={isAuto || q.editable === false}
                        className="w-full border rounded p-2"
                    />
                )}
                {q.type === "select" && (
                    <select
                        value={typeof value === "string" ? value : ""}
                        onChange={(e) => handleInputChange(q, e.target.value)}
                        disabled={isAuto || q.editable === false}
                        className="w-full border rounded p-2"
                    >
                        <option value="">Select</option>
                        {(q.options || q.label || []).map((opt, i) => (
                            <option key={i} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                )}
                {q.type === "radio" && (
                    <div className="flex gap-4">
                        {(q.label || []).map((opt, i) => (
                            <label key={i} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name={q.question_number}
                                    value={opt}
                                    checked={value === opt}
                                    onChange={(e) =>
                                        handleInputChange(q, e.target.value, !!q.yesquestion)
                                    }
                                    disabled={isAuto || q.editable === false}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                )}
                {q.type === "checkbox" && (
                    <div className="flex gap-4">
                        {(q.label || []).map((opt, i) => (
                            <label key={i} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value={opt}
                                    checked={Array.isArray(value) && value.includes(opt)}
                                    onChange={(e) => {
                                        let arr = Array.isArray(value) ? [...value] : [];
                                        if (e.target.checked) arr.push(opt);
                                        else arr = arr.filter((v) => v !== opt);
                                        handleInputChange(q, arr);
                                    }}
                                    disabled={isAuto || q.editable === false}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                )}
                {q.type === "multiple-select" && (
                    <div className="flex flex-wrap gap-2">
                        {(q.options || q.label || []).map((opt, i) => (
                            <label key={i} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value={opt}
                                    checked={multiValue.includes(opt)}
                                    onChange={(e) => {
                                        let arr = Array.isArray(multiValue) ? [...multiValue] : [];
                                        if (e.target.checked) arr.push(opt);
                                        else arr = arr.filter((v) => v !== opt);
                                        handleInputChange(q, arr);
                                    }}
                                    disabled={isAuto || q.editable === false}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                )}
                {q.type === "textarea" && (
                    <textarea
                        value={typeof value === "string" ? value : ""}
                        onChange={(e) => handleInputChange(q, e.target.value)}
                        disabled={isAuto || q.editable === false}
                        className="w-full border rounded p-2"
                        rows={3}
                    />
                )}
                {hasError && (
                    <div className="text-red-500 text-sm mt-1">{hasError}</div>
                )}

                {/* Render yesquestion if needed */}
                {q.yesquestion && conditional[q.question_number] && (
                    <div className="ml-6 mt-4 border-l-4 border-blue-300 pl-4">
                        {q.yesquestion.map((yq) => renderQuestion(yq))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="text-xl">Loading...</span>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Follow Up Form</h2>
            <div className="mb-2 text-gray-600">
                Submission ID: <span className="font-mono">{submissionId}</span>
            </div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                {section.questions.map((q) => renderQuestion(q))}
            </div>
            <div className="flex justify-between items-center mt-8">
                {currentSection > 0 ? (
                    <button
                        onClick={handlePrev}
                        className={clsx(isDarkMode?"text-black":"","px-4 py-2 rounded bg-gray-200 hover:bg-gray-300")}
                    >
                        Previous
                    </button>
                ) : (
                    <div />
                )}
                <div className="flex gap-2">
                    {sectionKeys.map((_, idx) => (
                        <span
                            key={idx}
                            className={`inline-block w-3 h-3 rounded-full ${idx === currentSection ? "bg-blue-500" : "bg-gray-300"
                                }`}
                        />
                    ))}
                </div>
                {currentSection < sectionKeys.length - 1 ? (
                    <button
                        onClick={handleNext}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                        Submit
                    </button>
                )}
            </div>
        </div>
    );
};

export default FollowUpFormPage;
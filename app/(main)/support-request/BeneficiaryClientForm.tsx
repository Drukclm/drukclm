// app/(main)/support-request/BeneficiaryClientForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Head from "next/head";
// ... other imports from your original BeneficiaryForm
import { beneficiaryForm } from "../../utils/BeneficiaryFormQuestion";
import { useThemeStore } from "../../store/themeStore";
import { supabase } from "../../../lib/supabaseClinent";

export default function BeneficiaryForm() {
  const { isDarkMode } = useThemeStore();
  const searchParams = useSearchParams();
  const networkParam = searchParams.get("network");
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  type ConditionalRule = { question: string; value: any } | null;
  const [conditionalQuestions, setConditionalQuestions] = useState<Record<string, ConditionalRule>>({});
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // ... rest of your BeneficiaryForm component code
  // (all the useEffect, handleChange, handleSubmit, renderQuestion, etc.)

  useEffect(() => {
    const sections = getCurrentSections();
    if (sections.length > 0) {
      const initialData: Record<string, any> = {};
      sections.forEach((section: any) => {
        section.questions.forEach((q: any) => {
          if (q.default !== undefined) {
            initialData[q.question_number] = q.default;
          } else if (q.type === "checkbox") {
            initialData[q.question_number] = [];
          } else {
            initialData[q.question_number] = "";
          }
        });
      });
      setFormData(initialData);
    }
  }, [networkParam]);

  const handleChange = (
    qNum: string,
    value: any,
    type?: string,
    required?: boolean
  ) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [qNum]: value };
      Object.entries(conditionalQuestions).forEach(([depQNum, cond]) => {
        if (!cond) return;
        const { question: controllingQNum, value: expectedValue } = cond;
        if (updatedData[controllingQNum] !== expectedValue) {
          updatedData[depQNum] = "";
        }
      });
      return updatedData;
    });

    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      if (newErrors[qNum]) delete newErrors[qNum];
      const cond = conditionalQuestions[qNum];
      const isActive =
        !cond || (cond && formData[cond.question] === cond.value);
      if (isActive) {
        if (type === "email" && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(value))
            newErrors[qNum] = "Invalid email address";
        }
        if (type === "number" && value && isNaN(value)) {
          newErrors[qNum] = "Must be a number";
        }
        if (
          (type === "text" || type === "textarea") &&
          value &&
          /\d/.test(value)
        ) {
          newErrors[qNum] = "Text cannot contain numbers";
        }
        if (
          required &&
          (!value ||
            value === "" ||
            (Array.isArray(value) && value.length === 0))
        ) {
          newErrors[qNum] = "This field is required";
        }
      }
      return newErrors;
    });
  };

  const handleSubmit = async () => {
    if (!VerifyCurrentPage()) return;
    setIsSubmitting(true);
    setSubmissionError(null);
    try {
// changes for select
      const finalAnswers={...formData}
      if (finalAnswers["6"] === "Others (Specify)") {
    finalAnswers["6"] = finalAnswers["6.1"];
    delete finalAnswers["6.1"];
  }

  if (finalAnswers["7"] === "Others (Specify)") {
    finalAnswers["7"] = finalAnswers["7.1"];
    delete finalAnswers["7.1"];
  }
      const submissionPayload = {
        kpo_name: networkParam,
        answers: finalAnswers,
      };
      const { data, error } = await supabase
        .from("support_request")
        .insert([submissionPayload]);
      if (error) {
        alert("Submission failed: " + error.message);
        return;
      }
      setFormData({});
      setConditionalQuestions({});
      setValidationErrors({});
      setCurrentSection(0);
      alert("Submission successful!");
    } catch (err: any) {
      console.error("Submission error:", err);
      setSubmissionError(err.message || "Something went wrong.");
      alert("Submission failed: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentSections = () => {
    if (!networkParam) return [];
    const bf: any = beneficiaryForm as any;
    if (!bf[networkParam]) return [];
    return bf[networkParam].sections;
  };

  const handleNext = () => {
    const isValid = VerifyCurrentPage();
    if (!isValid) return;
    const sections = getCurrentSections();
    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
    }
  };

  const VerifyCurrentPage = () => {
    const sections = getCurrentSections();
    if (sections.length === 0) return true;
    const current = sections[currentSection];
    if (!current) return true;
    let isValid = true;
    const errors: Record<string, string> = {};
    current.questions.forEach((question: any) => {
      // conditional question exists but the user did not select the required option, ignore that question.
      if (
      question.conditionalOn &&
      !(
        formData[question.conditionalOn.question] ===
        question.conditionalOn.value
      )
    ) {
      return;
    }

      const value = formData[question.question_number];
      if (
        question.required &&
        (!value || value === "" || (Array.isArray(value) && value.length === 0))
      ) {
        errors[question.question_number] = "This field is required";
        isValid = false;
      }
      if (question.conditionalOn) {
        const condQ = question.conditionalOn.question;
        const condVal = question.conditionalOn.value;
        if (formData[condQ] === condVal && (!value || value === "")) {
          errors[question.question_number] = "This field is required";
          isValid = false;
        }
      }
      if (question.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[question.question_number] = "Invalid email address";
          isValid = false;
        }
      }
    });
    setValidationErrors(errors);
    return isValid;
  };

  const renderQuestion = (q: any) => {
    const {
      question_number,
      question: text,
      conditionalOn,
      type,
      options,
      required,
      editable = true,
      placeholder,
    } = q;
    const value =
      formData[question_number] || (q.type === "checkbox" ? [] : "");
    if (
      conditionalOn &&
      !(Array.isArray(formData[conditionalOn.question])
        ? formData[conditionalOn.question].includes(conditionalOn.value)
        : formData[conditionalOn.question] === conditionalOn.value)
    )
      return null;

    const baseInputClasses =
      "w-full p-3 border rounded focus:outline-none focus:ring-2 transition-colors duration-300";
    const darkModeInputClasses = isDarkMode
      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500";
    const disabledClasses = !editable
      ? isDarkMode
        ? "bg-gray-800 text-gray-400 cursor-not-allowed border-gray-700"
        : "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
      : "";

    const inputElement: Record<string, React.ReactNode> = {
      text: (
        <input
          type="text"
          value={value}
          onChange={(e) =>
            handleChange(question_number, e.target.value, "text", required)
          }
          disabled={!editable}
          className={`${baseInputClasses} ${darkModeInputClasses} ${disabledClasses}`}
          placeholder={placeholder}
        />
      ),
      email: (
        <input
          type="email"
          value={value}
          onChange={(e) =>
            handleChange(question_number, e.target.value, "email", required)
          }
          disabled={!editable}
          className={`${baseInputClasses} ${darkModeInputClasses} ${disabledClasses}`}
          placeholder={placeholder}
        />
      ),
      number: (
        <input
          type="number"
          value={value}
          onChange={(e) =>
            handleChange(question_number, e.target.value, "number", required)
          }
          disabled={!editable}
          className={`${baseInputClasses} ${darkModeInputClasses} ${disabledClasses}`}
          placeholder={placeholder}
        />
      ),
      date: (
        <input
          type="date"
          value={value}
          onChange={(e) =>
            handleChange(question_number, e.target.value, "date", required)
          }
          disabled={!editable}
          className={`${baseInputClasses} ${darkModeInputClasses} ${disabledClasses}`}
        />
      ),
      textarea: (
        <textarea
          value={value}
          onChange={(e) =>
            handleChange(question_number, e.target.value, "textarea", required)
          }
          disabled={!editable}
          className={`${baseInputClasses} ${darkModeInputClasses} ${disabledClasses}`}
          rows={4}
          placeholder={placeholder}
        />
      ),
      select: (
        <select
          value={value}
          onChange={(e) =>
            handleChange(question_number, e.target.value, "select", required)
          }
          disabled={!editable}
          className={`${baseInputClasses} ${darkModeInputClasses} ${disabledClasses}`}
        >
          <option value="">Select</option>
          {options?.map((opt: string, i: number) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ),
      radio: (
        <div className="flex gap-6 flex-wrap">
          {options?.map((opt: string, i: number) => (
            <label
              key={i}
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } flex items-center gap-2 cursor-pointer`}
            >
              <input
                type="radio"
                name={question_number}
                value={opt}
                checked={value === opt}
                onChange={(e) =>
                  handleChange(
                    question_number,
                    e.target.value,
                    "radio",
                    required
                  )
                }
                disabled={!editable}
                className={`${
                  isDarkMode
                    ? "form-radio text-cyan-500"
                    : "form-radio text-blue-600"
                } h-4 w-4 transition-colors duration-200`}
              />
              {opt}
            </label>
          ))}
        </div>
      ),
      checkbox: (
        <div className="flex gap-6 flex-wrap">
          {options?.map((opt: string, i: number) => {
            const checked = Array.isArray(value) && value.includes(opt);
            return (
              <label
                key={i}
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } flex items-center gap-2 cursor-pointer`}
              >
                <input
                  type="checkbox"
                  value={opt}
                  checked={checked}
                  onChange={() => {
                    const newVal = checked
                      ? value.filter((v) => v !== opt)
                      : [...value, opt];
                    handleChange(question_number, newVal, "checkbox", required);
                  }}
                  disabled={!editable}
                  className={`${
                    isDarkMode
                      ? "form-checkbox text-cyan-500"
                      : "form-checkbox text-blue-600"
                  } h-4 w-4 transition-colors duration-200`}
                />
                {opt}
              </label>
            );
          })}
        </div>
      ),
      rating: (
        <div className="flex gap-4">
          {options?.map((opt: string, i: number) => (
            <label
              key={i}
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } flex items-center gap-2 cursor-pointer`}
            >
              <input
                type="radio"
                name={question_number}
                value={opt}
                checked={Number(value) === Number(opt)}
                onChange={(e) =>
                  handleChange(
                    question_number,
                    Number(e.target.value),
                    "rating",
                    required
                  )
                }
                disabled={!editable}
                className={`${
                  isDarkMode
                    ? "form-radio text-cyan-500"
                    : "form-radio text-blue-600"
                } h-4 w-4 transition-colors duration-200`}
              />
              {opt}
            </label>
          ))}
        </div>
      ),
    };

    return (
      <div key={question_number} className="mb-6">
        <label
          className={`block mb-2 font-medium ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {question_number}. {text}{" "}
          {required && <span className="text-red-500">*</span>}
        </label>

        {inputElement[type as string]}

        {validationErrors[question_number] && (
          <p className="text-red-500 text-sm mt-1">
            {validationErrors[question_number]}
          </p>
        )}
      </div>
    );
  };

  const sections = getCurrentSections();
  const currentSectionData = sections[currentSection];
  const totalSections = sections.length;

  if (!currentSectionData)
    return <div>No sections available for this network.</div>;

  return (
    <>
      <Head>
        <title>{beneficiaryForm.formName}</title>
      </Head>

      <div
        className={`min-h-screen p-4 flex items-center justify-center transition-colors duration-500 ${
          isDarkMode
            ? "bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900"
            : "bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100"
        }`}
      >
        <div
          className={`relative rounded-lg shadow-xl transition-colors duration-500 flex flex-col ${
            isDarkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          } h-[60vh] w-[90%] max-w-4xl`}
        >
          <div
            className={`p-6 text-white text-center ${
              isDarkMode
                ? "bg-gradient-to-r from-blue-700 to-purple-700"
                : "bg-gradient-to-r from-purple-500 to-pink-500"
            }`}
          >
            <h1 className="text-3xl font-bold mb-2">
              {networkParam
                ? networkParam
                    .replace(/_/g, " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : beneficiaryForm.formName}{" "}
              Beneficiary Support Request Form
            </h1>
            <p className="text-lg opacity-90">
              Page {currentSection + 1} of {totalSections}
            </p>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            <div
              className={`mb-8 p-4 rounded-md ${
                isDarkMode
                  ? "bg-gray-800 text-gray-100"
                  : "bg-white text-gray-900"
              }`}
            >
              <h3
                className={`text-xl font-semibold mb-4 pb-2 border-b-2 ${
                  isDarkMode
                    ? "text-cyan-300 border-gray-600"
                    : "text-purple-700 border-gray-300"
                }`}
              >
                {currentSectionData.title}
              </h3>
              {currentSectionData.questions.map(renderQuestion)}
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentSection === 0}
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center ${
                  isDarkMode
                    ? currentSection === 0
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                    : currentSection === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                }`}
              >
                Previous
              </button>

              {submissionError && (
                <div className="mb-4 text-red-500 font-medium text-center">
                  {submissionError}
                </div>
              )}
              <button
                type="button"
                onClick={
                  currentSection === totalSections - 1
                    ? handleSubmit
                    : handleNext
                }
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center ${
                  isDarkMode
                    ? currentSection === totalSections - 1
                      ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-500 hover:to-green-500"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500"
                    : currentSection === totalSections - 1
                    ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-400 hover:to-green-400"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-400 hover:to-indigo-400"
                }`}
              >
                {isSubmitting
                  ? "Submitting..."
                  : currentSection === totalSections - 1
                  ? "Submit"
                  : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

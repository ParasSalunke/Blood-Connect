import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';

export default function EligibilityChecker() {
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [showInfo, setShowInfo] = useState(null);

    const eligibilityQuestions = [
        {
            id: 'age',
            question: 'Are you between 18-65 years old?',
            info: 'You must be within this age range to safely donate blood.',
            criticalYes: true,
            category: 'Basic Requirements'
        },
        {
            id: 'weight',
            question: 'Do you weigh more than 50 kg?',
            info: 'Minimum weight requirement ensures donor safety.',
            criticalYes: true,
            category: 'Basic Requirements'
        },
        {
            id: 'health',
            question: 'Are you in good health and feeling well today?',
            info: 'You should be feeling healthy with no current illnesses.',
            criticalYes: true,
            category: 'Health Status'
        },
        {
            id: 'lastDonation',
            question: 'Has it been more than 3 months since your last blood donation?',
            info: 'This interval is necessary for your body to replenish blood cells.',
            criticalYes: true,
            category: 'Donation History'
        },
        {
            id: 'illness',
            question: 'Do you have any active infections or illnesses?',
            info: 'Active infections may affect blood safety.',
            criticalYes: false,
            category: 'Health Status'
        },
        {
            id: 'medication',
            question: 'Are you currently taking any antibiotics?',
            info: 'Some medications can affect donation eligibility.',
            criticalYes: false,
            category: 'Medications'
        },
        {
            id: 'pregnancy',
            question: 'Are you pregnant or have given birth in the last 6 months?',
            info: 'Pregnancy and recent childbirth affect eligibility.',
            criticalYes: false,
            category: 'Special Conditions'
        },
        {
            id: 'hemoglobin',
            question: 'Is your hemoglobin level above 12.5 g/dL?',
            info: 'Minimum hemoglobin ensures safe donation.',
            criticalYes: true,
            category: 'Health Status'
        }
    ];

    const categories = [...new Set(eligibilityQuestions.map(q => q.category))];

    const handleAnswer = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const checkEligibility = () => {
        let isEligible = true;
        let failureReason = [];
        let passedCriteria = [];

        eligibilityQuestions.forEach(question => {
            const answer = answers[question.id];
            if (question.criticalYes && !answer) {
                isEligible = false;
                failureReason.push(question.question);
            } else if (!question.criticalYes && answer) {
                isEligible = false;
                failureReason.push(question.question);
            } else if (answer === true) {
                passedCriteria.push(question.question);
            }
        });

        setResult({
            isEligible,
            failureReason,
            passedCriteria
        });
    };

    const allQuestionsAnswered = eligibilityQuestions.every(q => answers[q.id] !== undefined);

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 border-b pb-4">
                Blood Donation Eligibility Checker
            </h2>

            <div className="space-y-8">
                {categories.map(category => (
                    <div key={category} className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">{category}</h3>
                        {eligibilityQuestions
                            .filter(q => q.category === category)
                            .map(q => (
                                <div key={q.id} className="mb-6 p-4 bg-gray-50 rounded-lg relative">
                                    <div className="flex justify-between items-start mb-3">
                                        <p className="text-lg pr-8">{q.question}</p>
                                        <button
                                            onClick={() => setShowInfo(showInfo === q.id ? null : q.id)}
                                            className="text-blue-500 hover:text-blue-600"
                                        >
                                            <FaInfoCircle size={20} />
                                        </button>
                                    </div>

                                    {showInfo === q.id && (
                                        <div className="mb-3 text-sm text-gray-600 bg-blue-50 p-3 rounded">
                                            {q.info}
                                        </div>
                                    )}

                                    <div className="flex space-x-4">
                                        <button
                                            className={`flex-1 px-4 py-2 rounded-full transition-colors duration-200 ${answers[q.id] === true
                                                    ? 'border-dark_red text-white bg-dark_red hover:bg-dark hover:text-white'
                                                    : 'border-off_white/[.5] text-dark bg-white hover:bg-red hover:text-white hover:border-red'
                                                }`}
                                            onClick={() => handleAnswer(q.id, true)}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            className={`flex-1 px-4 py-2 rounded-full transition-colors duration-200 ${answers[q.id] === false
                                                    ? 'border-dark_red text-white bg-dark_red hover:bg-dark hover:text-white'
                                                    : 'border-off_white/[.5] text-dark bg-white hover:bg-red hover:text-white hover:border-red'
                                                }`}
                                            onClick={() => handleAnswer(q.id, false)}
                                        >
                                            No
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                ))}
            </div>

            <button
                className={`cursor-pointer w-full mt-6 px-6 py-3 rounded-full text-dark text-lg font-semibold transition-colors duration-200 ${allQuestionsAnswered
                        ? 'border-dark_red text-white bg-dark_red hover:bg-dark hover:text-white'
                        : 'border-off_white/[.5] text-dark bg-white hover:bg-red hover:text-white hover:border-red'
                    }`}
                onClick={checkEligibility}
                disabled={!allQuestionsAnswered}
            >
                Check Eligibility
            </button>

            {result && (
                <div className={`mt-8 p-6 rounded-lg ${result.isEligible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                    <div className="flex items-center mb-4">
                        {result.isEligible ? (
                            <FaCheckCircle className="text-green-500 text-2xl mr-2" />
                        ) : (
                            <FaTimesCircle className="text-red-500 text-2xl mr-2" />
                        )}
                        <h3 className="text-xl font-bold">
                            {result.isEligible
                                ? "You appear to be eligible to donate blood!"
                                : "You may not be eligible to donate blood at this time."}
                        </h3>
                    </div>

                    {!result.isEligible && result.failureReason.length > 0 && (
                        <div className="mt-4">
                            <p className="font-semibold text-red-600">Reasons for ineligibility:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                {result.failureReason.map((reason, index) => (
                                    <li key={index} className="text-red-700">{reason}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {result.isEligible && result.passedCriteria.length > 0 && (
                        <div className="mt-4">
                            <p className="font-semibold text-green-600">Met criteria:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                {result.passedCriteria.map((criteria, index) => (
                                    <li key={index} className="text-green-700">{criteria}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
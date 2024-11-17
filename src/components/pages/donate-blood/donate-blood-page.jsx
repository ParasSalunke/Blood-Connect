import { useState, useEffect } from "react";
import HeroComponent from "../../sections/hero/hero-component";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import SideBySideComponent from "../../sections/side-by-side/side-by-side-component";
import QuoteComponent from "../../sections/quote/quote-component";
import CriteriaComponent from "../../sections/criteria/criteria-component";
import FormComponent from "../../sections/form/form-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";
import EligibilityChecker from "../../sections/eligibility-checker/EligibilityChecker";

const DonateBloodPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		bloodType: "",
		message: "",
	});

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				const token = localStorage.getItem("authToken");
				const userData = localStorage.getItem("userData");

				if (token && userData) {
					setIsAuthenticated(true);
					// Pre-fill form with user data if needed
					const parsedUserData = JSON.parse(userData);
					setFormData(prev => ({
						...prev,
						name: parsedUserData.name || "",
						email: parsedUserData.email || ""
					}));
				}
			} catch (error) {
				console.error("Auth check failed:", error);
				setIsAuthenticated(false);
			} finally {
				setLoading(false);
			}
		};

		checkAuthStatus();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!isAuthenticated) {
			console.log("User not authenticated");
			return;
		}

		try {
			// Get fresh token
			const token = localStorage.getItem("authToken");

			if (!token) {
				setIsAuthenticated(false);
				return;
			}

			// Form submission is handled in FormComponent
			// Just clear the form here after successful submission
			setFormData({
				name: "",
				email: "",
				phone: "",
				bloodType: "",
				message: "",
			});

		} catch (error) {
			console.error("Form submission failed:", error);
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	const DonateBloodPageDetails = {
		quote: {
			classHint: "quote",
			quoteText: `“By donating money, you provide nourishment. By donating blood, you give the gift of life. Join us in this noble cause today!”`,
		},
		why_donate_blood: {
			subheadingText: "Donate blood today",
			headingText: "Why should you donate blood?",
			classHint: "side-col-image why-donate-blood",
			paraText: `Donating blood is a selfless act that has the power to save lives. Here are a few reasons why you should consider donating blood:
			\n― You could help save up to three lives with just one donation.
			― Blood is always needed in emergency situations, such as natural disasters and accidents.
			― Blood is needed for patients undergoing surgeries, cancer treatment, and other medical procedures.
			― Blood cannot be manufactured, which means that the only source of blood is through donations from volunteers.
			― Donating blood can also have health benefits for the donor, such as reducing the risk of heart disease and cancer.`,
			imageUrl: "../../../assets/images/blood-donation(1).jpg",
			buttonText: "Donate Now",
			buttonLink: "/donate-blood",
			buttonHave: true,
		},
		eligiblity_criteria: {
			subheadingText: "Are you ready?",
			headingText: "Eligibility Criteria",
			classHint: "side-col-image eligibility-criteria",
			paraText: [
				`18-50 years, above 50 Kg.`,
				`Normal temperature, pulse and blood pressure.`,
				`No Respiratory Diseases`,
				`Above 12.5 g/dL Hemoglobin`,
				`No skin disease, puncture or scars`,
				`No history of transmissible disease`,
			],
			imageUrl: "../../../assets/images/blood-donation(1).jpg",
			buttonText: "Donate Now",
			buttonLink: "/donate-blood",
			buttonHave: false,
		},
		hero: {
			subheadingText: "Donate Blood",
			headingText: "Save life by donating blood today",
			classHint: "donate-blood-page-hero",
		},
		stepsText: {
			subheadingText: "Donation Process",
			headingText: "Step-by-Step Guide to Donating Blood",
		},
	};

	const stepDetails = [
		{
			key: "check-eligibility",
			stepNumber: "01",
			stepName: "Check your eligibility",
			stepDescription:
				"Confirm you meet the eligibility requirements to donate blood, such as age, weight, and overall health.",
		},
		{
			key: "schedule-an-appointment",
			stepNumber: "02",
			stepName: "Schedule an appointment",
			stepDescription:
				"Schedule an appointment at a blood bank or blood drive near you.",
		},
		{
			key: "donate-blood",
			stepNumber: "03",
			stepName: "Donate Blood",
			stepDescription:
				"Arrive at the appointment, fill out a questionnaire, and donate blood. The process takes about 10-15 minutes.",
		},
	];

	const fields = [
		{
			key: "name",
			name: "name",
			type: "text",
			placeholder: "Name",
			required: true,
		},
		{
			key: "email",
			name: "email",
			type: "email",
			placeholder: "Email",
			required: true,
		},
		{
			key: "phone",
			name: "phone",
			type: "tel",
			placeholder: "Phone",
			required: true,
		},
		{
			key: "bloodType",
			name: "bloodType",
			type: "select", // Changed from "text" to "select"
			placeholder: "Blood Type",
			required: true,
			options: [
				{ value: "", label: "Select Blood Type" },
				{ value: "A+", label: "A+" },
				{ value: "A-", label: "A-" },
				{ value: "B+", label: "B+" },
				{ value: "B-", label: "B-" },
				{ value: "O+", label: "O+" },
				{ value: "O-", label: "O-" },
				{ value: "AB+", label: "AB+" },
				{ value: "AB-", label: "AB-" },
			],
		},
	];

	return (
		<>
			<HeaderComponent />

			<HeroComponent {...DonateBloodPageDetails.hero} />
			<FormComponent
				fields={fields}
				heading={"Schedule an Appointment"}
				buttonText={"Schedule an Appointment"}
				handleSubmit={handleSubmit}
				formData={formData}
				setFormData={setFormData}
			/>
			<EligibilityChecker />
			<ThreeStepProcessComponent
				stepsText={DonateBloodPageDetails.stepsText}
				stepDetails={stepDetails}
			/>
			<CriteriaComponent
				{...DonateBloodPageDetails.eligiblity_criteria}
			/>
			<SideBySideComponent {...DonateBloodPageDetails.why_donate_blood} />
			<QuoteComponent {...DonateBloodPageDetails.quote} />
			<BeforeFooterCTA />
			<FooterComponent />
		</>
	);
};

export default DonateBloodPage;

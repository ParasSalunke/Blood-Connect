import { useState, useEffect } from "react";
import HeroComponent from "../../sections/hero/hero-component";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import QuoteComponent from "../../sections/quote/quote-component";
import CriteriaComponent from "../../sections/criteria/criteria-component";
import FormComponent from "../../sections/form/form-component";
import SearchBloodStockComponent from "../../sections/search-blood-stock/search-blood-stock-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";
import BloodBankMap from "../../sections/BloodBankMap/BloodBankMap";

const NeedBloodPage = () => {
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

	const NeedBloodPageDetails = {
		quote: {
			classHint: "quote need-blood-quote",
			quoteText: `Facing a blood emergency?\n 
            Request a callback and let us help you!`,
			buttonText: "Call Now",
			buttonLink: "tel:+1234567890",
			buttonHave: true,
		},
		tips_for_managing_blood_loss: {
			subheadingText: "",
			headingText: "Tips for Managing Blood Loss",
			classHint: "tips-for-managing-blood-loss",
			paraText: [
				`Stay calm and avoid any strenuous activity.`,
				`Elevate the affected area if possible to reduce blood flow.`,
				`Apply pressure to the wound to slow down or stop the bleeding.`,
				`Drink fluids such as water or sports drinks to help replenish lost fluids.`,
				`Consume foods that are high in iron and protein, such as spinach, beans, and lean meats to help replenish lost nutrients.`,
				`Consider taking iron supplements if recommended by your doctor.`,
				`Keep a record of any symptoms and changes in condition to share with medical professionals.`,
			],
			imageUrl: "../../../assets/images/blood-donation(1).jpg",
			buttonHave: false,
		},
		hero: {
			subheadingText: "Need blood?",
			headingText: "Your blood needs are our priority.",
			classHint: "hero need-blood-page-hero",
		},
		stepsText: {
			subheadingText: "Collecting Blood",
			headingText: "From start to finish, here's what to expect.",
		},
		bloodStock: {
			subheadingText: "When you need it",
			headingText: "Find Available Blood Stock",
			classHint: "search-blood-stock",
		},
	};

	const stepDetails = [
		{
			key: "registration",
			stepNumber: "01",
			stepName: "Registration",
			stepDescription:
				"You will be asked to fill out a form with your personal information and medical history.",
		},
		{
			key: "screening",
			stepNumber: "02",
			stepName: "Screening",
			stepDescription:
				"A medical professional will check your vitals and ask you a series of questions to ensure you are eligible to donate.",
		},
		{
			key: "donation",
			stepNumber: "03",
			stepName: "Donation",
			stepDescription:
				"A sterile needle will be inserted into your arm to collect your blood, which will then be stored and used for transfusions.",
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
			<HeroComponent {...NeedBloodPageDetails.hero} />
			<FormComponent
				fields={fields}
				heading={"Request for emergency blood"}
				buttonText={"Request blood"}
				handleSubmit={handleSubmit}
				formData={formData}
				setFormData={setFormData}
				isAuthenticated={isAuthenticated}
			/>
			<BloodBankMap />
			<QuoteComponent {...NeedBloodPageDetails.quote} />
			<SearchBloodStockComponent {...NeedBloodPageDetails.bloodStock} />
			<ThreeStepProcessComponent
				stepsText={NeedBloodPageDetails.stepsText}
				stepDetails={stepDetails}
			/>
			<CriteriaComponent
				{...NeedBloodPageDetails.tips_for_managing_blood_loss}
			/>
			<BeforeFooterCTA />
			<FooterComponent />
		</>
	);
};

export default NeedBloodPage;

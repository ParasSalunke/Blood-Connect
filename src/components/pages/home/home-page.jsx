import HeroComponent from "../../sections/hero/hero-component";
import TwoCtaComponent from "../../sections/two-cta/two-cta-component";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import SideBySideComponent from "../../sections/side-by-side/side-by-side-component";
import QuoteComponent from "../../sections/quote/quote-component";
import CriteriaComponent from "../../sections/criteria/criteria-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";

const HomePage = () => {
	const HomePageDetails = {
		donate_blood: {
			subheadingText: "Be a Hero Today",
			headingText: "Join Blood Connect's Lifesaving Mission",
			classHint: "side-col-image donate-blood-with-Blood Connect",
			paraText:
				"At Blood Connect, we're building a network of dedicated donors who directly impact lives in our community. With state-of-the-art facilities and compassionate staff, we ensure your donation experience is safe, comfortable, and rewarding. Every donation can save up to three lives – be part of this incredible journey.",
			imageUrl: "../../../assets/images/blood-donation(1).jpg",
			buttonText: "Start Saving Lives",
			buttonLink: "/donate-blood",
			buttonHave: true,
		},
		quote: {
			classHint: "quote",
			quoteText: `"The blood you donate gives someone another chance at life. One day that someone may be a close relative, a friend, a loved one—or even you."`,
		},
		why_donate_blood: {
			subheadingText: "Make an Impact",
			headingText: "Why Your Donation Matters",
			classHint: "side-col-image why-donate-blood",
						paraText: `Blood donation is a vital lifeline for our healthcare system and community. Here's why every donation counts:
						One donation can save up to three lives through different blood components
						Blood cannot be manufactured - it can only come from generous donors
						Cancer patients, trauma victims, and surgical patients rely on blood donations daily
						Less than 5% of healthy adults donate blood regularly
						Your donation helps maintain a stable blood supply for emergencies
						Regular donation helps monitor your health and can reduce cardiovascular risks.`,
			imageUrl: "../../../assets/images/blood-donation(1).jpg",
			buttonText: "Donate Today",
			buttonLink: "/donate-blood",
			buttonHave: true,
		},
		eligiblity_criteria: {
			subheadingText: "Check Your Eligibility",
			headingText: "Basic Requirements",
			classHint: "side-col-image eligibility-criteria",
			paraText: [
				`Age between 18-65 years, weight above 50 Kg`,
				`Normal vital signs (temperature, pulse, blood pressure)`,
				`No active respiratory conditions`,
				`Hemoglobin level above 12.5 g/dL`,
				`Healthy skin at donation site`,
				`No history of infectious diseases`,
			],
			imageUrl: "../../../assets/images/blood-donation(1).jpg",
			buttonText: "Check Eligibility",
			buttonLink: "/donate-blood",
			buttonHave: false,
		},
		hero: {
			subheadingText: "Be Someone's Hero",
			headingText: "Save Lives Through Blood Donation",
			descriptionText: "Every drop counts in our mission to save lives. Your simple act of donating blood can help multiple patients and give hope to families in need.",
			classHint: "home-page-hero",
		},
		stepsText: {
			subheadingText: "Simple Process",
			headingText: "Your Journey to Saving Lives",
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

	return (
		<>
			<HeaderComponent />
			<HeroComponent {...HomePageDetails.hero} />
			<TwoCtaComponent />
			<ThreeStepProcessComponent
				stepsText={HomePageDetails.stepsText}
				stepDetails={stepDetails}
			/>
			<SideBySideComponent {...HomePageDetails.donate_blood} />
			<QuoteComponent {...HomePageDetails.quote} />
			<SideBySideComponent {...HomePageDetails.why_donate_blood} />
			<CriteriaComponent {...HomePageDetails.eligiblity_criteria} />
			<BeforeFooterCTA />
			<FooterComponent />
		</>
	);
};

export default HomePage;

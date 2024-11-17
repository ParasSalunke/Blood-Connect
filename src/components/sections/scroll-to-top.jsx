import { useState, useEffect } from "react";

const ScrollToTopButton = () => {
	const [isVisible, setIsVisible] = useState(false);

	// Show button when page is scrolled up to given distance
	const toggleVisibility = () => {
		if (window.pageYOffset > 300) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	};

	// Set up scroll event listener
	useEffect(() => {
		window.addEventListener("scroll", toggleVisibility);
		return () => {
			window.removeEventListener("scroll", toggleVisibility);
		};
	}, []);

	// Scroll to top handler
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<>
			{isVisible && (
				<button
					onClick={scrollToTop}
					style={{
						position: "fixed",
						right: "20px",
						bottom: "20px",
						height: "45px",
						width: "45px",
						fontSize: "24px",
						borderRadius: "50%",
						border: "1px solid #400606",
						backgroundColor: "#260303",
						color: "#F2F2F2",
						cursor: "pointer",
						opacity: "0.9",
						transition: "all 0.3s ease",
						zIndex: "999",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
					}}
					onMouseEnter={(e) => {
						e.target.style.backgroundColor = "#400606";
						e.target.style.transform = "translateY(-2px)";
						e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
					}}
					onMouseLeave={(e) => {
						e.target.style.backgroundColor = "#260303";
						e.target.style.transform = "translateY(0)";
						e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
					}}
				>
					↑
				</button>
			)}
		</>
	);
};

export default ScrollToTopButton;

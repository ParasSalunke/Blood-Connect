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
						height: "40px",
						width: "40px",
						fontSize: "24px",
						borderRadius: "50%",
						border: "none",
						backgroundColor: "#000",
						color: "#fff",
						cursor: "pointer",
						opacity: "0.7",
						transition: "opacity 0.3s",
						zIndex: "999"
					}}
					onMouseEnter={(e) => (e.target.style.opacity = "1")}
					onMouseLeave={(e) => (e.target.style.opacity = "0.7")}
				>
					↑
				</button>
			)}
		</>
	);
};

export default ScrollToTopButton;

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink, Link } from "react-router-dom";

// Update navigation array
const navigation = [
	{ name: "Home", href: "/" },
	{ name: "Host Blood Drive", href: "/host-blood-drive" },
	{ name: "Contact", href: "/contact" },
	{ name: "Need Blood", href: "/need-blood", isHighlighted: true },
	{ name: "Donate Blood", href: "/donate-blood", isHighlighted: true },
	{ name: "My Account", href: "/my-account", isHighlighted: true },
];

const compnayName = "Blood Connect";

const HeaderComponent = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [offset, setOffset] = useState(0);
	const [blurActivation, setBlurActivation] = useState(false);
	const [isActiveName, setIsActiveName] = useState(null);

	// Update reusableClass object
	const reuseableClass = {
		highlighted: `rounded-rsm border border-white/[.5] hover:bg-white hover:text-dark text-off_white`,
		mobileLink: `block w-full px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-red rounded-md`,
		mobileHighlighted: `block w-full px-3 py-2 text-base font-medium text-red border border-red rounded-md hover:bg-red hover:text-white`
	  };

	useEffect(() => {
		const onScroll = () => {
			setOffset(window.pageYOffset);
			setBlurActivation(window.pageYOffset > 5);
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [offset]);
	return (
		<header
			onScroll={() => setBlurActivation(true)}
			className={`fixed inset-x-0 top-0 z-50 border-b border-white/[.2] ${blurActivation ? "bg-dark/[.6] backdrop-blur-md" : ""
				}`}
		>
			<nav
				className="flex items-center justify-between p-6 lg:px-8 w-[min(1250px,100%-15px)] m-auto"
				aria-label="Global"
			>
				{/* Logo Section*/}
				<div className="flex lg:flex-1">
					<Link to="/" className="-m-1.5 p-1.5">
						<span className="sr-only">{compnayName}</span>
						<h2 className="not-italic font-bold text-[25px] leading-[55px] text-white">
							Blood<span className="text-[red]"> Connect</span>
						</h2>
					</Link>
				</div>

				{/* Mobile menu button hidden on large screens */}
				<div className="flex lg:hidden">
					<button
						type="button"
						className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-off_white"
						onClick={() => setMobileMenuOpen(true)}
					>
						<span className="sr-only">Open main menu</span>
						<Bars3Icon className="w-6 h-6" aria-hidden="true" />
					</button>
				</div>

				{/* Desktop navigation */}
				<div className="hidden lg:flex lg:gap-x-4 lg:transition">
					{navigation.map((item) => (
						<NavLink
							key={item.name}
							onClick={() => {
								setIsActiveName(item.name);
								setMobileMenuOpen(false);
							}}
							to={item.href}
							className={`text-sm font-normal lg:transition leading-6 text-off_white px-3 py-2 rounded-rsm 
			                ${item.isHighlighted ? reuseableClass.highlighted : ''}
			                ${isActiveName == item.name ? 'bg-dark' : ''}`}
						>
							{item.name}
						</NavLink>
					))}
				</div>
			</nav>

			{/* Mobile menu */}
			<Dialog
				as="div"
				className="lg:hidden"
				open={mobileMenuOpen}
				onClose={setMobileMenuOpen}
			>
				<div className="fixed inset-0 z-50" />
				<Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full px-6 py-6 overflow-y-auto bg-white sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
					<div className="flex items-center justify-between">
						<Link to="/" className="-m-1.5 p-1.5">
							<span className="sr-only">{compnayName}</span>
							<h2 className="not-italic font-bold text-[20px] leading-[55px] text-dark">
								Blood<span className="text-[red]"> Connect</span>
							</h2>
						</Link>
						<button
							type="button"
							className="-m-2.5 rounded-md p-2.5 text-gray-700"
							onClick={() => setMobileMenuOpen(false)}
						>
							<span className="sr-only">Close menu</span>
							<XMarkIcon className="w-6 h-6" aria-hidden="true" />
						</button>
					</div>
					<div className="flow-root mt-6">
						<div className="-my-6 divide-y divide-gray-500/10">
							<div className="py-6 space-y-2">
								{navigation.map((item) => (
									<NavLink
										key={item.name}
										onClick={() => {
											setIsActiveName(item.name);
											setMobileMenuOpen(false);
										}}
										to={item.href}
										className={`${item.isHighlighted ? reuseableClass.mobileHighlighted : reuseableClass.mobileLink}
                                        ${isActiveName === item.name ? 'bg-gray-100' : ''}`}
									>
										{item.name}
									</NavLink>
								))}
							</div>
						</div>
					</div>
				</Dialog.Panel>
			</Dialog>
		</header>
	);
};

export default HeaderComponent;

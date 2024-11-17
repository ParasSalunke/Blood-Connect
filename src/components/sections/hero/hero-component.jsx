import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import "./hero-component-styles.scss";

const HeroComponent = ({ 
  subheadingText, 
  headingText, 
  descriptionText,
  classHint 
}) => {
    return (
        <section className={`main-wrapper min-h-[80vh] bg-gradient-to-r from-red-900 to-red-600 relative ${classHint}`}>
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="main-container relative z-10 py-20 px-4">
                <div className="text-wrapper max-w-4xl mx-auto flex flex-col justify-center items-center space-y-6">
                    <h3 className="subheading relative font-bold sm:text-[20px] leading-[2em] text-center tracking-[0.3em] uppercase text-off_white">
                        {subheadingText}
                    </h3>
                    <h1 className="font-bold text-[35px] sm:text-[60px] leading-tight text-center capitalize text-white">
                        {headingText}
                    </h1>
                    {descriptionText && (
                        <p className="text-lg sm:text-xl text-center text-white/90 max-w-2xl">
                            {descriptionText}
                        </p>
                    )}
                    <div className="flex gap-4 mt-8">
                        <Link 
                            to="/donate-blood" 
                            className="px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                        >
                            Donate Now
                        </Link>
                        <Link 
                            to="/need-blood" 
                            className="px-8 py-4 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Need Blood
                        </Link>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-dark to-transparent"></div>
        </section>
    );
};

HeroComponent.propTypes = {
    subheadingText: PropTypes.string.isRequired,
    headingText: PropTypes.string.isRequired,
    descriptionText: PropTypes.string,
    classHint: PropTypes.string
};

export default HeroComponent;
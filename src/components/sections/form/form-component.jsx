import { useState } from "react";
import "./form-component-styles.scss";
import WrapperSection from "../wrapper-section/wrapper-section-component";

const FormComponent = ({
  fields,
  heading,
  buttonText,
  formData,
  setFormData,
  handleSubmit
}) => {
  const [status, setStatus] = useState("Pending");

  const inputStyles = `block w-full flex justify-start items-start rounded-rsm border-0 px-8 py-3 md:px-10 md:py-4 bg-light text-white ring-none placeholder:text-white outline-none focus:ring-1 focus:ring-center focus:bg-dark focus:ring-light sm:text-sm sm:leading-6`;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    const apiKey = import.meta.env.VITE_ACCESS_KEY;

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: apiKey,
          ...formData,
          from_name: formData.name,
          subject: `New ${heading} Request`,
        })
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Submitted");
        handleSubmit(e);
      } else {
        throw new Error("Form submission failed");
      }

    } catch (err) {
      setStatus("Error");
    }
  };

  return (
    <WrapperSection>
      <div className={`form-wrapper -mt-[10em] w-full relative p-6 py-10 lg:p-20 lg:pb-10 rounded-rmd z-[25] overflow-hidden`}>
        <h3 className="not-italic text-center font-medium text-[16px] sm:text-[25px] leading-[34px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white">
          {heading}
        </h3>

        {status === "Submitted" ? (
          <p className="text-center text-white text-sm sm:text-base mt-5">
            Thank you for contacting Blood Connect. We will get back to you as soon as possible.
          </p>
        ) : (
          <form
            className="contact-form grid grid-cols-1 sm:grid-cols-2 gap-5 w-full relative sm:p-6 py-8 rounded-rmd z-[25] overflow-hidden"
            onSubmit={handleFormSubmit}
          >
            {fields.map((field) => (
              field.type === "select" ? (
                <select
                  key={field.key}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field.name]: e.target.value,
                    })
                  }
                  value={formData[field.name]}
                  name={field.name}
                  id={field.name}
                  className={`${inputStyles} appearance-none`}
                  required={field.required}
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  key={field.key}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field.name]: e.target.value,
                    })
                  }
                  value={formData[field.name]}
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  className={inputStyles}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )
            ))}

            <div className="grid sm:col-span-2 gap-5 w-full">
              <textarea
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    message: e.target.value,
                  })
                }
                value={formData.message}
                name="message"
                id="message"
                className={`${inputStyles} h-[8em]`}
                rows={10}
                placeholder="Any other information..."
              />
            </div>

            <div className="grid place-items-center sm:col-span-2 gap-5 mb-5 w-full">
              <button
                type="submit"
                disabled={status === "Submitting"}
                className={`rounded-rsm border border-white hover:border-red text-dark bg-white hover:bg-red hover:text-white transition px-10 py-4 text-sm w-fit font-bold cursor-pointer ${status === "Submitting" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {status === "Submitting" ? "Submitting..." : buttonText}
              </button>
            </div>
          </form>
        )}
      </div>
    </WrapperSection>
  );
};

export default FormComponent;
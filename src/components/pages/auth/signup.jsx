import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from '../../../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { MoonLoader } from "react-spinners";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    bloodGroup: "",
    state: "",
    district: "",
    age: "",
    weight: "",
    lastDonationDate: "",
    medicalConditions: [],
    gender: "",
    phoneNumber: "",
    address: "",
    emergencyContact: {
      name: "",
      phone: "",
      relation: ""
    }
  });

  // Add these constants
  const medicalConditions = [
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "HIV/AIDS",
    "Hepatitis",
    "None"
  ];

  const genderOptions = ["Male", "Female", "Other"];

  const [error, setError] = useState("");

  const bloodGroups = [
    "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
  ];

  const stateDistricts = {
    "Andhra Pradesh": [
      "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool",
      "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram",
      "West Godavari", "YSR Kadapa"
    ],
    "Bihar": [
      "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur",
      "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj",
      "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj",
      "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur",
      "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa",
      "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan",
      "Supaul", "Vaishali", "West Champaran"
    ],
    "Delhi": [
      "Central Delhi", "East Delhi", "New Delhi", "North Delhi",
      "North East Delhi", "North West Delhi", "Shahdara", "South Delhi",
      "South East Delhi", "South West Delhi", "West Delhi"
    ],
    "Gujarat": [
      "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch",
      "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka",
      "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch",
      "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal",
      "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar",
      "Tapi", "Vadodara", "Valsad"
    ],
    "Karnataka": [
      "Bagalkot", "Ballari", "Bangalore Rural", "Bangalore Urban", "Belgaum",
      "Bidar", "Chamarajanagar", "Chickmagalur", "Chikkaballapur", "Chitradurga",
      "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri",
      "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur",
      "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada",
      "Vijayapura", "Yadgir"
    ],
    "Kerala": [
      "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam",
      "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta",
      "Thiruvananthapuram", "Thrissur", "Wayanad"
    ],
    "Maharashtra": [
      "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara",
      "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli",
      "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban",
      "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani",
      "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur",
      "Thane", "Wardha", "Washim", "Yavatmal"
    ],
    "Tamil Nadu": [
      "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
      "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
      "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
      "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
      "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
      "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
      "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
      "Vellore", "Viluppuram", "Virudhunagar"
    ],
    "Uttar Pradesh": [
      "Agra", "Aligarh", "Prayagraj", "Ambedkar Nagar", "Amethi", "Amroha",
      "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur",
      "Banda", "Barabanki", "Bareilly", "Basti", "Bijnor", "Budaun",
      "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah",
      "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar",
      "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur",
      "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj",
      "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar",
      "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba",
      "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad",
      "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Raebareli", "Rampur",
      "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli",
      "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur",
      "Unnao", "Varanasi"
    ]
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData({
      ...formData,
      state: selectedState,
      district: "" // Reset district when state changes
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true); // Set loading before async operations
    try {
      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Prepare user data (excluding password and confirmPassword)
      const userData = {
        email: formData.email,
        bloodGroup: formData.bloodGroup,
        state: formData.state,
        district: formData.district,
        age: formData.age,
        weight: formData.weight,
        medicalConditions: formData.medicalConditions,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        createdAt: new Date().toISOString()
      };

      // Store user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      // Navigate to login
      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center">
      <MoonLoader
        size={50}
        color={"#400606"}
        loading={true}
        cssOverride={{}} />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <h2 className="flex justify-center not-italic font-bold text-[25px] leading-[55px] text-dark">
          Blood<span className="text-[red]">Connect</span>
        </h2>
        <h2 className="text-3xl font-bold text-center">Create Account</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Email and Password fields remain the same */}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div>
            <select
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
              value={formData.state}
              onChange={handleStateChange}
            >
              <option value="">Select State</option>
              {Object.keys(stateDistricts).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <select
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              disabled={!formData.state}
            >
              <option value="">Select District</option>
              {formData.state && stateDistricts[formData.state].map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              required
              min="18"
              max="65"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
              placeholder="Age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
            <input
              type="number"
              required
              min="45"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
              placeholder="Weight (kg)"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />
          </div>

          {/* Medical History Section */}
          <div className="space-y-4">
            {/* <input
              type="date"
              max={new Date().toISOString().split('T')[0]}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
              placeholder="Last Donation Date"
              value={formData.lastDonationDate}
              onChange={(e) => setFormData({ ...formData, lastDonationDate: e.target.value })}
            /> */}

            <select
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              {genderOptions.map(gender => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>

            {/* Medical Conditions Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
              <div className="grid grid-cols-2 gap-2">
                {medicalConditions.map(condition => (
                  <label
                    key={condition}
                    className={`inline-flex items-center ${formData.medicalConditions.includes('None') && condition !== 'None'
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                      }`}
                  >
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                      value={condition}
                      checked={formData.medicalConditions.includes(condition)}
                      disabled={formData.medicalConditions.includes('None') && condition !== 'None'}
                      onChange={(e) => {
                        if (condition === 'None') {
                          // If "None" is selected, clear all other selections
                          setFormData({
                            ...formData,
                            medicalConditions: e.target.checked ? ['None'] : []
                          });
                        } else {
                          // If any other condition is selected, remove "None" if it exists
                          const updatedConditions = e.target.checked
                            ? [...formData.medicalConditions.filter(c => c !== 'None'), condition]
                            : formData.medicalConditions.filter(c => c !== condition);
                          setFormData({ ...formData, medicalConditions: updatedConditions });
                        }
                      }}
                    />
                    <span className={`ml-2 text-sm ${formData.medicalConditions.includes('None') && condition !== 'None'
                      ? 'text-gray-400'
                      : 'text-gray-600'
                      }`}>
                      {condition}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />

              <textarea
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
              />

              {/* Emergency Contact */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Emergency Contact</h4>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="Emergency Contact Name"
                  value={formData.emergencyContact.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                  })}
                />
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="Emergency Contact Phone"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                  })}
                />
                <input
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="Relationship"
                  value={formData.emergencyContact.relation}
                  onChange={(e) => setFormData({
                    ...formData,
                    emergencyContact: { ...formData.emergencyContact, relation: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign up
            </button>
          </div>
        </form>
        <p className="text-center">
          Already have an account? <Link to="/login" className="text-red-600 hover:text-red-700">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
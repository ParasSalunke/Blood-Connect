import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { MoonLoader } from 'react-spinners';

const MyAccount = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const medicalConditions = [
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "HIV/AIDS",
    "Hepatitis",
    "None"
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

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setEditedData(data);
      } else {
        setError("User data not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true); // Start loading
      const user = auth.currentUser;
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, editedData);
      setUserData(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
      setError(error.message);
    } finally {
      setIsSaving(false); // Stop loading regardless of outcome
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <MoonLoader
        size={50}
        color={"#400606"}
        loading={true}
        cssOverride={{}} />
    </div>
  );
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 bg-[#161a1b] text-white text-2xl">{error}</div>;
  if (!userData) return <div className="min-h-screen flex items-center justify-center text-white bg-[#161a1b]">No user data available</div>;

  const inputClasses = "w-full p-2 rounded bg-[#242829] border-[#400606] text-white placeholder-gray-400 focus:border-[#260303] focus:ring-[#260303] focus:ring-1 outline-none";
  const headingClasses = "text-lg font-semibold mb-4 text-white";
  const textClasses = "text-gray-300";
  const labelClasses = "text-white font-medium";

  return (
    <div className="min-h-screen text-white bg-[#161a1b] py-12">
      <div className="max-w-4xl mx-auto bg-[#1a1f20] rounded-xl shadow-2xl p-10">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10 border-b border-[#400606] pb-6">
          <h2 className="text-4xl font-bold text-white tracking-tight">My Account</h2>
          <div className="flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 text-sm font-semibold rounded-lg text-white bg-[#400606] hover:bg-[#260303] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Back
            </button>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="px-6 py-2.5 text-sm font-semibold rounded-lg text-white bg-[#400606] hover:bg-[#260303] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {isEditing ? (
            <>
              {/* Personal Information Section - Editing Mode */}
              <div className="bg-[#242829] p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-6 text-white border-b border-[#400606] pb-2">
                  Personal Information
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editedData.email}
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg bg-[#1a1f20] border border-[#400606] text-gray-400 cursor-not-allowed"
                    />
                  </div>

                  {[
                    { name: 'bloodGroup', label: 'Blood Group', type: 'text' },
                    { name: 'age', label: 'Age', type: 'number' },
                    { name: 'weight', label: 'Weight (kg)', type: 'number' },
                    {
                      name: 'gender',
                      label: 'Gender',
                      type: 'select',
                      options: [

                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                        { value: 'other', label: 'Other' },
                      ]
                    }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {field.label}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          name={field.name}
                          value={editedData[field.name]}
                          onChange={handleChange}
                          className="appearance-none w-full px-4 py-2.5 rounded-lg bg-[#1a1f20] border border-[#400606] text-white focus:ring-2 focus:ring-[#400606] transition-all duration-200"
                        >
                          {field.options.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={editedData[field.name]}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-lg bg-[#1a1f20] border border-[#400606] text-white focus:ring-2 focus:ring-[#400606] transition-all duration-200"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Section - Editing Mode */}
              <div className="bg-[#242829] p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-6 text-white border-b border-[#400606] pb-2">
                  Location Details
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      State
                    </label>
                    <select
                      name="state"
                      value={editedData.state}
                      onChange={(e) => {
                        const newState = e.target.value;
                        setEditedData(prev => ({
                          ...prev,
                          state: newState,
                          district: '' // Reset district when state changes
                        }));
                      }}
                      className="appearance-none w-full px-4 py-2.5 rounded-lg bg-[#1a1f20] border border-[#400606] text-white focus:ring-2 focus:ring-[#400606] transition-all duration-200"
                    >
                      <option value="">Select State</option>
                      {Object.keys(stateDistricts).map(state => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      District
                    </label>
                    <select
                      name="district"
                      value={editedData.district}
                      onChange={handleChange}
                      disabled={!editedData.state}
                      className="appearance-none w-full px-4 py-2.5 rounded-lg bg-[#1a1f20] border border-[#400606] text-white focus:ring-2 focus:ring-[#400606] transition-all duration-200"
                    >
                      <option value="">Select District</option>
                      {editedData.state &&
                        stateDistricts[editedData.state].map(district => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={editedData.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2.5 rounded-lg bg-[#1a1f20] border border-[#400606] text-white focus:ring-2 focus:ring-[#400606] transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Medical Information Section - Editing Mode */}
              <div className="bg-[#242829] p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-6 text-white border-b border-[#400606] pb-2">
                  Medical Information
                </h3>
                <div className="space-y-4">
                  {medicalConditions.map(condition => (
                    <label
                      key={condition}
                      className={`flex items-center p-3 rounded-lg hover:bg-[#1a1f20] transition-colors duration-200 ${editedData.medicalConditions?.includes('None') && condition !== 'None'
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                        }`}
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-[#400606] text-[#400606] bg-[#1a1f20] focus:ring-[#260303]"
                        value={condition}
                        checked={editedData.medicalConditions?.includes(condition)}
                        disabled={editedData.medicalConditions?.includes('None') && condition !== 'None'}
                        onChange={(e) => {
                          if (condition === 'None') {
                            setEditedData(prev => ({
                              ...prev,
                              medicalConditions: e.target.checked ? ['None'] : []
                            }));
                          } else {
                            const updatedConditions = e.target.checked
                              ? [...(editedData.medicalConditions || []).filter(c => c !== 'None'), condition]
                              : (editedData.medicalConditions || []).filter(c => c !== condition);
                            setEditedData(prev => ({
                              ...prev,
                              medicalConditions: updatedConditions
                            }));
                          }
                        }}
                      />
                      <span className={`ml-3 text-sm ${editedData.medicalConditions?.includes('None') && condition !== 'None'
                        ? 'text-gray-500'
                        : 'text-gray-300'
                        }`}>
                        {condition}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Emergency Contact Section - Editing Mode */}
              <div className="bg-[#242829] p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-6 text-white border-b border-[#400606] pb-2">
                  Emergency Contact
                </h3>
                <div className="space-y-5">
                  {[
                    { name: 'name', label: 'Contact Name', type: 'text' },
                    { name: 'phone', label: 'Phone Number', type: 'tel' },
                    { name: 'relation', label: 'Relationship', type: 'text' }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={editedData.emergencyContact[field.name]}
                        onChange={handleEmergencyContactChange}
                        className="w-full px-4 py-2.5 rounded-lg bg-[#1a1f20] border border-[#400606] text-white focus:ring-2 focus:ring-[#400606] transition-all duration-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* View Mode Sections */}
              <div className="bg-[#242829] p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-6 text-white border-b border-[#400606] pb-2">
                  Personal Information
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Email', value: userData.email },
                    { label: 'Blood Group', value: userData.bloodGroup },
                    { label: 'Age', value: userData.age },
                    { label: 'Weight', value: `${userData.weight} kg` },
                    { label: 'Gender', value: userData.gender }
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col">
                      <span className="text-sm text-gray-400">{item.label}</span>
                      <span className="text-white font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#242829] p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-6 text-white border-b border-[#400606] pb-2">
                  Location Details
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'State', value: userData.state },
                    { label: 'District', value: userData.district },
                    { label: 'Address', value: userData.address }
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col">
                      <span className="text-sm text-gray-400">{item.label}</span>
                      <span className="text-white font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#242829] p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-6 text-white border-b border-[#400606] pb-2">
                  Medical Information
                </h3>
                <div className="space-y-2">
                  <span className="text-sm text-gray-400">Medical Conditions</span>
                  <ul className="list-disc pl-5 space-y-1">
                    {userData.medicalConditions?.length > 0 ? (
                      userData.medicalConditions.map((condition, index) => (
                        <li key={index} className="text-white">{condition}</li>
                      ))
                    ) : (
                      <li className="text-gray-400">No medical conditions listed</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="bg-[#242829] p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-6 text-white border-b border-[#400606] pb-2">
                  Emergency Contact
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Name', value: userData.emergencyContact?.name },
                    { label: 'Phone', value: userData.emergencyContact?.phone },
                    { label: 'Relation', value: userData.emergencyContact?.relation }
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col">
                      <span className="text-sm text-gray-400">{item.label}</span>
                      <span className="text-white font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="mt-10 flex justify-center gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="group relative w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#400606] hover:bg-[#260303] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="flex items-center justify-center">
                    <MoonLoader size={15} color={"#ffffff"} loading={true} />
                    <span className="ml-2">Saving...</span>
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#400606] hover:bg-[#260303] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#400606] hover:bg-[#260303] transition-colors duration-200"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
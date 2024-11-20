// src/components/sections/blood-bank-map/blood-bank-map.jsx
import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { bloodBanksData } from '../../../data/bloodData';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const BloodBankMap = () => {
  const [selectedBank, setSelectedBank] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Center on India
  const defaultCenter = [20.5937, 78.9629];
  const defaultZoom = 5;

  // Filter blood banks based on search query
  const filteredBloodBanks = useMemo(() => {
    return bloodBanksData.filter(bank => 
      bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bank.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="bg-gradient-to-r from-dark via-dark_red to-dark p-8 rounded-2xl">
      <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-off_white to-white text-2xl sm:text-3xl font-extrabold mb-8 tracking-wide">
        Blood Banks in India
      </h2>
      
      {/* Search input */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search blood banks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-3 rounded-lg bg-dark_red text-white placeholder-gray-300 border border-red "
        />
      </div>

      {/* Map container with higher z-index */}
      <div className="h-[70vh] w-full rounded-xl overflow-hidden shadow-lg relative">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: "100%", width: "100%", zIndex: 1 }}
          maxBounds={[
            [6.4626999, 68.1766451],  // Southwest
            [35.6745457, 97.395561]    // Northeast
          ]}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredBloodBanks.map(bank => (
            <Marker
              key={bank.id}
              position={bank.position}
              eventHandlers={{
                click: () => setSelectedBank(bank),
              }}
            >
              <Popup>
                <div className="p-4">
                  <h3 className="font-bold text-xl text-dark_red mb-2">{bank.name}</h3>
                  <p className="text-sm text-gray-300">{bank.address}</p>
                  <p className="text-sm mt-2 text-gray-300">
                    <span className="font-semibold">Contact:</span> {bank.contact}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Results count */}
      <div className="mt-6 text-dark text-lg">
        Showing {filteredBloodBanks.length} blood banks
      </div>
    </div>
  );
};

export default BloodBankMap;
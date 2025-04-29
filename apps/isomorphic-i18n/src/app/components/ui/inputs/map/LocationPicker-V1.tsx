import React, { useCallback, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

interface LocationPickerProps {
  onLocationChange: (location: { lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number };
}

const mapContainerStyle = {
  width: '100%',
  height: '270px',
};

const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default center point (San Francisco)

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationChange, initialLocation = defaultCenter }) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number }>(initialLocation);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCPQicAmrON3EtFwOmHvSZQ9IbONbLQmtA', // Add your API key here
  });

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      const lat = event.latLng?.lat();
      const lng = event.latLng?.lng();
      if (lat && lng) {
        const newLocation = { lat, lng };
        setSelectedLocation(newLocation);
        onLocationChange(newLocation);
		console.log("lat: ",lat);
		console.log("lng: ",lng);
		
      }
    },
    [onLocationChange]
  );

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={14}
      center={selectedLocation}
      onClick={handleMapClick}
    >
      <Marker position={selectedLocation} />
    </GoogleMap>
  );
};

export default LocationPicker;

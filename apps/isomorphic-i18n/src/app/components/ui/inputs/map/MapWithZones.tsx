import React, { useCallback, useState, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript, Circle } from '@react-google-maps/api';

interface MapWithZonesProps {
  onLocationChange: (location: { lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number };
  zones: { center: { lat: number; lng: number }; radius: number; color?: string }[];
}

const mapContainerStyle = {
  width: '100%',
  height: '350px',
};

const defaultCenter = { lat: 37.7749, lng: -122.4194 };

const MapWithZones: React.FC<MapWithZonesProps> = ({
  onLocationChange,
  initialLocation = defaultCenter,
  zones = [],
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number }>(initialLocation);
  const API_KEY = 'AIzaSyCPQicAmrON3EtFwOmHvSZQ9IbONbLQmtA'; 
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
  });

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      const lat = event.latLng?.lat();
      const lng = event.latLng?.lng();
      if (lat && lng) {
        const newLocation = { lat, lng };
        setSelectedLocation(newLocation);
        onLocationChange(newLocation);
      }
    },
    [onLocationChange]
  );

  useEffect(() => {
    setSelectedLocation(initialLocation);
  }, [initialLocation]);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={14}
      center={selectedLocation}
    //   onClick={handleMapClick}
    >
      <Marker position={selectedLocation} />

      {zones.map((zone, index) => (
        <Circle
          key={index}
          center={zone.center}
          radius={zone.radius}
          options={{
            strokeColor: zone.color || '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: zone.color || '#FF0000',
            fillOpacity: 0.35,
            clickable: false,
            zIndex: 1,
          }}
        />
      ))}
    </GoogleMap>
  );
};

export default MapWithZones;

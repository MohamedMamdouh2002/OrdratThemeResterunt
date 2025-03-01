import React from 'react';

const API_KEY = 'AIzaSyCPQicAmrON3EtFwOmHvSZQ9IbONbLQmtA'; 

const MapEmbed = ({
	latitude,
	longitude,
	zoom = 15,
	width = '100%',
	height = '100%',
	allowFullScreen = false
}: {
	latitude: number;
	longitude: number;
	zoom?: number;
	width?: string;
	height?: string;
	allowFullScreen?: boolean;
}) => {
	// Generate the URL for the Google Maps Embed API with a marker
	const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${latitude},${longitude}&zoom=${zoom}`;

	return (
		<iframe
			src={mapUrl}
			width={width}
			height={height}
			style={{ border: 0 }}
			allowFullScreen={allowFullScreen}
			loading="lazy"
			referrerPolicy="no-referrer-when-downgrade"
			title="Google Maps"
		></iframe>
	);
};

export default MapEmbed;

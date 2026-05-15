import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create a custom red icon for the consumer
const consumerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function Logistics() {
  // Focus closer on a specific neighborhood in Blantyre
  const mapCenter: [number, number] = [-15.7861, 35.0058];

  const mockCouriers = [
    { id: 1, name: 'James Phiri (Motorcycle)', pos: [-15.7830, 35.0020] as [number, number] },
    { id: 2, name: 'Kondwani Mtika (Car)', pos: [-15.7920, 35.0120] as [number, number] },
  ];

  // Mock active order route (Uber style)
  const activeOrder = {
    courierPos: [-15.7830, 35.0020] as [number, number],
    consumerPos: [-15.7885, 35.0085] as [number, number],
    route: [
      [-15.7830, 35.0020],
      [-15.7835, 35.0050],
      [-15.7860, 35.0070],
      [-15.7885, 35.0085],
    ] as [number, number][]
  };

  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header" style={{ flexShrink: 0 }}>
        <h1 className="page-title">Live Logistics Map</h1>
        <p className="page-subtitle">Track active couriers, live routes, and consumer locations in high detail.</p>
      </div>

      <div className="glass-panel" style={{ flex: 1, padding: '16px', overflow: 'hidden', minHeight: '600px' }}>
        <MapContainer 
          center={mapCenter} 
          zoom={15} // Deeper initial zoom
          maxZoom={19} // Enable deep street-level zoom
          style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
            maxZoom={19}
          />
          
          {/* Active Order Route */}
          <Polyline positions={activeOrder.route} color="var(--primary)" weight={4} dashArray="10, 10" />

          {/* Consumer Marker */}
          <Marker position={activeOrder.consumerPos} icon={consumerIcon}>
            <Popup>
              <strong>Order #8821 Destination</strong><br/>
              Customer: Sarah M.<br/>
              Status: Waiting for delivery
            </Popup>
          </Marker>

          {/* Courier Markers */}
          {mockCouriers.map((courier) => (
            <Marker key={courier.id} position={courier.pos}>
              <Popup>
                <strong>{courier.name}</strong><br/>
                Status: On Delivery<br/>
                ETA: 12 mins
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

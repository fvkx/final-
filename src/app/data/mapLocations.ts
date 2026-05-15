// This file contains static map location data
// To integrate with a CMS:
// 1. Replace this with an API call to your CMS
// 2. Example: export const getMapLocations = async () => await fetch('/api/map-locations')

export interface MapLocation {
  id: string;
  name: string;
  region: string;
  position: {
    top: string;
    left: string;
  };
}

export const mapLocations: MapLocation[] = [
  { id: '1', name: 'Tropical Paradise', position: { top: '45%', left: '75%' }, region: 'Indian Ocean' },
  { id: '2', name: 'Mountain Valley', position: { top: '35%', left: '55%' }, region: 'Alpine' },
  { id: '3', name: 'Historic City', position: { top: '40%', left: '45%' }, region: 'Europe' },
  { id: '4', name: 'Desert Oasis', position: { top: '48%', left: '50%' }, region: 'Middle East' },
  { id: '5', name: 'Coastal Beauty', position: { top: '30%', left: '20%' }, region: 'Pacific' },
  { id: '6', name: 'Cultural Hub', position: { top: '55%', left: '65%' }, region: 'Asia' }
];

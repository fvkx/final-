// CMS Integration Layer
// This file provides a centralized place to integrate with your CMS
// Replace these functions with actual CMS API calls when ready

import { destinations } from '../data/destinations';
import type { Destination } from '../data/destinations';
import { activities } from '../data/activities';
import type { Activity } from '../data/activities';
import { travelTips } from '../data/travelTips';
import type { TravelTip } from '../data/travelTips';
import { mapLocations } from '../data/mapLocations';
import type { MapLocation } from '../data/mapLocations';

// ============================================
// DESTINATIONS
// ============================================

export async function getDestinations(): Promise<Destination[]> {
  // TODO: Replace with CMS API call
  // Example with Contentful:
  // const entries = await client.getEntries({ content_type: 'destination' });
  // return entries.items.map(item => ({ ... }));

  // Example with Strapi:
  // const response = await fetch('https://your-strapi.com/api/destinations?populate=*');
  // const data = await response.json();
  // return data.data;

  return destinations;
}

export async function getDestinationById(id: string): Promise<Destination | undefined> {
  // TODO: Replace with CMS API call
  // Example:
  // const entry = await client.getEntry(id);
  // return { ... };

  const allDestinations = await getDestinations();
  return allDestinations.find(d => d.id === id);
}

// ============================================
// ACTIVITIES
// ============================================

export async function getActivities(): Promise<Activity[]> {
  // TODO: Replace with CMS API call
  return activities;
}

// ============================================
// TRAVEL TIPS
// ============================================

export async function getTravelTips(): Promise<TravelTip[]> {
  // TODO: Replace with CMS API call
  return travelTips;
}

// ============================================
// MAP LOCATIONS
// ============================================

export async function getMapLocations(): Promise<MapLocation[]> {
  // TODO: Replace with CMS API call
  return mapLocations;
}

// ============================================
// CMS CLIENT CONFIGURATION (Example)
// ============================================

/*
// Uncomment and configure when ready to use a CMS

// CONTENTFUL EXAMPLE:
import { createClient } from 'contentful';

const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// STRAPI EXAMPLE:
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || '';

// SANITY EXAMPLE:
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});
*/

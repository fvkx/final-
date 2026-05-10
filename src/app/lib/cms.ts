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

import { API_BASE_URL } from './apiConfig';

export async function getDestinations(): Promise<Destination[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/places.php`);
    if (!response.ok) return destinations;
    
    const result = await response.json();
    if (result.success && result.data) {
      return result.data.map((place: any) => ({
        id: String(place.id),
        name: place.name,
        category: place.category === 'tourist-spot' ? 'Nature' : 'Heritage', // basic mapping
        location: 'Balingasag, Misamis Oriental', // Default since not in DB
        description: place.description,
        longDescription: place.description, // Default since not in DB
        imageUrl: place.image_url ? (API_BASE_URL.replace('/api/admin', '') + place.image_url) : 'https://images.unsplash.com/photo-1758782551916-1723a9cd00eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        bestTime: 'Year-round',
        whyVisit: place.description,
        highlights: [place.category.replace('_', ' ')]
      }));
    }
  } catch (e) {
    console.error('Failed to fetch destinations from API:', e);
  }
  
  // Fallback to static data
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

export async function getPageBySlug(slug: string, preview: boolean = false) {
  try {
    const url = `${API_BASE_URL}/content.php?slug=${slug}${preview ? '&preview=1' : ''}`;
    const response = await fetch(url);
    if (response.ok) {
      const result = await response.json();
      return result.data;
    }
  } catch (error) {
    console.error('Failed to fetch dynamic page:', error);
  }
  return null;
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

// Balingasag Tourist Spots Data
// To integrate with a CMS:
// 1. Replace this with an API call to your CMS (e.g., Contentful, Strapi, Sanity)
// 2. Example: export const getDestinations = async () => await fetch('/api/destinations')

export interface Destination {
  id: string;
  name: string;
  category: 'Beach' | 'Waterfalls' | 'Heritage' | 'Nature' | 'Religious' | 'Cultural';
  location: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  bestTime: string;
  whyVisit: string;
  highlights: string[];
}

export const destinations: Destination[] = [
  {
    id: '1',
    name: 'Balingasag Beach',
    category: 'Beach',
    location: 'Poblacion, Balingasag, Misamis Oriental',
    description: 'A pristine stretch of white sand along the calm shores of Macajalar Bay — perfect for swimming, sunrise views, and fresh seafood.',
    longDescription: 'Balingasag Beach is one of the most beloved shorelines in Misamis Oriental, stretching along the cool waters of Macajalar Bay. The beach is known for its soft white sand, gentle waves, and breathtaking sunrise views over the bay. Local fishermen launch their boats early morning, adding to the authentic coastal charm. Visitors can enjoy fresh seafood from nearby eateries, take a dip in the calm turquoise waters, or simply relax under the shade of coconut palms. The beach is easily accessible from the town center and is especially lively on weekends when families and groups gather for picnics and recreation.',
    imageUrl: 'https://images.unsplash.com/photo-1758782551916-1723a9cd00eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lJTIwdHJvcGljYWwlMjBiZWFjaCUyMGNvYXN0bGluZXxlbnwxfHx8fDE3Nzc5NjU4OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bestTime: 'November – May',
    whyVisit: 'Ideal for swimming, sunrise watching, and savoring fresh catch-of-the-day seafood along the bay.',
    highlights: ['Swimming', 'Sunrise Views', 'Seafood Dining', 'Beach Picnic', 'Fishing Community']
  },
  {
    id: '2',
    name: 'Binaliw Falls',
    category: 'Waterfalls',
    location: 'Barangay Binaliw, Balingasag',
    description: 'A stunning multi-tiered waterfall nestled in the lush rainforests of Balingasag\'s interior highlands — a refreshing escape into nature.',
    longDescription: 'Binaliw Falls is one of Balingasag\'s crown jewels, hidden deep within the verdant rainforests of the municipality\'s highlands. The falls cascade down multiple tiers of mossy rock into a clear, emerald-green pool below — perfect for a refreshing swim. The trek to the falls winds through scenic forested trails rich with local flora and fauna. Guides from the barangay are available to lead visitors safely through the jungle path. The natural surroundings are ideal for photography, birdwatching, and simply reconnecting with nature. The sound of rushing water and the cool mist make this a popular destination especially during the warmer months.',
    imageUrl: 'https://images.unsplash.com/photo-1739045969692-f694965be10c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lcyUyMHdhdGVyZmFsbCUyMG5hdHVyZXxlbnwxfHx8fDE3Nzc5NjU4OTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bestTime: 'December – June',
    whyVisit: 'Cool off in a pristine jungle waterfall surrounded by untouched rainforest and stunning biodiversity.',
    highlights: ['Swimming', 'Nature Trekking', 'Photography', 'Birdwatching', 'Guided Tours']
  },
  {
    id: '3',
    name: 'St. Michael the Archangel Parish Church',
    category: 'Religious',
    location: 'Poblacion, Balingasag',
    description: 'A centuries-old Catholic parish church in the heart of Balingasag\'s town center — an enduring symbol of faith, heritage, and community.',
    longDescription: 'The St. Michael the Archangel Parish Church stands as one of Balingasag\'s most important historical and spiritual landmarks. Founded during the Spanish colonial era, the church has witnessed centuries of local history and remains the center of religious life in the municipality. Its architecture reflects a blend of colonial and modern influences, with a solemn interior adorned with religious iconography and stained glass. The church is especially vibrant during the town fiesta in honor of St. Michael, when processions, masses, and cultural activities fill the surrounding plaza. Visitors are welcome to attend mass, explore the grounds, and learn about the church\'s rich historical heritage.',
    imageUrl: 'https://images.unsplash.com/photo-1760549310131-b09d86c601e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lcyUyMGhlcml0YWdlJTIwY2h1cmNoJTIwY29sb25pYWx8ZW58MXx8fHwxNzc3OTY1ODk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    bestTime: 'Year-round',
    whyVisit: 'Experience centuries of colonial history and spiritual heritage at this iconic town landmark.',
    highlights: ['Heritage Architecture', 'Religious Site', 'Cultural History', 'Town Fiesta', 'Photography']
  },
  {
    id: '4',
    name: 'Macajalar Bay View Deck',
    category: 'Nature',
    location: 'Balingasag Coastal Area',
    description: 'A scenic overlook offering panoramic views of the wide Macajalar Bay — stunning at sunset with hues of gold, orange, and purple filling the horizon.',
    longDescription: 'The Macajalar Bay View Deck is one of the most photographed spots in Balingasag, offering sweeping 180-degree views of Macajalar Bay and the distant mountain ranges beyond. The deck is especially popular at sunset, when the sky transforms into a canvas of brilliant colors reflected on the calm bay waters. Visitors often bring binoculars to spot migratory birds and passing fishing boats. Benches and pavilions allow visitors to sit and enjoy the peaceful scenery. The area is well-maintained by the local government and makes for a perfect afternoon escape from the town center. Sunrise views are equally spectacular, with the bay glowing in soft morning light.',
    imageUrl: 'https://images.unsplash.com/photo-1646821198791-a3e16385a689?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0JTIwUGhpbGlwcGluZXMlMjBpc2xhbmR8ZW58MXx8fHwxNzc3OTY1ODk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    bestTime: 'October – April',
    whyVisit: 'Witness some of the most spectacular sunsets in Misamis Oriental over the tranquil Macajalar Bay.',
    highlights: ['Sunset Views', 'Photography', 'Birdwatching', 'Scenic Picnic', 'Bay Panorama']
  },
  {
    id: '5',
    name: 'Balingasag Marine Sanctuary',
    category: 'Nature',
    location: 'Coastal Barangay, Balingasag',
    description: 'A protected marine sanctuary teeming with colorful coral reefs, tropical fish, and diverse marine biodiversity ideal for snorkeling and diving.',
    longDescription: 'The Balingasag Marine Sanctuary is a protected area established to conserve the rich marine biodiversity of the Macajalar Bay coastline. The sanctuary is home to vibrant coral gardens, sea turtles, various reef fish species, and other marine life. Visitors can arrange snorkeling and freediving sessions with the assistance of local community guides who are knowledgeable about the ecosystem. The sanctuary also serves as an educational site, with local fishermen and conservation volunteers explaining the importance of marine protection. Visitors are reminded to follow eco-friendly guidelines: no touching of corals, no feeding of fish, and no collection of marine specimens.',
    imageUrl: 'https://images.unsplash.com/photo-1771905266354-d134ad8c459a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lcyUyMGNvcmFsJTIwcmVlZiUyMHNub3JrZWxpbmclMjB1bmRlcndhdGVyfGVufDF8fHx8MTc3Nzk2NTkwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    bestTime: 'March – June',
    whyVisit: 'Discover an underwater world of colorful coral reefs and tropical marine life just offshore.',
    highlights: ['Snorkeling', 'Marine Life', 'Eco-Tourism', 'Photography', 'Conservation Education']
  },
  {
    id: '6',
    name: 'Balatukan Mountain Range',
    category: 'Nature',
    location: 'Upland Barangays, Balingasag',
    description: 'The majestic mountain ranges bordering Balingasag\'s upland barangays — offering rewarding hiking trails, cool mountain air, and breathtaking ridge views.',
    longDescription: 'The Balatukan Mountain Range forms the picturesque backdrop of Balingasag, visible from almost anywhere in the town. The mountains offer several hiking trails that wind through tropical forests, coffee farms, and indigenous communities. The summit rewards hikers with unrivaled panoramic views of Macajalar Bay and the surrounding towns. The cool highland climate is a refreshing contrast to the coastal heat below. The area is also known for its rich agricultural heritage — local farmers grow bananas, pineapples, and various root crops along the mountain slopes. Community-based ecotourism initiatives allow visitors to experience rural highland life firsthand.',
    imageUrl: 'https://images.unsplash.com/photo-1739769234606-6ca9c9ecc925?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lcyUyMG1vdW50YWluJTIwaGlraW5nJTIwbmF0dXJlJTIwdHJhaWx8ZW58MXx8fHwxNzc3OTY1ODk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    bestTime: 'November – April',
    whyVisit: 'Trek through lush highlands and be rewarded with sweeping views of Macajalar Bay and the valleys below.',
    highlights: ['Hiking', 'Mountain Views', 'Cool Climate', 'Coffee Farms', 'Local Agriculture']
  },
  {
    id: '7',
    name: 'Mangrove Eco-Park',
    category: 'Nature',
    location: 'Coastal Barangay, Balingasag',
    description: 'A community-managed mangrove forest offering guided boat tours through lush tidal waterways, rich in birdlife and coastal biodiversity.',
    longDescription: 'The Balingasag Mangrove Eco-Park is a community-led ecotourism destination along the municipality\'s coastal fringe. Visitors can take guided boat tours through the winding mangrove channels, observing the unique root systems, nesting birds, and marine nursery habitats. The mangroves serve as a critical buffer zone against storm surges and a breeding ground for commercially important fish species. Community volunteers serve as knowledgeable guides, sharing insight into the ecological importance of mangrove forests and ongoing conservation efforts. Sunrise tours are particularly popular, when the forest comes alive with birdcalls and morning mist hovers over the water.',
    imageUrl: 'https://images.unsplash.com/photo-1771767643385-0d329fc614a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lcyUyMG1hbmdyb3ZlJTIwZm9yZXN0JTIwbmF0dXJlfGVufDF8fHx8MTc3Nzk2NTg5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    bestTime: 'Year-round',
    whyVisit: 'Experience a serene boat journey through a thriving mangrove ecosystem rich with birdlife and natural beauty.',
    highlights: ['Boat Tours', 'Birdwatching', 'Eco-Tourism', 'Nature Photography', 'Conservation']
  },
  {
    id: '8',
    name: 'Balingasag Public Market',
    category: 'Cultural',
    location: 'Poblacion, Balingasag',
    description: 'The vibrant heart of Balingasag\'s local economy — a lively market brimming with fresh produce, seafood, local delicacies, and handcrafted goods.',
    longDescription: 'The Balingasag Public Market is a culturally rich destination that offers visitors an authentic glimpse into the daily life of the municipality\'s residents. Early mornings are the most lively, with vendors setting up stalls of freshly caught fish, tropical fruits, native delicacies, and handwoven goods. The market is famous for fresh milkfish (bangus) caught daily from Macajalar Bay, as well as dried fish, coconut products, and seasonal fruits like lanzones and rambutan. Visitors can sample native kakanin (rice cakes) and sip freshly brewed barako coffee. The market is also a great place to purchase local crafts and souvenirs to bring home.',
    imageUrl: 'https://images.unsplash.com/photo-1759773533571-16c133e10ae8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lcyUyMGZpc2hpbmclMjB2aWxsYWdlJTIwY29tbXVuaXR5fGVufDF8fHx8MTc3Nzk2MjE2OHww&ixlib=rb-4.1.0&q=80&w=1080',
    bestTime: 'Year-round (best early morning)',
    whyVisit: 'Immerse yourself in local culture, sample native delicacies, and discover the authentic flavors of Balingasag.',
    highlights: ['Local Produce', 'Fresh Seafood', 'Native Delicacies', 'Handcrafts', 'Cultural Experience']
  },
  {
    id: '9',
    name: 'Sagaran Falls',
    category: 'Waterfalls',
    location: 'Barangay Sagaran, Balingasag',
    description: 'A secluded jungle waterfall in the upland barangay of Sagaran, offering a peaceful retreat amid towering trees and crystal-clear mountain water.',
    longDescription: 'Sagaran Falls is a hidden gem tucked away in the upland forests of Barangay Sagaran in Balingasag. Less visited than Binaliw Falls, this waterfall offers a more secluded and intimate experience with nature. The cascading waters form a natural pool ideal for swimming and relaxation. The journey to the falls involves a scenic hike through farmlands and secondary growth forests, passing through traditional communities where visitors can interact with friendly locals. The falls are surrounded by large boulders and tropical vegetation, making it a paradise for photographers and nature lovers. Community-organized picnic areas are available for group visits.',
    imageUrl: 'https://images.unsplash.com/photo-1646008863090-47d8d75b0ba1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNaW5kYW5hbyUyMFBoaWxpcHBpbmVzJTIwbGFuZHNjYXBlJTIwYWVyaWFsfGVufDF8fHx8MTc3Nzk2NTg5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    bestTime: 'December – May',
    whyVisit: 'A peaceful off-the-beaten-path waterfall ideal for those seeking solitude and undisturbed nature.',
    highlights: ['Swimming', 'Nature Hike', 'Photography', 'Picnic Areas', 'Community Tourism']
  }
];

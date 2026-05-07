// Balingasag Travel Tips Data
// To integrate with a CMS:
// 1. Replace this with an API call to your CMS
// 2. Example: export const getTravelTips = async () => await fetch('/api/travel-tips')

export interface TravelTip {
  id: string;
  category: string;
  title: string;
  tip: string;
  icon: string;
}

export interface TransportOption {
  from: string;
  method: string;
  duration: string;
  description: string;
  icon: string;
}

export interface Accommodation {
  name: string;
  type: string;
  description: string;
}

export interface Restaurant {
  name: string;
  specialty: string;
  description: string;
}

export const travelTips: TravelTip[] = [
  {
    id: '1',
    icon: 'cloudSun',
    category: 'Best Time to Visit',
    title: 'November to May is Ideal',
    tip: 'Balingasag enjoys a tropical climate. The dry season from November to May offers sunny skies and calm bay waters — perfect for beach visits, waterfall treks, and outdoor activities.'
  },
  {
    id: '2',
    icon: 'shirt',
    category: 'What to Bring',
    title: 'Pack Light & Practical',
    tip: 'Bring lightweight, breathable clothing, sunscreen (SPF 50+), a hat or cap, insect repellent, sturdy sandals or hiking shoes, a reusable water bottle, and a waterproof bag for beach and waterfall visits.'
  },
  {
    id: '3',
    icon: 'dollarSign',
    category: 'Budget Tips',
    title: 'Affordable Destination',
    tip: 'Balingasag is a budget-friendly destination. Carry Philippine Pesos (PHP) as most local eateries and markets operate on cash. ATMs are available in the town center. A daily budget of ₱500–₱1,000 covers meals, local transport, and activities comfortably.'
  },
  {
    id: '4',
    icon: 'heart',
    category: 'Respect & Culture',
    title: 'Embrace Local Customs',
    tip: 'Dress modestly when visiting the church or attending religious events. Ask permission before photographing locals, especially indigenous community members. A friendly "Maayong adlaw!" (Good day!) in Bisaya goes a long way.'
  },
  {
    id: '5',
    icon: 'leaf',
    category: 'Eco-Tourism',
    title: 'Leave No Trace',
    tip: 'When visiting natural sites like waterfalls, the marine sanctuary, or mangrove park, do not litter, collect marine life, or disturb the natural ecosystem. Join official guided tours to support local conservation efforts.'
  },
  {
    id: '6',
    icon: 'shield',
    category: 'Safety',
    title: 'Stay Safe & Informed',
    tip: 'Register at the Municipal Tourism Office before visiting remote spots like waterfalls or mountain trails. Keep emergency contacts handy: Balingasag Municipal Hall (088) 856-xxxx. Always inform someone of your plans when trekking.'
  }
];

export const transportOptions: TransportOption[] = [
  {
    from: 'Cagayan de Oro City (CDO)',
    method: 'Bus / Minibus',
    duration: '1.5 – 2 hours',
    description: 'Take a bus or minibus (Davao-bound) from the Agora Bus Terminal in Cagayan de Oro. Tell the driver/conductor you are going to Balingasag. Buses depart regularly throughout the day. Fare is approximately ₱80–₱120.',
    icon: 'bus'
  },
  {
    from: 'Cagayan de Oro City (CDO)',
    method: 'Private Vehicle / Car',
    duration: '1 hour (via Highway)',
    description: 'Drive via the Cagayan-Iligan highway (N1) eastward. After passing Opol and El Salvador, continue to Balingasag. The route is well-paved and clearly signposted. Ample parking is available in the town center.',
    icon: 'car'
  },
  {
    from: 'Gingoog City',
    method: 'Bus / Jeepney',
    duration: '45 minutes – 1 hour',
    description: 'From Gingoog City Bus Terminal, ride a bus or jeepney heading westward toward Cagayan de Oro. Balingasag is a major stop along this route. Fare is approximately ₱40–₱70.',
    icon: 'bus'
  },
  {
    from: 'Laguindingan Airport (CGY)',
    method: 'Taxi / Grab + Bus',
    duration: '1.5 – 2 hours',
    description: 'Take a taxi or Grab ride to the Agora Bus Terminal in Cagayan de Oro (30 min), then board a bus to Balingasag (1.5 hours). Alternatively, hire a private van directly from the airport to Balingasag.',
    icon: 'plane'
  }
];

export const accommodations: Accommodation[] = [
  {
    name: 'Balingasag Beach Cottages',
    type: 'Beach Resort / Cottages',
    description: 'Beachfront cottages along Macajalar Bay offering simple but comfortable lodging steps from the water. Ideal for groups and families.'
  },
  {
    name: 'Municipal Guesthouses',
    type: 'Budget Guesthouse',
    description: 'Affordable guesthouses in the poblacion area, within walking distance of the market, church, and town center amenities.'
  },
  {
    name: 'Cagayan de Oro Hotels (Day Trips)',
    type: 'Hotel (Nearby City)',
    description: 'Many visitors prefer staying in CDO and doing day trips to Balingasag (1.5 hrs). CDO has a wide range of hotels across all budgets.'
  }
];

export const restaurants: Restaurant[] = [
  {
    name: 'Bay-Side Seafood Eateries',
    specialty: 'Fresh Grilled Seafood',
    description: 'Small open-air restaurants along the beach serving freshly grilled bangus, squid, crabs, and fish caught that morning from the bay.'
  },
  {
    name: 'Public Market Food Stalls',
    specialty: 'Native Delicacies & Kakanin',
    description: 'The Balingasag Public Market has a section of food stalls where you can enjoy local rice cakes, puso, kinilaw, and steaming cups of barako coffee.'
  },
  {
    name: 'Town Center Carenderias',
    specialty: 'Traditional Filipino Meals',
    description: 'Affordable carenderias (local diners) throughout the town center serve hearty Filipino meals including sinigang, adobo, and lechon manok.'
  }
];

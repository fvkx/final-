// Balingasag Events & Festivals Data
// To integrate with a CMS:
// 1. Replace this with an API call to your CMS
// 2. Example: export const getEvents = async () => await fetch('/api/events')

export interface Event {
  id: string;
  name: string;
  date: string;
  month: number; // for sorting
  description: string;
  imageUrl: string;
  featured: boolean;
  category: 'Festival' | 'Religious' | 'Cultural' | 'Civic';
}

export const events: Event[] = [
  {
    id: '1',
    name: 'Balingasag Town Fiesta (Feast of St. Michael)',
    date: 'September 29',
    month: 9,
    description: 'The grandest celebration in Balingasag honoring its patron saint, St. Michael the Archangel. The fiesta features solemn religious processions, cultural street performances, parades, brass bands, traditional dances, and a festive trade fair. The entire municipality comes alive with colorful decorations and the spirit of community.',
    imageUrl: 'https://images.unsplash.com/photo-1581513118044-696c147c1a66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lJTIwZmVzdGl2YWwlMjBjb2xvcmZ1bCUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc3Nzk2NTg5NXww&ixlib=rb-4.1.0&q=80&w=1080',
    featured: true,
    category: 'Religious'
  },
  {
    id: '2',
    name: 'Kahimunan Festival',
    date: 'January (Fiesta Season)',
    month: 1,
    description: 'A vibrant cultural festival rooted in the traditions of the Higaonon indigenous community. Kahimunan celebrates the harvest season with tribal dances, indigenous rituals, colorful costumes, and traditional music. It is a meaningful opportunity to witness and honor the living culture of Misamis Oriental\'s indigenous peoples.',
    imageUrl: 'https://images.unsplash.com/photo-1768700848339-b2d5d6c59bcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTb3V0aGVhc3QlMjBBc2lhJTIwY3VsdHVyYWwlMjBkYW5jZSUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc3Nzk2NTkwNHww&ixlib=rb-4.1.0&q=80&w=1080',
    featured: true,
    category: 'Cultural'
  },
  {
    id: '3',
    name: 'Bangus (Milkfish) Festival',
    date: 'June',
    month: 6,
    description: 'A festive celebration of Balingasag\'s prized catch — the bangus (milkfish) from Macajalar Bay. The festival features cooking competitions, seafood feasts, fishing boat parades, and a live exhibit of the milkfish industry. Local restaurants and vendors showcase creative bangus dishes that highlight the unique flavors of the bay\'s catch.',
    imageUrl: 'https://images.unsplash.com/photo-1774249447184-6000acf571cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxGaWxpcGlubyUyMGZvb2QlMjB0cmFkaXRpb25hbCUyMGN1aXNpbmV8ZW58MXx8fHwxNzc3OTY1OTAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    featured: false,
    category: 'Cultural'
  },
  {
    id: '4',
    name: 'Balingasag Foundation Day',
    date: 'February 14',
    month: 2,
    description: 'An annual civic celebration marking the founding anniversary of the Municipality of Balingasag. The day is observed with flag ceremonies, cultural presentations, sports competitions, exhibits showcasing local history and achievements, and an evening program featuring local talent. It is a day of community pride and civic spirit.',
    imageUrl: 'https://images.unsplash.com/photo-1758782551912-80cf4c578220?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGlzbGFuZCUyMGJheSUyMFBoaWxpcHBpbmVzJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3Nzc5NjU5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    featured: false,
    category: 'Civic'
  },
  {
    id: '5',
    name: 'Lanzones & Fruit Festival',
    date: 'October',
    month: 10,
    description: 'A harvest festival celebrating Balingasag\'s abundance of tropical fruits, most notably the sweet lanzones for which the region is famous. The festival features fruit-eating contests, agricultural trade fairs, produce exhibits, and livelihood demonstrations. Visitors can sample and purchase fresh fruits directly from local farmers.',
    imageUrl: 'https://images.unsplash.com/photo-1546415324-8da35ca04c44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lcyUyMGZydWl0JTIwdHJvcGljYWwlMjBjb2NvbnV0JTIwaGFydmVzdHxlbnwxfHx8fDE3Nzc5NjU5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    featured: false,
    category: 'Cultural'
  },
  {
    id: '6',
    name: 'Holy Week Observances',
    date: 'March / April (moveable)',
    month: 4,
    description: 'Balingasag observes Holy Week with deep religious devotion. The Pabasa ng Pasyon (chanting of the Passion of Christ), solemn processions on Palm Sunday and Good Friday, and the Easter Vigil Mass are central traditions. The town\'s streets fill with faithful residents joining the religious march and participating in centuries-old rituals.',
    imageUrl: 'https://images.unsplash.com/photo-1760549310131-b09d86c601e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lcyUyMGhlcml0YWdlJTIwY2h1cmNoJTIwY29sb25pYWx8ZW58MXx8fHwxNzc3OTY1ODk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    featured: false,
    category: 'Religious'
  }
];

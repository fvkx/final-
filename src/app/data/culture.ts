// Balingasag Culture & Heritage Data
// To integrate with a CMS:
// 1. Replace this with an API call to your CMS
// 2. Example: export const getCulture = async () => await fetch('/api/culture')

export interface CultureSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  facts?: string[];
}

export const cultureSections: CultureSection[] = [
  {
    id: '1',
    title: 'Higaonon Indigenous Heritage',
    subtitle: 'The Original Peoples of Balingasag',
    description: 'Long before the colonial era, the Higaonon people — one of the Lumad indigenous groups of Mindanao — inhabited the highlands and forests of what is now Balingasag. Their rich oral traditions, customary laws (known as Adat), intricate weaving, traditional music, and deep reverence for the natural world form the foundation of Balingasag\'s cultural identity. Today, Higaonon communities in the upland barangays continue to preserve their heritage through rituals, art, and indigenous governance systems. Visitors can connect with this living culture through community visits and cultural demonstrations arranged through the Municipal Tourism Office.',
    imageUrl: 'https://images.unsplash.com/photo-1599302994569-6fd86e9529e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lJTIwaW5kaWdlbm91cyUyMGN1bHR1cmUlMjB3ZWF2aW5nJTIwY3JhZnRzfGVufDF8fHx8MTc3Nzk2NTkwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    facts: [
      'Higaonon means "people of the mountains" in their native tongue',
      'Traditional Higaonon weaving uses natural dyes from forest plants',
      'The Kahimunan festival celebrates the Higaonon harvest tradition',
      'Adat (customary law) governs conflict resolution in indigenous communities'
    ]
  },
  {
    id: '2',
    title: 'Spanish Colonial Legacy',
    subtitle: 'Faith, Architecture & Tradition',
    description: 'Three centuries of Spanish colonial rule left an indelible mark on Balingasag\'s cultural landscape. The establishment of the parish church, the introduction of Catholicism, and the reorganization of settlements around a central plaza created the municipal identity that persists to this day. Religious feast days, the practice of compadrazgo (godparenthood), traditional fiestas, and colonial-era architecture are all living remnants of this period. The St. Michael the Archangel Parish Church remains the most visible symbol of Balingasag\'s colonial heritage and continues to serve as the spiritual and social heart of the community.',
    imageUrl: 'https://images.unsplash.com/photo-1760549310131-b09d86c601e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lcyUyMGhlcml0YWdlJTIwY2h1cmNoJTIwY29sb25pYWx8ZW58MXx8fHwxNzc3OTY1ODk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    facts: [
      'Balingasag was formally established as a municipality during the Spanish period',
      'The town\'s central plaza and church layout follows the classic Spanish urban design',
      'Local surnames like dela Cruz and Santos reflect Spanish naming traditions',
      'Sinulog-style devotional dances are performed during religious feasts'
    ]
  },
  {
    id: '3',
    title: 'Local Festivals & Traditions',
    subtitle: 'Celebrations That Unite the Community',
    description: 'Balingasag\'s calendar is dotted with festivals and celebrations that bring together residents in joy, faith, and community spirit. From the grand town fiesta honoring St. Michael the Archangel to the indigenous Kahimunan festival and the harvest-themed Lanzones Festival, each celebration is a unique expression of the community\'s values and heritage. Traditional music performed on kulintang (gong instruments), bamboo instruments, and rondalla guitar ensembles fills the air during these events. Street dancing, beauty pageants, and folk performances add color and pageantry to each occasion.',
    imageUrl: 'https://images.unsplash.com/photo-1581513118044-696c147c1a66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGlsaXBwaW5lJTIwZmVzdGl2YWwlMjBjb2xvcmZ1bCUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc3Nzk2NTg5NXww&ixlib=rb-4.1.0&q=80&w=1080',
    facts: [
      'Town Fiesta: September 29 — Feast of St. Michael the Archangel',
      'Kahimunan Festival: January — Celebrates the Higaonon harvest',
      'Lanzones Festival: October — Celebrates the fruit harvest season',
      'Bangus Festival: June — Honors the milkfish fishing industry'
    ]
  },
  {
    id: '4',
    title: 'Local Cuisine & Food Culture',
    subtitle: 'Flavors From the Bay and the Mountains',
    description: 'Balingasag\'s cuisine is shaped by its geography — a coastal town backed by forested mountains. Seafood from Macajalar Bay forms the heart of the local diet, with fresh bangus (milkfish), squid, crabs, and shrimp prominently featured. Mountain produce such as gabi (taro), kamote (sweet potato), and an abundance of tropical fruits complement coastal flavors. Native delicacies include kakanin (rice-based sweets), puso (hanging rice), and various coconut-based dishes. Visitors should not miss trying freshly grilled bangus, kinilaw (ceviche-style raw fish), and the locally grown lanzones fruit in season.',
    imageUrl: 'https://images.unsplash.com/photo-1774249447184-6000acf571cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxGaWxpcGlubyUyMGZvb2QlMjB0cmFkaXRpb25hbCUyMGN1aXNpbmV8ZW58MXx8fHwxNzc3OTY1OTAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    facts: [
      'Bangus (milkfish) from Macajalar Bay is considered among the tastiest in the region',
      'Kinilaw — raw fish marinated in vinegar and ginger — is a beloved local dish',
      'Lanzones from Balingasag are sweet and thin-skinned, prized throughout Mindanao',
      'Coconut is integral to almost every traditional Higaonon and Visayan dish'
    ]
  }
];

// This file contains static activity data
// To integrate with a CMS:
// 1. Replace this with an API call to your CMS
// 2. Example: export const getActivities = async () => await fetch('/api/activities')

export interface Activity {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  icon: string;
}

export const activities: Activity[] = [
  {
    id: '1',
    title: 'Historic Landmarks',
    description: 'Visit ancient temples and architectural wonders',
    imageUrl: 'https://images.unsplash.com/photo-1598177183224-b3cec6da6b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwdGVtcGxlJTIwbGFuZG1hcmt8ZW58MXx8fHwxNzc3ODg1MTQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    icon: 'landmark'
  },
  {
    id: '2',
    title: 'Local Cuisine',
    description: 'Taste authentic flavors and street food',
    imageUrl: 'https://images.unsplash.com/photo-1771694583868-6bd6733adce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGZvb2QlMjBjdWlzaW5lJTIwc3RyZWV0fGVufDF8fHx8MTc3Nzc4NDA1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    icon: 'utensils'
  },
  {
    id: '3',
    title: 'Cultural Festivals',
    description: 'Experience vibrant traditions and celebrations',
    imageUrl: 'https://images.unsplash.com/photo-1772433594481-afd3d35cf1f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGZlc3RpdmFsJTIwdHJhdmVsfGVufDF8fHx8MTc3Nzg4NTEzOXww&ixlib=rb-4.1.0&q=80&w=1080',
    icon: 'camera'
  },
  {
    id: '4',
    title: 'Adventure Activities',
    description: 'Snorkeling, hiking, and outdoor experiences',
    imageUrl: 'https://images.unsplash.com/photo-1660315249137-29c09bd829a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxiZWFjaCUyMHRyb3BpY2FsJTIwcGFyYWRpc2V8ZW58MXx8fHwxNzc3ODg0ODYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    icon: 'waves'
  }
];

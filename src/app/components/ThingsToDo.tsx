import { Camera, Utensils, Landmark, Waves } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { activities } from '../data/activities';

// Icon mapping helper
const iconMap = {
  landmark: Landmark,
  utensils: Utensils,
  camera: Camera,
  waves: Waves
};

export function ThingsToDo() {
  return (
    <div className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Things to Do</h2>
          <p className="text-xl text-gray-600">Unforgettable experiences waiting for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((activity) => {
            const Icon = iconMap[activity.icon as keyof typeof iconMap] || Camera;
            return (
              <div key={activity.id} className="group cursor-pointer">
                <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                  <ImageWithFallback
                    src={activity.imageUrl}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <Icon className="w-8 h-8 mb-2" />
                      <h3 className="text-xl font-bold">{activity.title}</h3>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{activity.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

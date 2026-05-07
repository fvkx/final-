import { Info, Shirt, DollarSign, MessageCircle, Umbrella, Camera } from 'lucide-react';
import { travelTips } from '../data/travelTips';

// Icon mapping helper
const iconMap = {
  umbrella: Umbrella,
  messageCircle: MessageCircle,
  dollarSign: DollarSign,
  shirt: Shirt,
  camera: Camera,
  info: Info
};

export function TravelTips() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Essential Travel Tips</h2>
          <p className="text-xl text-gray-600">Make your journey smooth and memorable</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {travelTips.map((tip) => {
            const Icon = iconMap[tip.icon as keyof typeof iconMap] || Info;
            return (
              <div key={tip.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{tip.category}</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">{tip.title}</h3>
                    <p className="text-gray-700 text-sm">{tip.tip}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

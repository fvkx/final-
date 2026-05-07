import { Globe, Shield, Compass, Users } from 'lucide-react';

const features = [
  {
    icon: Globe,
    title: 'Worldwide Destinations',
    description: 'Access to over 500+ destinations across all continents'
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Your safety is our priority with verified accommodations'
  },
  {
    icon: Compass,
    title: 'Expert Guides',
    description: 'Local experts to help you explore every corner'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Join millions of travelers sharing their experiences'
  }
];

export function Features() {
  return (
    <div className="bg-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          <p className="text-xl text-gray-600">Everything you need for the perfect journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

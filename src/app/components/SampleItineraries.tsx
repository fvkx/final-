import { Clock, CheckCircle2 } from 'lucide-react';

const itineraries = [
  {
    title: '1-Day Tropical Island Escape',
    duration: '1 Day',
    destination: 'Maldives',
    color: 'from-blue-500 to-cyan-500',
    activities: [
      { time: '8:00 AM', activity: 'Sunrise beach yoga and meditation' },
      { time: '10:00 AM', activity: 'Snorkeling at coral reef' },
      { time: '1:00 PM', activity: 'Traditional island lunch' },
      { time: '3:00 PM', activity: 'Water sports or relaxation' },
      { time: '6:00 PM', activity: 'Sunset cruise' },
      { time: '8:00 PM', activity: 'Beachside dinner' }
    ]
  },
  {
    title: '3-Day Cultural City Tour',
    duration: '3 Days',
    destination: 'Historic City',
    color: 'from-purple-500 to-pink-500',
    activities: [
      { time: 'Day 1', activity: 'Old town walking tour, visit historic landmarks' },
      { time: 'Day 1', activity: 'Local market exploration and street food' },
      { time: 'Day 2', activity: 'Museum visits and cultural sites' },
      { time: 'Day 2', activity: 'Traditional cooking class' },
      { time: 'Day 3', activity: 'Day trip to nearby ancient ruins' },
      { time: 'Day 3', activity: 'Evening cultural performance' }
    ]
  },
  {
    title: '5-Day Mountain Adventure',
    duration: '5 Days',
    destination: 'Alpine Region',
    color: 'from-green-500 to-emerald-500',
    activities: [
      { time: 'Day 1', activity: 'Arrival and acclimatization hike' },
      { time: 'Day 2', activity: 'Full-day mountain trekking' },
      { time: 'Day 3', activity: 'Visit mountain villages and local culture' },
      { time: 'Day 4', activity: 'Scenic cable car ride and photography' },
      { time: 'Day 5', activity: 'Nature walk and departure' }
    ]
  }
];

export function SampleItineraries() {
  return (
    <div className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Sample Itineraries</h2>
          <p className="text-xl text-gray-600">Plan your perfect trip with these suggested schedules</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {itineraries.map((itinerary, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className={`bg-gradient-to-r ${itinerary.color} p-6 text-white`}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm font-semibold">{itinerary.duration}</span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{itinerary.title}</h3>
                <p className="text-white/90 text-sm">{itinerary.destination}</p>
              </div>

              <div className="p-6">
                <ul className="space-y-4">
                  {itinerary.activities.map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-gray-900 text-sm">{item.time}</span>
                        <p className="text-gray-700 text-sm">{item.activity}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 italic">These are suggested itineraries. Customize them based on your interests and pace!</p>
        </div>
      </div>
    </div>
  );
}

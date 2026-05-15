import { Search, ArrowDown } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1714412192114-61dca8f15f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHRyb3BpY2FsJTIwcGFyYWRpc2V8ZW58MXx8fHwxNzc3ODg0ODYzfDA&ixlib=rb-4.1.0&q=80&w=1080)'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">Find Your Next Journey</h1>
        <p className="text-2xl md:text-3xl mb-4">Discover. Dream. Explore.</p>
        <p className="text-lg md:text-xl mb-12 text-white/90">Visual guides and inspiration for your perfect destination</p>

        <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-full overflow-hidden shadow-2xl max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search destinations, activities, or regions..."
            className="flex-1 px-6 py-4 text-gray-900 outline-none bg-transparent"
          />
          <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 transition-colors duration-300">
            <Search className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-16">
          <ArrowDown className="w-8 h-8 mx-auto animate-bounce" />
        </div>
      </div>
    </div>
  );
}

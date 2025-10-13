import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About Michigan Munchies</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              Michigan Munchies is your go-to resource for discovering the best food experiences across the Great Lakes State. 
              From bustling Detroit food trucks to cozy northern Michigan cafes, we're mapping Michigan's incredible culinary scene.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="mb-4">
              We believe that great food brings people together. Our mission is to connect Michiganders and visitors 
              with the diverse, delicious, and often hidden culinary gems that make our state special.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Curate and map the best restaurants, food trucks, and local eats across Michigan</li>
              <li>Provide detailed information about cuisines, price ranges, and special features</li>
              <li>Help you discover new places based on your location and preferences</li>
              <li>Support local businesses by driving traffic to authentic Michigan establishments</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4">Get In Touch</h2>
            <p>
              Have a favorite Michigan eatery you'd like us to feature? Know of a hidden gem that deserves recognition? 
              We'd love to hear from you and help showcase the amazing food scene in your community.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

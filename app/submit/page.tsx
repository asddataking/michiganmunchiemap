import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function SubmitPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Submit a Place</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              We'd love to hear about your favorite Michigan eateries! While we're currently in our curation phase, 
              we're always looking for exceptional places to feature.
            </p>
            
            <div className="bg-muted/50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">Coming Soon: Public Submissions</h2>
              <p className="mb-4">
                We're working on a submission system that will allow you to suggest restaurants, food trucks, 
                and local eats for inclusion in Michigan Munchies.
              </p>
              <p>
                In the meantime, if you have a recommendation or know of a hidden gem that deserves recognition, 
                please reach out to us through our contact channels.
              </p>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">What We're Looking For</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Authentic Michigan restaurants and food establishments</li>
              <li>Food trucks with unique offerings and great reputations</li>
              <li>Local favorites that showcase regional cuisine</li>
              <li>Places with exceptional food quality and service</li>
              <li>Hidden gems that deserve more recognition</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
            <p>
              Follow our progress and be the first to know when our public submission system launches. 
              We're excited to build this community-driven resource for Michigan food lovers!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  inStock: boolean;
  checkoutUrl: string;
};

// Public JSON feed product structure from Fourthwall
type FourthwallFeedProduct = {
  id: number;
  title: string;
  handle: string;
  description?: string;
  body_html?: string;
  price: string;
  featured_image?: string;
  images?: string[];
  product_type?: string;
  available: boolean;
  created_at: string;
  updated_at: string;
};

async function fetchFourthwallProducts(): Promise<Product[]> {
  try {
    // Use the public JSON feed instead of API endpoints
    const shopUrl = process.env.FW_SHOP_URL || 'https://shop.fourthwall.com';
    const collectionSlug = process.env.FW_COLLECTION_SLUG || 'all';
    
    console.log('🛒 Fetching products from Fourthwall public JSON feed');
    console.log('Shop URL:', shopUrl);
    console.log('Collection:', collectionSlug);
    
    const feedUrl = `${shopUrl}/collections/${collectionSlug}.json`;
    console.log('Feed URL:', feedUrl);
    
    const response = await fetch(feedUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DankNDevour-Storefront/1.0'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Failed to fetch feed:', response.status, errorText);
      throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Raw feed response:', JSON.stringify(data, null, 2));
    
    if (!data.products || !Array.isArray(data.products)) {
      console.log('❌ No products found in feed response');
      console.log('Response structure:', Object.keys(data));
      throw new Error('No products found in feed response');
    }

    const products: Product[] = data.products.map((product: FourthwallFeedProduct) => {
      // Handle image from public feed data
      let imageUrl = null;
      
      if (product.featured_image) {
        imageUrl = product.featured_image;
      } else if (product.images && product.images.length > 0) {
        imageUrl = product.images[0];
      }
      
      // Clean up product name - decode HTML entities and strip tags
      let cleanName = product.title || 'Untitled Product';
      if (typeof cleanName === 'string') {
        // Decode HTML entities
        cleanName = cleanName
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&nbsp;/g, ' ');
        
        // Strip HTML tags
        cleanName = cleanName.replace(/<[^>]*>/g, '');
      }
      
      // Clean up description
      let cleanDescription = product.description || product.body_html || '';
      if (typeof cleanDescription === 'string') {
        // Decode HTML entities
        cleanDescription = cleanDescription
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&nbsp;/g, ' ');
        
        // Strip HTML tags
        cleanDescription = cleanDescription.replace(/<[^>]*>/g, '');
        
        // Limit length
        cleanDescription = cleanDescription.substring(0, 200) + (cleanDescription.length > 200 ? '...' : '');
      }
      
      // Generate checkout URL
      const checkoutUrl = `${shopUrl}/products/${product.handle}`;
      
      console.log(`📦 Product: ${cleanName}`, {
        id: product.id,
        handle: product.handle,
        imageUrl,
        price: product.price,
        available: product.available
      });
      
      return {
        id: product.id?.toString() || product.handle,
        name: cleanName,
        description: cleanDescription,
        price: parseFloat(product.price) || 0,
        currency: 'USD',
        image: imageUrl || '/api/placeholder/300/300',
        category: product.product_type || 'General',
        inStock: product.available !== false,
        checkoutUrl: checkoutUrl
      };
    });

    console.log(`✅ Successfully fetched ${products.length} products from Fourthwall feed`);
    return products;
    
  } catch (error) {
    console.error('❌ Error fetching Fourthwall products:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const products = await fetchFourthwallProducts();
    
    // Filter by category if specified
    let filteredProducts = products;
    if (category && category !== 'All') {
      filteredProducts = products.filter(p => p.category === category);
    }
    
    // Limit results
    const limitedProducts = filteredProducts.slice(0, limit);
    
    return NextResponse.json(limitedProducts);
    
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

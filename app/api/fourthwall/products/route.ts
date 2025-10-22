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
  id: string;
  title: string;
  handle: string;
  description?: string;
  body_html?: string;
  price: string;
  image: string; // This is the main image field in the feed
  url: string;
  available: boolean;
  created_at: string;
  updated_at: string;
  product_type?: string; // Optional product type/category
};

async function fetchFourthwallProducts(): Promise<Product[]> {
  try {
    // Use the public JSON feed instead of API endpoints
    const shopUrl = process.env.FW_SHOP_URL || 'https://shop.fourthwall.com';
    const collectionSlug = process.env.FW_COLLECTION_SLUG || 'all';
    
    console.log('🛒 Fetching products from Fourthwall public JSON feed');
    console.log('Shop URL:', shopUrl);
    console.log('Collection:', collectionSlug);
    console.log('Environment FW_SHOP_URL:', process.env.FW_SHOP_URL);
    console.log('Environment FW_COLLECTION_SLUG:', process.env.FW_COLLECTION_SLUG);
    
    // Try multiple possible feed URLs
    const possibleUrls = [
      `${shopUrl}/collections/${collectionSlug}.json`,
      `${shopUrl}/products.json`,
      `${shopUrl}/collections/all.json`,
      `${shopUrl}/collections.json`
    ];
    
    console.log('🔍 Trying possible feed URLs:', possibleUrls);
    
    let response;
    let feedUrl;
    
    for (const url of possibleUrls) {
      console.log(`🔄 Trying URL: ${url}`);
      try {
        response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'DankNDevour-Storefront/1.0'
          }
        });
        
        console.log(`Response status for ${url}:`, response.status);
        
        if (response.ok) {
          feedUrl = url;
          console.log(`✅ Successfully connected to: ${url}`);
          break;
        } else {
          console.log(`❌ Failed to fetch ${url}:`, response.status);
        }
      } catch (error) {
        console.log(`❌ Error fetching ${url}:`, error);
      }
    }
    
    if (!response || !response.ok) {
      throw new Error(`Failed to fetch products from any Fourthwall URL. Tried: ${possibleUrls.join(', ')}`);
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
      let imageUrl = product.image || null;
      
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
        available: product.available,
        rawImage: product.image
      });
      
      return {
        id: product.id?.toString() || product.handle,
        name: cleanName,
        description: cleanDescription,
        price: parseFloat(product.price) || 0,
        currency: 'USD',
        image: imageUrl || '',
        category: product.product_type || 'General',
        inStock: product.available !== false,
        checkoutUrl: checkoutUrl
      };
    });

    console.log(`✅ Successfully fetched ${products.length} products from Fourthwall feed`);
    console.log('📦 Product titles:', products.map(p => p.name));
    console.log('📦 Sample product data:', JSON.stringify(products[0], null, 2));
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

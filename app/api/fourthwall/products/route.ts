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

type FourthwallProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  thumbnailImage?: string;
  images?: Array<{ url: string }>;
  category?: string;
  available?: boolean;
  inStock?: boolean;
  checkoutUrl?: string;
  url?: string;
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

    const products: Product[] = data.products.map((product: any) => {
      // Handle image from feed data
      let imageUrl = '/api/placeholder/300/300';
      
      if (product.featured_image) {
        imageUrl = product.featured_image;
      } else if (product.images && product.images.length > 0) {
        imageUrl = product.images[0];
      }
      
      // Generate checkout URL
      const checkoutUrl = `${shopUrl}/products/${product.handle}`;
      
      return {
        id: product.id?.toString() || product.handle,
        name: product.title || product.name || 'Untitled Product',
        description: product.description || product.body_html || '',
        price: product.price || 0,
        currency: 'USD',
        image: imageUrl,
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

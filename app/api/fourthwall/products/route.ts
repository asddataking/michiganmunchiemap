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
    const storefrontToken = process.env.FW_STOREFRONT_TOKEN;
    
    if (!storefrontToken) {
      console.log('❌ No Fourthwall storefront token configured');
      console.log('Please set FW_STOREFRONT_TOKEN in your environment variables');
      throw new Error('FW_STOREFRONT_TOKEN environment variable not set');
    }

    console.log('🛒 Fetching products from Fourthwall Storefront API');
    console.log('Token exists:', !!storefrontToken);
    
    const response = await fetch('https://api.fourthwall.com/api/products', {
      headers: {
        'Authorization': `Bearer ${storefrontToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Fourthwall API error:', response.status, response.statusText);
      console.error('Error response:', errorText);
      throw new Error(`Fourthwall API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Raw Fourthwall response:', JSON.stringify(data, null, 2));
    
    if (!data.products || !Array.isArray(data.products)) {
      console.log('❌ No products found in Fourthwall response');
      console.log('Response structure:', Object.keys(data));
      throw new Error('No products found in Fourthwall response');
    }

    const products: Product[] = data.products.map((product: FourthwallProduct) => {
      // Handle different possible image fields from Fourthwall
      let imageUrl = '/api/placeholder/300/300';
      
      if (product.thumbnailImage) {
        imageUrl = product.thumbnailImage;
      } else if (product.images && product.images.length > 0) {
        imageUrl = product.images[0].url;
      }
      
      // Handle different possible checkout URL fields
      let checkoutUrl = product.checkoutUrl || product.url || `https://fourthwall.com/products/${product.id}`;
      
      return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        currency: product.currency || 'USD',
        image: imageUrl,
        category: product.category || 'General',
        inStock: product.available ?? product.inStock ?? true,
        checkoutUrl: checkoutUrl
      };
    });

    console.log(`✅ Successfully fetched ${products.length} products from Fourthwall`);
    return products;
    
  } catch (error) {
    console.error('❌ Error fetching Fourthwall products:', error);
    throw error; // Re-throw instead of returning mock data
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

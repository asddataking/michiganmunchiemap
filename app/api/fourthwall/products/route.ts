import { NextRequest, NextResponse } from 'next/server';
import { ProductsCacheService } from '@/lib/products-cache';

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

// Fourthwall Storefront API product structure
type FourthwallProduct = {
  id: string;
  title: string;
  handle: string;
  description?: string;
  price: {
    amount: string;
    currency_code: string;
  };
  images: Array<{
    url: string;
    width: number;
    height: number;
    alt?: string;
  }>;
  available: boolean;
  product_type?: string;
  tags?: string[];
  variants?: Array<{
    id: string;
    title: string;
    price: {
      amount: string;
      currency_code: string;
    };
    available: boolean;
  }>;
};

async function fetchFourthwallProducts(): Promise<Product[]> {
  try {
    const storefrontToken = process.env.FW_STOREFRONT_TOKEN;
    const shopUrl = process.env.FW_SHOP_URL || 'https://shop.fourthwall.com';
    
    if (!storefrontToken) {
      console.warn('⚠️ No Fourthwall Storefront Token found. Falling back to public JSON feed.');
      return await fetchFromPublicFeed(shopUrl);
    }
    
    console.log('🛒 Fetching products from Fourthwall Storefront API');
    console.log('Shop URL:', shopUrl);
    
    // Use the official Storefront API
    const apiUrl = 'https://storefront-api.fourthwall.com/v1/products';
    const response = await fetch(`${apiUrl}?storefront_token=${storefrontToken}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DankNDevour-Storefront/1.0'
      }
    });
    
    if (!response.ok) {
      console.error(`❌ Storefront API failed: ${response.status} ${response.statusText}`);
      console.log('🔄 Falling back to public JSON feed...');
      return await fetchFromPublicFeed(shopUrl);
    }
    
    const data = await response.json();
    console.log('Raw Storefront API response:', JSON.stringify(data, null, 2));
    
    if (!data.products || !Array.isArray(data.products)) {
      console.log('❌ No products found in Storefront API response');
      console.log('Response structure:', Object.keys(data));
      throw new Error('No products found in Storefront API response');
    }

    const products: Product[] = data.products.map((product: FourthwallProduct) => {
      // Get the first image from the images array
      const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : null;
      
      // Clean up product name
      let cleanName = product.title || 'Untitled Product';
      if (typeof cleanName === 'string') {
        cleanName = cleanName
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&nbsp;/g, ' ')
          .replace(/<[^>]*>/g, '');
      }
      
      // Clean up description
      let cleanDescription = product.description || '';
      if (typeof cleanDescription === 'string') {
        cleanDescription = cleanDescription
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&nbsp;/g, ' ')
          .replace(/<[^>]*>/g, '')
          .substring(0, 200) + (cleanDescription.length > 200 ? '...' : '');
      }
      
      // Generate checkout URL
      const checkoutUrl = `${shopUrl}/products/${product.handle}`;
      
      console.log(`📦 Product: ${cleanName}`, {
        id: product.id,
        handle: product.handle,
        imageUrl,
        price: product.price?.amount,
        available: product.available,
        imagesCount: product.images?.length || 0
      });
      
      return {
        id: product.id?.toString() || product.handle,
        name: cleanName,
        description: cleanDescription,
        price: parseFloat(product.price?.amount || '0') || 0,
        currency: product.price?.currency_code || 'USD',
        image: imageUrl || '',
        category: product.product_type || 'General',
        inStock: product.available !== false,
        checkoutUrl: checkoutUrl
      };
    });

    console.log(`✅ Successfully fetched ${products.length} products from Fourthwall Storefront API`);
    console.log('📦 Product titles:', products.map(p => p.name));
    console.log('📦 Sample product data:', JSON.stringify(products[0], null, 2));
    return products;
    
  } catch (error) {
    console.error('❌ Error fetching Fourthwall products:', error);
    throw error;
  }
}

// Fallback function for public JSON feed
async function fetchFromPublicFeed(shopUrl: string): Promise<Product[]> {
  try {
    console.log('🔄 Using public JSON feed fallback');
    
    const possibleUrls = [
      `${shopUrl}/products.json`,
      `${shopUrl}/collections/all.json`,
      `${shopUrl}/collections.json`
    ];
    
    let response;
    
    for (const url of possibleUrls) {
      try {
        response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'DankNDevour-Storefront/1.0'
          }
        });
        
        if (response.ok) {
          console.log(`✅ Successfully connected to public feed: ${url}`);
          break;
        }
      } catch (error) {
        console.log(`❌ Error fetching ${url}:`, error);
      }
    }
    
    if (!response || !response.ok) {
      throw new Error(`Failed to fetch products from any Fourthwall URL. Tried: ${possibleUrls.join(', ')}`);
    }
    
    const data = await response.json();
    
    if (!data.products || !Array.isArray(data.products)) {
      throw new Error('No products found in public feed response');
    }

    const products: Product[] = data.products.map((product: any) => {
      const imageUrl = product.image || null;
      const cleanName = product.title || 'Untitled Product';
      const cleanDescription = product.description || '';
      const checkoutUrl = `${shopUrl}/products/${product.handle}`;
      
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

    console.log(`✅ Successfully fetched ${products.length} products from public feed`);
    return products;
    
  } catch (error) {
    console.error('❌ Error fetching from public feed:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    console.log('🛒 Products API called with params:', { category, limit, forceRefresh });
    
    let products: Product[] = [];
    
    // Try to get cached products first (unless force refresh is requested)
    if (!forceRefresh) {
      try {
        const cachedProducts = await ProductsCacheService.getCachedProducts();
        if (cachedProducts && cachedProducts.length > 0) {
          console.log(`✅ Using ${cachedProducts.length} cached products`);
          products = cachedProducts;
        }
      } catch (cacheError) {
        console.error('⚠️ Cache read failed, falling back to direct API:', cacheError);
        // Continue to fetch from Fourthwall
      }
    }
    
    // If no cached products or force refresh, fetch from Fourthwall
    if (products.length === 0 || forceRefresh) {
      console.log('🔄 Fetching fresh products from Fourthwall...');
      products = await fetchFourthwallProducts();
      
      // Cache the fresh products (non-blocking)
      ProductsCacheService.cacheProducts(products).catch(cacheError => {
        console.error('⚠️ Failed to cache products (non-critical):', cacheError);
      });
    }
    
    // Filter by category if specified
    let filteredProducts = products;
    if (category && category !== 'All') {
      filteredProducts = products.filter(p => p.category === category);
    }
    
    // Limit results
    const limitedProducts = filteredProducts.slice(0, limit);
    
    console.log(`📦 Returning ${limitedProducts.length} products (${products.length} total)`);
    
    return NextResponse.json(limitedProducts);
    
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

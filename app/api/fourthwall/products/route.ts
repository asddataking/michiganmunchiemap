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
  images: Array<{ url: string }>;
  category: string;
  available: boolean;
  checkoutUrl: string;
};

// Mock products as fallback
const mockProducts: Product[] = [
  {
    id: "1",
    name: "DankNDevour T-Shirt",
    description: "Premium quality cotton t-shirt featuring the DankNDevour logo. Perfect for food and cannabis culture enthusiasts.",
    price: 29.99,
    currency: "USD",
    image: "/api/placeholder/300/300",
    category: "Apparel",
    inStock: true,
    checkoutUrl: "https://fourthwall.com/dankndevour/tshirt"
  },
  {
    id: "2",
    name: "Michigan Munchie Map Hoodie",
    description: "Comfortable hoodie with the iconic Michigan Munchie Map design. Stay warm while exploring Michigan's food scene.",
    price: 49.99,
    currency: "USD",
    image: "/api/placeholder/300/300",
    category: "Apparel",
    inStock: true,
    checkoutUrl: "https://fourthwall.com/dankndevour/hoodie"
  },
  {
    id: "3",
    name: "Cannabis Culture Sticker Pack",
    description: "Set of 10 high-quality vinyl stickers featuring cannabis culture designs and Michigan landmarks.",
    price: 12.99,
    currency: "USD",
    image: "/api/placeholder/300/300",
    category: "Accessories",
    inStock: true,
    checkoutUrl: "https://fourthwall.com/dankndevour/stickers"
  },
  {
    id: "4",
    name: "DankPass Premium Membership",
    description: "Exclusive access to premium content, early episode releases, and member-only events. Join the community!",
    price: 9.99,
    currency: "USD",
    image: "/api/placeholder/300/300",
    category: "Membership",
    inStock: true,
    checkoutUrl: "https://dankpass.com/membership"
  },
  {
    id: "5",
    name: "Foodie Adventure Guide",
    description: "Digital guidebook featuring Michigan's best hidden food gems, complete with maps and recommendations.",
    price: 19.99,
    currency: "USD",
    image: "/api/placeholder/300/300",
    category: "Digital",
    inStock: true,
    checkoutUrl: "https://fourthwall.com/dankndevour/guide"
  },
  {
    id: "6",
    name: "Michigan Cannabis Dispensary Map",
    description: "Comprehensive map of Michigan's top cannabis dispensaries with reviews and product recommendations.",
    price: 14.99,
    currency: "USD",
    image: "/api/placeholder/300/300",
    category: "Digital",
    inStock: false,
    checkoutUrl: "https://fourthwall.com/dankndevour/cannabis-map"
  }
];

async function fetchFourthwallProducts(): Promise<Product[]> {
  try {
    const storefrontToken = process.env.FW_STOREFRONT_TOKEN;
    
    if (!storefrontToken) {
      console.log('No Fourthwall storefront token configured, using mock data');
      return mockProducts;
    }

    console.log('Fetching products from Fourthwall Storefront API');
    
    const response = await fetch('https://api.fourthwall.com/storefront/products', {
      headers: {
        'Authorization': `Bearer ${storefrontToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Fourthwall API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.products || !Array.isArray(data.products)) {
      console.log('No products found in Fourthwall response, using mock data');
      return mockProducts;
    }

    const products: Product[] = data.products.map((product: FourthwallProduct) => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      currency: product.currency || 'USD',
      image: product.images?.[0]?.url || '/api/placeholder/300/300',
      category: product.category || 'General',
      inStock: product.available,
      checkoutUrl: product.checkoutUrl
    }));

    console.log(`Successfully fetched ${products.length} products from Fourthwall`);
    return products;
    
  } catch (error) {
    console.error('Error fetching Fourthwall products:', error);
    console.log('Falling back to mock data');
    return mockProducts;
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

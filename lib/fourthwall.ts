interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  productUrl: string;
}

// Mock products for development/fallback
const mockProducts: Product[] = [
  {
    id: "1",
    name: "DankNDevour Classic Tee",
    price: 29.99,
    imageUrl: "/placeholder-product.jpg",
    productUrl: "https://shop.fourthwall.com/products/dankndevour-classic-tee"
  },
  {
    id: "2", 
    name: "Michigan Munchies Hoodie",
    price: 59.99,
    imageUrl: "/placeholder-product.jpg",
    productUrl: "https://shop.fourthwall.com/products/michigan-munchies-hoodie"
  }
];

export async function getProducts(): Promise<Product[]> {
  try {
    // Check if we have a JSON file with product data
    const productsJsonUrl = process.env.NEXT_PUBLIC_FOURTHWALL_PRODUCTS_JSON;
    
    if (productsJsonUrl) {
      const response = await fetch(productsJsonUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.products && Array.isArray(data.products)) {
          return data.products.map((product: any) => ({
            id: product.id?.toString() || product.handle,
            name: product.title || product.name || 'Untitled Product',
            price: parseFloat(product.price) || 0,
            imageUrl: product.image || product.images?.[0]?.url || '/placeholder-product.jpg',
            productUrl: product.checkoutUrl || `${process.env.NEXT_PUBLIC_FOURTHWALL_SHOP_URL}/products/${product.handle}`
          }));
        }
      }
    }

    // Fallback to API call
    const response = await fetch('/api/fourthwall/products?limit=4');
    if (response.ok) {
      const products = await response.json();
      return products.map((product: any) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.image,
        productUrl: product.checkoutUrl
      }));
    }

    // Final fallback to mock data
    console.log('Using mock products for development');
    return mockProducts;
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return mockProducts;
  }
}

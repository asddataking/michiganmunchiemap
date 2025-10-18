import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

type WebhookEvent = {
  type: string;
  data: any;
  timestamp: string;
  id: string;
};

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.FW_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.log('No Fourthwall webhook secret configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Get the raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('x-fourthwall-signature');
    
    if (!signature) {
      console.log('No webhook signature provided');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');
    
    const providedSignature = signature.replace('sha256=', '');
    
    if (!crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(providedSignature, 'hex')
    )) {
      console.log('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload: WebhookEvent = JSON.parse(body);
    console.log('Fourthwall webhook received:', {
      type: payload.type,
      id: payload.id,
      timestamp: payload.timestamp
    });

    // Handle different webhook events
    switch (payload.type) {
      case 'order.created':
        console.log('New order created:', payload.data);
        await handleOrderCreated(payload.data);
        break;
        
      case 'order.updated':
        console.log('Order updated:', payload.data);
        await handleOrderUpdated(payload.data);
        break;
        
      case 'order.cancelled':
        console.log('Order cancelled:', payload.data);
        await handleOrderCancelled(payload.data);
        break;
        
      case 'product.created':
        console.log('Product created:', payload.data);
        await handleProductCreated(payload.data);
        break;
        
      case 'product.updated':
        console.log('Product updated:', payload.data);
        await handleProductUpdated(payload.data);
        break;
        
      case 'product.deleted':
        console.log('Product deleted:', payload.data);
        await handleProductDeleted(payload.data);
        break;
        
      case 'customer.created':
        console.log('Customer created:', payload.data);
        await handleCustomerCreated(payload.data);
        break;
        
      case 'subscription.created':
        console.log('Subscription created:', payload.data);
        await handleSubscriptionCreated(payload.data);
        break;
        
      case 'subscription.updated':
        console.log('Subscription updated:', payload.data);
        await handleSubscriptionUpdated(payload.data);
        break;
        
      case 'subscription.cancelled':
        console.log('Subscription cancelled:', payload.data);
        await handleSubscriptionCancelled(payload.data);
        break;
        
      default:
        console.log('Unknown webhook type:', payload.type);
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error processing Fourthwall webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Webhook event handlers
async function handleOrderCreated(orderData: any) {
  try {
    console.log('Processing new order:', {
      orderId: orderData.id,
      customerEmail: orderData.customer?.email,
      total: orderData.total,
      items: orderData.items?.length || 0
    });
    
    // TODO: Implement order processing logic
    // - Send confirmation email
    // - Update inventory
    // - Log analytics
    // - Notify fulfillment team
    
  } catch (error) {
    console.error('Error handling order created:', error);
  }
}

async function handleOrderUpdated(orderData: any) {
  try {
    console.log('Processing order update:', {
      orderId: orderData.id,
      status: orderData.status,
      trackingNumber: orderData.trackingNumber
    });
    
    // TODO: Implement order update logic
    // - Send status update email
    // - Update customer dashboard
    // - Log status change
    
  } catch (error) {
    console.error('Error handling order updated:', error);
  }
}

async function handleOrderCancelled(orderData: any) {
  try {
    console.log('Processing order cancellation:', {
      orderId: orderData.id,
      reason: orderData.cancellationReason
    });
    
    // TODO: Implement cancellation logic
    // - Process refund
    // - Restore inventory
    // - Send cancellation email
    
  } catch (error) {
    console.error('Error handling order cancelled:', error);
  }
}

async function handleProductCreated(productData: any) {
  try {
    console.log('Processing product creation:', {
      productId: productData.id,
      name: productData.name,
      category: productData.category
    });
    
    // TODO: Implement product creation logic
    // - Update product cache
    // - Sync with external systems
    // - Notify team
    
  } catch (error) {
    console.error('Error handling product created:', error);
  }
}

async function handleProductUpdated(productData: any) {
  try {
    console.log('Processing product update:', {
      productId: productData.id,
      name: productData.name,
      available: productData.available
    });
    
    // TODO: Implement product update logic
    // - Update product cache
    // - Sync pricing changes
    // - Update availability
    
  } catch (error) {
    console.error('Error handling product updated:', error);
  }
}

async function handleProductDeleted(productData: any) {
  try {
    console.log('Processing product deletion:', {
      productId: productData.id,
      name: productData.name
    });
    
    // TODO: Implement product deletion logic
    // - Remove from cache
    // - Update external systems
    // - Handle existing orders
    
  } catch (error) {
    console.error('Error handling product deleted:', error);
  }
}

async function handleCustomerCreated(customerData: any) {
  try {
    console.log('Processing customer creation:', {
      customerId: customerData.id,
      email: customerData.email,
      name: customerData.name
    });
    
    // TODO: Implement customer creation logic
    // - Add to CRM
    // - Send welcome email
    // - Create customer profile
    
  } catch (error) {
    console.error('Error handling customer created:', error);
  }
}

async function handleSubscriptionCreated(subscriptionData: any) {
  try {
    console.log('Processing subscription creation:', {
      subscriptionId: subscriptionData.id,
      customerId: subscriptionData.customerId,
      plan: subscriptionData.plan
    });
    
    // TODO: Implement subscription creation logic
    // - Grant access to premium content
    // - Send welcome email
    // - Update customer status
    
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscriptionData: any) {
  try {
    console.log('Processing subscription update:', {
      subscriptionId: subscriptionData.id,
      status: subscriptionData.status,
      plan: subscriptionData.plan
    });
    
    // TODO: Implement subscription update logic
    // - Update access permissions
    // - Send notification email
    // - Log changes
    
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionCancelled(subscriptionData: any) {
  try {
    console.log('Processing subscription cancellation:', {
      subscriptionId: subscriptionData.id,
      reason: subscriptionData.cancellationReason
    });
    
    // TODO: Implement subscription cancellation logic
    // - Revoke premium access
    // - Send cancellation email
    // - Process final billing
    
  } catch (error) {
    console.error('Error handling subscription cancelled:', error);
  }
}

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Fourthwall webhook endpoint is active',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
}

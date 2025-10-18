import { NextRequest, NextResponse } from 'next/server';

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

    // Verify webhook signature
    const signature = request.headers.get('x-fourthwall-signature');
    if (!signature) {
      console.log('No webhook signature provided');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // TODO: Implement signature verification
    // const body = await request.text();
    // const expectedSignature = crypto
    //   .createHmac('sha256', webhookSecret)
    //   .update(body)
    //   .digest('hex');
    
    // if (signature !== expectedSignature) {
    //   console.log('Invalid webhook signature');
    //   return NextResponse.json(
    //     { error: 'Invalid signature' },
    //     { status: 401 }
    //   );
    // }

    const payload = await request.json();
    console.log('Fourthwall webhook received:', payload);

    // Handle different webhook events
    switch (payload.type) {
      case 'order.created':
        console.log('New order created:', payload.data);
        // TODO: Process new order
        break;
        
      case 'order.updated':
        console.log('Order updated:', payload.data);
        // TODO: Process order update
        break;
        
      case 'product.updated':
        console.log('Product updated:', payload.data);
        // TODO: Update product cache
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

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Fourthwall webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}

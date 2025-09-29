// api/wompi/webhook.js
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const WOMPI_EVENTS_SECRET = process.env.WOMPI_EVENTS_SECRET;

/**
 * Validar firma del webhook
 */
function validateWebhookSignature(body, signature) {
  const bodyString = JSON.stringify(body);
  const hash = crypto
    .createHash('sha256')
    .update(`${bodyString}${WOMPI_EVENTS_SECRET}`)
    .digest('hex');
  
  return hash === signature;
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Event-Signature');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['x-event-signature'] || req.headers['X-Event-Signature'];
    const eventData = req.body;

    console.log('Webhook received:', {
      event: eventData.event,
      transactionId: eventData.data?.transaction?.id,
      signature: signature ? 'present' : 'missing'
    });

    // Validar firma (en producción esto es obligatorio)
    if (signature) {
      const isValid = validateWebhookSignature(eventData, signature);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
      console.log('Webhook signature validated');
    }

    const { event, data, sent_at } = eventData;
    const transaction = data.transaction;

    if (!transaction) {
      console.error('No transaction data in webhook');
      return res.status(400).json({ error: 'No transaction data' });
    }

    console.log('Processing webhook event:', {
      event,
      transactionId: transaction.id,
      status: transaction.status,
      reference: transaction.reference
    });

    // Buscar transacción en la base de datos
    const { data: dbTransaction, error: findError } = await supabase
      .from('transactions')
      .select('*, orders(*)')
      .eq('wompi_transaction_id', transaction.id)
      .single();

    if (findError || !dbTransaction) {
      console.error('Transaction not found in database:', transaction.id);
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Actualizar transacción
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: transaction.status,
        wompi_data: transaction,
        webhook_data: eventData,
        updated_at: new Date().toISOString()
      })
      .eq('id', dbTransaction.id);

    if (updateError) {
      console.error('Error updating transaction:', updateError);
      throw updateError;
    }

    console.log('Transaction updated:', dbTransaction.id);

    // Actualizar estado del pedido
    const paymentStatus = 
      transaction.status === 'APPROVED' ? 'paid' :
      transaction.status === 'DECLINED' ? 'failed' :
      transaction.status === 'VOIDED' ? 'cancelled' :
      transaction.status === 'ERROR' ? 'failed' :
      'pending';

    const orderStatus = 
      transaction.status === 'APPROVED' ? 'processing' :
      transaction.status === 'DECLINED' ? 'cancelled' :
      transaction.status === 'VOIDED' ? 'cancelled' :
      'pending';

    const { error: orderError } = await supabase
      .from('orders')
      .update({
        status: orderStatus,
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', dbTransaction.order_id);

    if (orderError) {
      console.error('Error updating order:', orderError);
    } else {
      console.log('Order updated:', {
        orderId: dbTransaction.order_id,
        status: orderStatus,
        paymentStatus: paymentStatus
      });
    }

    // Si el pago fue aprobado, actualizar stock de productos
    if (transaction.status === 'APPROVED') {
      console.log('Payment approved, updating product stock...');
      
      // Aquí puedes agregar lógica adicional:
      // - Enviar email de confirmación
      // - Actualizar inventario
      // - Notificar al usuario
      // - Generar factura
    }

    // Responder a Wompi
    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({
      error: 'Error processing webhook',
      message: error.message
    });
  }
};
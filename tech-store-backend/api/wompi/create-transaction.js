// api/wompi/create-transaction.js
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const WOMPI_PRIVATE_KEY = process.env.WOMPI_PRIVATE_KEY;
const WOMPI_API_URL = process.env.WOMPI_API_URL;
const WOMPI_INTEGRITY_SECRET = process.env.WOMPI_INTEGRITY_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://tu-dominio.vercel.app';

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      orderId,
      amount,
      currency,
      reference,
      customerEmail,
      paymentMethod,
      acceptanceToken,
      customerData,
      shippingAddress
    } = req.body;

    // Validar datos requeridos
    if (!orderId || !amount || !customerEmail || !paymentMethod || !acceptanceToken || !reference) {
      return res.status(400).json({ 
        success: false,
        error: 'Datos incompletos',
        message: 'Faltan campos requeridos'
      });
    }

    // Generar firma de integridad
    const amountInCents = Math.round(amount * 100);
    const integrityString = `${reference}${amountInCents}${currency || 'COP'}${WOMPI_INTEGRITY_SECRET}`;
    const integritySignature = crypto.createHash('sha256').update(integrityString).digest('hex');

    // Preparar datos para Wompi
    const transactionData = {
      amount_in_cents: amountInCents,
      currency: currency || 'COP',
      signature: integritySignature,
      customer_email: customerEmail,
      reference: reference,
      payment_method: paymentMethod,
      acceptance_token: acceptanceToken,
      customer_data: {
        phone_number: customerData?.phone || '',
        full_name: `${customerData?.firstName || ''} ${customerData?.lastName || ''}`.trim(),
        legal_id: customerData?.document || '',
        legal_id_type: customerData?.documentType || 'CC'
      },
      redirect_url: `${FRONTEND_URL}/payment-result?reference=${reference}`
    };

    // Agregar dirección de envío si existe
    if (shippingAddress && shippingAddress.address) {
      transactionData.shipping_address = {
        address_line_1: shippingAddress.address,
        address_line_2: shippingAddress.addressDetails || '',
        city: shippingAddress.city,
        region: shippingAddress.state || shippingAddress.city,
        country: 'CO',
        phone_number: shippingAddress.phone || customerData?.phone || '',
        postal_code: shippingAddress.postalCode || ''
      };
    }

    console.log('Creating Wompi transaction:', {
      reference,
      amount: amountInCents,
      email: customerEmail
    });

    // Crear transacción en Wompi
    const wompiResponse = await fetch(`${WOMPI_API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WOMPI_PRIVATE_KEY}`
      },
      body: JSON.stringify(transactionData)
    });

    const wompiData = await wompiResponse.json();

    if (!wompiResponse.ok) {
      console.error('Wompi API error:', wompiData);
      throw new Error(wompiData.error?.reason || wompiData.error?.messages?.join(', ') || 'Error creando transacción en Wompi');
    }

    console.log('Wompi transaction created:', wompiData.data.id);

    // Guardar transacción en Supabase
    const { data: transaction, error: dbError } = await supabase
      .from('transactions')
      .insert([{
        order_id: orderId,
        user_id: customerData?.userId || null,
        wompi_transaction_id: wompiData.data.id,
        wompi_reference: reference,
        amount: amount,
        currency: currency || 'COP',
        status: wompiData.data.status,
        payment_method_type: paymentMethod.type,
        customer_email: customerEmail,
        customer_data: customerData,
        wompi_data: wompiData.data
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Error guardando transacción en DB:', dbError);
    }

    // Actualizar estado del pedido
    const orderStatus = wompiData.data.status === 'APPROVED' ? 'paid' : 'pending';
    
    await supabase
      .from('orders')
      .update({
        payment_status: orderStatus,
        transaction_id: transaction?.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    console.log('Order updated with payment status:', orderStatus);

    return res.status(200).json({
      success: true,
      transaction: wompiData.data,
      reference: reference,
      paymentUrl: wompiData.data.payment_method?.extra?.async_payment_url || null,
      status: wompiData.data.status
    });

  } catch (error) {
    console.error('Error en create-transaction:', error);
    return res.status(500).json({
      success: false,
      error: 'Error procesando pago',
      message: error.message
    });
  }
};
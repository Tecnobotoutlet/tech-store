// api/wompi/transaction-status/[id].js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const WOMPI_PRIVATE_KEY = process.env.WOMPI_PRIVATE_KEY;
const WOMPI_API_URL = process.env.WOMPI_API_URL;

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Transaction ID required' });
    }

    console.log('Checking transaction status:', id);

    // Consultar estado en Wompi
    const wompiResponse = await fetch(`${WOMPI_API_URL}/transactions/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${WOMPI_PRIVATE_KEY}`
      }
    });

    if (!wompiResponse.ok) {
      throw new Error('Error consultando transacción en Wompi');
    }

    const wompiData = await wompiResponse.json();
    const transaction = wompiData.data;

    console.log('Transaction status from Wompi:', transaction.status);

    // Actualizar en base de datos
    const { data: dbTransaction, error: dbError } = await supabase
      .from('transactions')
      .update({
        status: transaction.status,
        wompi_data: transaction,
        updated_at: new Date().toISOString()
      })
      .eq('wompi_transaction_id', id)
      .select()
      .single();

    if (!dbError && dbTransaction) {
      // Actualizar estado del pedido según estado de transacción
      const paymentStatus = transaction.status === 'APPROVED' ? 'paid' :
                           transaction.status === 'DECLINED' ? 'failed' :
                           transaction.status === 'VOIDED' ? 'cancelled' :
                           'pending';

      await supabase
        .from('orders')
        .update({
          payment_status: paymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', dbTransaction.order_id);

      console.log('Order payment status updated to:', paymentStatus);
    }

    return res.status(200).json({
      success: true,
      transaction: transaction,
      status: transaction.status
    });

  } catch (error) {
    console.error('Error checking transaction status:', error);
    return res.status(500).json({
      error: 'Error verificando estado',
      message: error.message
    });
  }
};
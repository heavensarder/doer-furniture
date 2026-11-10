import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureEcommerceTables } from '@/lib/ecommerce-db';
import { sendOrderNotifications } from '@/lib/mail-sender';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureEcommerceTables();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      sql +=
        ' AND (order_number LIKE ? OR customer_name LIKE ? OR phone LIKE ? OR email LIKE ? OR company_name LIKE ? OR product_name LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term, term, term);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(sql, params);
    return NextResponse.json({ orders: rows });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureEcommerceTables();

    const body = await request.json();
    const customerName = (body.customer_name || body.fullName || '').trim();
    const phone = (body.phone || '').trim();
    const email = (body.email || '').trim();
    const companyName = (body.company_name || body.companyName || '').trim();
    const deliveryAddress = (body.delivery_address || body.address || '').trim();
    const notes = (body.notes || body.message || '').trim();
    const quantity = Math.max(1, parseInt(body.quantity || '1', 10) || 1);

    const productId = body.product_id ? Number(body.product_id) : null;
    let productName = (body.product_name || '').trim();
    let productSlug = (body.product_slug || '').trim();
    let productImage = (body.product_image || '').trim();
    let productPrice =
      body.product_price !== null &&
      body.product_price !== undefined &&
      !isNaN(Number(body.product_price)) &&
      Number(body.product_price) > 0
        ? Number(body.product_price)
        : null;

    if (!customerName || !phone || !email || !deliveryAddress) {
      return NextResponse.json(
        {
          error:
            'Please fill in all required fields (Name, Phone Number, Email, and Address).',
        },
        { status: 400 }
      );
    }

    // Look up product if productId provided
    if (productId) {
      const [prodRows]: any = await pool.execute(
        'SELECT * FROM products WHERE id = ?',
        [productId]
      );
      if (prodRows && prodRows.length > 0) {
        const p = prodRows[0];
        productName = p.name;
        productSlug = p.slug;
        productImage = p.main_image;
        productPrice =
          !p.is_call_for_price && p.price && Number(p.price) > 0
            ? Number(p.price)
            : null;
      }
    }

    if (!productName) {
      productName = 'Custom Product Order';
    }

    const now = new Date();
    const year = now.getFullYear();
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `DOER-${year}-${randomCode}`;

    const [result]: any = await pool.execute(
      `INSERT INTO orders (
        order_number, product_id, product_name, product_slug, product_image,
        product_price, quantity, customer_name, phone, email,
        company_name, delivery_address, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        orderNumber,
        productId,
        productName,
        productSlug,
        productImage,
        productPrice,
        quantity,
        customerName,
        phone,
        email,
        companyName,
        deliveryAddress,
        notes,
      ]
    );

    const [newOrder]: any = await pool.execute(
      'SELECT * FROM orders WHERE id = ?',
      [result.insertId]
    );

    // Trigger SMTP order notifications (Admin alert + Customer order receipt reply)
    if (newOrder && newOrder[0]) {
      sendOrderNotifications(newOrder[0]).catch((err) => {
        console.error('Failed to trigger order notifications:', err);
      });
    }

    return NextResponse.json(
      {
        order: newOrder[0],
        message: 'Order placed successfully!',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error placing order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}


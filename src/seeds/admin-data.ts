import { Order, ProductCard, ClientCard } from '../models/index.js';

export async function seedAdminData() {
  console.log('🌱 Seeding admin data...');

  // Seed Product Cards
  const productCards = [
    {
      name: 'Carte Premium NFC',
      type: 'Premium',
      price: 99,
      stock: 45,
      active: true,
      description: 'Carte NFC haut de gamme avec finition premium',
    },
    {
      name: 'Carte Standard',
      type: 'Standard',
      price: 79,
      stock: 120,
      active: true,
      description: 'Carte NFC standard de qualité',
    },
    {
      name: 'Carte Luxury Gold',
      type: 'Luxury',
      price: 149,
      stock: 12,
      active: true,
      description: 'Carte de luxe avec finition dorée',
    },
    {
      name: 'Carte Black Edition',
      type: 'Limited',
      price: 199,
      stock: 5,
      active: false,
      description: 'Édition limitée noire exclusive',
    },
  ];

  const existingCards = await ProductCard.countDocuments();
  if (existingCards === 0) {
    await ProductCard.insertMany(productCards);
    console.log('✅ Product cards seeded');
  } else {
    console.log('ℹ️  Product cards already exist');
  }

  // Seed Orders (we'll need a user ID - using a placeholder)
  const orders = [
    {
      userId: '000000000000000000000001', // Placeholder - will need real user ID in production
      customerName: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      items: ['1x Carte Premium NFC'],
      total: 99,
      status: 'pending' as const,
      cardDesign: 'Modern Gold',
      shippingAddress: '123 Rue de la Paix, 75001 Paris',
    },
    {
      userId: '000000000000000000000002',
      customerName: 'Marie Martin',
      email: 'marie.martin@email.com',
      items: ['2x Carte Standard'],
      total: 158,
      status: 'processing' as const,
      cardDesign: 'Minimalist Black',
      shippingAddress: '45 Avenue des Champs, 69000 Lyon',
    },
    {
      userId: '000000000000000000000003',
      customerName: 'Pierre Bernard',
      email: 'pierre.bernard@email.com',
      items: ['1x Carte Premium NFC', '1x Carte Standard'],
      total: 178,
      status: 'completed' as const,
      cardDesign: 'Luxury Silver',
      shippingAddress: '78 Boulevard Saint-Michel, 75005 Paris',
    },
  ];

  const existingOrders = await Order.countDocuments();
  if (existingOrders === 0) {
    const createdOrders = await Order.insertMany(orders);
    console.log('✅ Orders seeded');

    // Seed Client Cards based on orders
    const clientCards = [
      {
        serialNumber: 'IC-2025-001234',
        orderId: createdOrders[0]._id.toString(),
        customerName: 'Jean Dupont',
        email: 'jean.dupont@email.com',
        cardType: 'Premium NFC',
        design: 'Modern Gold',
        status: 'ordered' as const,
        shippingAddress: '123 Rue de la Paix, 75001 Paris',
        orderDate: new Date(Date.now() - 2 * 86400000),
      },
      {
        serialNumber: 'IC-2025-001235',
        orderId: createdOrders[1]._id.toString(),
        customerName: 'Marie Martin',
        email: 'marie.martin@email.com',
        cardType: 'Standard',
        design: 'Minimalist Black',
        status: 'manufacturing' as const,
        shippingAddress: '45 Avenue des Champs, 69000 Lyon',
        orderDate: new Date(Date.now() - 5 * 86400000),
      },
      {
        serialNumber: 'IC-2025-001456',
        orderId: createdOrders[1]._id.toString(),
        customerName: 'Marie Martin',
        email: 'marie.martin@email.com',
        cardType: 'Standard',
        design: 'Minimalist Black',
        status: 'shipped' as const,
        shippingAddress: '45 Avenue des Champs, 69000 Lyon',
        trackingNumber: 'FR123456789',
        orderDate: new Date(Date.now() - 5 * 86400000),
      },
      {
        serialNumber: 'IC-2025-000789',
        orderId: createdOrders[2]._id.toString(),
        customerName: 'Pierre Bernard',
        email: 'pierre.bernard@email.com',
        cardType: 'Premium NFC',
        design: 'Luxury Silver',
        status: 'delivered' as const,
        shippingAddress: '78 Boulevard Saint-Michel, 75005 Paris',
        trackingNumber: 'FR987654321',
        orderDate: new Date(Date.now() - 10 * 86400000),
        deliveryDate: new Date(Date.now() - 7 * 86400000),
      },
      {
        serialNumber: 'IC-2025-000790',
        orderId: createdOrders[2]._id.toString(),
        customerName: 'Pierre Bernard',
        email: 'pierre.bernard@email.com',
        cardType: 'Standard',
        design: 'Luxury Silver',
        status: 'activated' as const,
        shippingAddress: '78 Boulevard Saint-Michel, 75005 Paris',
        trackingNumber: 'FR987654321',
        orderDate: new Date(Date.now() - 10 * 86400000),
        deliveryDate: new Date(Date.now() - 7 * 86400000),
        activatedAt: new Date(Date.now() - 5 * 86400000),
      },
    ];

    await ClientCard.insertMany(clientCards);
    console.log('✅ Client cards seeded');
  } else {
    console.log('ℹ️  Orders already exist');
  }

  console.log('✅ Admin data seeding completed');
}






import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { Template } from '../models/Template.js';
import { UserFinance, Bill, PhysicalCard } from '../models/Finance.js';
import { Order, ProductCard, ClientCard } from '../models/index.js';
import { seedAdminData } from './admin-data.js';
async function seed() {
    try {
        console.log('🌱 Starting database seeding...\n');
        // Connect to database
        await mongoose.connect(config.mongodb.uri);
        console.log('✅ Connected to MongoDB\n');
        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Profile.deleteMany({}),
            Template.deleteMany({}),
            UserFinance.deleteMany({}),
            Bill.deleteMany({}),
            PhysicalCard.deleteMany({}),
            Order.deleteMany({}),
            ProductCard.deleteMany({}),
            ClientCard.deleteMany({}),
        ]);
        console.log('✅ Data cleared\n');
        // Create test user
        console.log('👤 Creating test user...');
        const testUser = new User({
            email: 'test@inutile.cards',
            password: 'Test123456!',
            firstName: 'Test',
            lastName: 'User',
            phone: '+33612345678',
            role: 'user',
        });
        await testUser.save();
        const testProfile = new Profile({
            userId: testUser._id.toString(),
            slug: 'test.user',
            displayName: 'Test User',
            bio: 'Ceci est un compte de test pour Inutile Cards.',
            links: [
                {
                    id: 'link-1',
                    title: 'Mon Portfolio',
                    url: 'https://example.com/portfolio',
                    icon: 'globe',
                    isActive: true,
                    order: 0,
                },
                {
                    id: 'link-2',
                    title: 'LinkedIn',
                    url: 'https://linkedin.com/in/testuser',
                    icon: 'linkedin',
                    isActive: true,
                    order: 1,
                },
                {
                    id: 'link-3',
                    title: 'Mon CV',
                    url: 'https://example.com/cv.pdf',
                    icon: 'file',
                    isActive: true,
                    order: 2,
                },
            ],
            socialLinks: [
                { platform: 'instagram', url: 'https://instagram.com/testuser', isActive: true },
                { platform: 'twitter', url: 'https://twitter.com/testuser', isActive: true },
            ],
            theme: {
                backgroundColor: '#0a0a0a',
                textColor: '#ffffff',
                buttonColor: '#d4af37',
                linkBlockColor: '#d4af37',
                buttonTextColor: '#0a0a0a',
                buttonStyle: 'rounded',
                fontFamily: 'Inter',
                nameFontSize: 24,
                bioFontSize: 14,
                linkFontSize: 16,
            },
            isPublic: true,
        });
        await testProfile.save();
        const testFinance = new UserFinance({
            userId: testUser._id.toString(),
            paymentCards: [
                {
                    id: 'card-1',
                    last4: '4242',
                    brand: 'Visa',
                    expiryMonth: 12,
                    expiryYear: 2026,
                    isDefault: true,
                },
            ],
            subscription: {
                userId: testUser._id.toString(),
                plan: 'premium',
                status: 'active',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                cancelAtPeriodEnd: false,
            },
        });
        await testFinance.save();
        // Create test bill
        const testBill = new Bill({
            userId: testUser._id.toString(),
            amount: 9.99,
            currency: 'EUR',
            description: 'Abonnement Premium - Novembre 2024',
            status: 'paid',
            paidAt: new Date(),
        });
        await testBill.save();
        // Create test physical card
        const testPhysicalCard = new PhysicalCard({
            userId: testUser._id.toString(),
            type: 'premium',
            status: 'delivered',
            trackingNumber: 'FR123456789',
            orderedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            shippedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            deliveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        });
        await testPhysicalCard.save();
        console.log('✅ Test user created');
        console.log(`   Email: test@inutile.cards`);
        console.log(`   Password: Test123456!`);
        console.log(`   Profile: http://localhost:3000/${testProfile.slug}\n`);
        // Create admin user
        console.log('👑 Creating admin user...');
        const adminUser = new User({
            email: 'admin@inutile.cards',
            password: 'Admin123456!',
            firstName: 'Admin',
            lastName: 'Inutile',
            role: 'admin',
        });
        await adminUser.save();
        const adminProfile = new Profile({
            userId: adminUser._id.toString(),
            slug: 'admin',
            displayName: 'Admin Inutile Cards',
            bio: 'Compte administrateur officiel d\'Inutile Cards.',
            links: [
                {
                    id: 'admin-link-1',
                    title: 'Site Officiel',
                    url: 'https://inutile.cards',
                    icon: 'globe',
                    isActive: true,
                    order: 0,
                },
                {
                    id: 'admin-link-2',
                    title: 'Support',
                    url: 'mailto:support@inutile.cards',
                    icon: 'mail',
                    isActive: true,
                    order: 1,
                },
            ],
            socialLinks: [
                { platform: 'instagram', url: 'https://instagram.com/inutilecards', isActive: true },
                { platform: 'linkedin', url: 'https://linkedin.com/company/inutilecards', isActive: true },
            ],
            theme: {
                backgroundColor: '#1a1a1a',
                textColor: '#ffffff',
                buttonColor: '#c9a227',
                linkBlockColor: '#c9a227',
                buttonTextColor: '#000000',
                buttonStyle: 'pill',
                fontFamily: 'Inter',
                nameFontSize: 24,
                bioFontSize: 14,
                linkFontSize: 16,
            },
            isPublic: true,
        });
        await adminProfile.save();
        const adminFinance = new UserFinance({
            userId: adminUser._id.toString(),
        });
        await adminFinance.save();
        console.log('✅ Admin user created');
        console.log(`   Email: admin@inutile.cards`);
        console.log(`   Password: Admin123456!`);
        console.log(`   Profile: http://localhost:3000/${adminProfile.slug}\n`);
        // Create templates
        console.log('🎨 Creating templates...');
        const templates = [
            {
                name: 'Classique Noir',
                description: 'Template élégant avec fond noir et accents dorés',
                theme: {
                    backgroundColor: '#0a0a0a',
                    textColor: '#ffffff',
                    buttonColor: '#d4af37',
                    linkBlockColor: '#d4af37',
                    buttonTextColor: '#0a0a0a',
                    buttonStyle: 'rounded',
                    fontFamily: 'Inter',
                    nameFontSize: 24,
                    bioFontSize: 14,
                    linkFontSize: 16,
                },
                isActive: true,
                isPremium: false,
            },
            {
                name: 'Minimaliste Blanc',
                description: 'Design épuré sur fond blanc',
                theme: {
                    backgroundColor: '#ffffff',
                    textColor: '#1a1a1a',
                    buttonColor: '#1a1a1a',
                    linkBlockColor: '#1a1a1a',
                    buttonTextColor: '#ffffff',
                    buttonStyle: 'square',
                    fontFamily: 'Inter',
                    nameFontSize: 24,
                    bioFontSize: 14,
                    linkFontSize: 16,
                },
                isActive: true,
                isPremium: false,
            },
            {
                name: 'Gradient Sunset',
                description: 'Dégradé chaleureux du coucher de soleil',
                theme: {
                    backgroundColor: '#2d1f3d',
                    textColor: '#ffffff',
                    buttonColor: '#ff6b35',
                    linkBlockColor: '#ff6b35',
                    buttonTextColor: '#ffffff',
                    buttonStyle: 'pill',
                    fontFamily: 'Inter',
                    nameFontSize: 24,
                    bioFontSize: 14,
                    linkFontSize: 16,
                },
                isActive: true,
                isPremium: true,
            },
            {
                name: 'Ocean Blue',
                description: 'Tons bleus profonds et apaisants',
                theme: {
                    backgroundColor: '#0d1b2a',
                    textColor: '#e0e1dd',
                    buttonColor: '#3d5a80',
                    linkBlockColor: '#3d5a80',
                    buttonTextColor: '#ffffff',
                    buttonStyle: 'rounded',
                    fontFamily: 'Inter',
                    nameFontSize: 24,
                    bioFontSize: 14,
                    linkFontSize: 16,
                },
                isActive: true,
                isPremium: true,
            },
            {
                name: 'Royal Gold',
                description: 'Luxe et élégance avec des accents dorés royaux',
                theme: {
                    backgroundColor: '#1a1a2e',
                    textColor: '#eaeaea',
                    buttonColor: '#c9a227',
                    linkBlockColor: '#c9a227',
                    buttonTextColor: '#1a1a2e',
                    buttonStyle: 'pill',
                    fontFamily: 'Inter',
                    nameFontSize: 24,
                    bioFontSize: 14,
                    linkFontSize: 16,
                },
                isActive: true,
                isPremium: true,
            },
        ];
        for (const templateData of templates) {
            const template = new Template(templateData);
            await template.save();
            console.log(`   ✓ Template "${template.name}" créé`);
        }
        console.log('✅ Templates created\n');
        // Create Nicolas Oliveira profile for demo
        console.log('🎭 Creating demo profile (Nicolas Oliveira - ADMIN)...');
        const demoUser = new User({
            email: 'nicolas.oliveira@inutile.cards',
            password: 'Nicolas123456!',
            firstName: 'Nicolas',
            lastName: 'Oliveira',
            phone: '+33699887766',
            role: 'admin',
        });
        await demoUser.save();
        const demoProfile = new Profile({
            userId: demoUser._id.toString(),
            slug: 'nicolas.oliveira',
            displayName: 'Nicolas Oliveira',
            bio: 'Entrepreneur & Designer • Fondateur @InutileCards • Paris 🇫🇷',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            links: [
                {
                    id: 'nico-link-1',
                    title: '🚀 Inutile Cards',
                    url: 'https://inutile.cards',
                    icon: 'rocket',
                    isActive: true,
                    order: 0,
                },
                {
                    id: 'nico-link-2',
                    title: '💼 Mon Portfolio',
                    url: 'https://nicolas-oliveira.com',
                    icon: 'briefcase',
                    isActive: true,
                    order: 1,
                },
                {
                    id: 'nico-link-3',
                    title: '📧 Me contacter',
                    url: 'mailto:nicolas@inutile.cards',
                    icon: 'mail',
                    isActive: true,
                    order: 2,
                },
                {
                    id: 'nico-link-4',
                    title: '📅 Prendre RDV',
                    url: 'https://calendly.com/nicolas-oliveira',
                    icon: 'calendar',
                    isActive: true,
                    order: 3,
                },
            ],
            socialLinks: [
                { platform: 'instagram', url: 'https://instagram.com/nicolas.oliveira', isActive: true },
                { platform: 'linkedin', url: 'https://linkedin.com/in/nicolas-oliveira', isActive: true },
                { platform: 'twitter', url: 'https://twitter.com/nicolasoliveira', isActive: true },
            ],
            email: 'nicolas.oliveira@inutile.cards',
            phone: '+33699887766',
            theme: {
                backgroundColor: '#0f0f0f',
                textColor: '#ffffff',
                buttonColor: '#c9a227',
                linkBlockColor: '#c9a227',
                buttonTextColor: '#0f0f0f',
                buttonStyle: 'pill',
                fontFamily: 'Inter',
                nameFontSize: 24,
                bioFontSize: 14,
                linkFontSize: 16,
            },
            isPublic: true,
            isAdmin: true,
        });
        await demoProfile.save();
        const demoFinance = new UserFinance({
            userId: demoUser._id.toString(),
            paymentCards: [
                {
                    id: 'nico-card-1',
                    last4: '8888',
                    brand: 'Mastercard',
                    expiryMonth: 6,
                    expiryYear: 2027,
                    isDefault: true,
                },
            ],
            subscription: {
                userId: demoUser._id.toString(),
                plan: 'premium',
                status: 'active',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                cancelAtPeriodEnd: false,
            },
        });
        await demoFinance.save();
        // Create metal card for Nicolas
        const nicoCard = new PhysicalCard({
            userId: demoUser._id.toString(),
            type: 'metal',
            status: 'delivered',
            trackingNumber: 'FR987654321',
            orderedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            shippedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
            deliveredAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        });
        await nicoCard.save();
        console.log('✅ Demo profile created');
        console.log(`   Email: nicolas.oliveira@inutile.cards`);
        console.log(`   Password: Nicolas123456!`);
        console.log(`   Profile: http://localhost:3000/nicolas.oliveira\n`);
        // Seed admin data (orders, product cards, client cards)
        await seedAdminData();
        console.log('═══════════════════════════════════════════════════════════');
        console.log('🎉 Database seeding completed successfully!');
        console.log('═══════════════════════════════════════════════════════════\n');
        console.log('Test accounts:');
        console.log('  User:  test@inutile.cards / Test123456!');
        console.log('  Admin: admin@inutile.cards / Admin123456!');
        console.log('  Demo:  nicolas.oliveira@inutile.cards / Nicolas123456!\n');
        await mongoose.disconnect();
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}
seed();
//# sourceMappingURL=index.js.map
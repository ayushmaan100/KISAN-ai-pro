import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Bihar Market Data...');

  // Clear old data
  await prisma.marketPrice.deleteMany();

  const prices = [
    // 🌽 Gulabbagh (Purnia) - The Maize Capital of India
    { market: 'Gulabbagh', district: 'Purnia', crop: 'Maize', variety: 'Rabi Hybrid', price: 2150 },
    { market: 'Gulabbagh', district: 'Purnia', crop: 'Paddy', variety: 'Common', price: 2300 },
    
    // 🍚 Patna - Capital Markets
    { market: 'Patna Bazar', district: 'Patna', crop: 'Rice', variety: 'Katarni', price: 5500 },
    { market: 'Patna Bazar', district: 'Patna', crop: 'Potato', variety: 'Jyoti', price: 1200 },
    { market: 'Patna Bazar', district: 'Patna', crop: 'Onion', variety: 'Nasik Red', price: 3500 },

    // 🍒 Muzaffarpur - Litchi Hub
    { market: 'Muzaffarpur', district: 'Muzaffarpur', crop: 'Litchi', variety: 'Shahi', price: 8000 },
    
    // 🌾 Ara (Bhojpur)
    { market: 'Ara Mandi', district: 'Bhojpur', crop: 'Wheat', variety: 'HD-2967', price: 2275 },
    { market: 'Ara Mandi', district: 'Bhojpur', crop: 'Gram', variety: 'Desi', price: 5800 },
    { market: 'Ara Mandi', district: 'Bhojpur', crop: 'Mustard', variety: 'Pusa Bold', price: 4500},
    { market: 'Ara Mandi', district: 'Bhojpur', crop: 'Barley', variety: 'DWR-28', price: 2000 },
    { market: 'Ara Mandi', district: 'Bhojpur', crop: 'Rice', variety: 'Basmati', price: 2100 }
  ];

  for (const p of prices) {
    await prisma.marketPrice.create({ data: p });
  }

  console.log('✅ Market Data Seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
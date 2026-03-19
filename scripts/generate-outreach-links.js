const fs = require('fs');
const path = require('path');

const allLeads = JSON.parse(fs.readFileSync(path.resolve('leads/qualified-leads.json'), 'utf8'));
const count = parseInt(process.argv[2]) || 10;
const startFrom = parseInt(process.argv[3]) || 0;
const filter = (process.argv[4] || '').toLowerCase();

const SAMPLE_URL = 'https://nandi-food-plaza.pages.dev';
const TRACKER_PATH = path.resolve('reports/outreach-tracker.csv');

// Filter by city or category if provided
let leads = allLeads;
if (filter) {
  leads = allLeads.filter(l =>
    l.city.toLowerCase().includes(filter) ||
    l.category.toLowerCase().includes(filter) ||
    l.categories.toLowerCase().includes(filter)
  );
  console.log(`\nFiltered by "${filter}": ${leads.length} leads found`);
}

const batch = leads.slice(startFrom, startFrom + count);

if (batch.length === 0) {
  console.log('\nNo more leads in this range. Try a different offset or filter.');
  process.exit(0);
}

console.log(`\n${'='.repeat(60)}`);
console.log(`  WhatsApp Outreach Links — ${batch.length} leads`);
console.log(`  Range: #${startFrom + 1} to #${startFrom + batch.length} ${filter ? `(filter: ${filter})` : '(all leads)'}`);
console.log(`  Sample URL: ${SAMPLE_URL}`);
console.log(`${'='.repeat(60)}\n`);

const csvRows = [];
// Create header if file doesn't exist
if (!fs.existsSync(TRACKER_PATH)) {
  csvRows.push('name,phone,city,category,rating,reviews,whatsapp_link,date_generated,status');
}

const today = new Date().toISOString().split('T')[0];

batch.forEach((lead, i) => {
  const phone = lead.phone.replace(/[^0-9]/g, '').replace(/^0+/, '');
  const phoneClean = phone.startsWith('91') ? phone : '91' + phone;
  const shortName = lead.name.length > 30 ? lead.name.substring(0, 30) : lead.name;

  const msg = `🙏 Namaste ${shortName} ji,

Your ${lead.category.toLowerCase()} has an amazing ${lead.reviews.toLocaleString()}+ reviews with ${lead.rating}★ on Google Maps — that shows real customer trust!

I'm a professional web designer and I build modern websites for successful businesses like yours in ${lead.city}.

Here's a sample of the kind of website I create:
🌐 ${SAMPLE_URL}

This has interactive menus, photo gallery, Google Maps, WhatsApp button, and works beautifully on mobile.

For ${shortName}, I can build a personalized website like this with:
✅ Your menu/services with photos
✅ Customer reviews showcase
✅ WhatsApp click-to-chat button
✅ Google Maps location
✅ SEO so customers find you on Google

💰 Introductory price: just ₹5,000 one-time (no monthly fees for 1st year).

Interested? Just reply "YES" and I'll share more details.

Reply STOP to opt out.`;

  const link = `https://wa.me/${phoneClean}?text=${encodeURIComponent(msg)}`;

  console.log(`${startFrom + i + 1}. ${lead.name}`);
  console.log(`   📍 ${lead.city} | ${lead.category} | ⭐ ${lead.rating} | 📝 ${lead.reviews.toLocaleString()}`);
  console.log(`   📞 ${lead.phone}`);
  console.log(`   🔗 ${link}`);
  console.log();

  csvRows.push(`"${lead.name.replace(/"/g, '""')}","${lead.phone}","${lead.city}","${lead.category}",${lead.rating},${lead.reviews},"${link}","${today}","pending"`);
});

// Write/append tracker
if (csvRows.length > 0) {
  if (!fs.existsSync(TRACKER_PATH)) {
    fs.writeFileSync(TRACKER_PATH, csvRows.join('\n') + '\n');
  } else {
    const existingData = fs.readFileSync(TRACKER_PATH, 'utf8');
    // Skip rows that already exist (by phone number)
    const existingPhones = new Set(existingData.split('\n').map(row => {
      const match = row.match(/"(\+?\d[\d\s]+)"/);
      return match ? match[1] : '';
    }));
    const newRows = csvRows.filter(row => {
      const match = row.match(/"(\+?\d[\d\s]+)"/);
      return match && !existingPhones.has(match[1]);
    });
    if (newRows.length > 0) {
      fs.appendFileSync(TRACKER_PATH, newRows.join('\n') + '\n');
    }
  }
  console.log(`📊 Tracker: reports/outreach-tracker.csv`);
}

console.log(`\n${'─'.repeat(60)}`);
console.log(`💡 HOW TO USE:`);
console.log(`   1. Click each 🔗 link (or copy to phone browser)`);
console.log(`   2. WhatsApp opens with message pre-filled → Hit Send`);
console.log(`   3. When someone replies YES → tell Claude "Build website for {name}"`);
console.log(`\n📌 COMMANDS:`);
console.log(`   Next batch:        node scripts/generate-outreach-links.js ${count} ${startFrom + count}${filter ? ' ' + filter : ''}`);
console.log(`   Filter by city:    node scripts/generate-outreach-links.js 10 0 visakhapatnam`);
console.log(`   Filter by type:    node scripts/generate-outreach-links.js 10 0 salon`);
console.log(`   All restaurants:   node scripts/generate-outreach-links.js 20 0 restaurant`);
console.log(`${'─'.repeat(60)}\n`);

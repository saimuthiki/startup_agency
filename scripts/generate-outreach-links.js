const fs = require('fs');
const path = require('path');

const allLeads = JSON.parse(fs.readFileSync(path.resolve('leads/qualified-leads.json'), 'utf8'));
const count = parseInt(process.argv[2]) || 10;
const startFrom = parseInt(process.argv[3]) || 0;
const filter = (process.argv[4] || '').toLowerCase();

const SAMPLE_URL = 'https://nandi-food-plaza.pages.dev';
const TRACKER_PATH = path.resolve('reports/outreach-tracker.csv');

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
  console.log('\nNo more leads in this range.');
  process.exit(0);
}

console.log(`\n${'='.repeat(60)}`);
console.log(`  WhatsApp Outreach — ${batch.length} leads`);
console.log(`  Range: #${startFrom + 1} to #${startFrom + batch.length}`);
console.log(`${'='.repeat(60)}\n`);

const csvRows = [];
if (!fs.existsSync(TRACKER_PATH)) {
  csvRows.push('name,phone,city,category,rating,reviews,whatsapp_link,date_generated,status');
}

const today = new Date().toISOString().split('T')[0];

batch.forEach((lead, i) => {
  const phone = lead.phone.replace(/[^0-9]/g, '').replace(/^0+/, '');
  const phoneClean = phone.startsWith('91') ? phone : '91' + phone;
  const shortName = lead.name.length > 35 ? lead.name.substring(0, 35) : lead.name;

  const msg = `Hi ${shortName} ji! 🙏

${lead.reviews > 100 ? `Wow — ${lead.reviews.toLocaleString()}+ Google reviews with ${lead.rating}★! Your customers clearly love what you do.` : `Your ${lead.category.toLowerCase()} in ${lead.city} caught my attention on Google Maps.`}

Quick question — have you thought about having your own website?

Today 70% of customers search online before visiting any shop. Without a website, you're invisible to them. Your competitors who have websites are getting those customers.

I recently built this for a business just like yours:
👉 ${SAMPLE_URL}
(Open it — takes 5 seconds. See how professional it looks!)

What you get:
📱 Mobile-friendly website your customers love
📍 Google Maps so people find you easily
💬 WhatsApp button — customers message you in 1 tap
⭐ Your reviews & ratings showcased
📸 Beautiful photo gallery of your business
🔍 SEO — show up when people Google "${lead.category.toLowerCase()} in ${lead.city}"

💰 One-time investment: starts at just ₹5,000
(No monthly fees for the first year. Price is negotiable!)

This is a one-time cost that brings you customers 24/7, 365 days. Think of it — even if just 2-3 new customers find you through the website every month, it pays for itself many times over.

Interested? Just reply YES — I'll create a free mockup for your business to show you how it looks. No payment needed to see the demo.

- Sai, Web Designer`;

  const link = `https://wa.me/${phoneClean}?text=${encodeURIComponent(msg)}`;

  console.log(`${startFrom + i + 1}. ${lead.name}`);
  console.log(`   📍 ${lead.city} | ${lead.category} | ⭐ ${lead.rating} | 📝 ${lead.reviews.toLocaleString()}`);
  console.log(`   📞 ${lead.phone}`);
  console.log(`   🔗 ${link}`);
  console.log();

  csvRows.push(`"${lead.name.replace(/"/g, '""')}","${lead.phone}","${lead.city}","${lead.category}",${lead.rating},${lead.reviews},"${link}","${today}","pending"`);
});

if (csvRows.length > 0) {
  if (!fs.existsSync(TRACKER_PATH)) {
    fs.writeFileSync(TRACKER_PATH, csvRows.join('\n') + '\n');
  } else {
    const existingData = fs.readFileSync(TRACKER_PATH, 'utf8');
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
console.log(`💡 Click each 🔗 link → WhatsApp opens → Hit Send`);
console.log(`📌 Next batch: node scripts/generate-outreach-links.js ${count} ${startFrom + count}${filter ? ' ' + filter : ''}`);
console.log(`${'─'.repeat(60)}\n`);

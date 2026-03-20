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

  const reviewLine = lead.reviews > 100
    ? `Google Maps లో ${lead.reviews.toLocaleString()}+ reviews, ${lead.rating}★ rating — మీ customers మిమ్మల్ని చాలా నమ్ముతున్నారు! 👏`
    : `Google Maps లో మీ ${lead.category.toLowerCase()} చూశాను — ${lead.city} లో మంచి business నడుపుతున్నారు!`;

  const msg = `🙏 ${shortName} గారు,

${reviewLine}

ఒక్క question — మీకు website ఉందా?

ఇప్పుడు 70% customers shop కి రాకముందు online లో search చేస్తారు. Website లేకపోతే వాళ్ళకి మీరు కనిపించరు. మీ competitors websites ఉన్నాయి — ఆ customers వాళ్ళ దగ్గరకి వెళ్తున్నారు.

ఇలాంటి business కోసం నేను recently build చేసిన website చూడండి 👇
🌐 ${SAMPLE_URL}
(5 seconds లో open చేయండి — ఎంత professional గా ఉందో చూడండి!)

మీకు ఏం దొరుకుతుంది:
📱 Mobile-friendly website
📍 Google Maps location
💬 WhatsApp button — 1 tap లో customers message చేస్తారు
🔍 "${lead.category.toLowerCase()} in ${lead.city}" అని Google లో search చేస్తే మీరు కనిపిస్తారు

💰 One-time investment: ₹5,000 నుండి (negotiable)
Monthly charges లేవు. ఒక్కసారి invest చేస్తే 24/7 customers వస్తారు.

ఆసక్తి ఉంటే నాకు message చేయండి — మీ business కోసం free demo చూపిస్తాను 🙌

— Sai, Web Designer`;

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

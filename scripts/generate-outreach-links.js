const fs = require('fs');
const path = require('path');

const leads = JSON.parse(fs.readFileSync(path.resolve('leads/qualified-leads.json'), 'utf8'));
const count = parseInt(process.argv[2]) || 10;
const startFrom = parseInt(process.argv[3]) || 0;

const SAMPLE_URL = 'https://nandi-food-plaza.pages.dev';

console.log(`\n=== WhatsApp Outreach Links (${count} leads, starting from #${startFrom + 1}) ===`);
console.log(`Sample URL: ${SAMPLE_URL}\n`);

const batch = leads.slice(startFrom, startFrom + count);
const csvRows = ['name,phone,city,category,rating,reviews,whatsapp_link,status'];

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

  csvRows.push(`"${lead.name}","${lead.phone}","${lead.city}","${lead.category}",${lead.rating},${lead.reviews},"${link}","pending"`);
});

// Save tracker CSV
const trackerPath = path.resolve('reports/outreach-tracker.csv');
if (!fs.existsSync(trackerPath)) {
  fs.writeFileSync(trackerPath, csvRows.join('\n'));
  console.log(`📊 Tracker saved: reports/outreach-tracker.csv`);
} else {
  // Append without header
  fs.appendFileSync(trackerPath, '\n' + csvRows.slice(1).join('\n'));
  console.log(`📊 Appended to: reports/outreach-tracker.csv`);
}

console.log(`\n💡 HOW TO USE:`);
console.log(`   1. Click each 🔗 link (or copy to phone browser)`);
console.log(`   2. WhatsApp opens with personalized message pre-filled`);
console.log(`   3. Hit Send — that's it!`);
console.log(`   4. When someone replies YES → tell Claude to build their website\n`);
console.log(`📌 Next batch: node scripts/generate-outreach-links.js ${count} ${startFrom + count}`);

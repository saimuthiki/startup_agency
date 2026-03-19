const path = require('path');
const XLSX = require('xlsx');
const fs = require('fs');

const inputFile = process.argv[2] || 'leads/all-task-1-overview.xlsx';
const outputFile = process.argv[3] || 'leads/qualified-leads.json';

const wb = XLSX.readFile(path.resolve(inputFile));
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws);

console.log(`Total rows: ${data.length}`);

const qualified = data
  .filter(row => {
    const phone = row.phone || row.Phone || '';
    const website = row.website || row.Website || '';
    const rating = parseFloat(row.rating || row.Rating || 0);
    const isClosed = row.is_temporarily_closed === true || row.is_temporarily_closed === 'true';
    return phone && phone.toString().trim() !== '' &&
           (!website || website.toString().trim() === '') &&
           rating >= 3.5 &&
           !isClosed;
  })
  .map(row => {
    const name = (row.name || row.Name || '').toString().trim();
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
    const phone = (row.phone || '').toString().trim();
    const address = (row.address || '').toString().trim();
    const city = extractCity(address, row.query || '');
    return {
      name,
      slug,
      phone,
      category: (row.main_category || row.category || 'Business').toString().trim(),
      categories: (row.categories || '').toString().trim(),
      address,
      city,
      rating: parseFloat(row.rating || 0),
      reviews: parseInt(row.reviews || 0),
      featured_image: (row.featured_image || '').toString().trim(),
      google_maps_link: (row.link || '').toString().trim(),
      query: (row.query || '').toString().trim()
    };
  })
  .sort((a, b) => b.reviews - a.reviews);

function extractCity(address, query) {
  const queryMatch = query.match(/in\s+([^,]+)/i);
  if (queryMatch) return queryMatch[1].trim();
  const parts = address.split(',').map(s => s.trim());
  if (parts.length >= 3) return parts[parts.length - 3];
  return 'Andhra Pradesh';
}

fs.writeFileSync(path.resolve(outputFile), JSON.stringify(qualified, null, 2));

// Summary
const byCategory = {};
const byCity = {};
qualified.forEach(l => {
  byCategory[l.category] = (byCategory[l.category] || 0) + 1;
  byCity[l.city] = (byCity[l.city] || 0) + 1;
});

console.log(`\nQualified leads: ${qualified.length} / ${data.length}`);
console.log(`\nBy Category:`);
Object.entries(byCategory).sort((a,b) => b[1]-a[1]).slice(0,15).forEach(([k,v]) => console.log(`  ${k}: ${v}`));
console.log(`\nBy City:`);
Object.entries(byCity).sort((a,b) => b[1]-a[1]).slice(0,15).forEach(([k,v]) => console.log(`  ${k}: ${v}`));
console.log(`\nOutput: ${outputFile}`);

const fs = require('fs');

const galleryUpdates = [
  {
    id: "gal-001", // Veneers
    before: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Comparison_-_Crowns_and_veneer.jpg",
    after: "https://images.unsplash.com/photo-1606265752439-1f18756aa5ee?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "gal-002", // Whitening
    before: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Office_Teeth_Whitening.jpg",
    after: "https://images.unsplash.com/photo-1590680424574-d46ecdd86de3?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "gal-003", // Implants
    before: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Implant_vs_Bridge.jpg",
    after: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "gal-004", // Orthodontics
    before: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Orthobraces_-_dental_braces_lower_upper_jaw.jpg",
    after: "https://images.unsplash.com/photo-1627916104191-18545e1d4499?q=80&w=800&auto=format&fit=crop"
  }
];

let c = fs.readFileSync('src/data/clinic.ts', 'utf8');

galleryUpdates.forEach(update => {
  const regex = new RegExp(`(id:\\s*"${update.id}"[\\s\\S]*?beforeImageUrl:\\s*)"([^"]+)"([\\s\\S]*?afterImageUrl:\\s*)"([^"]+)"`);
  c = c.replace(regex, `$1"${update.before}"$3"${update.after}"`);
});

fs.writeFileSync('src/data/clinic.ts', c);
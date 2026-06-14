const fs = require('fs');
const path = require('path');
const os = require('os');

// 1. Get WLAN/Wi-Fi IPv4 Address
const nets = os.networkInterfaces();
let ipAddress = 'localhost';

for (const name of Object.keys(nets)) {
    if (name.toLowerCase().includes('wi-fi') || name.toLowerCase().includes('wlan')) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                ipAddress = net.address;
            }
        }
    }
}
// Fallback if not specifically named wi-fi/wlan
if (ipAddress === 'localhost') {
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal && !name.toLowerCase().includes('vmware') && !name.toLowerCase().includes('vbox')) {
                ipAddress = net.address;
            }
        }
    }
}

console.log(`[IP Update] Found IP Address: ${ipAddress}`);

// 2. Define how URLs map to server ports
function mapUrl(url) {
    if (!url || url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:')) return url;
    
    // Leave external links alone (except our own IP links)
    if (url.startsWith('http') && !url.includes('localhost') && !url.match(/http:\/\/[0-9\.]+:\d+/)) {
        return url;
    }

    // If it's already one of our server links, just update the IP
    let match = url.match(/http:\/\/(?:localhost|[0-9\.]+):(700[0-8])(.*)/);
    if (match) {
        return `http://${ipAddress}:${match[1]}${match[2]}`;
    }

    // Remove query string and hash to parse the path
    let cleanUrl = url.split('#')[0].split('?')[0];
    if (!cleanUrl) return url; 

    let basename = path.basename(cleanUrl);
    if (!basename || cleanUrl === '/' || cleanUrl === '') basename = 'index.html';
    
    if (basename === 'style.css') return `http://${ipAddress}:7001/`;
    if (basename === 'app.js') return `http://${ipAddress}:7006/`;
    if (basename === 'index.html') return `http://${ipAddress}:7000/`;
    if (basename === 'destinations.html') return `http://${ipAddress}:7002/`;
    if (basename.startsWith('destination-details-')) {
        let m = basename.match(/destination-details-(\d+)\.html/);
        if (m) return `http://${ipAddress}:7002/destination-details/${m[1]}`;
    }
    if (basename === 'blog.html') return `http://${ipAddress}:7003/`;
    if (basename.startsWith('blog-post-')) {
        let m = basename.match(/blog-post-(\d+)\.html/);
        if (m) return `http://${ipAddress}:7003/blog-post/${m[1]}`;
    }
    if (basename === 'accommodations.html') return `http://${ipAddress}:7004/`;
    if (basename.startsWith('accommodation-details-')) {
        let m = basename.match(/accommodation-details-(\d+)\.html/);
        if (m) return `http://${ipAddress}:7004/accommodation-details/${m[1]}`;
    }
    if (basename === 'tours.html') return `http://${ipAddress}:7005/`;
    if (basename.startsWith('tour-details-')) {
        let m = basename.match(/tour-details-(\d+)\.html/);
        if (m) return `http://${ipAddress}:7005/tour-details/${m[1]}`;
    }
    if (['about.html', 'contact.html', 'faq.html', 'support.html'].includes(basename)) {
        return `http://${ipAddress}:7007/${basename.replace('.html', '')}`;
    }
    if (['privacy.html', 'terms.html'].includes(basename)) {
        return `http://${ipAddress}:7000/${basename}`; // Served from root or ignored if missing
    }
    if (url.includes('/images/') || cleanUrl.match(/\.(jpg|png|webp|jpeg)$/i)) {
        return `http://${ipAddress}:7008/${basename}`;
    }
    
    return url;
}

// 3. Process Files
function processFile(filePath) {
    if (!filePath.endsWith('.html') && !filePath.endsWith('.css')) return;
    
    let originalContent = fs.readFileSync(filePath, 'utf8');
    let content = originalContent;
    
    // Replace href="..."
    content = content.replace(/href="([^"]+)"/g, (match, p1) => `href="${mapUrl(p1)}"`);
    // Replace href='...'
    content = content.replace(/href='([^']+)'/g, (match, p1) => `href='${mapUrl(p1)}'`);
    
    // Replace src="..."
    content = content.replace(/src="([^"]+)"/g, (match, p1) => `src="${mapUrl(p1)}"`);
    // Replace src='...'
    content = content.replace(/src='([^']+)'/g, (match, p1) => `src='${mapUrl(p1)}'`);

    // Replace data-src="..."
    content = content.replace(/data-src="([^"]+)"/g, (match, p1) => `data-src="${mapUrl(p1)}"`);
    // Replace data-src='...'
    content = content.replace(/data-src='([^']+)'/g, (match, p1) => `data-src='${mapUrl(p1)}'`);
    
    // Handle inline styles url('...')
    content = content.replace(/url\('([^']+)'\)/g, (match, p1) => `url('${mapUrl(p1)}')`);
    content = content.replace(/url\("([^"]+)"\)/g, (match, p1) => `url("${mapUrl(p1)}")`);

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git') continue;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else {
            processFile(fullPath);
        }
    }
}

// Run the replacement
walkDir(__dirname);
console.log(`[IP Update] Done. All HTML/CSS files updated to map to IP: ${ipAddress}`);

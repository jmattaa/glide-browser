const fs = require('fs');
const path = require('path');

fs.cpSync(
    path.join(process.cwd(), 'templates'),
    path.join(process.cwd(), 'dist', 'templates'),
    { recursive: true }
);
fs.cpSync(
    path.join(process.cwd(), 'user'),
    path.join(process.cwd(), 'dist', 'user'),
    { recursive: true }
);
fs.cpSync(
    path.join(process.cwd(), 'glide-pages'),
    path.join(process.cwd(), 'dist', 'glide-pages'),
    { recursive: true }
);
fs.cpSync(
    path.join(process.cwd(), 'html-pages'),
    path.join(process.cwd(), 'dist'),
    { recursive: true }
)

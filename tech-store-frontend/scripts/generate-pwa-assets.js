// scripts/generate-pwa-assets.js - Generador automático de iconos y splash screens
const fs = require('fs');
const path = require('path');

// Verificar si sharp está instalado
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.error('❌ Error: sharp no está instalado.');
  console.log('📦 Instálalo con: npm install --save-dev sharp');
  process.exit(1);
}

// Configuración de iconos
const iconSizes = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 57, name: 'icon-57x57.png' },
  { size: 60, name: 'icon-60x60.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 76, name: 'icon-76x76.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 114, name: 'icon-114x114.png' },
  { size: 120, name: 'icon-120x120.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' }
];

// Configuración de splash screens para iOS
const splashSizes = [
  { width: 640, height: 1136, name: 'iphone5_splash.png', device: 'iPhone 5/SE' },
  { width: 750, height: 1334, name: 'iphone6_splash.png', device: 'iPhone 6/7/8' },
  { width: 1242, height: 2208, name: 'iphoneplus_splash.png', device: 'iPhone 6/7/8 Plus' },
  { width: 1125, height: 2436, name: 'iphonex_splash.png', device: 'iPhone X/11 Pro' },
  { width: 828, height: 1792, name: 'iphonexr_splash.png', device: 'iPhone XR/11' },
  { width: 1242, height: 2688, name: 'iphonexsmax_splash.png', device: 'iPhone XS Max/11 Pro Max' },
  { width: 1536, height: 2048, name: 'ipad_splash.png', device: 'iPad' },
  { width: 1668, height: 2224, name: 'ipadpro1_splash.png', device: 'iPad Pro 10.5"' },
  { width: 2048, height: 2732, name: 'ipadpro2_splash.png', device: 'iPad Pro 12.9"' },
  { width: 1668, height: 2388, name: 'ipadpro3_splash.png', device: 'iPad Pro 11"' }
];

// Crear directorios si no existen
const createDirectories = () => {
  const dirs = ['public/icons', 'public/splash'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Directorio creado: ${dir}`);
    }
  });
};

// Generar iconos
const generateIcons = async (logoPath) => {
  console.log('🎨 Generando iconos...');
  
  for (const icon of iconSizes) {
    try {
      await sharp(logoPath)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(path.join('public/icons', icon.name));
      
      console.log(`✅ ${icon.name} (${icon.size}x${icon.size})`);
    } catch (error) {
      console.error(`❌ Error generando ${icon.name}:`, error.message);
    }
  }
};

// Generar favicon.ico
const generateFavicon = async (logoPath) => {
  console.log('🌟 Generando favicon...');
  
  try {
    // Generar PNG de 32x32 para favicon
    const favicon32 = await sharp(logoPath)
      .resize(32, 32)
      .png()
      .toBuffer();
    
    fs.writeFileSync('public/favicon.ico', favicon32);
    console.log('✅ favicon.ico generado');
  } catch (error) {
    console.error('❌ Error generando favicon:', error.message);
  }
};

// Generar splash screens
const generateSplashScreens = async (logoPath) => {
  console.log('📱 Generando splash screens...');
  
  for (const splash of splashSizes) {
    try {
      // Crear gradiente de fondo
      const gradient = Buffer.from(`
        <svg width="${splash.width}" height="${splash.height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad)" />
        </svg>
      `);

      // Redimensionar logo para el splash
      const logoSize = Math.min(splash.width, splash.height) * 0.3;
      const logoBuffer = await sharp(logoPath)
        .resize(Math.round(logoSize), Math.round(logoSize), {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toBuffer();

      // Combinar gradiente con logo centrado
      await sharp(gradient)
        .composite([{
          input: logoBuffer,
          top: Math.round((splash.height - logoSize) / 2),
          left: Math.round((splash.width - logoSize) / 2)
        }])
        .png()
        .toFile(path.join('public/splash', splash.name));
      
      console.log(`✅ ${splash.name} (${splash.width}x${splash.height}) - ${splash.device}`);
    } catch (error) {
      console.error(`❌ Error generando ${splash.name}:`, error.message);
    }
  }
};

// Generar browserconfig.xml para Microsoft
const generateBrowserConfig = () => {
  const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/icons/icon-144x144.png"/>
            <TileColor>#2563eb</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;

  fs.writeFileSync('public/browserconfig.xml', browserConfig);
  console.log('✅ browserconfig.xml generado');
};

// Generar robots.txt
const generateRobotsTxt = () => {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://tu-dominio.com/sitemap.xml`;

  fs.writeFileSync('public/robots.txt', robotsTxt);
  console.log('✅ robots.txt generado');
};

// Crear logo de ejemplo si no existe
const createExampleLogo = async () => {
  const logoPath = 'public/logo-source.png';
  
  if (!fs.existsSync(logoPath)) {
    console.log('🎨 Creando logo de ejemplo...');
    
    const logoSvg = Buffer.from(`
      <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="256" cy="256" r="240" fill="url(#logoGrad)" />
        <text x="256" y="280" font-family="Arial, sans-serif" font-size="120" font-weight="bold" text-anchor="middle" fill="white">T</text>
        <text x="256" y="380" font-family="Arial, sans-serif" font-size="40" text-anchor="middle" fill="white" opacity="0.9">TechStore</text>
      </svg>
    `);

    await sharp(logoSvg)
      .png()
      .toFile(logoPath);
    
    console.log(`✅ Logo de ejemplo creado: ${logoPath}`);
    console.log('💡 Tip: Reemplaza este archivo con tu logo real y ejecuta el script nuevamente');
  }
  
  return logoPath;
};

// Función principal
const main = async () => {
  console.log('🚀 Generador de Assets PWA para TechStore\n');
  
  try {
    // Crear directorios
    createDirectories();
    
    // Crear logo de ejemplo o usar existente
    const logoPath = await createExampleLogo();
    
    // Verificar que el logo existe
    if (!fs.existsSync(logoPath)) {
      console.error(`❌ Logo no encontrado: ${logoPath}`);
      console.log('📝 Coloca tu logo como "public/logo-source.png" y ejecuta el script nuevamente');
      process.exit(1);
    }
    
    console.log(`📁 Usando logo: ${logoPath}\n`);
    
    // Generar todos los assets
    await generateIcons(logoPath);
    console.log('');
    
    await generateFavicon(logoPath);
    console.log('');
    
    await generateSplashScreens(logoPath);
    console.log('');
    
    generateBrowserConfig();
    generateRobotsTxt();
    
    console.log('\n🎉 ¡Assets PWA generados exitosamente!');
    console.log('\n📂 Archivos creados:');
    console.log('   public/icons/ - Todos los iconos de la PWA');
    console.log('   public/splash/ - Splash screens para iOS');
    console.log('   public/favicon.ico - Favicon principal');
    console.log('   public/browserconfig.xml - Configuración Microsoft');
    console.log('   public/robots.txt - SEO robots');
    
    console.log('\n✨ Siguiente paso:');
    console.log('   1. Revisa que todos los iconos se vean bien');
    console.log('   2. Reemplaza logo-source.png con tu logo real si es necesario');
    console.log('   3. Ejecuta "npm run build" para crear la PWA');
    
  } catch (error) {
    console.error('❌ Error durante la generación:', error.message);
    process.exit(1);
  }
};

// Verificar argumentos de línea de comandos
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🚀 Generador de Assets PWA para TechStore

Uso:
  node scripts/generate-pwa-assets.js

Requisitos:
  - Logo fuente: public/logo-source.png (se crea automáticamente si no existe)
  - Dependencia: sharp (se instala automáticamente)

Genera:
  • 16 iconos de diferentes tamaños para PWA
  • 10 splash screens para dispositivos iOS
  • favicon.ico
  • browserconfig.xml
  • robots.txt

Opciones:
  --help, -h    Muestra esta ayuda
  `);
  process.exit(0);
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { main, generateIcons, generateSplashScreens };
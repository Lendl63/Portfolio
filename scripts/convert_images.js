const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '..', 'src', 'icon', 'user');
const outputDir = path.join(__dirname, '..', 'src', 'assets', 'user');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

async function convert() {
  const files = fs.readdirSync(inputDir).filter(f => /\.(jpe?g|png)$/i.test(f));

  for (const file of files) {
    const name = path.parse(file).name;
    const input = path.join(inputDir, file);

    try {
      // Avatars: resize to 50x50 and create webp + avif + fallback jpg
      await sharp(input)
        .resize(50, 50)
        .webp({ quality: 75 })
        .toFile(path.join(outputDir, `${name}-50.webp`));

      await sharp(input)
        .resize(50, 50)
        .avif({ quality: 50 })
        .toFile(path.join(outputDir, `${name}-50.avif`));

      await sharp(input)
        .resize(50, 50)
        .jpeg({ quality: 70 })
        .toFile(path.join(outputDir, `${name}-50.jpg`));

      // Full-size conversions for gallery/hero images
      await sharp(input)
        .webp({ quality: 80 })
        .toFile(path.join(outputDir, `${name}.webp`));

      await sharp(input)
        .avif({ quality: 60 })
        .toFile(path.join(outputDir, `${name}.avif`));

      console.log(`Converted ${file}`);
    } catch (err) {
      console.error(`Error converting ${file}:`, err);
    }
  }
}

convert();

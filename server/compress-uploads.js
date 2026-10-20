require('dotenv').config();
const { Client } = require('pg'); // 👈 Using PostgreSQL client
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// ✅ Automatically reads from your .env file
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432, // 👈 Default Postgres port
};

// ✅ Automatically reads from your .env file
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/var/www/tripist-admin/uploads";

async function processImages() {
  console.log("🚀 Starting image compression...");
  console.log(`📁 Looking in: ${UPLOAD_DIR}`);
  
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL Database.");

    const files = fs.readdirSync(UPLOAD_DIR);

    for (const file of files) {
      // Skip files that are already compressed .webp or aren't images
      if (file.endsWith('.webp') || !file.match(/\.(jpg|jpeg|png)$/i)) continue;

      const oldFilePath = path.join(UPLOAD_DIR, file);
      const stats = fs.statSync(oldFilePath);
      
      // Only process if file is larger than 300KB
      if (stats.size > 300 * 1024) {
        const newFilename = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        const newFilePath = path.join(UPLOAD_DIR, newFilename);

        console.log(`\n📦 Compressing: ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

        try {
          // 1. Compress the image
          await sharp(oldFilePath)
            .resize({ width: 1920, withoutEnlargement: true })
            .webp({ quality: 75 })
            .toFile(newFilePath);

          // 2. Fix permissions
          fs.chmodSync(newFilePath, 0o644);

          const oldUrlPattern = `%${file}%`;

          // 3. Update Database (Packages) - Postgres uses $1, $2 syntax
          await client.query(
            "UPDATE packages SET image = REPLACE(image, $1, $2) WHERE image LIKE $3", 
            [file, newFilename, oldUrlPattern]
          );

          // 4. Update Database (Destinations)
          await client.query(
            "UPDATE destinations SET hero_image = REPLACE(hero_image, $1, $2) WHERE hero_image LIKE $3", 
            [file, newFilename, oldUrlPattern]
          );

          // 5. Delete the old heavy file
          fs.unlinkSync(oldFilePath);

          console.log(`✅ Success! Saved as ${newFilename} and updated database.`);

        } catch (err) {
          console.error(`❌ Failed to process ${file}:`, err.message);
        }
      }
    }

    console.log("\n🎉 All images processed successfully!");
    
  } catch (error) {
    console.error("❌ Database Connection Error:", error.message);
  } finally {
    await client.end(); // Close Postgres connection
  }
}

processImages();
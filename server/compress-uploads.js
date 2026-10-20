const mysql = require('mysql2/promise'); // Use 'pg' if you are using PostgreSQL
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// ⚠️ 1. UPDATE YOUR DATABASE DETAILS HERE
const dbConfig = {
  host: 'localhost',
  user: 'your_db_user',
  password: 'your_db_password',
  database: 'your_db_name'
};

// ⚠️ 2. YOUR UPLOAD FOLDER PATH
const UPLOAD_DIR = "/var/www/tripist-admin/uploads";

async function processImages() {
  console.log("🚀 Starting image compression...");
  
  try {
    const db = await mysql.createConnection(dbConfig);
    console.log("✅ Connected to Database.");

    // Get all files in the uploads folder
    const files = fs.readdirSync(UPLOAD_DIR);

    for (const file of files) {
      // Skip files that are already compressed .webp or aren't images
      if (file.endsWith('.webp') || !file.match(/\.(jpg|jpeg|png)$/i)) continue;

      const oldFilePath = path.join(UPLOAD_DIR, file);
      const stats = fs.statSync(oldFilePath);
      
      // Only process if file is larger than 300KB (to save time)
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

          // 2. Fix permissions so Nginx can read it
          fs.chmodSync(newFilePath, 0o644);

          const oldUrlPattern = `%${file}`;
          const newUrl = `/uploads/${newFilename}`; // Adjust if your URLs look different

          // 3. Update Database (Packages)
          await db.execute(
            "UPDATE packages SET image = REPLACE(image, ?, ?) WHERE image LIKE ?", 
            [file, newFilename, oldUrlPattern]
          );

          // 4. Update Database (Destinations)
          await db.execute(
            "UPDATE destinations SET hero_image = REPLACE(hero_image, ?, ?) WHERE hero_image LIKE ?", 
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
    await db.end();
    
  } catch (error) {
    console.error("❌ Script Error:", error);
  }
}

processImages();
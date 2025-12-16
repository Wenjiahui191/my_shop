const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');

const schemaPath = path.join(__dirname, '../src/database/schema.sql');

async function initDb() {
  try {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    const statements = schema
      .split(';')
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0);

    console.log('Running schema initialization...');

    for (const statement of statements) {
      await db.query(statement);
    }

    // Hash password for default admin
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
      
    // Insert default admin if not exists
    await db.query(`
      INSERT IGNORE INTO admins (username, password, role) 
      VALUES ('admin', ?, 'admin')
    `, [hashedPassword]);

    console.log('Database initialized successfully!');
    console.log('Default admin created: username=admin, password=admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDb();

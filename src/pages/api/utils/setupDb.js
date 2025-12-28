import sql from './sql.js'; // adjust path

async function setupDatabase() {
  try {
    console.log('Creating auth_users table...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS auth_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'customer',
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    // MySQL doesn't support `CREATE INDEX IF NOT EXISTS` (that's a Postgres feature).
    // Check information_schema for the index and create it only when missing.
    const idxCheck = await sql`
      SELECT COUNT(*) AS cnt
      FROM information_schema.statistics
      WHERE table_schema = DATABASE()
        AND table_name = 'auth_users'
        AND index_name = 'idx_auth_users_email'
    `;

    const idxExists = idxCheck && idxCheck[0] && (idxCheck[0].cnt > 0);
    if (!idxExists) {
      // Only create the index when it doesn't exist
      await sql`
        CREATE INDEX idx_auth_users_email ON auth_users(email)
      `;
    }

    console.log('✅ Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

export default setupDatabase;
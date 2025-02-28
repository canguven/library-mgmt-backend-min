const { sequelize } = require('./database');

/**
 * Initializes the database - syncs models and resets sequences
 * Automatically detects all tables and resets their sequences
 */
const initializeDatabase = async () => {
  try {
    // Sync models
    await sequelize.sync();
    console.log('Database synchronized successfully');
    
    // Get all tables with their sequences from PostgreSQL information schema
    const [results] = await sequelize.query(`
      SELECT 
        table_name, 
        column_name, 
        pg_get_serial_sequence(quote_ident(table_name), column_name) as sequence_name
      FROM 
        information_schema.columns
      WHERE 
        table_schema = 'public'
        AND column_default LIKE 'nextval%'
    `);
    
    // Reset sequence for each table found
    for (const table of results) {
      if (table.sequence_name) {
        await sequelize.query(`
          SELECT setval('${table.sequence_name}', (SELECT COALESCE(MAX(${table.column_name}), 0) + 1 FROM "${table.table_name}"), false);
        `);
        console.log(`Reset sequence for table ${table.table_name}`);
      }
    }
    
    console.log('All database sequences reset successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};

module.exports = {
  initializeDatabase
};
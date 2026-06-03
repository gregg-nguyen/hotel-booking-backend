import pool from "./db"; // Import database connection

async function testConnection() {
  // Database queries take time, so we use async

  try {
    // Try connecting to PostgreSQL

    const result = await pool.query("SELECT NOW()");
    // Send SQL to PostgreSQL:
    // "What time is it right now?"

    console.log(result.rows);
    // Print PostgreSQL's answer

  } catch (error) {
    // If connection/query fails

    console.error(error);
    // Show error details
  }
}

testConnection();
// Actually run the function
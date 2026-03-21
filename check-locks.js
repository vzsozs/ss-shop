const { createClient } = require('@libsql/client');

async function check() {
  const client = createClient({
    url: 'file:payload.db',
  });

  try {
    const res = await client.execute("PRAGMA table_info(payload_locked_documents_rels)");
    console.log('Columns:', JSON.stringify(res.rows));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

check();

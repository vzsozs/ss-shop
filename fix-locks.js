const { createClient } = require('@libsql/client');

async function fix() {
  const client = createClient({
    url: 'file:payload.db',
  });

  try {
    console.log('Dropping payload_locked_documents_rels...');
    await client.execute('DROP TABLE IF EXISTS payload_locked_documents_rels');
    
    // Also drop any shadow tables from failed Drizzle migrations
    console.log('Dropping shadow tables...');
    await client.execute('DROP TABLE IF EXISTS __new_payload_locked_documents_rels');
    await client.execute('DROP TABLE IF EXISTS __new_slides'); 
    await client.execute('DROP TABLE IF EXISTS __new_menu_slides');
    
    console.log('Done.');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

fix();

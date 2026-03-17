require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function testContentUpdate() {
  try {
    console.log('🧪 Testing content update...');
    
    // First, try to read existing content
    const { data: existingContent, error: readError } = await supabase
      .from('content')
      .select('*')
      .eq('page_key', 'home-hero')
      .single();
    
    console.log('📖 Existing content:', { existingContent: existingContent?.id, readError });
    
    if (readError) {
      console.error('❌ Cannot read content:', readError);
      return;
    }
    
    // Try a simple update
    const updateData = {
      title: 'Test Update at ' + new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('🔄 Attempting update with:', updateData);
    
    const { data: updateResult, error: updateError } = await supabase
      .from('content')
      .update(updateData)
      .eq('id', existingContent.id)
      .select()
      .single();
    
    console.log('📝 Update result:', { updateResult, updateError });
    
    if (updateError) {
      console.error('❌ Update failed:', updateError);
      
      // Try with upsert
      console.log('🔄 Trying upsert...');
      const upsertData = {
        ...updateData,
        id: existingContent.id,
        page_key: 'home-hero'
      };
      
      const { data: upsertResult, error: upsertError } = await supabase
        .from('content')
        .upsert(upsertData)
        .select()
        .single();
      
      console.log('📝 Upsert result:', { upsertResult, upsertError });
    } else {
      console.log('✅ Update successful!');
    }
    
  } catch (error) {
    console.error('❌ Error in testContentUpdate:', error);
  }
}

testContentUpdate();

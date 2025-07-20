import { useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Use correct env vars depending on your setup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,         // ✅ URL from .env
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY     // ✅ Anon Key from .env
)

function App() {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.from('your_table_name').select('*').limit(1)

      if (error) {
        console.error('❌ Supabase Connection Error:', error.message)
      } else {
        console.log('✅ Supabase Connection Successful. Data:', data)
      }
    }
s
    testConnection()
  }, [])

  return (
    <div>
      <h1>Supabase Test Connection</h1>
      <p>Check the browser console for connection status.</p>
    </div>
  )
}

export default App

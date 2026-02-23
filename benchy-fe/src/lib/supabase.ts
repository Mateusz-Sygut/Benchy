import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Database } from '../types/database';

const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL || 
                   process.env.EXPO_PUBLIC_SUPABASE_URL || 
                   'YOUR_SUPABASE_URL';

const supabaseAnonKey = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY || 
                       process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                       'YOUR_SUPABASE_ANON_KEY';

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.error('❌ Supabase URL i klucz API nie są skonfigurowane!');
  console.log('📝 Dodaj je do app.json w sekcji extra:');
  console.log('   "SUPABASE_URL": "https://xxx.supabase.co"');
  console.log('   "SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIs..."');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;


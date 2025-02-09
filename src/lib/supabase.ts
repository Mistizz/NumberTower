import { createClient } from '@supabase/supabase-js';

// 環境変数が存在することを型で保証
declare global {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 開発環境でのみ詳細なエラーメッセージを表示
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment Variables Status:', {
    VITE_SUPABASE_URL: supabaseUrl ? '設定済み' : '未設定',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? '設定済み' : '未設定'
  });
  throw new Error('Required environment variables are missing. Please check your configuration.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
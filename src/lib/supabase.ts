import { createClient } from "@supabase/supabase-js"

// Publishable client settings are public; authorization is enforced by database RLS.
const url = import.meta.env.VITE_SUPABASE_URL || "https://zmjfpjnfdaunmdtywxql.supabase.co"
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_iOhbMal_VtpY9SQml8PiQw_pRuZnIMM"
export const supabase = createClient(url, key)

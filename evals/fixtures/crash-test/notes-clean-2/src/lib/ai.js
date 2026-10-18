import { supabase } from './supabase.js'

export async function summarize(text) {
  const { data } = await supabase.functions.invoke('summarize', { body: { text } })
  return data.choices[0].message.content
}

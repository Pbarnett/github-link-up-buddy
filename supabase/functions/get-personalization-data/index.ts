import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Edge Function to get personalization data
export default async (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return res.status(200).json(profiles);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

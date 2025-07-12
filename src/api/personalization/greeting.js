import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getPersonalizedGreeting(userId) {
  try {
    // Fetch user personalization data
    const { data: userData, error: userError } = await supabase
      .from('user_personalization')
      .select('name, last_visit, personalization_enabled')
      .eq('user_id', userId)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error fetching user data:', userError);
      return { greeting: 'Welcome!', personalized: false };
    }

    // If no personalization data or personalization disabled
    if (!userData || !userData.personalization_enabled) {
      return { greeting: 'Welcome!', personalized: false };
    }

    // Update last visit
    await supabase
      .from('user_personalization')
      .update({ last_visit: new Date().toISOString() })
      .eq('user_id', userId);

    // Generate time-based greeting
    const getTimeBasedGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    };

    const timeGreeting = getTimeBasedGreeting();
    const personalizedGreeting = userData.name 
      ? `${timeGreeting}, ${userData.name}!`
      : timeGreeting;

    return {
      greeting: personalizedGreeting,
      name: userData.name,
      lastVisit: userData.last_visit,
      personalized: true
    };
  } catch (error) {
    console.error('Error in getPersonalizedGreeting:', error);
    return { greeting: 'Welcome!', personalized: false };
  }
}

export async function updatePersonalizationPreferences(userId, preferences) {
  try {
    const { data, error } = await supabase
      .from('user_personalization')
      .upsert({
        user_id: userId,
        personalization_enabled: preferences.personalizationEnabled,
        name: preferences.name || null,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating personalization preferences:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in updatePersonalizationPreferences:', error);
    throw error;
  }
}

// Next.js API route handler
export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const greetingData = await getPersonalizedGreeting(userId);
      res.status(200).json(greetingData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch personalized greeting' });
    }
  } else if (req.method === 'PUT') {
    try {
      const result = await updatePersonalizationPreferences(userId, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update personalization preferences' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

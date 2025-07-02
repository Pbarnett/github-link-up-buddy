-- Add indexes for better query performance
-- Based on Supabase documentation recommendations

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_github_username ON public.profiles(github_username);
CREATE INDEX IF NOT EXISTS idx_profiles_is_public ON public.profiles(is_public);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- GitHub repositories indexes
CREATE INDEX IF NOT EXISTS idx_github_repositories_user_id ON public.github_repositories(user_id);
CREATE INDEX IF NOT EXISTS idx_github_repositories_is_public ON public.github_repositories(is_public);
CREATE INDEX IF NOT EXISTS idx_github_repositories_language ON public.github_repositories(language);
CREATE INDEX IF NOT EXISTS idx_github_repositories_stars ON public.github_repositories(stars_count DESC);
CREATE INDEX IF NOT EXISTS idx_github_repositories_updated ON public.github_repositories(updated_at DESC);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_github_repositories_user_public ON public.github_repositories(user_id, is_public);

-- GitHub followers indexes
CREATE INDEX IF NOT EXISTS idx_github_followers_user_id ON public.github_followers(user_id);
CREATE INDEX IF NOT EXISTS idx_github_followers_follower_id ON public.github_followers(follower_github_id);

-- Connection requests indexes
CREATE INDEX IF NOT EXISTS idx_connection_requests_requester ON public.connection_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_requested ON public.connection_requests(requested_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_status ON public.connection_requests(status);
CREATE INDEX IF NOT EXISTS idx_connection_requests_created ON public.connection_requests(created_at DESC);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_connection_requests_requested_status ON public.connection_requests(requested_id, status);

-- Connections indexes
CREATE INDEX IF NOT EXISTS idx_connections_user1 ON public.connections(user1_id);
CREATE INDEX IF NOT EXISTS idx_connections_user2 ON public.connections(user2_id);
CREATE INDEX IF NOT EXISTS idx_connections_created ON public.connections(created_at DESC);

-- User interests indexes
CREATE INDEX IF NOT EXISTS idx_user_interests_user_id ON public.user_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interests_interest_id ON public.user_interests(interest_id);

-- User skills indexes
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON public.user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON public.user_skills(skill_id);

-- Interests indexes for search
CREATE INDEX IF NOT EXISTS idx_interests_name ON public.interests USING gin(to_tsvector('english', name));

-- Skills indexes for search
CREATE INDEX IF NOT EXISTS idx_skills_name ON public.skills USING gin(to_tsvector('english', name));

-- Add full-text search indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_search ON public.profiles 
USING gin(to_tsvector('english', 
    coalesce(github_username, '') || ' ' || 
    coalesce(bio, '') || ' ' || 
    coalesce(location, '')
));

-- Add full-text search indexes for repositories
CREATE INDEX IF NOT EXISTS idx_repositories_search ON public.github_repositories 
USING gin(to_tsvector('english', 
    coalesce(name, '') || ' ' || 
    coalesce(description, '') || ' ' || 
    coalesce(language, '')
));

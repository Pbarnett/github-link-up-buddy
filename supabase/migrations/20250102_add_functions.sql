-- Database functions for better performance and complex queries
-- Based on Supabase documentation best practices

-- Function to search profiles with full-text search
CREATE OR REPLACE FUNCTION search_profiles(search_term text, limit_count integer DEFAULT 10)
RETURNS TABLE (
    id uuid,
    github_username text,
    bio text,
    location text,
    avatar_url text,
    is_public boolean,
    rank real
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.github_username,
        p.bio,
        p.location,
        p.avatar_url,
        p.is_public,
        ts_rank(
            to_tsvector('english', 
                coalesce(p.github_username, '') || ' ' || 
                coalesce(p.bio, '') || ' ' || 
                coalesce(p.location, '')
            ),
            plainto_tsquery('english', search_term)
        ) as rank
    FROM public.profiles p
    WHERE 
        p.is_public = true
        AND to_tsvector('english', 
            coalesce(p.github_username, '') || ' ' || 
            coalesce(p.bio, '') || ' ' || 
            coalesce(p.location, '')
        ) @@ plainto_tsquery('english', search_term)
    ORDER BY rank DESC
    LIMIT limit_count;
END;
$$;

-- Function to search repositories with full-text search
CREATE OR REPLACE FUNCTION search_repositories(search_term text, limit_count integer DEFAULT 10)
RETURNS TABLE (
    id uuid,
    user_id uuid,
    name text,
    description text,
    language text,
    stars_count integer,
    is_public boolean,
    rank real
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.user_id,
        r.name,
        r.description,
        r.language,
        r.stars_count,
        r.is_public,
        ts_rank(
            to_tsvector('english', 
                coalesce(r.name, '') || ' ' || 
                coalesce(r.description, '') || ' ' || 
                coalesce(r.language, '')
            ),
            plainto_tsquery('english', search_term)
        ) as rank
    FROM public.github_repositories r
    WHERE 
        r.is_public = true
        AND to_tsvector('english', 
            coalesce(r.name, '') || ' ' || 
            coalesce(r.description, '') || ' ' || 
            coalesce(r.language, '')
        ) @@ plainto_tsquery('english', search_term)
    ORDER BY rank DESC
    LIMIT limit_count;
END;
$$;

-- Function to get connection suggestions for a user
CREATE OR REPLACE FUNCTION get_connection_suggestions(target_user_id uuid, limit_count integer DEFAULT 10)
RETURNS TABLE (
    suggested_user_id uuid,
    github_username text,
    bio text,
    location text,
    avatar_url text,
    common_interests_count integer,
    common_skills_count integer,
    score integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH user_connections AS (
        -- Get all existing connections for the target user
        SELECT 
            CASE 
                WHEN c.user1_id = target_user_id THEN c.user2_id
                ELSE c.user1_id
            END as connected_user_id
        FROM public.connections c
        WHERE c.user1_id = target_user_id OR c.user2_id = target_user_id
    ),
    pending_requests AS (
        -- Get all pending connection requests
        SELECT cr.requester_id, cr.requested_id
        FROM public.connection_requests cr
        WHERE 
            (cr.requester_id = target_user_id OR cr.requested_id = target_user_id)
            AND cr.status = 'pending'
    ),
    user_interests AS (
        -- Get target user's interests
        SELECT ui.interest_id
        FROM public.user_interests ui
        WHERE ui.user_id = target_user_id
    ),
    user_skills AS (
        -- Get target user's skills
        SELECT us.skill_id
        FROM public.user_skills us
        WHERE us.user_id = target_user_id
    ),
    potential_connections AS (
        SELECT 
            p.id as suggested_user_id,
            p.github_username,
            p.bio,
            p.location,
            p.avatar_url,
            -- Count common interests
            COALESCE((
                SELECT COUNT(*)
                FROM public.user_interests ui2
                WHERE ui2.user_id = p.id
                AND ui2.interest_id IN (SELECT interest_id FROM user_interests)
            ), 0) as common_interests_count,
            -- Count common skills
            COALESCE((
                SELECT COUNT(*)
                FROM public.user_skills us2
                WHERE us2.user_id = p.id
                AND us2.skill_id IN (SELECT skill_id FROM user_skills)
            ), 0) as common_skills_count
        FROM public.profiles p
        WHERE 
            p.id != target_user_id
            AND p.is_public = true
            AND p.id NOT IN (SELECT connected_user_id FROM user_connections)
            AND p.id NOT IN (
                SELECT requester_id FROM pending_requests 
                UNION 
                SELECT requested_id FROM pending_requests
            )
    )
    SELECT 
        pc.suggested_user_id,
        pc.github_username,
        pc.bio,
        pc.location,
        pc.avatar_url,
        pc.common_interests_count,
        pc.common_skills_count,
        (pc.common_interests_count * 2 + pc.common_skills_count * 3) as score
    FROM potential_connections pc
    WHERE pc.common_interests_count > 0 OR pc.common_skills_count > 0
    ORDER BY score DESC, pc.common_skills_count DESC, pc.common_interests_count DESC
    LIMIT limit_count;
END;
$$;

-- Function to get user stats
CREATE OR REPLACE FUNCTION get_user_stats(target_user_id uuid)
RETURNS TABLE (
    total_repositories integer,
    public_repositories integer,
    total_stars integer,
    total_connections integer,
    pending_requests integer,
    interests_count integer,
    skills_count integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::integer FROM public.github_repositories WHERE user_id = target_user_id),
        (SELECT COUNT(*)::integer FROM public.github_repositories WHERE user_id = target_user_id AND is_public = true),
        (SELECT COALESCE(SUM(stars_count), 0)::integer FROM public.github_repositories WHERE user_id = target_user_id),
        (SELECT COUNT(*)::integer FROM public.connections WHERE user1_id = target_user_id OR user2_id = target_user_id),
        (SELECT COUNT(*)::integer FROM public.connection_requests WHERE requested_id = target_user_id AND status = 'pending'),
        (SELECT COUNT(*)::integer FROM public.user_interests WHERE user_id = target_user_id),
        (SELECT COUNT(*)::integer FROM public.user_skills WHERE user_id = target_user_id);
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION search_profiles(text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION search_repositories(text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION get_connection_suggestions(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_stats(uuid) TO authenticated;

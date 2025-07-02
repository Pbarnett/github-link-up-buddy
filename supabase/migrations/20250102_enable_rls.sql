-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view public profiles" ON public.profiles
    FOR SELECT USING (is_public = true OR auth.uid() = id);

-- GitHub repositories policies
CREATE POLICY "Users can view their own repositories" ON public.github_repositories
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own repositories" ON public.github_repositories
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public repositories are viewable by all authenticated users" ON public.github_repositories
    FOR SELECT USING (is_public = true AND auth.role() = 'authenticated');

-- GitHub followers policies
CREATE POLICY "Users can view their own followers" ON public.github_followers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own followers" ON public.github_followers
    FOR ALL USING (auth.uid() = user_id);

-- Connection requests policies
CREATE POLICY "Users can view requests they sent or received" ON public.connection_requests
    FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = requested_id);

CREATE POLICY "Users can create connection requests" ON public.connection_requests
    FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update requests they received" ON public.connection_requests
    FOR UPDATE USING (auth.uid() = requested_id);

-- Connections policies
CREATE POLICY "Users can view their own connections" ON public.connections
    FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can manage their own connections" ON public.connections
    FOR ALL USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- User interests policies
CREATE POLICY "Users can manage their own interests" ON public.user_interests
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view public interests" ON public.user_interests
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = user_interests.user_id 
            AND (profiles.is_public = true OR profiles.id = auth.uid())
        )
    );

-- Interests policies (read-only for most users)
CREATE POLICY "Authenticated users can view interests" ON public.interests
    FOR SELECT TO authenticated USING (true);

-- User skills policies
CREATE POLICY "Users can manage their own skills" ON public.user_skills
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view public skills" ON public.user_skills
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = user_skills.user_id 
            AND (profiles.is_public = true OR profiles.id = auth.uid())
        )
    );

-- Skills policies (read-only for most users)
CREATE POLICY "Authenticated users can view skills" ON public.skills
    FOR SELECT TO authenticated USING (true);

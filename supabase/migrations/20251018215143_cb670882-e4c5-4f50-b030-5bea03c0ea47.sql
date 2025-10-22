-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Add features and comparison_table columns to agents table
ALTER TABLE public.agents ADD COLUMN features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.agents ADD COLUMN comparison_table JSONB DEFAULT '{"headers": ["Features", "Starter", "Pro", "Business", "Enterprise"], "rows": []}'::jsonb;

-- Update RLS policies for agents to use admin role
DROP POLICY IF EXISTS "Authenticated users can insert agents" ON public.agents;
DROP POLICY IF EXISTS "Authenticated users can update agents" ON public.agents;
DROP POLICY IF EXISTS "Authenticated users can delete agents" ON public.agents;

CREATE POLICY "Admins can insert agents"
ON public.agents
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update agents"
ON public.agents
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete agents"
ON public.agents
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for user_roles (admins can manage roles)
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Add sample features and comparison data to existing agents
UPDATE public.agents
SET features = '[
  {"id": "1", "icon": "🕐", "title": "24/7 Availability", "description": "Never miss a customer inquiry with round-the-clock automated responses", "order": 1, "visible": true},
  {"id": "2", "icon": "🌍", "title": "Multi-language Support", "description": "Communicate with customers in their preferred language", "order": 2, "visible": true},
  {"id": "3", "icon": "🧠", "title": "Smart AI Learning", "description": "Continuously improves responses based on interactions", "order": 3, "visible": true},
  {"id": "4", "icon": "🔗", "title": "CRM Integration", "description": "Seamlessly connects with your existing tools", "order": 4, "visible": true},
  {"id": "5", "icon": "📊", "title": "Analytics Dashboard", "description": "Track performance and customer insights", "order": 5, "visible": true},
  {"id": "6", "icon": "🎓", "title": "Custom Training", "description": "Train the bot on your specific business data", "order": 6, "visible": true}
]'::jsonb,
comparison_table = '{
  "headers": ["Features", "Starter", "Pro", "Business", "Enterprise"],
  "rows": [
    {"id": "1", "type": "section", "label": "Basic Features", "values": ["", "", "", ""], "order": 1},
    {"id": "2", "type": "feature", "label": "Messages per month", "values": ["1,000", "5,000", "15,000", "Unlimited"], "order": 2},
    {"id": "3", "type": "feature", "label": "WhatsApp numbers", "values": ["1", "2", "5", "Unlimited"], "order": 3},
    {"id": "4", "type": "feature", "label": "Email support", "values": ["check", "check", "check", "check"], "order": 4},
    {"id": "5", "type": "section", "label": "Advanced Features", "values": ["", "", "", ""], "order": 5},
    {"id": "6", "type": "feature", "label": "AI-powered responses", "values": ["Basic", "Advanced", "Premium", "Custom"], "order": 6},
    {"id": "7", "type": "feature", "label": "Custom branding", "values": ["cross", "check", "check", "check"], "order": 7},
    {"id": "8", "type": "feature", "label": "Analytics dashboard", "values": ["cross", "check", "check", "check"], "order": 8},
    {"id": "9", "type": "section", "label": "Integrations", "values": ["", "", "", ""], "order": 9},
    {"id": "10", "type": "feature", "label": "CRM integration", "values": ["cross", "Basic", "Advanced", "Full"], "order": 10},
    {"id": "11", "type": "feature", "label": "API access", "values": ["cross", "cross", "check", "check"], "order": 11},
    {"id": "12", "type": "feature", "label": "Webhooks", "values": ["cross", "cross", "check", "check"], "order": 12},
    {"id": "13", "type": "section", "label": "Support", "values": ["", "", "", ""], "order": 13},
    {"id": "14", "type": "feature", "label": "Response time", "values": ["24 hours", "12 hours", "6 hours", "1 hour"], "order": 14},
    {"id": "15", "type": "feature", "label": "Dedicated manager", "values": ["cross", "cross", "cross", "check"], "order": 15},
    {"id": "16", "type": "feature", "label": "SLA guarantee", "values": ["cross", "cross", "99%", "99.9%"], "order": 16}
  ]
}'::jsonb
WHERE name = 'Chatbot Agent';
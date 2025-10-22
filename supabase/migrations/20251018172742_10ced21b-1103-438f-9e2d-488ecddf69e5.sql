-- Create agents table for AI agent catalog
CREATE TABLE public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  image TEXT DEFAULT '🤖',
  is_active BOOLEAN DEFAULT true,
  starter_price INTEGER NOT NULL,
  starter_features TEXT[] NOT NULL,
  pro_price INTEGER NOT NULL,
  pro_features TEXT[] NOT NULL,
  business_price INTEGER NOT NULL,
  business_features TEXT[] NOT NULL,
  enterprise_price INTEGER NOT NULL,
  enterprise_features TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Public can view active agents
CREATE POLICY "Anyone can view active agents" 
ON public.agents 
FOR SELECT 
USING (is_active = true);

-- Only authenticated users can manage agents (admins)
CREATE POLICY "Authenticated users can insert agents" 
ON public.agents 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update agents" 
ON public.agents 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete agents" 
ON public.agents 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.agents
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample agents
INSERT INTO public.agents (name, short_description, description, image, starter_price, starter_features, pro_price, pro_features, business_price, business_features, enterprise_price, enterprise_features) VALUES
(
  'Chatbot Agent',
  'Intelligent conversational AI for customer support and engagement',
  'Our Chatbot Agent uses advanced natural language processing to understand and respond to customer queries in real-time. Perfect for businesses looking to provide 24/7 customer support, automate FAQs, and enhance customer engagement. The AI learns from every interaction, continuously improving its responses and understanding of your business context.',
  '🤖',
  499,
  ARRAY['Basic chat functionality', 'Up to 1000 messages/month', 'Email support', 'Standard response time'],
  999,
  ARRAY['Advanced NLP', 'Up to 5000 messages/month', 'Priority support', 'Custom branding', 'Analytics dashboard', 'Multi-channel integration'],
  1999,
  ARRAY['Unlimited messages', 'Multi-language support', 'API access', 'Dedicated account manager', 'Custom integrations', 'Advanced analytics', 'White-label options'],
  4999,
  ARRAY['Custom deployment', 'White-label solution', 'SLA guarantee', '24/7 phone support', 'Custom AI model training', 'Dedicated infrastructure', 'Full API access', 'Priority development']
),
(
  'Leads Finder Agent',
  'Automated lead generation and qualification system',
  'Transform your sales pipeline with our intelligent Leads Finder Agent. Using AI-powered algorithms, it identifies, qualifies, and scores potential leads across multiple channels. The system analyzes company data, social signals, and behavioral patterns to find your ideal customers, saving your team countless hours of manual prospecting.',
  '🎯',
  599,
  ARRAY['100 leads per month', 'Basic filtering', 'Email support', 'CSV export', 'Lead scoring'],
  1199,
  ARRAY['500 leads per month', 'Advanced filters', 'CRM integration', 'Priority support', 'Real-time notifications', 'Automated outreach'],
  2499,
  ARRAY['2000 leads per month', 'AI-powered scoring', 'Multi-channel outreach', 'Dedicated account manager', 'Custom data sources', 'API access', 'Team collaboration'],
  5999,
  ARRAY['Unlimited leads', 'Custom AI model', 'White-label solution', 'Full API access', 'Dedicated infrastructure', 'Priority support', 'Custom integrations', 'Advanced analytics']
),
(
  'Content Generator',
  'AI-powered content creation for blogs, social media, and marketing',
  'Never run out of content ideas again. Our Content Generator creates high-quality, SEO-optimized content for blogs, social media, email campaigns, and more. The AI understands your brand voice, target audience, and industry trends to produce engaging content that converts. From headlines to full articles, it handles all your content needs.',
  '✍️',
  799,
  ARRAY['50 articles per month', 'Basic templates', 'Email support', 'SEO optimization', 'Multiple formats'],
  1499,
  ARRAY['200 articles per month', 'Advanced SEO', 'Multiple formats', 'Priority support', 'Brand voice training', 'Content calendar', 'Image suggestions'],
  2999,
  ARRAY['Unlimited content', 'Brand voice training', 'API access', 'Dedicated account manager', 'Custom templates', 'Multi-language', 'Team collaboration', 'Advanced analytics'],
  6999,
  ARRAY['Custom AI model', 'Multi-language support', 'White-label solution', 'SLA guarantee', 'Priority development', 'Dedicated infrastructure', 'Full API access', 'Custom integrations']
),
(
  'Email Assistant',
  'Smart email automation and response management',
  'Streamline your email workflow with our intelligent Email Assistant. It automatically categorizes emails, drafts responses, schedules follow-ups, and even detects urgent messages. The AI learns your communication style and preferences, helping you maintain inbox zero while never missing important messages.',
  '📧',
  449,
  ARRAY['500 emails per month', 'Basic categorization', 'Email support', 'Template responses', 'Standard automation'],
  899,
  ARRAY['2000 emails per month', 'Smart categorization', 'Priority support', 'Custom templates', 'Advanced automation', 'Calendar integration', 'Priority detection'],
  1799,
  ARRAY['Unlimited emails', 'AI-powered responses', 'API access', 'Dedicated account manager', 'Custom workflows', 'Team collaboration', 'Advanced analytics', 'Multi-account'],
  4499,
  ARRAY['Custom AI model', 'White-label solution', 'SLA guarantee', 'Priority support', 'Custom integrations', 'Dedicated infrastructure', 'Full API access', 'Enterprise security']
),
(
  'Data Analyzer',
  'Advanced analytics and insights from your business data',
  'Unlock the power of your data with our AI Data Analyzer. It processes large datasets, identifies patterns, generates insights, and creates beautiful visualizations. Whether you need sales forecasts, customer behavior analysis, or operational insights, this agent turns complex data into actionable intelligence.',
  '📊',
  899,
  ARRAY['100 reports per month', 'Basic analytics', 'Email support', 'Standard visualizations', 'CSV/Excel export'],
  1699,
  ARRAY['500 reports per month', 'Advanced analytics', 'Priority support', 'Custom dashboards', 'API access', 'Predictive insights', 'Real-time data'],
  3299,
  ARRAY['Unlimited reports', 'AI predictions', 'Dedicated account manager', 'Custom models', 'Team collaboration', 'Advanced integrations', 'White-label dashboards', 'Priority processing'],
  7999,
  ARRAY['Custom AI models', 'White-label solution', 'SLA guarantee', 'Dedicated infrastructure', 'Priority support', 'Custom integrations', 'Full API access', 'Enterprise security', 'On-premise deployment']
),
(
  'Social Media Manager',
  'Automated social media content and scheduling',
  'Dominate social media with our AI-powered Social Media Manager. It creates engaging posts, schedules content across platforms, analyzes performance, and even responds to comments. The AI understands trending topics, optimal posting times, and what content resonates with your audience.',
  '📱',
  699,
  ARRAY['50 posts per month', 'Basic scheduling', 'Email support', '3 social platforms', 'Performance analytics'],
  1399,
  ARRAY['200 posts per month', 'Advanced scheduling', 'Priority support', 'All major platforms', 'AI content creation', 'Hashtag optimization', 'Competitor analysis'],
  2799,
  ARRAY['Unlimited posts', 'AI engagement', 'API access', 'Dedicated account manager', 'Custom templates', 'Team collaboration', 'Advanced analytics', 'Influencer insights'],
  6499,
  ARRAY['Custom AI model', 'White-label solution', 'SLA guarantee', 'Priority support', 'Custom integrations', 'Dedicated infrastructure', 'Full API access', 'Multi-brand management']
);
-- Create key_features table
CREATE TABLE public.key_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT '🤖',
  icon_bg_color text NOT NULL DEFAULT '#6366f1',
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.key_features ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view active features
CREATE POLICY "Anyone can view active features"
ON public.key_features
FOR SELECT
USING (is_active = true);

-- Only admins can insert features
CREATE POLICY "Admins can insert features"
ON public.key_features
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update features
CREATE POLICY "Admins can update features"
ON public.key_features
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete features
CREATE POLICY "Admins can delete features"
ON public.key_features
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_key_features_updated_at
  BEFORE UPDATE ON public.key_features
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert default features (matching current homepage)
INSERT INTO public.key_features (title, description, icon, icon_bg_color, display_order) VALUES
  ('AI Education Programs', 'Comprehensive AI training and educational resources to transform your business', '🎓', '#3b82f6', 1),
  ('Custom Agent Development', 'Tailored AI solutions built specifically for your unique business needs', '⚡', '#8b5cf6', 2),
  ('Enterprise-Grade Security', 'Bank-level security and compliance for your sensitive data', '🛡️', '#10b981', 3),
  ('24/7 Support', 'Round-the-clock technical support and maintenance for your AI agents', '🎧', '#f59e0b', 4);
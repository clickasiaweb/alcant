-- Enhanced Admin Panel Schema for Industrial Solutions
-- This script extends the existing schema with admin-specific features
-- Run this after the main supabase-schema.sql

-- Admin activity logs table
CREATE TABLE admin_activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL, -- 'product', 'category', 'user', etc.
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin settings table
CREATE TABLE admin_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key VARCHAR(255) NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  is_public BOOLEAN DEFAULT false, -- Whether settings can be accessed by frontend
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System notifications table
CREATE TABLE admin_notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  is_read BOOLEAN DEFAULT false,
  admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- File uploads table (for admin file management)
CREATE TABLE admin_file_uploads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  public_url VARCHAR(500),
  uploaded_by UUID REFERENCES users(id) ON DELETE CASCADE,
  entity_type VARCHAR(50), -- 'product', 'category', etc.
  entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API keys table for admin integrations
CREATE TABLE admin_api_keys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL UNIQUE,
  permissions TEXT[] NOT NULL DEFAULT '{}', -- Array of permissions
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backup logs table
CREATE TABLE admin_backup_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  backup_type VARCHAR(50) NOT NULL, -- 'full', 'incremental', 'manual'
  file_path VARCHAR(500),
  file_size INTEGER,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  error_message TEXT,
  started_by UUID REFERENCES users(id) ON DELETE SET NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for admin_activity_logs
CREATE INDEX idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX idx_admin_activity_logs_action ON admin_activity_logs(action);
CREATE INDEX idx_admin_activity_logs_entity ON admin_activity_logs(entity_type, entity_id);
CREATE INDEX idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);

-- Indexes for admin_settings
CREATE INDEX idx_admin_settings_key ON admin_settings(key);
CREATE INDEX idx_admin_settings_is_public ON admin_settings(is_public);

-- Indexes for admin_notifications
CREATE INDEX idx_admin_notifications_admin_id ON admin_notifications(admin_id);
CREATE INDEX idx_admin_notifications_is_read ON admin_notifications(is_read);
CREATE INDEX idx_admin_notifications_created_at ON admin_notifications(created_at DESC);

-- Indexes for admin_file_uploads
CREATE INDEX idx_admin_file_uploads_uploaded_by ON admin_file_uploads(uploaded_by);
CREATE INDEX idx_admin_file_uploads_entity ON admin_file_uploads(entity_type, entity_id);
CREATE INDEX idx_admin_file_uploads_created_at ON admin_file_uploads(created_at DESC);

-- Indexes for admin_api_keys
CREATE INDEX idx_admin_api_keys_key_hash ON admin_api_keys(key_hash);
CREATE INDEX idx_admin_api_keys_is_active ON admin_api_keys(is_active);
CREATE INDEX idx_admin_api_keys_created_by ON admin_api_keys(created_by);

-- Indexes for admin_backup_logs
CREATE INDEX idx_admin_backup_logs_status ON admin_backup_logs(status);
CREATE INDEX idx_admin_backup_logs_started_at ON admin_backup_logs(started_at DESC);

-- Triggers for updated_at
CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON admin_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security for admin tables
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_backup_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Admin activity logs - only admins can view their own logs, service role can view all
CREATE POLICY "Allow admins to view own activity logs" ON admin_activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = admin_id 
            AND role = 'admin' 
            AND is_active = true
        )
    );

CREATE POLICY "Allow service role full access to admin activity logs" ON admin_activity_logs
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Admin settings - public can read public settings, admins can read all
CREATE POLICY "Allow public read access to public admin settings" ON admin_settings
    FOR SELECT USING (is_public = true);

CREATE POLICY "Allow admins full access to admin settings" ON admin_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth.uid() = id 
            AND role = 'admin' 
            AND is_active = true
        )
    );

CREATE POLICY "Allow service role full access to admin settings" ON admin_settings
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Admin notifications - only admins can view their own notifications
CREATE POLICY "Allow admins to view own notifications" ON admin_notifications
    FOR ALL USING (
        admin_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = admin_id 
            AND role = 'admin' 
            AND is_active = true
        )
    );

CREATE POLICY "Allow service role full access to admin notifications" ON admin_notifications
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Admin file uploads - only admins can view/manage their uploads
CREATE POLICY "Allow admins full access to own file uploads" ON admin_file_uploads
    FOR ALL USING (
        uploaded_by = auth.uid() AND
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = uploaded_by 
            AND role = 'admin' 
            AND is_active = true
        )
    );

CREATE POLICY "Allow service role full access to admin file uploads" ON admin_file_uploads
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Admin API keys - only admins can manage their own keys
CREATE POLICY "Allow admins full access to own API keys" ON admin_api_keys
    FOR ALL USING (
        created_by = auth.uid() AND
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = created_by 
            AND role = 'admin' 
            AND is_active = true
        )
    );

CREATE POLICY "Allow service role full access to admin API keys" ON admin_api_keys
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Admin backup logs - only admins can view all logs
CREATE POLICY "Allow admins full access to backup logs" ON admin_backup_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth.uid() = id 
            AND role = 'admin' 
            AND is_active = true
        )
    );

CREATE POLICY "Allow service role full access to backup logs" ON admin_backup_logs
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Insert default admin settings
INSERT INTO admin_settings (key, value, description, is_public) VALUES
('site_name', 'Industrial Solutions', 'Website name', true),
('site_description', 'Premium Industrial Equipment and Solutions', 'Website description', true),
('contact_email', 'admin@industrialsolutions.com', 'Main contact email', true),
('maintenance_mode', 'false', 'Enable maintenance mode', false),
('backup_frequency', 'daily', 'Backup frequency', false),
('max_file_size', '10485760', 'Maximum file upload size in bytes', false),
('allowed_file_types', '["jpg","jpeg","png","gif","pdf","doc","docx"]', 'Allowed file types for upload', false),
('session_timeout', '3600', 'Session timeout in seconds', false);

-- Create function to log admin activities
CREATE OR REPLACE FUNCTION log_admin_activity(
    admin_user_id UUID,
    action_name VARCHAR(100),
    entity_type_name VARCHAR(50),
    entity_id_value UUID DEFAULT NULL,
    old_data JSONB DEFAULT NULL,
    new_data JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO admin_activity_logs (
        admin_id, 
        action, 
        entity_type, 
        entity_id, 
        old_values, 
        new_values,
        ip_address,
        user_agent
    ) VALUES (
        admin_user_id,
        action_name,
        entity_type_name,
        entity_id_value,
        old_data,
        new_data,
        inet_client_addr(),
        current_setting('request.headers')::json->>'user-agent'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to create admin notification
CREATE OR REPLACE FUNCTION create_admin_notification(
    admin_user_id UUID,
    notification_title VARCHAR(255),
    notification_message TEXT,
    notification_type VARCHAR(50) DEFAULT 'info',
    expires_at_time TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO admin_notifications (
        admin_id,
        title,
        message,
        type,
        expires_at
    ) VALUES (
        admin_user_id,
        notification_title,
        notification_message,
        notification_type,
        expires_at_time
    ) RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for admin dashboard statistics
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM products WHERE is_active = true) as active_products,
    (SELECT COUNT(*) FROM categories WHERE is_active = true) as active_categories,
    (SELECT COUNT(*) FROM subcategories WHERE is_active = true) as active_subcategories,
    (SELECT COUNT(*) FROM users WHERE role = 'admin' AND is_active = true) as active_admins,
    (SELECT COUNT(*) FROM inquiries WHERE status = 'pending') as pending_inquiries,
    (SELECT COUNT(*) FROM inquiries WHERE created_at >= CURRENT_DATE) as today_inquiries,
    (SELECT COUNT(*) FROM admin_activity_logs WHERE created_at >= CURRENT_DATE) as today_activities,
    (SELECT COUNT(*) FROM admin_notifications WHERE is_read = false) as unread_notifications;

COMMENT ON TABLE admin_activity_logs IS 'Logs all admin activities for audit trail';
COMMENT ON TABLE admin_settings IS 'Stores admin configuration settings';
COMMENT ON TABLE admin_notifications IS 'Admin notifications and alerts';
COMMENT ON TABLE admin_file_uploads IS 'Tracks file uploads by admins';
COMMENT ON TABLE admin_api_keys IS 'API keys for admin integrations';
COMMENT ON TABLE admin_backup_logs IS 'Logs of backup operations';
COMMENT ON VIEW admin_dashboard_stats IS 'Dashboard statistics for admin panel';

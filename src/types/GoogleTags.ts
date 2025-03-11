export interface GoogleTag {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  tag_type: 'google_ads' | 'tag_manager' | 'other';
  tag_code: string;
  is_active: boolean;
  target_elements: string[];
  description?: string;
  trigger_event: 'click' | 'pageview' | 'custom';
}

export interface GoogleTagFormData {
  id?: string;
  name: string;
  tag_type: 'google_ads' | 'tag_manager' | 'other';
  tag_code: string;
  is_active: boolean;
  target_elements: string[];
  description?: string;
  trigger_event: 'click' | 'pageview' | 'custom';
}

export interface GoogleTagsAdmin {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  tag_type: 'google_ads' | 'tag_manager' | 'other';
  tag_code: string;
  is_active: boolean;
  target_elements: string[];
  description?: string;
  trigger_event: 'click' | 'pageview' | 'custom';
}

export interface GoogleTagFormData {
  name: string;
  tag_type: 'google_ads' | 'tag_manager' | 'other';
  tag_code: string;
  is_active: boolean;
  target_elements: string[];
  description?: string;
  trigger_event: 'click' | 'pageview' | 'custom';
}
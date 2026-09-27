export interface GeneratedImage {
  id: string;
  prompt: string;
  enhanced_prompt?: string;
  style: string;
  aspect_ratio: string;
  width: number;
  height: number;
  image_url: string;
  file_path?: string;
  provider: string;
  model: string;
  seed: number;
  is_favorite: number | boolean;
  created_at: string;
  mode: 'text2img' | 'img2img' | 'poster';
  reference_url?: string;
}

export interface WorkflowStep {
  step: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  message: string;
}

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  color?: string;
}

export interface AspectRatioOption {
  id: string;
  name: string;
  ratio: string;
  usage: string;
  dimensions: string;
}

export interface PosterPreset {
  id: string;
  title: string;
  platform: string;
  aspect_ratio: string;
  dimensions: string;
  recommended_style: string;
  template_headline: string;
  template_subtext: string;
  badge_text: string;
  description: string;
}

export interface EnhanceResult {
  success: boolean;
  original_prompt: string;
  enhanced_prompt: string;
  subject: string;
  style_applied: string;
  lighting: string;
  composition: string;
  modifiers: string[];
  llm_provider: string;
}

export interface SystemConfig {
  providers: Record<string, {
    name: string;
    requires_key: boolean;
    is_active: boolean;
    is_configured: boolean;
    models: string[];
    description: string;
  }>;
  default_provider: string;
  styles: StyleOption[];
  aspect_ratios: AspectRatioOption[];
}

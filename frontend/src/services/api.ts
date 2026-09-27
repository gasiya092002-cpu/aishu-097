import { GeneratedImage, EnhanceResult, SystemConfig, PosterPreset } from '../types';

const API_BASE = '/api';

export async function generateImage(params: {
  prompt: string;
  enhanced_prompt?: string;
  style: string;
  aspect_ratio: string;
  provider?: string;
  model?: string;
  seed?: number;
  quality?: string;
  count?: number;
  mode?: string;
}): Promise<{ success: boolean; images: GeneratedImage[]; workflow_steps: any[] }> {
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Network generation error' }));
    throw new Error(errorData.detail || 'Failed to generate image');
  }
  return res.json();
}

export async function enhancePrompt(prompt: string, style: string = 'Photorealistic'): Promise<EnhanceResult> {
  const res = await fetch(`${API_BASE}/enhance-prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, style }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Enhancement failed' }));
    throw new Error(errorData.detail || 'Failed to enhance prompt');
  }
  return res.json();
}

export async function uploadReferenceImage(file: File): Promise<{
  success: boolean;
  reference: {
    ref_id: string;
    filename: string;
    url: string;
    width: number;
    height: number;
    aspect_ratio: string;
  };
}> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/upload-reference`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(errorData.detail || 'Failed to upload reference image');
  }
  return res.json();
}

export async function imageToImage(params: {
  reference_url: string;
  transformation_prompt: string;
  style?: string;
  mode_type?: string;
  strength?: number;
  aspect_ratio?: string;
  provider?: string;
}): Promise<{ success: boolean; image: GeneratedImage }> {
  const res = await fetch(`${API_BASE}/image-to-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Image-to-image failed' }));
    throw new Error(errorData.detail || 'Failed to process image transformation');
  }
  return res.json();
}

export async function getGallery(params: {
  limit?: number;
  offset?: number;
  style?: string;
  favorite_only?: boolean;
  search?: string;
  mode?: string;
} = {}): Promise<{ images: GeneratedImage[]; count: number }> {
  const query = new URLSearchParams();
  if (params.limit) query.set('limit', params.limit.toString());
  if (params.offset) query.set('offset', params.offset.toString());
  if (params.style) query.set('style', params.style);
  if (params.favorite_only) query.set('favorite_only', 'true');
  if (params.search) query.set('search', params.search);
  if (params.mode) query.set('mode', params.mode);

  const res = await fetch(`${API_BASE}/gallery?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch gallery items');
  return res.json();
}

export async function toggleFavorite(imageId: string): Promise<{ id: string; is_favorite: boolean }> {
  const res = await fetch(`${API_BASE}/gallery/${imageId}/favorite`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to toggle favorite');
  return res.json();
}

export async function deleteImage(imageId: string): Promise<{ success: boolean; deleted_id: string }> {
  const res = await fetch(`${API_BASE}/gallery/${imageId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete image');
  return res.json();
}

export async function getPosterPresets(): Promise<{ presets: PosterPreset[] }> {
  const res = await fetch(`${API_BASE}/posters/presets`);
  if (!res.ok) throw new Error('Failed to fetch poster presets');
  return res.json();
}

export async function buildPosterPrompt(params: {
  category: string;
  headline: string;
  subtext?: string;
  topic: string;
  mood?: string;
}): Promise<{ success: boolean; poster_background_prompt: string; headline: string; subtext: string }> {
  const res = await fetch(`${API_BASE}/posters/build-prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to build poster prompt');
  return res.json();
}

export async function getSystemConfig(): Promise<SystemConfig> {
  const res = await fetch(`${API_BASE}/config`);
  if (!res.ok) throw new Error('Failed to load system config');
  return res.json();
}

export async function getHealth(): Promise<any> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to fetch health status');
  return res.json();
}

export async function testApiKey(provider: string, apiKey: string): Promise<{ valid: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/config/test-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, api_key: apiKey }),
  });
  return res.json();
}

export async function clearGalleryData(): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/config/clear-data`, {
    method: 'POST',
  });
  return res.json();
}

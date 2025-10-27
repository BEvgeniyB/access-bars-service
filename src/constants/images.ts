export const BACKGROUND_IMAGES = {
  PRIMARY: 'https://cdn.poehali.dev/files/db4ae80e-dbb8-4534-a07a-f33cfa23d35a.jpg',
  TRAINING_HERO: 'https://cdn.poehali.dev/files/84b00c22-64c5-4a5c-b7ca-de55c4dac19d.jpg',
  TRAINING_COURSES: 'https://cdn.poehali.dev/files/fd60c33c-3948-432b-92ba-2955cd2ace49.jpg',
  TRAINING_BENEFITS: 'https://cdn.poehali.dev/files/0b3a5d2b-a1b4-4b32-b456-f4e6b3c8a9d0.jpg',
  ACCESS_BARS_HERO: 'https://cdn.poehali.dev/files/12b737b3-bf4d-499d-8f9a-ff594a4f705f.jpg',
  ACCESS_BARS_BENEFITS: 'https://cdn.poehali.dev/files/4e668bb9-7ccd-46e9-9329-0f7414a65ea0.jpg',
  ACCESS_BARS_SESSIONS: 'https://cdn.poehali.dev/files/8257b36c-01da-4ea7-8a9a-76326d9b58b0.jpg',
  HEALING_PAGE: 'https://cdn.poehali.dev/files/19fd920a-9d96-45d1-9b4a-8e0584e2a051.jpg',
  MASSAGE_PAGE: 'https://cdn.poehali.dev/files/3d793832-1b45-412e-9e96-8322568689f1.png',
  ACCESS_BARS_PAGE: 'https://cdn.poehali.dev/files/58c024e8-2d2e-49a9-ac0e-19692c531870.jpg',
  ACCESS_BARS_HEADER: 'https://cdn.poehali.dev/files/4e95d530-7f57-4257-9e14-933aa912aea1.png',
  LOGO: '/img/d400ba6e-3090-41d0-afab-e8e8c2a5655b.jpg'
} as const;

export const getBackgroundStyle = (
  imageUrl: string,
  options?: {
    fixed?: boolean;
    position?: string;
    size?: string;
  }
) => ({
  backgroundImage: `url('${imageUrl}')`,
  backgroundSize: options?.size || 'cover',
  backgroundPosition: options?.position || 'center',
  backgroundRepeat: 'no-repeat',
  ...(options?.fixed && { backgroundAttachment: 'fixed' })
});

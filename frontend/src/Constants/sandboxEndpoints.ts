export interface SandboxParam {
  key: string
  label: string
  type: 'string' | 'number'
  required: boolean
  example: string
  inPath?: boolean
}

export interface SandboxEndpoint {
  id: string
  method: 'GET'
  path: string
  label: string
  description: string
  params: SandboxParam[]
}

export const SANDBOX_ENDPOINTS: SandboxEndpoint[] = [
  {
    id: 'list-projects',
    method: 'GET',
    path: '/api/v1/projects',
    label: 'List Projects',
    description: 'Ambil semua project yang dipublish, dengan pagination.',
    params: [
      { key: 'page', label: 'Page', type: 'number', required: false, example: '1', inPath: false },
      {
        key: 'lang',
        label: 'Language',
        type: 'string',
        required: false,
        example: 'id',
        inPath: false,
      },
    ],
  },
  {
    id: 'get-project',
    method: 'GET',
    path: '/api/v1/projects/:slug',
    label: 'Get Project',
    description: 'Ambil detail satu project berdasarkan slug.',
    params: [
      {
        key: 'slug',
        label: 'Slug',
        type: 'string',
        required: true,
        example: 'shaturne-portfolio',
        inPath: true,
      },
      {
        key: 'lang',
        label: 'Language',
        type: 'string',
        required: false,
        example: 'id',
        inPath: false,
      },
    ],
  },
  {
    id: 'list-skills',
    method: 'GET',
    path: '/api/v1/skills',
    label: 'List Skills',
    description: 'Ambil semua skill, diurutkan by sort_order.',
    params: [
      {
        key: 'lang',
        label: 'Language',
        type: 'string',
        required: false,
        example: 'id',
        inPath: false,
      },
    ],
  },
  {
    id: 'list-experience',
    method: 'GET',
    path: '/api/v1/experience',
    label: 'List Experience',
    description: 'Ambil semua pengalaman kerja dan pendidikan.',
    params: [
      {
        key: 'lang',
        label: 'Language',
        type: 'string',
        required: false,
        example: 'id',
        inPath: false,
      },
    ],
  },
  {
    id: 'now-playing',
    method: 'GET',
    path: '/api/v1/now-playing',
    label: 'Now Playing',
    description: 'Cek lagu yang sedang diputar di Spotify.',
    params: [],
  },
]

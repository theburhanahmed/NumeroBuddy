import apiClient from './api-client';

export type UniverseEntityType = 'person' | 'asset' | 'event';

export interface UniverseEntity {
  id: string;
  name: string;
  entity_type: UniverseEntityType;
  date_of_birth?: string;
  relationship_type?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface UniverseEvent {
  id: string;
  event_type: string;
  event_date: string;
  title: string;
  description?: string;
  related_entities: string[];
  created_at?: string;
}

export interface UniverseAsset {
  id: string;
  entity: string;
  entity_name: string;
  asset_type: 'vehicle' | 'property' | 'business' | 'phone';
  asset_number: string;
  numerology_vibration?: number;
  safety_score?: number;
  compatibility_with_owner?: number;
  additional_data?: Record<string, unknown>;
}

export interface UniverseRelationship {
  id: string;
  entity_1: string;
  entity_1_name?: string;
  entity_2: string;
  entity_2_name?: string;
  relationship_type?: string;
  compatibility_score?: number;
  influence_score?: number;
  analysis_data?: Record<string, unknown>;
}

export interface UniverseDashboard {
  summary?: Record<string, number | string>;
  stats?: Record<string, number | string>;
  network_graph?: {
    nodes: Array<{ id: string; label: string; type: string }>;
    edges: Array<{ source: string; target: string; compatibility?: number; influence?: number; type?: string }>;
  };
  [key: string]: unknown;
}

export interface InfluenceMap {
  nodes?: Array<Record<string, unknown>>;
  edges?: Array<Record<string, unknown>>;
  relationships?: UniverseRelationship[];
  [key: string]: unknown;
}

export interface NextAction {
  id?: string;
  title?: string;
  message?: string;
  description?: string;
  priority?: string;
  [key: string]: unknown;
}

export interface CompatibilityResult {
  overall_score?: number;
  entity_1_name?: string;
  entity_2_name?: string;
  details?: string;
  [key: string]: unknown;
}

export interface CrossEntityAnalysis {
  compatibility_matrix?: CompatibilityResult[];
  influence_analysis?: Array<Record<string, unknown>>;
  relationships?: UniverseRelationship[];
}

interface BaseEntityPayload {
  name: string;
  relationship_type?: string;
  metadata?: Record<string, unknown>;
}

export type EntityPayload =
  | (BaseEntityPayload & { entity_type: 'person'; date_of_birth: string })
  | (BaseEntityPayload & { entity_type: 'asset' | 'event'; date_of_birth?: never });

export interface EventPayload {
  event_type: string;
  event_date: string;
  title: string;
  description?: string;
  related_entities: string[];
}

const collection = <T>(data: T[] | { results?: T[]; data?: T[]; recommendations?: T[] }): T[] => {
  if (Array.isArray(data)) return data;
  return data.results || data.data || data.recommendations || [];
};

export const meusAPI = {
  listEntities: async () => collection((await apiClient.get<UniverseEntity[] | { results?: UniverseEntity[] }>('/api/v1/entity/')).data),
  createEntity: (data: EntityPayload) => apiClient.post<UniverseEntity>('/api/v1/entity/', data),
  getEntity: (id: string) => apiClient.get<UniverseEntity>(`/api/v1/entity/${id}/`),
  updateEntity: (id: string, data: Partial<EntityPayload>) => apiClient.patch<UniverseEntity>(`/api/v1/entity/${id}/`, data),
  deleteEntity: (id: string) => apiClient.delete(`/api/v1/entity/${id}/`),

  getDashboard: () => apiClient.get<UniverseDashboard>('/api/v1/universe/dashboard/'),
  getInfluenceMap: () => apiClient.get<InfluenceMap>('/api/v1/universe/influence-map/'),
  getCycles: (entityId?: string, targetDate?: string) => apiClient.get<Record<string, unknown>>('/api/v1/universe/cycles/', { params: { entity_id: entityId, date: targetDate } }),
  analyzeCrossEntity: (entity_ids: string[], analysis_type: string) => apiClient.post<CrossEntityAnalysis>('/api/v1/analysis/cross-entity/', { entity_ids, analysis_type }),
  getNextActions: async () => collection((await apiClient.get<{ recommendations: NextAction[] }>('/api/v1/recommendations/next-actions/')).data),

  listEvents: async () => collection((await apiClient.get<UniverseEvent[] | { results?: UniverseEvent[] }>('/api/v1/universe/events/')).data),
  createEvent: (data: EventPayload) => apiClient.post<UniverseEvent>('/api/v1/universe/events/', data),
  getEvent: (id: string) => apiClient.get<UniverseEvent>(`/api/v1/universe/events/${id}/`),
  updateEvent: (id: string, data: Partial<EventPayload>) => apiClient.patch<UniverseEvent>(`/api/v1/universe/events/${id}/`, data),
  deleteEvent: (id: string) => apiClient.delete(`/api/v1/universe/events/${id}/`),

  listAssets: async () => collection((await apiClient.get<UniverseAsset[] | { results?: UniverseAsset[] }>('/api/v1/universe/assets/')).data),
  createAsset: (data: Pick<UniverseAsset, 'entity' | 'asset_type' | 'asset_number'> & { additional_data?: Record<string, unknown> }) => apiClient.post<UniverseAsset>('/api/v1/universe/assets/', data),
  getAsset: (id: string) => apiClient.get<UniverseAsset>(`/api/v1/universe/assets/${id}/`),
  updateAsset: (id: string, data: Partial<Omit<UniverseAsset, 'id'>>) => apiClient.patch<UniverseAsset>(`/api/v1/universe/assets/${id}/`, data),
  deleteAsset: (id: string) => apiClient.delete(`/api/v1/universe/assets/${id}/`),

  listRelationships: async () => collection((await apiClient.get<UniverseRelationship[] | { results?: UniverseRelationship[] }>('/api/v1/universe/relationships/')).data),
  createRelationship: (data: Omit<UniverseRelationship, 'id'>) => apiClient.post<UniverseRelationship>('/api/v1/universe/relationships/', data),
  getRelationship: (id: string) => apiClient.get<UniverseRelationship>(`/api/v1/universe/relationships/${id}/`),
  updateRelationship: (id: string, data: Partial<Omit<UniverseRelationship, 'id'>>) => apiClient.patch<UniverseRelationship>(`/api/v1/universe/relationships/${id}/`, data),
  deleteRelationship: (id: string) => apiClient.delete(`/api/v1/universe/relationships/${id}/`),

  getReport: () => apiClient.get<Record<string, unknown>>('/api/v1/universe/report/'),
};

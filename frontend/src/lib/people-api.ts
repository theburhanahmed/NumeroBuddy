import apiClient from './api-client';

export interface Person {
  id: string;
  name: string;
  birth_date?: string;
  relationship?: string;
  notes?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const peopleAPI = {
  async list(): Promise<Person[]> {
    const response = await apiClient.get('/api/v1/people/');
    return response.data as Person[];
  },
};


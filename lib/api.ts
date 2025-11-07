import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Score {
  id?: number;
  player_name: string;
  score: number;
  moves: number;
  time: number;
  grid_size: string;
  theme: string;
  created_at?: string;
}

export interface TopScore extends Score {
  rank: number;
}

export interface Statistics {
  total_participations: number;
  average_score: number;
  average_time: number;
  average_moves: number;
  best_time: number;
  best_moves: number;
  total_players: number;
}

export interface ThemeItem {
  id: number | string;
  name: string;
  image?: string;
  emoji?: string;
}

export interface ThemeResponse {
  theme: string;
  data: ThemeItem[];
}

export const gameApi = {
  saveScore: async (score: Score): Promise<Score> => {
    console.log('Sending score to API:', score);
    try {
      const response = await api.post<Score>('/scores', score);
      console.log('Score saved, response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in saveScore:', error);
      throw error;
    }
  },

  getTopScores: async (limit: number = 10): Promise<TopScore[]> => {
    const response = await api.get<TopScore[]>(`/scores/top?limit=${limit}`);
    return response.data;
  },

  getStatistics: async (): Promise<Statistics> => {
    const response = await api.get<Statistics>('/scores/statistics');
    return response.data;
  },

  getTheme: async (themeName: string, limit: number = 18): Promise<ThemeResponse> => {
    const response = await api.get<ThemeResponse>(`/themes/${themeName}?limit=${limit}`);
    return response.data;
  },
};


import axios from 'axios';
import { UserProfile, ResearchProject, ResearchData, AIAnalysis, Comment } from '@/types/research';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/research`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export const researchApi = {
    // User Profile
    getUserProfile: async (): Promise<UserProfile> => {
        const response = await api.get('/profiles/');
        return response.data[0]; // Current user's profile
    },

    updateUserProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        const response = await api.patch(`/profiles/${data.id}/`, data);
        return response.data;
    },

    // Research Projects
    getProjects: async (params?: { 
        status?: string, 
        search?: string,
        ordering?: string 
    }): Promise<ResearchProject[]> => {
        const response = await api.get('/projects/', { params });
        return response.data;
    },

    getProject: async (id: number): Promise<ResearchProject> => {
        const response = await api.get(`/projects/${id}/`);
        return response.data;
    },

    createProject: async (data: Partial<ResearchProject>): Promise<ResearchProject> => {
        const response = await api.post('/projects/', data);
        return response.data;
    },

    updateProject: async (id: number, data: Partial<ResearchProject>): Promise<ResearchProject> => {
        const response = await api.patch(`/projects/${id}/`, data);
        return response.data;
    },

    deleteProject: async (id: number): Promise<void> => {
        await api.delete(`/projects/${id}/`);
    },

    addCollaborator: async (projectId: number, userId: number): Promise<void> => {
        await api.post(`/projects/${projectId}/add_collaborator/`, { user_id: userId });
    },

    // Research Data
    getDataSets: async (params?: {
        project?: number,
        data_type?: string,
        search?: string
    }): Promise<ResearchData[]> => {
        const response = await api.get('/data/', { params });
        return response.data;
    },

    uploadData: async (projectId: number, formData: FormData): Promise<ResearchData> => {
        const response = await api.post('/data/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // AI Analysis
    getAnalyses: async (params?: {
        project?: number,
        status?: string,
        analysis_type?: string
    }): Promise<AIAnalysis[]> => {
        const response = await api.get('/analyses/', { params });
        return response.data;
    },

    createAnalysis: async (data: Partial<AIAnalysis>): Promise<AIAnalysis> => {
        const response = await api.post('/analyses/', data);
        return response.data;
    },

    retryAnalysis: async (id: number): Promise<void> => {
        await api.post(`/analyses/${id}/retry_analysis/`);
    },

    // Comments
    getComments: async (projectId: number): Promise<Comment[]> => {
        const response = await api.get('/comments/', { 
            params: { project: projectId } 
        });
        return response.data;
    },

    createComment: async (data: Partial<Comment>): Promise<Comment> => {
        const response = await api.post('/comments/', data);
        return response.data;
    },

    deleteComment: async (id: number): Promise<void> => {
        await api.delete(`/comments/${id}/`);
    },
}; 
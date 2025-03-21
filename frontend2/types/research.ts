export interface UserProfile {
    id: number;
    username: string;
    email: string;
    full_name: string;
    bio: string;
    institution: string;
    position: string;
    research_interests: string;
    website: string;
    created_at: string;
    updated_at: string;
}

export interface Comment {
    id: number;
    project: number;
    author: number;
    author_name: string;
    content: string;
    parent: number | null;
    replies: Comment[];
    created_at: string;
    updated_at: string;
}

export interface ResearchData {
    id: number;
    project: number;
    title: string;
    description: string;
    data_type: 'raw' | 'processed' | 'analysis' | 'visualization';
    file: string;
    file_url: string;
    uploaded_by: number;
    uploaded_by_name: string;
    version: string;
    metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface AIAnalysis {
    id: number;
    project: number;
    data: number;
    title: string;
    description: string;
    analysis_type: string;
    parameters: Record<string, any>;
    results: Record<string, any>;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    error_message: string;
    requested_by: number;
    requested_by_name: string;
    created_at: string;
    updated_at: string;
}

export interface ResearchProject {
    id: number;
    title: string;
    slug: string;
    description: string;
    owner: number;
    owner_name: string;
    collaborators: number[];
    collaborators_detail: UserProfile[];
    status: 'draft' | 'active' | 'completed' | 'archived';
    is_public: boolean;
    start_date: string | null;
    end_date: string | null;
    data_sets: ResearchData[];
    ai_analyses: AIAnalysis[];
    comments: Comment[];
    created_at: string;
    updated_at: string;
} 
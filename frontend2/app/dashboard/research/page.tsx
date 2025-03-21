'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ResearchProject } from '@/types/research';
import { researchApi } from '@/services/researchApi';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, SearchIcon } from '@heroicons/react/24/outline';

export default function ResearchDashboard() {
    const router = useRouter();
    const [projects, setProjects] = useState<ResearchProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [ordering, setOrdering] = useState('-created_at');

    useEffect(() => {
        loadProjects();
    }, [searchQuery, statusFilter, ordering]);

    const loadProjects = async () => {
        try {
            const params: any = {
                ordering,
                search: searchQuery || undefined,
            };
            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }
            const data = await researchApi.getProjects(params);
            setProjects(data);
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors = {
            draft: 'bg-gray-500',
            active: 'bg-green-500',
            completed: 'bg-blue-500',
            archived: 'bg-yellow-500',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-500';
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Research Projects</h1>
                <Button
                    onClick={() => router.push('/dashboard/research/new')}
                    className="bg-primary hover:bg-primary/90"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    New Project
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={ordering}
                    onValueChange={setOrdering}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="-created_at">Newest First</SelectItem>
                        <SelectItem value="created_at">Oldest First</SelectItem>
                        <SelectItem value="title">Title A-Z</SelectItem>
                        <SelectItem value="-title">Title Z-A</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Card
                            key={project.id}
                            className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                            onClick={() => router.push(`/dashboard/research/${project.id}`)}
                        >
                            <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2">
                                <div className="flex flex-col">
                                    <h3 className="font-semibold text-lg text-gray-900">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        by {project.owner_name}
                                    </p>
                                </div>
                                <Badge className={`${getStatusColor(project.status)} text-white`}>
                                    {project.status}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 line-clamp-2 mb-4">
                                    {project.description}
                                </p>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>{project.data_sets.length} datasets</span>
                                    <span>{project.ai_analyses.length} analyses</span>
                                    <span>{project.collaborators.length} collaborators</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && projects.length === 0 && (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No projects found
                    </h3>
                    <p className="text-gray-500">
                        Create a new project to get started with your research
                    </p>
                </div>
            )}
        </div>
    );
} 
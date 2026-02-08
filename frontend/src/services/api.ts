import type { FileAnalysisResponse, Segment } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function uploadFile(file: File): Promise<FileAnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/api/v1/analyze-file`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'File upload failed');
    }

    return response.json();
}

export async function checkHealth(): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/health`);
        return res.ok;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function translateSegments(segments: Segment[]): Promise<Segment[]> {
    const response = await fetch(`${API_URL}/api/v1/translate-segments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(segments),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Translation failed');
    }

    return response.json();
}
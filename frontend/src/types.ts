export interface Segment {
    id: string;
    source_text: string;
    target_text: string | null;
    width_px: number;
    status: 'PENDING' | 'SAFE' | 'OVERFLOW';
}

export interface FileAnalysisResponse {
    filename: string;
    total_segments: number;
    segments: Segment[];
}

export interface AnalysisRequest {
    text: string;
    font_size: number;
}

export interface AnalysisResponse {
    text: string;
    width_px: number;
    safe: boolean;
}
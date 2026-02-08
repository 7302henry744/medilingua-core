import { render, screen } from '@testing-library/react';
import { WidthVisualizer } from '../WidthVisualizer';
import type { Segment } from '../../types';
import { describe, it, expect } from 'vitest';

// Mock Data
const safeSegment: Segment = {
    id: "1",
    source_text: "Short",
    target_text: "Lyhyt",
    width_px: 50, // Well under 200px
    status: "SAFE"
};

const overflowSegment: Segment = {
    id: "2",
    source_text: "Long Text",
    target_text: "Very Long Finnish Text That Overflows",
    width_px: 250, // Over 200px limit
    status: "OVERFLOW"
};

describe('WidthVisualizer', () => {
    it('renders safe segments correctly', () => {
        render(<WidthVisualizer segments={[safeSegment]} />);

        // Check for text
        expect(screen.getByText("Lyhyt")).toBeInTheDocument();
        // Check for safe badge (Green)
        const badge = screen.getByText("50px");
        expect(badge).toHaveClass('text-emerald-700');
    });

    it('renders overflow warning for unsafe segments', () => {
        render(<WidthVisualizer segments={[overflowSegment]} />);

        // Check for Critical Overflow text
        expect(screen.getByText(/CRITICAL OVERFLOW/i)).toBeInTheDocument();
        // Check for unsafe badge (Red)
        const badge = screen.getByText("250px");
        expect(badge).toHaveClass('text-red-700');
    });
});
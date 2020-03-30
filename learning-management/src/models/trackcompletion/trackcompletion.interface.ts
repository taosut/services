/**
 * Language variable type declaration.
 *
 * @interface
 */
export interface ITrackCompletion {
    id: string;
    total_progress: string;
    lecture_progress: string;
    quiz_progress: string;
    quiz_score: string;

    quiz_rank: number;
    overall_rank: number;

    finished: boolean;

    track_id: string;
    user_id: string;

    created_at: Date;
    updated_at: Date;
}

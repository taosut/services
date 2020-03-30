/**
 * Language variable type declaration.
 *
 * @interface
 */
export interface IQuizAttempt {
    id: string;
    total_attempted: number;
    total_correct: number;
    total_question: number;
    latest_score: string;
    elapsed_time: number;
    finished: boolean;
    latest_started_at: Date;

    quiz_id: string;
    user_id: string;

    created_at: Date;
    updated_at: Date;
}
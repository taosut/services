/**
 * Language variable type declaration.
 *
 * @interface
 */
export interface IQuizAttemptDetail {
    id: string;
    question: string;
    sort_order: number;
    
    question_id: string;
    choosen_answer_id: string;
    correct_answer_id: string;

    quiz_attempt_id: string;

    created_at: Date;
    updated_at: Date;
}
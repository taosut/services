/**
 * Language variable type declaration.
 *
 * @interface
 */
export interface IQuizQuestion {
    id: string;
    question: string;
    
    quiz_id: string;

    created_at: Date;
    updated_at: Date;
    deleted_at: Date|null;
}
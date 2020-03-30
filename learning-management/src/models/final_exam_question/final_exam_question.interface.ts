/**
 * Language variable type declaration.
 *
 * @interface
 */
export interface IFinalExamQuestion {
    id: string;
    question: string;

    final_exam_id: string;

    created_at: Date;
    updated_at: Date;
    deleted_at: Date|null;
}

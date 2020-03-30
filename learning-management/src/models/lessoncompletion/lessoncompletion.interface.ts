/**
 * Language variable type declaration.
 *
 * @interface
 */
export interface ILessonCompletion {
    id: string;
    elapsed_time: number;
    progress: string;
    finished: boolean;

    lesson_id: string;
    user_id: string;

    created_at: Date;
    updated_at: Date;
}
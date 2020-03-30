/**
 * Language variable type declaration.
 *
 * @interface
 */
export interface ILesson {
    id: string;
    title: string;
    slug: string;
    lesson_type: string;
    description: string|null;
    duration: number;
    sort_order: number;

    playlist_id: string;

    created_at: Date;
    updated_at: Date;
    deleted_at: Date|null;
}
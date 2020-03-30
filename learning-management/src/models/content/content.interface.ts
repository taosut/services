/**
 * Language variable type declaration.
 *
 * @interface
 */
export interface IContent {
    id: string;
    content: string|null;
    video_source: string|null;
    video_link: string|null;
    duration: number|null;

    lesson_id: string;

    created_at: Date;
    updated_at: Date;
    deleted_at: Date|null;
}

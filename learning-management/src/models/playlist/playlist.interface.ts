/**
 * Language variable type declaration.
 *
 * @interface
 */
export interface IPlaylist {
    id: string;
    title: string;
    slug: string;
    description: string|null;
    duration: number;
    sort_order: number;

    course_id: string;

    created_at: Date;
    updated_at: Date;
    deleted_at: Date|null;
}
/**
 * Language variable type declaration.
 *
 * @interface
 */
export interface ITrack {
    id: string;
    title: string;
    slug: string;
    preview: string|null;
    description: string|null;
    requirement: string|null;
    published: boolean;
    sort_order: number;

    user_id: string|null;

    created_at: Date;
    updated_at: Date;
    deleted_at: Date|null;
}
/**
 * Language variable type declaration.
 *
 * @interface
 */
export interface ICourse {
    id: string;
    title: string;
    slug: string;
    preview: string|null;
    description: string|null;
    term_and_condition: string|null;
    published: boolean;
    approved: boolean;
    sort_order: number;

    user_id: string|null;
    track_id: string|null;

    created_at: Date;
    updated_at: Date;
    deleted_at: Date|null;
}
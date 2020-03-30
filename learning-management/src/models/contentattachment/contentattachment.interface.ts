/**
 * Language variable type declaration.
 *
 * @interface
 */
export interface IContentAttachment {
    id: string;
    name: string;
    type: string;
    size: number;
    path: string;

    content_id: string;

    created_at: Date;
    updated_at: Date;
    deleted_at: Date|null;
}
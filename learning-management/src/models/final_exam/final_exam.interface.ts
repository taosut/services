/**
 * Language variable type declaration.
 *
 * @interface
 */
export interface IFinalExam {
    id: string;
    title: string;
    slug: string;
    description: string|null;
    duration: number;
    published: boolean;

    track_id: string|null;
    course_id: string|null;
    playlist_id: string|null;

    created_at: Date;
    updated_at: Date;
    deleted_at: Date|null;
}

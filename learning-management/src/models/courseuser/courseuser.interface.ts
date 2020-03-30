/**
 * Language variable type declaration.
 *
 * @interface
 */
export interface ICourseUser {
    id: string;
    has_joined: boolean;

    course_id: string;
    user_id: string;

    created_at: Date;
    updated_at: Date;
}
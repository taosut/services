import { demoUserData } from './demoUserData';

/**
 * Service for authentication
 *
 * @class
 */
export class AuthService {
    constructor() {
    // constructor
    }
    /**
     * Get userId
     *
     * @function
     */
    getUserId(role = 'learner'): Promise<string> {
        if (!role) {
            return Promise.reject({statusCode: 401, message: 'Unauthorized'});
        } else {
            return Promise.resolve(this.getUserDemoId(role));
        }
    }
    getUserDemoId(role = 'learner') {
        const find = demoUserData.find(user => user.roles.find(el => el === role) !== undefined);
        if (find) {
            return Promise.resolve(find.id);
        } else {
            return Promise.reject({statusCode: 401, message: 'Unauthorized'});
        }
    }
}

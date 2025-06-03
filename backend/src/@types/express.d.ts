import { User } from '../users/user.entity'; // Import your User type or interface

declare global {
  namespace Express {
    interface Request {
      user?: User;  // Add the user property to the Request type
    }
  }
}
export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  collegeIdVerified: boolean;
}

export interface CourseDTO {
  id: string;
  title: string;
  price: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type CourseContentType = 'video' | 'document';
<<<<<<< codex/add-admin-course-manager-feature-gbmr6s
export type CoursePublishTarget = 'dashboard' | 'roadmap' | 'both';
=======
>>>>>>> main

export type CourseContentItem = {
  id: string;
  type: CourseContentType;
  title: string;
  url: string;
  topic: string;
};

export type ManagedCourse = {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
<<<<<<< codex/add-admin-course-manager-feature-gbmr6s
  publishTarget: CoursePublishTarget;
=======
>>>>>>> main
  content: CourseContentItem[];
  createdAt: string;
  updatedAt: string;
};

export type CourseFormState = {
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
<<<<<<< codex/add-admin-course-manager-feature-gbmr6s
  publishTarget: CoursePublishTarget;
=======
>>>>>>> main
};

export type ContentFormState = {
  type: CourseContentType;
  title: string;
  url: string;
  topic: string;
};

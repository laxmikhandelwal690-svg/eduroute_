export type CourseContentType = 'video' | 'document';
export type CoursePublishTarget = 'dashboard' | 'roadmap' | 'both';

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
  publishTarget: CoursePublishTarget;
  content: CourseContentItem[];
  createdAt: string;
  updatedAt: string;
};

export type CourseFormState = {
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  publishTarget: CoursePublishTarget;
};

export type ContentFormState = {
  type: CourseContentType;
  title: string;
  url: string;
  topic: string;
};

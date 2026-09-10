export type CourseContentType = 'video' | 'document';

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
  content: CourseContentItem[];
  createdAt: string;
  updatedAt: string;
};

export type CourseFormState = {
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
};

export type ContentFormState = {
  type: CourseContentType;
  title: string;
  url: string;
  topic: string;
};

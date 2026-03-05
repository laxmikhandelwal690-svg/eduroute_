import { ContentFormState, CourseFormState, ManagedCourse } from '../types/courseManager';

const COURSE_STORAGE_KEY = 'eduroute.courseManager.courses';

const isBrowser = typeof window !== 'undefined';

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const normalizeCourse = (course: ManagedCourse): ManagedCourse => ({
  ...course,
  publishTarget: course.publishTarget || 'dashboard',
});

const safelyParseCourses = (rawValue: string | null): ManagedCourse[] => {
  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue) as ManagedCourse[];
    if (!Array.isArray(parsedValue)) {
      return [];
    }
    return parsedValue.map(normalizeCourse);
  } catch {
    return [];
  }
};

const saveCourses = (courses: ManagedCourse[]) => {
  if (!isBrowser) {
    return;
  }
  localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(courses));
};

export const getManagedCourses = (): ManagedCourse[] => {
  if (!isBrowser) {
    return [];
  }

  const rawCourses = localStorage.getItem(COURSE_STORAGE_KEY);
  return safelyParseCourses(rawCourses);
};

export const getRoadmapManagedCourses = () => getManagedCourses().filter((course) => course.publishTarget === 'roadmap' || course.publishTarget === 'both');

export const getDashboardManagedCourses = () => getManagedCourses().filter((course) => course.publishTarget === 'dashboard' || course.publishTarget === 'both');

export const createCourse = (payload: CourseFormState): ManagedCourse => {
  const courses = getManagedCourses();
  const now = new Date().toISOString();
  const nextCourse: ManagedCourse = {
    id: createId(),
    title: payload.title.trim(),
    description: payload.description.trim(),
    category: payload.category.trim(),
    thumbnailUrl: payload.thumbnailUrl.trim(),
    publishTarget: payload.publishTarget,
    content: [],
    createdAt: now,
    updatedAt: now,
  };

  const updatedCourses = [nextCourse, ...courses];
  saveCourses(updatedCourses);

  return nextCourse;
};

export const updateCourse = (courseId: string, payload: CourseFormState): ManagedCourse[] => {
  const courses = getManagedCourses();
  const updatedCourses = courses.map((course) => {
    if (course.id !== courseId) {
      return course;
    }

    return {
      ...course,
      title: payload.title.trim(),
      description: payload.description.trim(),
      category: payload.category.trim(),
      thumbnailUrl: payload.thumbnailUrl.trim(),
      publishTarget: payload.publishTarget,
      updatedAt: new Date().toISOString(),
    };
  });

  saveCourses(updatedCourses);
  return updatedCourses;
};

export const deleteCourse = (courseId: string): ManagedCourse[] => {
  const updatedCourses = getManagedCourses().filter((course) => course.id !== courseId);
  saveCourses(updatedCourses);
  return updatedCourses;
};

export const createCourseContent = (courseId: string, payload: ContentFormState): ManagedCourse[] => {
  const courses = getManagedCourses();
  const updatedCourses = courses.map((course) => {
    if (course.id !== courseId) {
      return course;
    }

    return {
      ...course,
      content: [
        ...course.content,
        {
          id: createId(),
          type: payload.type,
          title: payload.title.trim(),
          url: payload.url.trim(),
          topic: payload.topic.trim(),
        },
      ],
      updatedAt: new Date().toISOString(),
    };
  });

  saveCourses(updatedCourses);
  return updatedCourses;
};

export const updateCourseContent = (
  courseId: string,
  contentId: string,
  payload: ContentFormState,
): ManagedCourse[] => {
  const courses = getManagedCourses();
  const updatedCourses = courses.map((course) => {
    if (course.id !== courseId) {
      return course;
    }

    return {
      ...course,
      content: course.content.map((item) => {
        if (item.id !== contentId) {
          return item;
        }

        return {
          ...item,
          type: payload.type,
          title: payload.title.trim(),
          url: payload.url.trim(),
          topic: payload.topic.trim(),
        };
      }),
      updatedAt: new Date().toISOString(),
    };
  });

  saveCourses(updatedCourses);
  return updatedCourses;
};

export const deleteCourseContent = (courseId: string, contentId: string): ManagedCourse[] => {
  const courses = getManagedCourses();
  const updatedCourses = courses.map((course) => {
    if (course.id !== courseId) {
      return course;
    }

    return {
      ...course,
      content: course.content.filter((item) => item.id !== contentId),
      updatedAt: new Date().toISOString(),
    };
  });

  saveCourses(updatedCourses);
  return updatedCourses;
};

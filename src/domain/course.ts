export interface CourseLesson {
  id: string;
  title: string;
  file: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface Course {
  title: string;
  modules: CourseModule[];
}

export interface FlatLesson extends CourseLesson {
  moduleId: string;
  moduleTitle: string;
  markdown: string;
}

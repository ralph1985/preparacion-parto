import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Course, FlatLesson } from "../../domain/course";

const contentRoot = join(process.cwd(), "src/infrastructure/content");
const coursePath = join(contentRoot, "data/course.json");

export async function getCourse(): Promise<Course> {
  return JSON.parse(await readFile(coursePath, "utf8")) as Course;
}

export async function getFlatLessons(): Promise<FlatLesson[]> {
  const course = await getCourse();
  const lessons = await Promise.all(
    course.modules.flatMap((module) =>
      module.lessons.map(async (lesson) => {
        const filePath = join(
          contentRoot,
          lesson.file.replace("./content/", "./"),
        );
        const markdown = await readFile(filePath, "utf8");

        return {
          ...lesson,
          moduleId: module.id,
          moduleTitle: module.title,
          markdown,
        };
      }),
    ),
  );

  return lessons;
}

export async function getLessonById(
  id: string,
): Promise<FlatLesson | undefined> {
  const lessons = await getFlatLessons();
  return lessons.find((lesson) => lesson.id === id);
}

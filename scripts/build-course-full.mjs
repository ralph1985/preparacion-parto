import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const courseRoot = join(root, "src/infrastructure/content");
const publicContentRoot = join(root, "public/content");
const course = JSON.parse(
  readFileSync(join(courseRoot, "data/course.json"), "utf8"),
);
const output = [
  "# Preparacion al parto - curso completo",
  "",
  "Contenido educativo privado/familiar. No sustituye el seguimiento de matrona, ginecologia, pediatria, urgencias ni del equipo sanitario. Las pautas variables deben confirmarse con el hospital o centro de referencia.",
  "",
  "## Indice",
  "",
];

course.modules.forEach((module) => {
  output.push(`- ${module.title}`);
  module.lessons.forEach((lesson) => {
    output.push(`  - ${lesson.title} (${lesson.id})`);
  });
});

output.push("", "## Contenido", "");

course.modules.forEach((module) => {
  output.push(`# ${module.title}`, "");
  module.lessons.forEach((lesson) => {
    const filePath = join(courseRoot, lesson.file.replace("./content/", "./"));
    output.push(`<!-- lesson-id: ${lesson.id} -->`);
    output.push(readFileSync(filePath, "utf8").trim());
    output.push("");
  });
});

mkdirSync(publicContentRoot, { recursive: true });
writeFileSync(
  join(publicContentRoot, "course-full.md"),
  `${output.join("\n").trim()}\n`,
);

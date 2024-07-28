import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { emailTemplateT } from "@/types";

export const compileEmailTemplate: emailTemplateT = async (
  templateName: string,
  foldername: string,
  data: any
) => {
  try {
    // Read the template file
    const templatePath = path.resolve(
      __dirname,
      "..",
      "templates",
      foldername,
      `${templateName}.hbs`
    );
    const templateSource = fs.readFileSync(templatePath, "utf8");

    // Compile the template
    const template = handlebars.compile(templateSource);

    // Generate HTML content from template and data
    const html = template(data);

    return html;
  } catch (error) {
    throw new Error(`Error compiling email template: ${error}`);
  }
};

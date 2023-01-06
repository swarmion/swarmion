// eslint-disable-next-line import/no-named-as-default
import prompts from 'prompts';

const TEMPLATES = ['swarmion-starter', 'swarmion-full-stack'] as const;

export type Template = typeof TEMPLATES[number];

const isValidTemplate = (template: unknown): template is Template =>
  typeof template === 'string' && TEMPLATES.includes(template as Template);

const getProjectTemplate = async (
  templateOption: unknown,
): Promise<Template> => {
  if (isValidTemplate(templateOption)) {
    return templateOption;
  }

  const templateRes = await prompts({
    type: 'select',
    name: 'template',
    message: 'Choose your starting template',
    choices: [
      {
        title: 'Swarmion Starter',
        description: 'Simple example with a single backend',
        value: 'swarmion-starter',
      },
      {
        title: 'Swarmion Fullstack',
        description:
          'More complete example with a backend, a frontend and a shared lib',
        value: 'swarmion-full-stack',
      },
      {
        title: 'Swarmion with Next.js',
        description: 'Example with a backend and a frontend using Next.js',
        value: 'swarmion-with-next',
      },
    ],
  });

  if (isValidTemplate(templateRes.template)) {
    return templateRes.template;
  } else {
    throw new Error();
  }
};

export default getProjectTemplate;

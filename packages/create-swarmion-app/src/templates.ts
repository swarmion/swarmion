const TEMPLATES = ['swarmion-starter', 'swarmion-full-stack'] as const;

export type Template = typeof TEMPLATES[number];

export const isValidTemplate = (template: unknown): template is Template =>
  typeof template === 'string' && TEMPLATES.includes(template as Template);

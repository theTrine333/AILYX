export interface Model {
  id: string;
  type: string;
  features: string[];
  info: {
    name: string;
    description: string;
    url: string;
    developer: string;
    contextLength: number;
  };
  action?: any;
}

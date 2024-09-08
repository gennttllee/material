export type ChatMessage = {
  origin: string;
  message: {
    body: string;
    projectId: string;
  };
  destination: string;
  type: string;
  _id?: string;
};

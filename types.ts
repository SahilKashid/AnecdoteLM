export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface GeneratedContent {
  rawMarkdown: string;
}

export interface FileData {
  name: string;
  type: string;
  data: string; // Base64
}

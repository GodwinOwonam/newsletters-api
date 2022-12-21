export interface IResponse {
  status: boolean;
  message?: string;
  error?: string[];
  data?: any;
}

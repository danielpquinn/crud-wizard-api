import { level } from "./bootstrap";

export interface IToast {
  id: number;
  level: level;
  message: string;
}

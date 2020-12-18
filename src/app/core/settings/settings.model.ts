import { AppState } from "../states/core.state";

export const NIGHT_MODE_THEME = 'BLACK-THEME';

export type Language = 'en' | 'vi';

export interface SettingsState {
  language: string;
}

export interface State extends AppState {
  settings: SettingsState;
}

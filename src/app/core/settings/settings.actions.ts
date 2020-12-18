import { Action } from '@ngrx/store';

import { Language } from './settings.model';

export enum SettingsActionTypes {
  CHANGE_LANGUAGE = '[Settings] Change Language',
}

export class ActionSettingsChangeLanguage implements Action {
  readonly type = SettingsActionTypes.CHANGE_LANGUAGE;

  constructor(readonly payload: { language: Language }) {}
}

export type SettingsActions =
  | ActionSettingsChangeLanguage;

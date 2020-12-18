import { ActionSettingsChangeLanguage, SettingsActionTypes } from './settings.actions';

describe('Settings Actions', () => {

  it('should create ActionSettingsChangeLanguage action', () => {
    const action = new ActionSettingsChangeLanguage({
      language: 'en'
    });

    expect(action.type).toEqual(SettingsActionTypes.CHANGE_LANGUAGE);
    expect(action.payload.language).toEqual('en');
  });

});

import { WizardConfig } from './interfaces';
import { TOOLBAR_POSITION, TOOLBAR_BUTTON_POSITION, THEME } from './enums';

export const DEFAULT_CONFIG: WizardConfig = {
  selected: 0,
  keyNavigation: true,
  cycleSteps: false,
  lang: {
      next: 'Next2',
      previous: 'Previous2'
  },
  toolbarSettings: {
      toolbarPosition: TOOLBAR_POSITION.bottom,
      toolbarButtonPosition: TOOLBAR_BUTTON_POSITION.end,
      showNextButton: true,
      showPreviousButton: true,
      toolbarExtraButtons: []
  },
  anchorSettings: {
      anchorClickable: true,
      enableAllAnchors: false,
      markDoneStep: true,
      markAllPreviousStepsAsDone: true,
      removeDoneStepOnNavigateBack: false,
      enableAnchorOnDoneStep: true
  },
  theme: THEME.default,
};


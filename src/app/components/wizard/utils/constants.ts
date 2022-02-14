import { WizardConfig } from './interfaces';

export const DEFAULT_CONFIG: WizardConfig = {
  selected: 0,
  lang: {
      next: 'Próximo',
      previous: 'Voltar',
      finish: 'Finalizar'
  },
  toolbarSettings: {
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
};


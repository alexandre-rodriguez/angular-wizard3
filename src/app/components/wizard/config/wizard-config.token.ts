import { InjectionToken } from "@angular/core";
import { WizardConfig } from '../utils/interfaces';

export const WIZARD_CONFIG_TOKEN = new InjectionToken<WizardConfig>('wizardCustom.config');

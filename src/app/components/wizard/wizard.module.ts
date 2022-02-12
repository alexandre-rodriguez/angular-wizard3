import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardComponent } from './wizard/wizard.component';
import { WizardStepComponent } from './wizard-step/wizard-step.component';
import { WizardStepContentDirective } from './wizard-step/directives/wizard-step-content.directive';
import { WizardConfig } from './utils/interfaces';
import { WIZARD_CONFIG_TOKEN } from './config/wizard-config.token';



@NgModule({
  declarations: [
    WizardComponent,
    WizardStepComponent,
    WizardStepContentDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    WizardComponent,
    WizardStepComponent
  ]
})
export class WizardModule {
/**
   * forRoot
   * @returns A module with its provider dependencies
   */
 static forRoot(wizardConfig: WizardConfig): ModuleWithProviders<WizardModule> {
  return {
    ngModule: WizardModule,
    providers: [
      {
        provide: WIZARD_CONFIG_TOKEN,
        useValue: wizardConfig
      }
    ]
  };
}



}

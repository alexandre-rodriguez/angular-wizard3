import { Component, } from '@angular/core';
import { WizardService } from '../components/wizard/services/wizard.service';
import { WizardConfig, StepChangedArgs } from '../components/wizard/utils/interfaces';
import { StepDefinition, ExemploService } from './services/exemplo.service';
import { STEP_STATE, THEME } from '../components/wizard/utils/enums';

@Component({
  selector: 'pucx-exemplo',
  templateUrl: './exemplo.component.html',
  styleUrls: ['./exemplo.component.scss']
})
export class ExemploComponent {

  config: WizardConfig;
  stepDefinitions: StepDefinition[];

  stepStates = { normal: STEP_STATE.normal, disabled: STEP_STATE.disabled, error: STEP_STATE.error, hidden: STEP_STATE.hidden };
  themes = [THEME.default, THEME.arrows, THEME.circles, THEME.dots];
  stepIndexes = [0, 1, 2, 3, 4, 5, 6];

  selectedTheme!: THEME;
  selectedStepIndex: number = 0;

  constructor(
    private ngWizardService: WizardService,
    private exemploService: ExemploService,
  ) {
    this.config = exemploService.config;
    this.stepDefinitions = exemploService.stepDefinitions;

    this.config.toolbarSettings?.toolbarExtraButtons?.push(
      {
        text: 'Reset',
        class: 'btn btn-danger',
        event: this.resetWizard.bind(this)
      }
    );
  }

  ngOnInit() {
    this.selectedTheme = this.config.theme || THEME.arrows;
    this.themeSelected();

    if (this.config.selected) {
      this.selectedStepIndex = this.config.selected;
    }

    this.ngWizardService.stepChanged()
      .subscribe({
        next: (args) => {
          console.log('catching step change - method 2');
        }
      });
  }

  stepChanged(args: StepChangedArgs) {
    this.selectedStepIndex = args.step.index;
    console.log('catching step change - method 1');
  }

  showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
  }

  showNextStep(event?: Event) {
    this.ngWizardService.next();
  }

  resetWizard(event?: Event) {
    this.selectedTheme = this.config.theme  || THEME.arrows;

    if (this.config.selected !== undefined) {
      this.selectedStepIndex = this.config.selected;
    }

    this.ngWizardService.reset();
  }

  themeSelected() {
    this.ngWizardService.theme(this.selectedTheme);
  }

  stepIndexSelected() {
    this.ngWizardService.show(this.selectedStepIndex);
  }
}

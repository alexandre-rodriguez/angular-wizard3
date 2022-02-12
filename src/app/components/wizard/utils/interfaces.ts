import { Directive, Input, Type, ComponentRef, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';
import { STEP_STATE, STEP_DIRECTIN, STEP_STATUS, STEP_POSITION, TOOLBAR_POSITION, TOOLBAR_BUTTON_POSITION, THEME } from './enums';

export interface Language {
  next?: string;
  previous?: string;
}

export interface ToolbarSettings {
  toolbarPosition?: TOOLBAR_POSITION; // none, top, bottom, both
  toolbarButtonPosition?: TOOLBAR_BUTTON_POSITION; // start, end
  showNextButton?: boolean; // show/hide a Next button
  showPreviousButton?: boolean; // show/hide a Previous button
  toolbarExtraButtons?: ToolbarButton[]; // Extra buttons to show on toolbar, array of input/buttons elements
}

export interface ToolbarButton {
  text: string;
  class: string;
  event?: () => void;
}

export interface AnchorSettings {
  anchorClickable?: boolean; // Enable/Disable anchor navigation
  enableAllAnchors?: boolean; // Activates all anchors clickable all times
  markDoneStep?: boolean; // Add done css
  markAllPreviousStepsAsDone?: boolean; // When a step selected, all previous steps are marked done
  removeDoneStepOnNavigateBack?: boolean; // While navigate back done step after active step will be cleared
  enableAnchorOnDoneStep?: boolean; // Enable/Disable the done steps navigation
}

export interface WizardConfig {
  selected?: number; // Initial selected step, 0 = first step
  keyNavigation?: boolean; // Enable/Disable keyboard navigation(left and right keys are used if enabled)
  cycleSteps?: boolean; // Allows to cycle the navigation of steps
  lang?: Language; // Language variables for button
  toolbarSettings?: ToolbarSettings;
  anchorSettings?: AnchorSettings;
  theme?: THEME; // theme for the wizard, related css need to include for other than default theme
}

@Directive()
export abstract class WizardStep {
  index: number = 0;

  @Input()
  title: string = '';

  @Input()
  description: string = '';

  @Input()
  state?: STEP_STATE;
  initialState?: STEP_STATE;

  @Input()
  component?: Type<any>;
  componentRef?: ComponentRef<any>;

  @Input()
  canEnter!: boolean | ((args: StepValidationArgs) => boolean) | ((args: StepValidationArgs) => Observable<boolean>);
  //canEnter: any;

  @Input()
  canExit!: boolean | ((args: StepValidationArgs) => boolean) | ((args: StepValidationArgs) => Observable<boolean>);
  //canExit: any;

  status?: STEP_STATUS;
  initialStatus?: STEP_STATUS;

  @HostBinding('hidden')
  public get hidden(): boolean {
      return this.status != STEP_STATUS.active;
  }
}

export interface StepValidationArgs {
  direction: STEP_DIRECTIN;
  fromStep: WizardStep;
  toStep: WizardStep;
}

export interface StepChangedArgs {
  step: WizardStep;
  previousStep: WizardStep;
  direction: STEP_DIRECTIN;
  position: STEP_POSITION;
}

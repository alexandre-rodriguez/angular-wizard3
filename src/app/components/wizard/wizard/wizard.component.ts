import {
  Component,
  OnDestroy,
  OnInit,
  AfterContentInit,
  ContentChildren,
  QueryList,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { WizardStep, WizardConfig, StepChangedArgs } from '../utils/interfaces';
import {
  STEP_STATUS,
  STEP_STATE,
  STEP_DIRECTIN,
  STEP_POSITION,
} from '../utils/enums';
import { of, Subscription, Observable, isObservable } from 'rxjs';
import { WizardDataService } from '../services/wizard-data.service';
import { merge } from '../utils/functions';
import { StepValidationArgs, ToolbarButton } from '../utils/interfaces';

@Component({
  selector: 'pucx-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WizardComponent implements OnInit, OnDestroy, AfterContentInit {
  @ContentChildren(WizardStep)
  public steps!: QueryList<WizardStep>;

  _pConfig!: WizardConfig;
  get pConfig(): WizardConfig {
    return this._pConfig || {};
  }

  @Input('config')
  set pConfig(config: WizardConfig) {
    this._pConfig = config;
  }

  config!: WizardConfig;

  @Output() stepChanged = new EventEmitter<StepChangedArgs>();
  @Output() reseted = new EventEmitter<void>();
  @Output() finished = new EventEmitter<void>();

  showToolbar: boolean = true;
  showPreviousButton: boolean = false;
  showNextButton: boolean = false;
  showExtraButtons: boolean = false;
  wizardComplete: boolean = false;
  currentStepIndex!: number; // Active step index
  currentStep!: WizardStep; // Active step

  resetWizardWatcher!: Subscription;
  showNextStepWatcher!: Subscription;
  showPreviousStepWatcher!: Subscription;
  showStepWatcher!: Subscription;
  finishWizardWatcher!: Subscription;

  constructor(private wizardDataService: WizardDataService) {}
  ngOnInit(): void {}

  ngAfterContentInit() {
    this._backupStepStates();

    this._init();

    // Set toolbar
    this._setToolbar();

    // Assign plugin events
    this._setEvents();

    this.resetWizardWatcher = this.wizardDataService.resetWizard$.subscribe(
      () => this._reset()
    );

    this.showNextStepWatcher = this.wizardDataService.showNextStep$.subscribe(
      () => this._showNextStep()
    );

    this.showPreviousStepWatcher =
      this.wizardDataService.showPreviousStep$.subscribe(() =>
        this._showPreviousStep()
      );

    this.showStepWatcher = this.wizardDataService.showStep$.subscribe((index) =>
      this._showStep(index)
    );

    this.finishWizardWatcher = this.wizardDataService.finishWizard$.subscribe(
      () => this._finishWizard()
    );
  }

  _init() {
    // set config
    let defaultConfig = this.wizardDataService.getDefaultConfig();
    this.config = merge(defaultConfig, this.pConfig);

    // set step states
    this._initSteps();

    // Show the initial step
    this._showStep(this.config.selected);
  }

  _initSteps() {
    this.steps.forEach((step, index) => {
      step.index = index;
      step.status = step.status || STEP_STATUS.untouched;
      step.state = step.state || STEP_STATE.normal;
    });

    // Mark previous steps of the active step as done
    const selected = this.config.selected;

    if (
      selected !== undefined &&
      selected > 0 &&
      this.config.anchorSettings?.markDoneStep &&
      this.config.anchorSettings?.markAllPreviousStepsAsDone
    ) {
      this.steps.forEach((step) => {
        if (
          step.state != STEP_STATE.disabled &&
          step.state != STEP_STATE.hidden
        ) {
          step.status = step.index < selected ? STEP_STATUS.done : step.status;
        }
      });
    }
  }

  _backupStepStates() {
    this.steps.forEach((step) => {
      step.initialStatus = step.status;
      step.initialState = step.state;
    });
  }

  _restoreStepStates() {
    this.steps.forEach((step) => {
      step.status = step.initialStatus;
      step.state = step.initialState;
    });
  }

  // PRIVATE FUNCTIONS
  _setToolbar() {
    this.showPreviousButton =
      this.config.toolbarSettings?.showPreviousButton || false;
    this.showNextButton = this.config.toolbarSettings?.showNextButton || false;

    this.showExtraButtons =   true;
    /*
    this.showExtraButtons =
      (this.config.toolbarSettings?.toolbarExtraButtons &&
        this.config.toolbarSettings?.toolbarExtraButtons.length > 0) ||
      false;
    */
  }

  _setEvents() {
    //TODO: keyNavigation
    // Keyboard navigation event
    if (this.config.keyNavigation) {
      // $(document).keyup(function (e) {
      //   mi._keyNav(e);
      // });
    }
  }

  _getStepCssClass(selectedStep: WizardStep) {
    let stepClass = '';

    switch (selectedStep.state) {
      case STEP_STATE.disabled:
        stepClass += ' disabled';
        break;
      case STEP_STATE.error:
        stepClass += ' danger';
        break;
      case STEP_STATE.hidden:
        stepClass += ' hidden';
        break;
    }

    switch (selectedStep.status) {
      case STEP_STATUS.done:
        stepClass += ' done';
        break;
      case STEP_STATUS.active:
        stepClass += ' active';
        break;
      case STEP_STATUS.complete:
        stepClass += ' complete';
        break;
    }

    return stepClass;
  }

  _showSelectedStep(event: Event, selectedStep: WizardStep) {
    event.preventDefault();

    if (!this.config.anchorSettings?.anchorClickable) {
      return;
    }

    if (
      !this.config.anchorSettings.enableAnchorOnDoneStep &&
      selectedStep.status == STEP_STATUS.done
    ) {
      return true;
    }

    if (selectedStep.index != this.currentStepIndex) {
      if (
        this.config.anchorSettings.enableAllAnchors &&
        this.config.anchorSettings.anchorClickable
      ) {
        this._showStep(selectedStep.index);
      } else {
        if (selectedStep.status == STEP_STATUS.done) {
          this._showStep(selectedStep.index);
        }
      }
    }

    return;
  }

  _showNextStep(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    // Find the next not disabled & hidden step
    let filteredSteps = this.filteredNextSteps;

    if (filteredSteps.length == 0) {
      return;
    } else {
      this._showStep(filteredSteps.shift()?.index || 0);
    }
  }

  _showPreviousStep(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    // Find the previous not disabled & hidden step
    let filteredSteps = this.filteredPreviousSteps;

    if (filteredSteps.length == 0) {
      if (!this.config.cycleSteps) {
        return;
      }

      this._showStep(this.steps.length - 1);
    } else {
      this._showStep(filteredSteps.pop()?.index || 0);
    }
  }

  _showStep(selectedStepIndex?: number) {
    // If step not found, skip
    if (
      selectedStepIndex === undefined ||
      selectedStepIndex >= this.steps.length ||
      selectedStepIndex < 0
    ) {
      return;
    }

    // If current step is requested again, skip
    if (selectedStepIndex == this.currentStepIndex) {
      return;
    }

    let selectedStep = this.steps.toArray()[selectedStepIndex];

    // If it is a disabled or hidden step, skip
    if (
      selectedStep.state == STEP_STATE.disabled ||
      selectedStep.state == STEP_STATE.hidden
    ) {
      return;
    }

    return this._isStepChangeValid(
      selectedStep,
      this.currentStep && this.currentStep.canExit
    )
      .toPromise()
      .then((isValid) => {
        if (isValid) {
          return this._isStepChangeValid(
            selectedStep,
            selectedStep.canEnter
          ).toPromise();
        }

        return of(isValid).toPromise();
      })
      .then((isValid) => {
        if (isValid) {
          // Load step content
          this._loadStepContent(selectedStep);
        }
      });
  }

  _finishWizard() {
    this.filteredAvailableSteps.forEach((step) => {
      step.status = STEP_STATUS.complete;

      if (step.state === STEP_STATE.error) {
        step.state = STEP_STATE.normal;
      }
    });

    this.wizardComplete = true;

    this.finished.emit();
  }

  private _isStepChangeValid(
    selectedStep: WizardStep,
    condition:
      | boolean
      | ((args: StepValidationArgs) => boolean)
      | ((args: StepValidationArgs) => Observable<boolean>)
  ): Observable<boolean> {
    if (typeof condition === typeof true) {
      return of(<boolean>condition);
    } else if (condition instanceof Function) {
      let direction = this._getStepDirection(selectedStep.index);
      let result = condition({
        direction: direction,
        fromStep: this.currentStep,
        toStep: selectedStep,
      });

      if (isObservable(result)) {
        return result;
      } else if (typeof result === typeof true) {
        return of(<boolean>result);
      } else {
        return of(false);
      }
    }

    return of(true);
  }

  _loadStepContent(selectedStep: WizardStep) {
    // Update controls
    this._setAnchor(selectedStep);

    // Trigger "stepChanged" event
    const args = <StepChangedArgs>{
      step: selectedStep,
      previousStep: this.currentStep,
      direction: this._getStepDirection(selectedStep.index),
      position: this._getStepPosition(selectedStep.index),
    };
    this.stepChanged.emit(args);
    this.wizardDataService.stepChanged(args);

    // Update the current index
    this.currentStepIndex = selectedStep.index;
    this.currentStep = selectedStep;
  }

  _setAnchor(selectedStep: WizardStep) {
    // Current step anchor > Remove other classes and add done class
    if (this.currentStep) {
      this.currentStep.status = STEP_STATUS.untouched;

      if (this.config.anchorSettings?.markDoneStep) {
        this.currentStep.status = STEP_STATUS.done;

        if (this.config.anchorSettings.removeDoneStepOnNavigateBack) {
          this.steps.forEach((step) => {
            if (step.index > selectedStep.index) {
              step.status = STEP_STATUS.untouched;
            }
          });
        }
      }
    }

    // Next step anchor > Remove other classes and add active class
    selectedStep.status = STEP_STATUS.active;
  }

  _extraButtonClicked(button: ToolbarButton) {
    if (button.event) {
      button.event();
    }
  }

  // HELPER FUNCTIONS
  _keyNav(event: KeyboardEvent) {
    // Keyboard navigation
    switch (event.which) {
      case 37:
        // left
        this._showPreviousStep(event);
        event.preventDefault();
        break;
      case 39:
        // right
        this._showNextStep(event);
        event.preventDefault();
        break;
      default:
        return; // exit this handler for other keys
    }
  }

  _getStepDirection(selectedStepIndex: number): STEP_DIRECTIN {
    return this.currentStepIndex != null &&
      this.currentStepIndex != selectedStepIndex
      ? this.currentStepIndex < selectedStepIndex
        ? STEP_DIRECTIN.forward
        : STEP_DIRECTIN.backward
      : STEP_DIRECTIN.none;
  }

  _getStepPosition(selectedStepIndex: number): STEP_POSITION {
    return selectedStepIndex == 0
      ? STEP_POSITION.first
      : selectedStepIndex == this.steps.length - 1
      ? STEP_POSITION.final
      : STEP_POSITION.middle;
  }

  _reset() {
    // Reset all elements and classes
    this.currentStepIndex = -1;
    this.currentStep = this.steps.toArray()[this.currentStepIndex];
    this._restoreStepStates();
    this._init();

    // Trigger "reseted" event
    this.reseted.emit();
  }

  _complete(event: any) {
    console.log('Finalizar processo ', event);
    this._finishWizard();
  }

  ngOnDestroy() {
    if (this.resetWizardWatcher) {
      this.resetWizardWatcher.unsubscribe();
    }

    if (this.showNextStepWatcher) {
      this.showNextStepWatcher.unsubscribe();
    }

    if (this.showPreviousStepWatcher) {
      this.showPreviousStepWatcher.unsubscribe();
    }

    if (this.showStepWatcher) {
      this.showStepWatcher.unsubscribe();
    }

    if (this.finishWizardWatcher) {
      this.finishWizardWatcher.unsubscribe();
    }
  }

  get firstStep(): boolean {
    return this.filteredPreviousSteps.length === 0;
  }

  get lastStep(): boolean {
    return this.filteredNextSteps.length === 0;
  }

  get filteredPreviousSteps() {
    return this.filteredAvailableSteps.filter(
      (step) =>
        step.index <
        (this.currentStepIndex == null
          ? this.steps.length
          : this.currentStepIndex)
    );
  }

  get filteredNextSteps() {
    return this.filteredAvailableSteps.filter(
      (step) =>
        step.index >
        (this.currentStepIndex == null ? -1 : this.currentStepIndex)
    );
  }

  get filteredAvailableSteps() {
    return this.steps.filter((step) => {
      return (
        step.state != STEP_STATE.disabled && step.state != STEP_STATE.hidden
      );
    });
  }

  get filteredNotHiddenSteps() {
    return this.steps.filter((step) => {
      return (
        step.state != STEP_STATE.hidden
      );
    });
  }
}

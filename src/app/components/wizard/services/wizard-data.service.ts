import { Inject, Optional, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { StepChangedArgs, WizardConfig } from '../utils/interfaces';
import { WIZARD_CONFIG_TOKEN } from '../config/wizard-config.token';
import { DEFAULT_CONFIG } from '../../wizard/utils/constants';
import { merge } from '../utils/functions';


@Injectable({
  providedIn: 'root'
})
export class WizardDataService {
  resetWizard$: Observable<any>;
  showNextStep$: Observable<any>;
  showPreviousStep$: Observable<any>;
  showStep$: Observable<number>;
  finishWizard$: Observable<any>;
  stepChangedArgs$: Observable<StepChangedArgs>;

  private _resetWizard: Subject<any>;
  private _showNextStep: Subject<any>;
  private _showPreviousStep: Subject<any>;
  private _showStep: Subject<number>;
  private _finishWizard: Subject<any>;
  private _stepChangedArgs: Subject<StepChangedArgs>;
  private _defaultConfig: WizardConfig;

  constructor(@Optional() @Inject(WIZARD_CONFIG_TOKEN) private config: WizardConfig) {
    this._defaultConfig = { ...DEFAULT_CONFIG };
    if (this.config) {
      this._defaultConfig = merge(this._defaultConfig, this.config);
    }

    // Observable sources
    this._resetWizard = new Subject<any>();
    this._showNextStep = new Subject<any>();
    this._showPreviousStep = new Subject<any>();
    this._showStep = new Subject<any>();
    this._finishWizard = new Subject<any>();
    this._stepChangedArgs = new Subject<StepChangedArgs>();

    // Observable streams
    this.resetWizard$ = this._resetWizard.asObservable();
    this.showNextStep$ = this._showNextStep.asObservable();
    this.showPreviousStep$ = this._showPreviousStep.asObservable();
    this.finishWizard$ = this._finishWizard.asObservable();
    this.showStep$ = this._showStep.asObservable();
    this.stepChangedArgs$ = this._stepChangedArgs.asObservable();
  }

  getDefaultConfig(): WizardConfig {
    return { ...this._defaultConfig };
  }

  resetWizard() {
    this._resetWizard.next(null);
  }

  showNextStep() {
    this._showNextStep.next(null);
  }

  showPreviousStep() {
    this._showPreviousStep.next(null);
  }

  showStep(index: number) {
    this._showStep.next(index);
  }

  stepChanged(args: StepChangedArgs) {
    this._stepChangedArgs.next(args);
  }

  finishWizard() {
    this._finishWizard.next({});
  }
}

import { Injectable } from '@angular/core';
import { WizardDataService } from './wizard-data.service';
import { StepChangedArgs } from '../utils/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WizardService {
  constructor(
    private wizardDataService: WizardDataService
  ) {
  }

  reset() {
    this.wizardDataService.resetWizard();
  }

  next() {
    this.wizardDataService.showNextStep();
  }

  previous() {
    this.wizardDataService.showPreviousStep();
  }

  show(index: number) {
    this.wizardDataService.showStep(index);
  }

  finishWizard() {
    this.wizardDataService.finishWizard();
  }

  stepChanged(): Observable<StepChangedArgs> {
    return this.wizardDataService.stepChangedArgs$;
  }
}

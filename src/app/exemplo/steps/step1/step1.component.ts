import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
//import { of } from 'rxjs';
import { WizardComponent } from '../../../components/wizard/wizard/wizard.component';
import { WizardStep } from '../../../components/wizard/utils/interfaces';
import { STEP_STATE, STEP_STATUS } from 'src/app/components/wizard/utils/enums';

@Component({
  selector: 'pucx-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component implements OnInit {
  name = new FormControl('', Validators.required);

  constructor() {}

  ngOnInit(): void {
  }

  validateEntryToStep() {
    return true;
  }

  validateExitFromStep(step: WizardStep) {
    if (this.name.invalid) {
      step.state = STEP_STATE.error;
      return false;
    }

    step.state = STEP_STATE.normal;
    return true;
  }
}

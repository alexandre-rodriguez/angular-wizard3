import { Injectable, Type } from '@angular/core';
import { isObservable, Observable } from 'rxjs';
import { WizardConfig, StepValidationArgs } from '../../components/wizard/utils/interfaces';
import { STEP_STATE, THEME } from '../../components/wizard/utils/enums';
import { Step1Component } from '../steps/step1/step1.component';
import { Step2Component } from '../steps/step2/step2.component';
import { Step3Component } from '../steps/step3/step3.component';
import { Step4Component } from '../steps/step4/step4.component';
import { Step5Component } from '../steps/step5/step5.component';


@Injectable({
  providedIn: 'root'
})
export class ExemploService {
  constructor() {
  }

  config: WizardConfig = {
    selected: 0,
    theme: THEME.arrows,
    toolbarSettings: {
      toolbarExtraButtons: [
        {
          text: 'Finish',
          class: 'btn btn-info',
          event: () => alert('Finished!!!')
        },
      ]
    }
  };

  stepDefinitions: StepDefinition[] = [
    {
      title: 'Step 1',
      description: 'Step 1 description',
      component: Step1Component,
      canEnter: this.validateStep.bind(this, 'entry'),
      canExit: this.validateStep.bind(this, 'exit'),
    },
    {
      title: 'Step 2',
      description: 'Step 2 description',
      state: STEP_STATE.disabled,
      component: Step2Component,
    },
    {
      title: 'Step 3',
      description: 'Step 3 description',
      component: Step3Component,
      canEnter: this.validateStep.bind(this, 'entry'),
      canExit: this.validateStep.bind(this, 'exit'),
    },
    {
      title: 'Step 4',
      description: 'Step 4 description',
      component: Step4Component,
    },
    {
      title: 'Step 5',
      description: 'Step 5 description',
      state: STEP_STATE.hidden,
      component: Step5Component,
    },
  ];

  private validateStep(type: string, args: StepValidationArgs) {
    let step = type == 'entry' ? args.toStep : args.fromStep;
    let stepSpecificValidateMethod;

    if (step && step.componentRef) {
      stepSpecificValidateMethod = type == 'entry' ? step.componentRef.instance.validateEntryToStep : step.componentRef.instance.validateExitFromStep;
    }

    if (stepSpecificValidateMethod) {
      if (typeof stepSpecificValidateMethod === typeof true) {
        return <boolean>stepSpecificValidateMethod;
      }
      else if (stepSpecificValidateMethod instanceof Function) {
        stepSpecificValidateMethod = stepSpecificValidateMethod.bind(step.componentRef?.instance);
        let result = stepSpecificValidateMethod();

        if (isObservable(result)) {
          return (result as Observable<boolean>);
        }
        else if (typeof result === typeof true) {
          return <boolean>result;
        }
      }
    }

    return undefined;
  }
}

export interface StepDefinition {
  title: string;
  description: string;
  state?: STEP_STATE;
  component: Type<any>;
  canEnter?: any;
  canExit?: any;
}

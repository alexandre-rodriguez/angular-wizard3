import { Component, ComponentFactoryResolver, forwardRef, OnInit, ViewChild } from '@angular/core';

import { WizardStep } from '../utils/interfaces';
import { WizardStepContentDirective } from './directives/wizard-step-content.directive';
import { STEP_STATE } from '../utils/enums';

@Component({
  selector: 'pucx-step',
  templateUrl: './wizard-step.component.html',
  styleUrls: ['./wizard-step.component.scss'],
  providers: [
    { provide: WizardStep, useExisting: forwardRef(() => WizardStepComponent) }
  ]
})
export class WizardStepComponent extends WizardStep implements OnInit {
  @ViewChild(WizardStepContentDirective, { static: true })
  stepContent!: WizardStepContentDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    super();
  }

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent() {
    if (!this.component) {
      return;
    }

    let componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(this.component);

    this.stepContent.viewContainerRef.clear();
    this.componentRef =
      this.stepContent.viewContainerRef.createComponent(componentFactory);
  }
}

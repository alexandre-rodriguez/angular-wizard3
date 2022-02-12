import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[wizardStepContent]'
})
export class WizardStepContentDirective {
  constructor(
    public viewContainerRef: ViewContainerRef,
  ) {
  }
}

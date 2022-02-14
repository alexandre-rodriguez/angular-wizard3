import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {ToastModule} from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {InputSwitchModule} from 'primeng/inputswitch';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WizardModule } from './components/wizard/wizard.module';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { ExemploComponent } from './exemplo/exemplo.component';
import { Step1Component } from './exemplo/steps/step1/step1.component';
import { Step2Component } from './exemplo/steps/step2/step2.component';
import { Step3Component } from './exemplo/steps/step3/step3.component';
import { Step4Component } from './exemplo/steps/step4/step4.component';
import { Step5Component } from './exemplo/steps/step5/step5.component';
import { Step6Component } from './exemplo/steps/step6/step6.component';

@NgModule({
  declarations: [
    AppComponent,
    ExemploComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component,
    Step6Component,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    WizardModule,
    CdkStepperModule,
    ReactiveFormsModule,
    ToastModule,
    InputSwitchModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

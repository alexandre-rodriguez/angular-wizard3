import { ChangeDetectorRef, Component } from '@angular/core';
import { WizardService } from '../components/wizard/services/wizard.service';
import {
  WizardConfig,
  StepChangedArgs,
} from '../components/wizard/utils/interfaces';
import { StepDefinition, ExemploService } from './services/exemplo.service';
import { STEP_STATE } from '../components/wizard/utils/enums';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'pucx-exemplo',
  templateUrl: './exemplo.component.html',
  styleUrls: ['./exemplo.component.scss'],
  providers: [MessageService],
})
export class ExemploComponent {
  config: WizardConfig;
  stepDefinitions: StepDefinition[];

  checked: boolean = false;
  botaoExtra: boolean = false;

  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden,
  };

  selectedStepIndex: number = 0;

  constructor(
    private wizardService: WizardService,
    exemploService: ExemploService,
    private messageService: MessageService,
  ) {
    this.config = exemploService.config;
    this.stepDefinitions = exemploService.stepDefinitions;

    this.config.toolbarSettings!.toolbarExtraButtons = [];
  }

  ngOnInit() {
    if (this.config.selected) {
      this.selectedStepIndex = this.config.selected;
    }

    this.wizardService.stepChanged().subscribe({
      next: (args) => {
        console.log('catching step change - method 2');
      },
    });
  }

  stepChanged(args: StepChangedArgs) {
    this.selectedStepIndex = args.step.index;
    console.log('catching step change - method 1');
  }

  showPreviousStep(event?: Event) {
    this.wizardService.previous();
  }

  showNextStep(event?: Event) {
    this.wizardService.next();
  }

  chamaBotaoExtra(botao: number) {
    this.messageService.add({
      severity: 'info',
      summary: 'Botão Extra ' + botao,
      detail: 'Chamando o botão extra ' + botao,
    });
  }

  finishWizard() {
    this.messageService.add({
      severity: 'success',
      summary: 'Finalizar',
      detail: 'Finalizando o wizard',
    });
  }

  stepIndexSelected() {
    this.wizardService.show(this.selectedStepIndex);
  }

  handleChange(event: any) {
    this.stepDefinitions[4].state = event.checked
      ? this.stepStates.normal
      : this.stepStates.hidden;
  }

  handleBotaoExtra(event: any) {
    if (event.checked) {
      console.log('entrei');
      this.config.toolbarSettings?.toolbarExtraButtons?.push({
        text: 'Botão extra 1',
        class: 'btn btn-success',
        event: this.chamaBotaoExtra.bind(this, 1),
      }, {
        text: 'Botão extra 2',
        class: 'btn btn-warning',
        event: this.chamaBotaoExtra.bind(this, 2),
      });
    } else {
      this.config.toolbarSettings?.toolbarExtraButtons?.pop();
      this.config.toolbarSettings?.toolbarExtraButtons?.pop();
    }
  }
}

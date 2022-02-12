import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'pucx-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss']
})
export class Step3Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  validateEntryToStep = true;

  validateExitFromStep() {
    return of(true);
  }
}

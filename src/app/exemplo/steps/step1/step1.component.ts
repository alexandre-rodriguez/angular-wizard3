import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'pucx-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {

  constructor(
    ) {
    }

    ngOnInit(): void {
    }

    validateEntryToStep() {
      return true;
    }

    validateExitFromStep() {
      return of(true);
    }

}

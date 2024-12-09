import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit{
  reminder: boolean = true;

  constructor(private router: Router){}

  ngOnInit() {

    this.reminder = this.router.url == '/Remindlater' ? true : false;
  }
}

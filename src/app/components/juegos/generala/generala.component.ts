import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-generala',
  standalone: true,
  imports: [],
  templateUrl: './generala.component.html',
  styleUrl: './generala.component.css',
})
export class GeneralaComponent implements OnInit {
  ngOnInit() {
    window.scrollTo(0, 0);
  }
}

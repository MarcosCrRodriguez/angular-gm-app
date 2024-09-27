import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cubilete } from '../../models/cubilete';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quien-soy.component.html',
  styleUrl: './quien-soy.component.css',
})
export class QuienSoyComponent implements OnInit {
  email: string = 'rodriguezmarcoscruz@gmail.com';
  public cubilete: Cubilete = new Cubilete();

  ngOnInit() {
    window.scrollTo(0, 0);
  }
}

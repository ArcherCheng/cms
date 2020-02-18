import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  @Input() imageSrc = '';
  imageLoaded = false;

  constructor() {}

  ngOnInit(): void {
  }

  handleImageLoad() {
    this.imageLoaded = true;
  }

}

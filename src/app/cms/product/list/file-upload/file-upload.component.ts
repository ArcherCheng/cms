import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  @Input() parent: FormGroup;
  imageSrc = 'null';
  activeColor = 'green';
  baseColor = '#ccc';
  overlayColor = 'rgba(255,255,255,0.5)';
  dragging = false;
  loaded = false;
  imageLoaded = false;

  ngOnInit() {
    if (!!this.parent) {
      this.imageSrc = this.parent.value.file;
    }
  }

  handleDragEnter() {
    this.dragging = true;
  }

  handleDragLeave() {
    this.dragging = false;
  }

  handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e);
  }

  handleImageLoad() {
    this.imageLoaded = true;
  }

  handleInputChange(e) {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    const pattern = /image-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    this.loaded = false;
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    const reader = e.target;
    this.imageSrc = reader.result;
    this.loaded = true;
    this.parent.patchValue({
      file: this.imageSrc
    });
  }

  cancel() {
    this.imageSrc = '';
  }
}

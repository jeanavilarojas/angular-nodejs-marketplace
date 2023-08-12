import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-producto-pregunta',
  templateUrl: './producto-pregunta.component.html',
  styleUrls: ['./producto-pregunta.component.css']
})
export class ProductoPreguntaComponent implements OnInit {
  datos: any;
  datosDialog: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<ProductoPreguntaComponent>,
    private gService: GenericService
  ) {
    this.datosDialog = data;
  }

  ngOnInit(): void { }

  close() {
    //Dentro de close ()
    //this.form.value 
    this.dialogRef.close();
  }
}

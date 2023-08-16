import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-usuario-index',
  templateUrl: './usuario-index.component.html',
  styleUrls: ['./usuario-index.component.css']
})
export class UsuarioIndexComponent {
  id: number;
  usuario: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private gService: GenericService,
    private route: ActivatedRoute,
    private router: Router) {
    let id = this.route.snapshot.paramMap.get('id');
    this.id = +id;
    if (!isNaN(Number(this.id))) {
      this.obtenerUsuario(Number(this.id));
    }
  }

  obtenerUsuario(id: number) {
    this.gService
      .get('usuario', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.usuario = data;
      });
  }

  agregarDireccion(){
    this.router.navigate(['/direccion/crear']);
  }

  agregarMetodoPago(){
    this.router.navigate(['/metodopago/crear']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

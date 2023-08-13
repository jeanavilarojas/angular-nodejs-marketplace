import { Component, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';


@Component({
  selector: 'app-usuario-all',
  templateUrl: './usuario-all.component.html',
  styleUrls: ['./usuario-all.component.css']
})
export class UsuarioAllComponent {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = [
    'id',
    'nombre',
    'identificacion',
    'correo',
    'estado',
    'roles',
    'acciones',
  ];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gService: GenericService,
    private _liveAnnouncer: LiveAnnouncer,
    private notification: NotificacionService
  ) {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.gService
      .getAll('usuario')
      .pipe(takeUntil(this.destroy$))
      .subscribe((apiData: any) => {
        this.datos = apiData;
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  cambiarEstado(user: any) {
    this.gService
      .update('usuario/cambiarEstado', user)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.obtenerUsuarios();
        this.notification.mensaje(
          'Éxito',
          'El estado del usuario cambió',
          TipoMessage.success
        );
      });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

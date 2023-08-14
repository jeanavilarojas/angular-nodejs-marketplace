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
  selector: 'app-producto-all',
  templateUrl: './producto-all.component.html',
  styleUrls: ['./producto-all.component.css']
})
export class ProductoAllComponent {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['id', 'nombre', 'precio', 'cantidad', 'estado', 'vendedor', 'acciones'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gService: GenericService,
    private _liveAnnouncer: LiveAnnouncer,
    private notification: NotificacionService
  ) {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.gService
      .getAll('producto')
      .pipe(takeUntil(this.destroy$))
      .subscribe((apiData: any) => {
        this.datos = apiData;
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }
  
  // Direccionar a la página de detalle
  detalleProducto(id: number) {
    this.router.navigate(['/producto/detalle', id]);
  }

  // Editar el producto seleccionado
  actualizarProducto(id: number) {
    this.router.navigate(['/producto/actualizar', id]);
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

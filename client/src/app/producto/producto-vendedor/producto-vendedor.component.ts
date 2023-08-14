import { Component, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-producto-vendedor',
  templateUrl: './producto-vendedor.component.html',
  styleUrls: ['./producto-vendedor.component.css'],
})
export class ProductoVendedorComponent {
  id: number;
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['id', 'nombre', 'descripcion', 'precio', 'cantidad', 'acciones'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private gService: GenericService,
    private route: ActivatedRoute,
    private router: Router,
    private _liveAnnouncer: LiveAnnouncer) {
    let id = this.route.snapshot.paramMap.get('id');
    this.id = +id;
    if (!isNaN(Number(this.id))) {
      this.listaProductos(Number(this.id));
    }
  }

  // Listar los productos del vendedor llamando al API
  listaProductos(id: number) {
    this.gService
      .get('producto/vendedor', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.datos = data;
        this.dataSource = new MatTableDataSource(this.datos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  // Crear un producto nuevo
  crearProducto() {
    this.router.navigate(['/producto/crear']);
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

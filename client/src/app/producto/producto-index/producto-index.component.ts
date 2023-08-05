import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { GenericService } from 'src/app/share/generic.service';

@Component({
  selector: 'app-producto-index',
  templateUrl: './producto-index.component.html',
  styleUrls: ['./producto-index.component.css'],
})
export class ProductoIndexComponent {
  datos: any[] = []; // Respuesta del API con las categorías formateadas
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private gService: GenericService, private sanitizer: DomSanitizer, private router: Router) {
    this.listaProductos();
  }

  // Listar los productos llamando al API
  listaProductos() {
    this.gService
      .list('producto/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any[]) => {
        console.log(data);
        this.datos = data.map((producto) => ({
          ...producto,
          categoriasString: producto.categorias
            .map((categoria) => categoria.descripcion)
            .join(', '),
        }));
      });
  }

  // Obtener las fotos del producto
  getImageUrl(url) {
    const binary = atob(url);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const base64Image = 'data:image/jpeg;base64,' + btoa(String.fromCharCode.apply(null, bytes));
    return this.sanitizer.bypassSecurityTrustUrl(base64Image);
  }

  // Direccionar a la página de detalle
  detalleProducto(id: number) {
    this.router.navigate(['/producto-detalle', id]);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

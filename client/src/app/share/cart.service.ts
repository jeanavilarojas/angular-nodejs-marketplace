import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
// Definir clase con las propiedades que es necesario que gestione el carrito
export class ItemCart {
  idItem: number;
  product: any;
  cantidad: number;
  precio: number;
  subtotal: number;
}
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart = new BehaviorSubject<ItemCart[]>(null); //Definimos nuestro BehaviorSubject, este debe tener un valor inicial siempre
  public currentDataCart$ = this.cart.asObservable(); //Tenemos un observable con el valor actual del BehaviorSubject
  public qtyItems = new Subject<number>();
  constructor() {
    //Obtener los datos de la variable orden guardada en el localStorage
    this.cart = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('orden'))
    );
    //Establecer un observable para los datos del carrito
    this.currentDataCart$ = this.cart.asObservable();
  }

  saveCart(): void {
    localStorage.setItem('orden', JSON.stringify(this.cart.getValue()));
  }

  addToCart(producto: any) {
    const newItem = new ItemCart();
    //Armar instancia de ItemCart con los valores respectivos del producto
    //producto.id es cuando viene desde el boton comprar y trae la información del API
    newItem.idItem = producto.id | producto.idItem;
    newItem.precio = producto.precio;
    newItem.cantidad = 1;
    newItem.subtotal = this.calculoSubtotal(newItem);
    newItem.product = producto;
    //Obtenemos el valor actual
    let listCart = this.cart.getValue();
    //Si no es el primer item del carrito
    if (listCart) {
      //Buscamos si ya cargamos ese item en el carrito
      let objIndex = listCart.findIndex((obj) => obj.idItem == newItem.idItem);
      //Si ya cargamos uno aumentamos su cantidad
      if (objIndex != -1) {
        //Verificar que el producto tenga la propiedad cantidad
        if (producto.hasOwnProperty('cantidad')) {
          //Si la cantidad es menor o igual a 0 se elimina del carrito
          if (producto.cantidad <= 0) {
            this.removeFromCart(newItem);
            return;
          } else {
            //Actualizar cantidad
            listCart[objIndex].cantidad = producto.cantidad;
          }
        } else {
          //Actualizar la cantidad de un producto existente
          listCart[objIndex].cantidad += 1;
        }
        newItem.cantidad = listCart[objIndex].cantidad;
        listCart[objIndex].subtotal = this.calculoSubtotal(newItem);
      }
      //Si es el primer item de ese tipo se agrega al carrito
      else {
        listCart.push(newItem);
      }
    }
    //Si es el primer elemento del carrito se deb inicializar
    else {
      listCart = [];
      listCart.push(newItem);
    }
    this.cart.next(listCart); //Enviamos el valor al Observable
    //Actualizar la cantidad total de items del carrito
    this.qtyItems.next(this.quantityItems());
    //Actualizar la información en el localStorage
    this.saveCart();
  }

  //Calcula el subtotal del item del carrito que se indique
  private calculoSubtotal(item: ItemCart) {
    return item.precio * item.cantidad;
  }

  //Elimina un elemento del carrito
  public removeFromCart(newData: ItemCart) {
    //Obtenemos el valor actual de carrito
    let listCart = this.cart.getValue();
    //Buscamos el item del carrito para eliminar
    let objIndex = listCart.findIndex((obj) => obj.idItem == newData.idItem);
    if (objIndex != -1) {
      //Eliminamos el item del array del carrito
      listCart.splice(objIndex, 1);
    }
    this.cart.next(listCart); //Enviamos el valor al Observable
    //Actualizar la cantidad total de items del carrito
    this.qtyItems.next(this.quantityItems());
    //Actualizar la información en el localStorage
    this.saveCart();
  }

  //Obtener todos los items del carrito
  get getItems() {
    return this.cart.getValue();
  }

  //Gestiona el conteo de los items del carrito como un Observable
  get countItems(): Observable<number> {
    this.qtyItems.next(this.quantityItems());
    return this.qtyItems.asObservable();
  }

  setItems() {
    return this.cart.getValue();
  }

  quantityItems() {
    let listCart = this.cart.getValue();
    let sum = 0;
    if (listCart != null) {
      //Sumando las cantidades de cada uno de los items del carrito
      listCart.forEach((obj) => {
        sum += obj.cantidad;
      });
    }
    return sum;
  }

  //Calcula y retorna el total de los items del carrito
  public getTotal(): number {//Total antes de impuestos
    let total = 0;
    let listCart = this.cart.getValue();
    if (listCart != null) {
      //Sumando los subtotales de cada uno de los items del carrito
      listCart.forEach((item: ItemCart, index) => {
        total += item.subtotal;
      });
    }
    return total;
  }

  //Borra toda los items del carrito
  public deleteCart() {
    this.cart.next(null); //Enviamos el valor al Observable
    //Actualizar cantidad de items a 0
    this.qtyItems.next(0);
    //Actualizar la información en el localStorage
    this.saveCart();
  }
}

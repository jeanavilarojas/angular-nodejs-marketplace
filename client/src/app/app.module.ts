import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptorService } from './share/http-error-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { ShareModule } from './share/share.module';
import { DireccionModule } from './direccion/direccion.module';
import { MetodopagoModule } from './metodopago/metodopago.module';
import { PedidoModule } from './pedido/pedido.module';
import { ProductoModule } from './producto/producto.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    CoreModule,
    HomeModule,
    ShareModule,
    DireccionModule,
    MetodopagoModule,
    PedidoModule,
    ProductoModule,
    UsuarioModule,
    // Siempre de último
    AppRoutingModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptorService, multi: true
  },],
  bootstrap: [AppComponent],
})
export class AppModule { }

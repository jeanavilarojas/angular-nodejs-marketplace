import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { ShareModule } from './share/share.module';
import { PedidoModule } from './pedido/pedido.module';
import { ProductoModule } from './producto/producto.module';
import { UserModule } from './user/user.module';
import { UsuarioModule } from './usuario/usuario.module';

import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptorService } from './share/http-error-interceptor.service';

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
    PedidoModule,
    ProductoModule,
    UserModule,
    UsuarioModule,
     // Siempre de último
    AppRoutingModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, 
    useClass: HttpErrorInterceptorService, multi: true }, ],
  bootstrap: [AppComponent],
})
export class AppModule {}

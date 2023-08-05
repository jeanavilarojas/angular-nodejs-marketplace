import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';

@Component({
  selector: 'app-user-index',
  templateUrl: './user-index.component.html',
  styleUrls: ['./user-index.component.css']
})
export class UserIndexComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.router.navigate(['/usuario/login'], { relativeTo: this.route });
  }
}

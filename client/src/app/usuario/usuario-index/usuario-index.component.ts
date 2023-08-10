import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-usuario-index',
  templateUrl: './usuario-index.component.html',
  styleUrls: ['./usuario-index.component.css']
})
export class UsuarioIndexComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.router.navigate(['/usuario/login'], { relativeTo: this.route });
  }
}

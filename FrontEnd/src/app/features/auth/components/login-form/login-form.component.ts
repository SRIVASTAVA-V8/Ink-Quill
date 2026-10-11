import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { LoginData } from '../../../../models/user.model';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}
  LoginData: LoginData = {
    email: '',
    password: ''
  };

  onLogin() 
  {(this.auth.login( this.LoginData)).subscribe({    
     next: (user) => {
      console.log('Login successful:', user);
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      const safeReturnUrl = returnUrl?.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/';
      this.router.navigateByUrl(user.role === 'admin' ? '/admin/dashboard' : safeReturnUrl);
    },
    error: (err) => {
      console.error('Login failed:', err);
      alert('Login failed: ' + err.message);
    } 
  })
}
}

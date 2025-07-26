import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private role: string = '';

  login(role: string) {
    this.role = role; // e.g., 'HR', 'Manager'
    localStorage.setItem('userRole', role);
  }

  logout() {
    this.role = '';
    localStorage.removeItem('userRole');
  }

  getRole(): string {
    return localStorage.getItem('userRole') || '';
  }

  isHR(): boolean {
    return this.getRole() === 'HR';
  }

  isManager(): boolean {
    return this.getRole() === 'Manager';
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { AmplifyAuthService } from 'src/app/services/amplify-auth.service';
import { OnboardingStateService } from 'src/app/services/onboarding-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private amplifyAuthService: AmplifyAuthService, private router: Router, private stateService: OnboardingStateService) {

  }

  async ngOnInit() {
    this.initOnboardingState();
    if (await this.amplifyAuthService.checkAuthStatus()) {
      if (!this.stateService.currentOnboardingState.profileCompleted)
        this.router.navigate(['/profile'])
      else if (!this.stateService.currentOnboardingState.cameraPermissionsGranted)
        this.router.navigate(['/camera'])
      else 
        this.router.navigate(['/lobby'])
    }
  }

  initOnboardingState() {
    if (this.stateService.currentOnboardingState == null)
      this.stateService.currentOnboardingState = { cameraPermissionsGranted: false, profileCompleted: false, currentOnboardingProfile: {
        country: '',
        email: '',
        nickname: ''
      } }
  }
}
import { Component, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { Observable, of } from 'rxjs';
import { AmplifyAuthService } from 'src/app/services/amplify-auth.service';
import { OnboardingApiService } from './services/onboarding-api.service';
import { WebSocketService } from './services/websocket.service';
import { WebSocketActions } from './infrastructure/websocket/websocket.actions.enum';
import { UserProfileService } from './services/user-profile.service';
import { Router } from '@angular/router';
import { UserProfileDetails } from './shared/models/user-profile-details.model';
declare const FB: any; // Declare the FB object

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isLoggedIn: boolean = false;
  public isRegistered: boolean = false;
  public userName$: Observable<string | null> = of("")
  public currentYear: number = new Date().getFullYear();
  public lottieOptions: AnimationOptions = {
    path: '/assets/animations/flyingdarts_icon.json',
    loop: false
  };

  constructor(
    private router: Router,
    private amplifyAuthService: AmplifyAuthService, 
    private onboardingApiService: OnboardingApiService, 
    private webSocketService: WebSocketService,
    private userProfileService: UserProfileService) {
  }

  onAnimate(animationItem: AnimationItem): void {
    console.log(animationItem);
  }
  async ngOnInit() {
    // If authenticated with amplify authenticator
    var cognitoUser = await this.amplifyAuthService.getUser();
    if (!!cognitoUser) {
        // Fetch user profile for logged in user
        console.log("lol");
        this.onboardingApiService.getUserProfile(cognitoUser!.getUsername());
    }
    this.isLoggedIn = !!cognitoUser;

    // Subscribe on messages
    this.webSocketService.getMessages().subscribe(x=> {
      // Response from v2/user/profile/get
      if (x.action === WebSocketActions.UserProfileGet) {
        // Insert details into localStorage
        this.userProfileService.currentUserProfileDetails = x.message as UserProfileDetails;
        this.isRegistered = !!(x.message as UserProfileDetails)
      }
    })
    
    // Check if we have a profile stored already.
    if (this.userProfileService.currentUserProfileDetails) {
      // If so set the userName
      this.userName$ = of(this.userProfileService.currentUserProfileDetails.UserName);
    }
      
  }
  title = 'flyingdarts';

  public signOut(): void {
    this.amplifyAuthService.signOut();
  }

  openLoginOrRegister(): void {
    this.router.navigate(['/', 'onboarding', 'welcome', 'new-users'])
  }

  navigateTo(wher: number): void {
    switch(wher){
      case 1:
        this.router.navigate(['/', 'onboarding', 'welcome', 'new-users'])
        break;
      case 2:
        this.router.navigate(['/', 'onboarding', 'welcome', 'new-users', { outlets: { 'onboarding-outlet': ['profile']}}])
        break;
      case 3:
        this.router.navigate(['/', 'onboarding', 'welcome', 'new-users', { outlets: { 'onboarding-outlet': ['camera']}}])
        break;
    }

  }
}
export function isNullOrUndefined(value: any): boolean {
  return value == null || value == undefined
}
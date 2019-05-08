import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MainproviderProvider } from '../providers/mainprovider/mainprovider';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { LoginPage } from '../pages/login/login';
import { HelperProvider } from '../providers/helper/helper';
import { SignupPage } from '../pages/signup/signup';
import { ForgetpasswordPage } from '../pages/forgetpassword/forgetpassword';
import { IonicStorageModule } from '@ionic/storage';
import { VerificationPage } from '../pages/verification/verification';
import { SettingsPage } from '../pages/settings/settings';
import { GroupsPage } from '../pages/groups/groups';
import { FriendsPage } from '../pages/friends/friends';
import { CreategroupPage } from '../pages/creategroup/creategroup';
import { HttpModule, Http } from '@angular/http';
import { ChangepasswordPage } from '../pages/changepassword/changepassword';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ShoppinglistPage } from '../pages/shoppinglist/shoppinglist';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {ProgressBarModule} from "angular-progress-bar"
import { ProductsPage } from '../pages/products/products';
import { FriendlistPage } from '../pages/friendlist/friendlist';
import { ListdetailsPage } from '../pages/listdetails/listdetails';
import { CreatemenuPage } from '../pages/createmenu/createmenu';
import { PopoverPage } from '../pages/popover/popover';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    PopoverPage,
    MyApp,
    ListdetailsPage,
    CreatemenuPage,
    FriendlistPage,
    ProductsPage,
    FriendsPage,
    ShoppinglistPage,
    CreategroupPage,
    LoginPage,
    GroupsPage,
    VerificationPage,
    ChangepasswordPage,
    AboutPage,
    ForgetpasswordPage,
    SettingsPage,
    ContactPage,
    HomePage,
    SignupPage,
    TabsPage
  ],
  imports: [
    ProgressBarModule,
    IonicStorageModule.forRoot(),  
    HttpClientModule,
    NgxQRCodeModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    PopoverPage,
    CreatemenuPage,
    ListdetailsPage,
    MyApp,
    ProductsPage,
    ShoppinglistPage,
    CreategroupPage,
    GroupsPage,
    FriendsPage,
    ChangepasswordPage,
    SignupPage,
    FriendlistPage,
    ForgetpasswordPage,
    LoginPage,
    VerificationPage,
    AboutPage,
    ContactPage,
    SettingsPage,
    HomePage,
    TabsPage
  ],
  providers: [
    Camera,
    ImagePicker,
    BarcodeScanner,
    SocialSharing,
    InAppBrowser,
    HttpClient,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MainproviderProvider,
    HelperProvider
  ]
})
export class AppModule {}
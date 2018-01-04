import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Http, Headers, HttpModule } from '@angular/http';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileDropModule } from 'ngx-file-drop/lib/ngx-drop';
import { FileUploaderModule } from '@uniprank/ng2-file-uploader';
import { InputFileModule, InputFileOptions, InputFileRepository } from 'ngx-input-file';

import {
  MatAutocompleteModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatGridListModule,
  MatCardModule,
  MatStepperModule,
  MatTabsModule,
  MatExpansionModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatChipsModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatDialogModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatDialogRef
} from '@angular/material';

import { CdkTableModule } from '@angular/cdk/table';

import { DataSource } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { AppComponent } from './app.component';

import 'hammerjs';

import { UserService } from './service/user.service';
import { RESTService } from './service/rest.service';

import { IsOnlineGuard } from './guard/is-online.guard';

import { SignInComponent } from './authentications/sign-in/sign-in.component';
import { MenuComponent } from './top-bars/menu/menu.component';
import { HomeComponent, DialogOverviewExampleDialog } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { InfomationsComponent } from './students/infomations/infomations.component';
import { RegisterM1DialogComponent } from './dialog/register-m1-dialog/register-m1-dialog.component';
import { DashboardStudentComponent } from './students/dashboard-student/dashboard-student.component';
import { UploadImageComponent } from './students/upload-image/upload-image.component';

const studentRoute: Routes = [
  {
    path: 'info',
    component: InfomationsComponent,
  },
  {
    path: 'dashboard',
    component: DashboardStudentComponent
  },
  {
    path: 'image',
    component: UploadImageComponent
  }
];

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'student',
    children: studentRoute,
    canActivate: [IsOnlineGuard],
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'signin',
    component: SignInComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    MenuComponent,
    HomeComponent,
    FooterComponent,
    InfomationsComponent,
    RegisterM1DialogComponent,
    DialogOverviewExampleDialog,
    DashboardStudentComponent,
    UploadImageComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    FileDropModule,
    FileUploaderModule,
    InputFileModule
  ],
  exports: [
    InputFileModule
  ],
  providers: [
    RESTService,
    UserService,
    FormBuilder,
    IsOnlineGuard
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogOverviewExampleDialog]
})
export class AppModule { }

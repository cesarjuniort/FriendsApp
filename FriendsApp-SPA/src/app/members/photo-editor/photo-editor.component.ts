import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  // @Output() memberPhotoChange = new EventEmitter<string>();
  photoUrl: string;
  apiBaseUrl = environment.apiUrl;

  uploader: FileUploader; // = new FileUploader({ url: URL });
  hasBaseDropZoneOver = false;
  currentMainPhoto: Photo;

  constructor(private authService: AuthService, private alertify: AlertifyService,
    private userService: UserService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.apiBaseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true, // removes it from the display queue.
      autoUpload: false,
      maxFileSize: 10485760 // 10 MB
    });

    this.uploader.onAfterAddingFile = (f) => { f.withCredentials = false; } // fixes an issue with the component and Cors.

    // when the upload completes, push the new photo into the array so that is visible to the user without having to do a refresh.
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const photo = this.buildPhotoFromResponse(response);
      if (photo) {
        this.photos.push(photo);
      }
      if (photo.isMain) {
        this.authService.changeMemberPhoto(photo.url);
      }
    }
  }

  private buildPhotoFromResponse(rawResponse: string): Photo {
    if (rawResponse) {
      const res: Photo = JSON.parse(rawResponse);
      return {
        id: res.id,
        url: res.url,
        dateAdded: res.dateAdded,
        description: res.description,
        isMain: res.isMain
      };
    }
    return null;
  }

  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.id)
      .subscribe(next => {
        this.currentMainPhoto = this.photos.filter(p => p.isMain === true)[0];
        if (this.currentMainPhoto) {
          this.currentMainPhoto.isMain = false;
        }
        photo.isMain = true;
        // this.memberPhotoChange.emit(photo.url);
        this.authService.changeMemberPhoto(photo.url);
        this.alertify.success('Photo set to main successfully!');
      },
        error => { this.alertify.error(error); });
  }

  deletePhoto(photo: Photo) {
    this.alertify.confirm('Delete this photo?',
      () => {
        this.userService.deletePhoto(this.authService.decodedToken.nameid, photo.id).subscribe(
          () => { /* photo successfully deleted from the backend. */
            this.photos.splice(this.photos.findIndex(p => p.id === photo.id, 1));
            this.alertify.success('The photo was deleted successfully.');
          },
          (err) => { this.alertify.error(err) }
        )
      });
  }

}

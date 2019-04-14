import { Component, OnInit, Input } from '@angular/core';
import { Photo } from 'src/app/models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];

  apiBaseUrl = environment.apiUrl;

  uploader: FileUploader; // = new FileUploader({ url: URL });
  hasBaseDropZoneOver = false;


  constructor(private authService: AuthService) { }

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
    this.uploader.onSuccessItem = (item, response, status,headers) => {
      const photo = this.buildPhotoFromResponse(response);
      if(photo) {
        this.photos.push(photo);
      }
    }
  }

  private buildPhotoFromResponse(rawResponse: string): Photo {
    if(rawResponse) {
      const res: Photo = JSON.parse(rawResponse);
      return {
        id: res.id,
        url: res.url,
        dateAdded: res.dateAdded,
        description: res.description,
        isMain : res.isMain
      };
    }
    return null;
  }

}

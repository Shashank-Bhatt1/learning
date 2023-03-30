<div>
    <div class="block block-rounded block-bordered mt-3" x-data="{
            photoId: 0,
            photos: [],
            removePhoto(photoIndex) {
                this.photos.splice(photoIndex,1);
            }
        }">
        <div class="block-header block-header-default">
            <h3 class="block-title">{{__('Photos')}} <span x-text="'(' + photos.length + ')'"></span></h3>
        </div>
        <div class="block-content block-content-full" @image-uploaded.window="() => {
                    let filename = $event.detail.name.substring(0, $event.detail.name.lastIndexOf('.')) || $event.detail.name;
                    
                    photos.push({
                        id: photoId,
                        name: filename,
                        label: $event.detail.name,
                        url: $event.detail.url,
                    });
                    photoId++;
                }">
            <form id="upload-photo-form">
                <div id="dropbox-3" x-data="dragdrop" @dragover.prevent="dragOverHandler(event)"
                    @dragenter.prevent="dragOverHandler(event)" @dragleave="dragLeaveHandler()"
                    @drop.prevent="dropHandler(event,'image',['jpg','jpeg','png'])" :class="dropping ? 'bg-primary-light':'bg-body'">
                    
                    <label for="image-upload" class="btn btn-primary">
                        <i class="fa-solid fa-cloud-arrow-up"></i>  {{__('Upload')}}</label>
                    <input type="file" class="form-control visually-hidden" id="image-upload" multiple
                        @change="fileUploaded($event,'image',['jpg','jpeg','png'])"
                        accept="image/*"/>
                </div>
            </form>
            <div class="media-grid-parent small-grid my-3">
                <template x-for="(photo,photoIndex) in photos" :key="photo.id">
                    <div class="media-grid-child rounded-3 overflow-hidden shadow no-containment">
                        <div class="card h-100 border-0">
                            <div class="card-body text-center bg-body ratio ratio-4x3 flex-grow-0">
                                <div class="d-flex align-items-center justify-content-center">
                                    <img :src="photo.url" alt="photo" class="img-cover w-100 h-100" />
                                    <div class="card-img-overlay media-img-btn-overlay
                                        justify-content-end bg-black-10">
                                        <div class="dropdown">
                                            <div class="img-avatar img-avatar32" data-bs-toggle="dropdown">
                                                <button type="button" class="btn btn-secondary h-100 w-100 d-flex justify-content-center align-items-center" >
                                                    <i class="fa-solid fa-ellipsis-vertical"></i>
                                                </button>
                                            </div>
                                            <div class="dropdown-menu">
                                                <div class="dropdown-item bg-transparent">
                                                    <h4 class="mb-0 fw-normal">Filename.jpg</h4>
                                                </div>
                                                <ul class="list-unstyled">
                                                    <li>
                                                        <a class="dropdown-item" href="javascript:void(0)">
                                                            <i class="fa-solid fa-pen fa-fw me-1"></i> {{__('Rename')}}
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a class="dropdown-item" href="javascript:void(0)">
                                                            <i class="fa-solid fa-download fa-fw me-1"></i> {{__('Download')}}
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a class="dropdown-item" href="javascript:void(0)" @click="removePhoto(photoIndex)">
                                                            <i class="far fa-trash-alt fa-fw me-1"></i> {{__('Delete')}}
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <h6 class="card-subtitle mb-0" x-text="photo.label"></h6>
                                <p class="card-text">1 week ago</p>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</div>


@push('beforealpinescript')
    <script src="{{Module::asset('pim:js/dragdrop.js')}}"></script>
@endpush

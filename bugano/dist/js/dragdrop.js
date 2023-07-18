document.addEventListener('alpine:init', () => {
    Alpine.data('dragdrop', () => ({
        dropping: false,
        dragOverHandler(event) {
            event.preventDefault();
            this.dropping = true;
        },
        dragLeaveHandler() {
            this.dropping = false
        },
        fileUploaded(event,fileType,extensions) {
            if(! event.target.files.length) return;

            for(let i = 0; i < event.target.files.length; i++) {
                let file = event.target.files[i];
                this.fileValidate(file,fileType,extensions);
            }
        },
        bytesToMegaBytes(bytes) {
            return (bytes / (1024*1024)).toFixed(2);
        },
        validateFileSize(file) {
            let fileSizeInMb = this.bytesToMegaBytes(file.size);
            console.log(fileSizeInMb);
            if(fileSizeInMb > 10) {
                alert('File size should be less than 10MB');
                return false;
            }
            return true;
        },
        validateFileExtensions(file,fileType,extensions) {
            let fileExtension = file.name.split('.').pop(),
                eventName = fileType + '-uploaded';

            if(extensions.indexOf(fileExtension) >= 0) {
               
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (readEvent) => {
                    let fileEvent = new CustomEvent(eventName, {
                        detail: {
                            name: file.name,
                            url:  readEvent.target.result
                        }
                    });
                    window.dispatchEvent(fileEvent);
                }
                
            } else {
                alert('only ' + extensions +  ' files are allowed')
            }
        },
        fileValidate(file,fileType,extensions) {
            if(this.validateFileSize(file))
                this.validateFileExtensions(file,fileType,extensions);
            
        },
        dropHandler(event,fileType,extensions) {
            if(event.dataTransfer.items) {
                [...event.dataTransfer.items].forEach((item,i) => {
                    if (item.kind === 'file') {
                        let file = item.getAsFile();
                        this.fileValidate(file,fileType,extensions);
                    }
                })
            } else {
                [...event.dataTransfer.files].forEach((file, i) => {
                    
                    this.fileValidate(file,fileType,extensions);
                });
            }
            this.dropping = false;
        } 

    }))
});
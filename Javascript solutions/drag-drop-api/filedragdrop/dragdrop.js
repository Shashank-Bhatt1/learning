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
        fileValidate(file,fileType,extensions) {
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
                console.log('only ' + extensions +  ' files are allowed')
            }
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
})
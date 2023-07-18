//set backgrouds
document.addEventListener('alpine:init', () => {

    Alpine.data('backgrounds', () => ({
        backgroundSearch: '',
        init() {

            this.$dispatch('set-bg-length', {backgrounds: this.backgrounds})
            this.$store.canvas.initFabricCanvas();
        },
        isUploadBlockVisible: false,
        hideUploadBlock() {
            this.isUploadBlockVisible = false;
        },
        showUploadBlock() {
            this.isUploadBlockVisible = true;
        },
        tempBackground: {},
        removeTempBackground() {
            this.tempBackground = {};
        },
        selectedBackground: null,
        placedBackground: null,
        backgrounds: [
            {id: 'background-1', url: 'images/backgrounds/Mask Group 7.png', label: 'blue background'},
            {id: 'background-2', url: 'images/backgrounds/Mask Group 8.png', label: 'pink background'},
            {id: 'background-3', url: 'images/backgrounds/Mask Group 6.png', label: 'yellow background'},
            {id: 'background-4', url: 'images/backgrounds/Mask Group 9.png', label: 'indigo background'},
            {id: 'background-5', url: 'images/backgrounds/Mask Group 10.png', label: 'green background'},
            {id: 'background-6', url: 'images/backgrounds/Mask Group 11.png', label: 'coffee background'},
            {id: 'background-7', url: 'images/backgrounds/Mask Group 12.png', label: 'red background'},
            {id: 'background-8', url: 'images/backgrounds/Mask Group 13.png', label: 'purple background'},
        ],
        selectBackground(id,url) {
            this.selectedBackground = id;
            this.$store.canvas.setCanvasBackground(url);
        },
        addBackground() {
            if(this.tempBackground.url) {
                this.backgrounds.unshift({
                    id: 'background-' + (this.backgrounds.length + 1),
                    url: this.tempBackground.url,
                    label: this.tempBackground.label
                })
                this.isUploadBlockVisible = false;
                
            }
        },
        filterBackground() {
            this.backgrounds.forEach((background) => {
                if(!(background.label.includes(this.backgroundSearch))) {
                    background.hidden = true;
                } else {
                    background.hidden = false;
                }
            })
        },
        
    }));

    
});
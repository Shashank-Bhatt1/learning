document.addEventListener('alpine:init', () => {
    Alpine.data('fonts', () => ({
        uploadedFontId: 0,
        defaultFonts: [
            {id: 0, name: 'Arial'},
            {id: 1, name: 'Verdana'},
            {id: 2, name: 'Tahoma'},
            {id: 3, name: 'Trebuchet MS'},
            {id: 4, name: 'Times New Roman'},
            {id: 5, name: 'Georgia'},
            {id: 6, name: 'Garamond'},
            {id: 7, name: 'Courier New'},
            {id: 8, name: 'Brush Script MT'}
        ],
        enteredText: '', 
        uploadedFonts: [],
        removeFonts(fontIndex) {
            this.uploadedFonts.splice(fontIndex,1);
        },
        selectedFont: '',
        setSelectedFont(font) {
            this.selectedFont = font;
            this.$store.canvas.setLabelFont(font);
        },
        isConfigurationBlockVisible: false,
        showConfigurationBlock() {
            this.isConfigurationBlockVisible = true
        },
        hideConfigurationBlock() {
            this.isConfigurationBlockVisible = false
        },
        addLabel(text) {
            this.$store.canvas.addLabelToCanvas(text);
            this.enteredText = '';
        },
        uploadedFontUrl: '',
        uploadedFontName: '',
        uploadedFontLabel: '',
        getUploadText() {
            return this.uploadedFontLabel || 'Select your Font and/or save it to favorite';
        },
        trigger: {
            ['@font-uploaded.window'](event) {
                this.uploadedFontName = event.detail.name.substring(0, event.detail.name.lastIndexOf('.')) || event.detail.name;
                this.uploadedFontLabel = event.detail.name;
                this.uploadedFontUrl = event.detail.url;
                
                let newFont = new FontFace(this.uploadedFontName, 'url(' + this.uploadedFontUrl + ')');

                newFont.load().then(function(loadedFont) {
                    document.fonts.add(loadedFont);
                }).catch(function(error) {
                    console.log('Failed to load font: ' + error)
                })
                
                
            }
        },
        addUploadedFonts() {
            if (this.uploadedFonts.length === 0) {
                this.uploadedFonts.push({
                    id: this.uploadedFontId,
                    name: this.uploadedFontName,
                    label: this.uploadedFontLabel
                });
                this.uploadedFontId++;
            } else if (this.uploadedFonts.length && !(this.uploadedFonts.some(obj => obj.name === this.uploadedFontName))) {
                this.uploadedFonts.push({
                    id: this.uploadedFontId,
                    name: this.uploadedFontName,
                    label: this.uploadedFontLabel
                });
                this.uploadedFontId++;
            }
        }, 
        selectedLabelSize: null,
        labelSizes: [
            { id: 1, label: 'XS', scale: 0.25 },
            { id: 2, label: 'S', scale: 0.5 },
            { id: 3, label:'M', scale: 1 },
            { id: 4, label: 'L', scale: 1.5 },
            { id: 5, label: 'XL', scale: 2 },
            { id: 6, label: 'XXL', scale: 3 }
        ],
        getSelectedScale() {
            if(this.selectedLabelSize) {
                return this.labelSizes.find(labelSize => labelSize.label === this.selectedLabelSize).scale;
            }
            return 0;
        },
        toggleSelectedLabelSize() {
            if(this.selectedLabelSize) {
                const selectedLabelSizeObj = this.labelSizes.find(labelSize => labelSize.label === this.selectedLabelSize);
                const selectedLabelSizeIndex = this.labelSizes.indexOf(selectedLabelSizeObj);
                const nextIndex = (selectedLabelSizeIndex + 1) % this.labelSizes.length;
            
                this.selectedLabelSize = this.labelSizes[nextIndex].label;

            } else {
                this.selectedLabelSize = 'XS';
            }
        },
        sizeHandler() {
            this.toggleSelectedLabelSize();
        },
       

    }))
})
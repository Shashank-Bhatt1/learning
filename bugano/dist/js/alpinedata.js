var container = document.getElementById('canvas-holder');
var circle = document.getElementById('colorpicker-circle');
var canvas = document.getElementById('colorpicker');

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

    //backgrounds

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

    
    //shapes

    Alpine.data('shapes', () => ({
        shapeSearch: '',
        isUploadBlockVisible: false,
        init() {
            this.$dispatch('set-shapes-length', {shapes: this.shapes})
        },
        isConfigurationBlockVisible: false,
        hideUploadBlock() {
            this.isUploadBlockVisible = false;
        },
        showUploadBlock() {
            this.isUploadBlockVisible = true;
        },
        showConfigurationBlock() {
            this.isConfigurationBlockVisible = true
        },
        hideConfigurationBlock() {
            this.isConfigurationBlockVisible = false
        },
        tempShape: {},
        removeTempShape() {
            this.tempShape = {};
        },
        selectedShape: null,
        placedShape: null,
        shapes: [
            {id: 'shape-1', url: 'images/shapes/shape-1.svg', label: 'cone'},
            {id: 'shape-2', url: 'images/shapes/shape-2.svg', label: 'fire works' },
            {id: 'shape-3', url: 'images/shapes/shape-3.svg', label: 'fire works with stars'},
            {id: 'shape-4', url: 'images/shapes/shape-4.svg', label: 'stars' },
            {id: 'shape-5', url: 'images/shapes/shape-5.svg', label: 'halftone' },
            {id: 'shape-6', url: 'images/shapes/shape-6.svg', label: 'year welcome 2023' },
            {id: 'shape-7', url: 'images/shapes/shape-7.svg', label: 'rounded design with dots' },
            {id: 'shape-8', url: 'images/shapes/shape-8.svg', label: 'man celebrating with fireworks' },
            {id: 'shape-9', url: 'images/shapes/shape-9.svg', label: 'kiss' },
            {id: 'shape-10', url: 'images/shapes/shape-10.svg', label: 'shooting star' },
            {id: 'shape-11', url: 'images/shapes/shape-11.svg', label: 'nature with sea shrore'},
            {id: 'shape-12', url: 'images/shapes/shape-12.svg', label: 'anniversary'}
        ],
        selectShape(id,url) {
            this.showConfigurationBlock();
            this.selectedShape = id;
            this.$store.canvas.addShapeToCanvas(url);
        },
        addShape() {
            if(this.tempShape.url) {
                this.shapes.unshift({
                    id: 'background-' + (this.shapes.length + 1),
                    url: this.tempShape.url,
                    label:  this.tempShape.label
                })
                this.isUploadBlockVisible = false;
            }
        },
        filterShape() {
            this.shapes.forEach((shape) => {
                if(!(shape.label.includes(this.shapeSearch))) {
                    shape.hidden = true;
                } else {
                    shape.hidden = false;
                }
            })
        },
        selectedShapeSize: null,
        shapeSizes: [
            { id: 1, label: 'XS', scale: 0.25 },
            { id: 2, label: 'S', scale: 0.5 },
            { id: 3, label:'M', scale: 1 },
            { id: 4, label: 'L', scale: 1.5 },
            { id: 5, label: 'XL', scale: 2 },
            { id: 6, label: 'XXL', scale: 3 }
        ],
        getSelectedScale() {
            if(this.selectedShapeSize) {
                return this.shapeSizes.find(shapeSize => shapeSize.label === this.selectedShapeSize).scale;
            }
            return 0;
        },
        toggleSelecteShapeSize() {
            if(this.selectedShapeSize) {
                const selectedShapeSizeObj = this.shapeSizes.find(shapeSize => shapeSize.label === this.selectedShapeSize);
                const selectedShapeSizeIndex = this.shapeSizes.indexOf(selectedShapeSizeObj);
                const nextIndex = (selectedShapeSizeIndex + 1) % this.shapeSizes.length;
                this.selectedShapeSize = this.shapeSizes[nextIndex].label;

            } else {
                this.selectedShapeSize = 'XS';
            }
        },
        sizeHandler() {
            this.toggleSelecteShapeSize();
        },
    }));

    //fonts

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
            if (this.uploadedFontName && this.uploadedFonts.length === 0) {
                this.uploadedFonts.push({
                    id: this.uploadedFontId,
                    name: this.uploadedFontName,
                    label: this.uploadedFontLabel
                });
                this.uploadedFontId++;
            } else if (this.uploadedFontName && this.uploadedFonts.length && !(this.uploadedFonts.some(obj => obj.name === this.uploadedFontName))) {
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


    //colors
    Alpine.data('colors', () => ({
        hue: 0,
        saturation: 0,
        lightness: 0,
        updateOutputPosition() {
            document.documentElement.style.setProperty('--hue', this.hue);
        },
        init() {
           
        },
        
        updateRGBFromHue() {
            this.updateOutputPosition();
            let [h,s,l] = ColorUtils.rgbToHSL(this.red, this.green, this.blue);
            const newHue = this.hue;
            const [r,g,b] = ColorUtils.hslToRGB(newHue,s,l);
            
            this.red = r;
            this.green = g;
            this.blue = b;

            // this.saturation = s = Math.round(s);
            // this.lightness = l = Math.round(l);
            this.saturation = s;
            this.lightness = l;
            this.updateColorsInOtherModes('rgb');
            console.log('rgb updated')
            
        },
        updateColorsInOtherModes(mode) {
            //this alternate syntax can be used in place of get/set
            //el._x_model.set(Math.min(255, Math.max(0,  el._x_model.get())));
            let self = this;
            if(mode === 'rgb') {
                const [h,s,l] = ColorUtils.rgbToHSL(this.red, this.green, this.blue);
                // this.hue = h = Math.round(h);
                // this.lightness = l = Math.round(l);
                // this.saturation = s = Math.round(s);
                this.hue = h;
                this.lightness = l;
                this.saturation = s;
                this.updateOutputPosition();
                console.log('hsl updated');

                const [c,m,y,k] = ColorUtils.rgbToCMYK(this.red, this.green, this.blue)
                this.cyan = c;
                this.magenta = m;
                this.yellow = y;
                this.key = k;

                const hex = ColorUtils.rgbToHEX(this.red, this.green, this.blue)
                this.hex = hex;
            } else if (mode === 'cmyk') {
                const [h,s,l] = ColorUtils.cmykToHSL(this.cyan, this.magenta, this.yellow,this.key);
                this.hue = h;
                this.lightness = l;
                this.saturation = s;
                this.updateOutputPosition();
                console.log('hsl updated');

                const [r,g,b] = ColorUtils.cmykToRGB(this.cyan, this.magenta, this.yellow,this.key);
                this.red = r;
                this.green = g;
                this.blue = b;

                const hex = ColorUtils.cmykToHEX(this.cyan, this.magenta, this.yellow,this.key);
                this.hex = hex;
            } else if (mode === 'hex') {
                if(this.isHexCode(this.hex)) {
                    const [h,s,l] = ColorUtils.hexToHSL(this.hex);
                    this.hue = h;
                    this.lightness = l;
                    this.saturation = s;
                    this.updateOutputPosition();
                    console.log('hsl updated');

                    const [c,m,y,k] = ColorUtils.hexToCMYK(this.hex);
                    this.cyan = c;
                    this.magenta = m;
                    this.yellow = y;
                    this.key = k;

                    const [r,g,b] = ColorUtils.hexToRGB(this.hex);
                    this.red = r;
                    this.green = g;
                    this.blue = b;
                }

            }
            
        }, 
        lastColorId: 8,
        colors: [],
        addColor(color) {
            let id = this.lastColorId;
            this.colors.push({
                id: id,
                color: color
            });
            this.lastColorId++;
        },
        removeColor(colorIndex) {
            this.colors.splice(colorIndex,1);
        },
        defaultColors: [
            {id: 0, color: '#1ABC9C'},
            {id: 1, color: '#2ECC71'},
            {id: 2, color: '#3498DB'},
            {id: 3, color: '#9B59B6'}, 
            {id: 4, color: '#34495E'},
            {id: 5, color: '#F1C40F'},
            {id: 6, color: '#E67E22'},
            {id: 7, color: '#E74C3C'}
        ],
        currentTextColorObj: {},
        setTextColor(color) {
            this.currentTextColorObj.color = color.color;
            this.currentTextColorObj.id = color.id;
            this.$store.canvas.setLabelColor(color.color);
        },
        _red: 0,
        get red() {
            return this._red;
        },
        set red(val) {
            this._red = Math.min(255, Math.max(0, val))
        },
        _green: 0,
        get green() {
            return this._green;
        },
        set green(val) {
            this._green = Math.min(255, Math.max(0, val))
        },
        _blue: 0,
        get blue() {
            return this._blue;
        },
        set blue(val) {
            this._blue = Math.min(255, Math.max(0, val))
        },

        _cyan: 0.0000,
        get cyan() {
            return this._cyan;
        },
        set cyan(val) {
            this._cyan = Math.min(100, Math.max(0, val))
        },
        _magenta: 0.0000,
        get magenta() {
            return this._magenta;
        },
        set magenta(val) {
            this._magenta = Math.min(100, Math.max(0, val))
        },

        _yellow: 0.0000,
        get yellow() {
            return this._yellow;
        },
        set yellow(val) {
            this._yellow = Math.min(100, Math.max(0, val))
        },

        _key: 1.0000,
        get key() {
            return this._key;
        },
        set key(val) {
            this._key = Math.min(100, Math.max(0, val))
        },  
        _hex: '#000000',
        get hex() {
            return this._hex;
        },
        set hex(val) {
            this._hex = val;
        },
        hexCheck() {
            this.hex = this.isHexCode(this.hex) ? this.hex : '#000000';
            this.updateColorsInOtherModes('hex');
        },
        isHexCode(hexcode) {
            return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexcode)
        },

        get selectedColor() {
            let color = `rgb(${this.red},${this.green},${this.blue})`;
            this.$store.canvas.setLabelColor(color);
            this.currentTextColorObj = {};
            return color;
        },
        colordatawrapper: {
            //get r,g and b color data from event emitted by nested elements
            // amd set them back to r, g and b values here for selectedcolor
            ['@color-selected'](event) {
                this.red = event.detail.r;
                this.green = event.detail.g;
                this.blue = event.detail.b;
                this.updateColorsInOtherModes('rgb')
            } 
        }

    }))


    //colorpicker

    Alpine.data('colorpicker', () => ({
        
        isMouseDown: false,
        
        init() {
            const [width, height] = [260, 260];
            [canvas.width, canvas.height] = [width, height];

            this.drawColors(canvas);
        },
        drawColors(canvas) {
            const context = canvas.getContext('2d',{ willReadFrequently: true });
            const {width, height} = canvas;
    
            //Colors - horizontal gradient
            const gradientH = context.createLinearGradient(0, 0, width, 0);
            gradientH.addColorStop(0, "rgb(255, 0, 0)"); // red
            gradientH.addColorStop(1/6, "rgb(255, 255, 0)"); // yellow
            gradientH.addColorStop(2/6, "rgb(0, 255, 0)"); // green
            gradientH.addColorStop(3/6, "rgb(0, 255, 255)");
            gradientH.addColorStop(4/6, "rgb(0, 0, 255)"); // blue
            gradientH.addColorStop(5/6, "rgb(255, 0, 255)");
            gradientH.addColorStop(1, "rgb(255, 0, 0)"); // red
            context.fillStyle = gradientH;
            context.fillRect(0, 0, width, height);
    
            //Shades - vertical gradient
            const gradientV = context.createLinearGradient(0, 0, 0, height);
            gradientV.addColorStop(0, "rgba(255, 255, 255, 1)");
            gradientV.addColorStop(0.5, "rgba(255, 255, 255, 0)");
            gradientV.addColorStop(0.5, "rgba(0, 0, 0, 0)");
            gradientV.addColorStop(1, "rgba(0, 0, 0, 1)");
            context.fillStyle = gradientV;
            context.fillRect(0, 0, width, height);
        },
        getCanvasPointCoordinates(event,canvas) {
            const rect = canvas.getBoundingClientRect();
            let x = event.clientX - rect.left; //x position within the element.
            let y = event.clientY - rect.top;  //y position within the element.
            
            //on clicking on last co-ordinate of canvas r,g and b are 0 and
            //hence incorrect data was returned so maximum is it's 1px less than width 
            x = Math.min(canvas.width, Math.max(0,x));
            y = Math.min(canvas.height, Math.max(0,y));
            
            return {x,y};
        },
        setCircleBorderColor(lightness) {
            const txtColor = lightness < 50 ? '#FFF' : '#000';
            circle.style.borderColor = txtColor;
        },
        pickColor(event, canvas, circle) {
            const context = canvas.getContext('2d',{ willReadFrequently: true });
            const {x, y} = this.getCanvasPointCoordinates(event,canvas)
            const imgData = context.getImageData(x, y, 1, 1);
            let [r, g, b] = imgData.data;
            const [h, s, l] = ColorUtils.rgbToHSL(r, g, b);
            this.setCircleBorderColor(l);
            canvas.dispatchEvent(new CustomEvent('color-selected', {
                bubbles: true,  detail: {r, g, b, h, s, l} 
            }));
        },
        updateCirclePosition(event,canvas,circle) {
            const {x, y} = this.getCanvasPointCoordinates(event,canvas)
            circle.style.top = (y - 0) + 'px';
            circle.style.left = (x - 0) + 'px';
        },
        wrapper: {
            ['@mousedown'](event) {
                this.isMouseDown = true;
            },
            ['@mouseup'](event) {
                this.isMouseDown = false;
                this.updateCirclePosition(event, canvas, circle);
                this.pickColor(event, canvas, circle)
            },
            ['@mousemove'](event) {
                if(this.isMouseDown) {
                    this.updateCirclePosition(event, canvas, circle)
                }
            },
            ['@mouseup.outside'](event) {
                if(this.isMouseDown) {
                    this.isMouseDown = false;
                    this.updateCirclePosition(event, canvas, circle)
                    this.pickColor(event, canvas, circle)
                }
            },
            ['@color-updated.window'](event) {
                const [h,s,l] = [event.detail.h,event.detail.s, event.detail.l];
                const leftpx =  ((h * canvas.width) / 360) + 'px',
                    toppx = ((100- l) * (canvas.height/100)) + 'px';
                this.setCircleBorderColor(l);
                //console.log(leftpx, toppx)
                circle.style.left = leftpx;
                circle.style.top = toppx;
                
            }
        },
            
    }))



});
document.addEventListener('alpine:init', () => {
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
            let [h,s,l] = this.rgbToHSL(this.red, this.green, this.blue);
            const newHue = this.hue;
            const [r,g,b] = this.hslToRGB(newHue,s,l);
            
            this.red = Math.round(r);
            this.green = Math.round(g);
            this.blue = Math.round(b);

            this.saturation = s = Math.round(s);
            this.lightness = l = Math.round(l);
            console.log('rgb updated')
            
        },
        updateHueFromRGB() {
            //this alternate syntax can be used in place of get/set
            //el._x_model.set(Math.min(255, Math.max(0,  el._x_model.get())));
            
            let [h,s,l] = this.rgbToHSL(this.red, this.green, this.blue);
            this.hue = h = Math.round(h);
            this.lightness = l = Math.round(l);
            this.saturation = s = Math.round(s);
            this.updateOutputPosition();
            console.log('hue updated')
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
        get selectedColor() {
            let color = `rgb(${this.red},${this.green},${this.blue})`;
            this.$store.canvas.setLabelColor(color);
            this.currentTextColorObj = {};
            return color;
        },
        rgbToHSL(r,g,b) {
            r /= 255;
            g /= 255;
            b /= 255;
            const l = Math.max(r, g, b);
            const s = l - Math.min(r, g, b);
            const h = s
                ? l === r
                ? (g - b) / s
                : l === g
                ? 2 + (b - r) / s
                : 4 + (r - g) / s
                : 0;
            return [
                60 * h < 0 ? 60 * h + 360 : 60 * h,
                100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
                (100 * (2 * l - s)) / 2,
            ];
        },
        hslToRGB(h, s, l) {
            s /= 100;
            l /= 100;
            const k = n => (n + h / 30) % 12;
            const a = s * Math.min(l, 1 - l);
            const f = n =>
              l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
            return [255 * f(0), 255 * f(8), 255 * f(4)];
        },
        colordatawrapper: {
            //get r,g and b color data from event emitted by nested elements
            // amd set them back to r, g and b values here for selectedcolor
            ['@color-selected'](event) {
                this.red = event.detail.r;
                this.green = event.detail.g;
                this.blue = event.detail.b;
                this.updateHueFromRGB()
            } 
        }

    }))
});
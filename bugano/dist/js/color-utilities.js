class ColorUtils {
    constructor() {}

    ////rgb to others
    static rgbToHSL(r,g,b) {
        //older method 
        // r /= 255;
        // g /= 255;
        // b /= 255;
        // const l = Math.max(r, g, b);
        // const s = l - Math.min(r, g, b);
        // const h = s
        //     ? l === r
        //     ? (g - b) / s
        //     : l === g
        //     ? 2 + (b - r) / s
        //     : 4 + (r - g) / s
        //     : 0;
        // return [
        //     60 * h < 0 ? 60 * h + 360 : 60 * h,
        //     100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
        //     (100 * (2 * l - s)) / 2,
        // ];
        //older method 
        const [h,s,l] =  chroma.rgb(r,g,b).hsl()
        return [
            isNaN(h) ? 0 : h,
            s * 100,
            l * 100
        ]
    }
    static rgbToCMYK(r,g,b) {
        const [c,m,y,k] = chroma.rgb(r,g,b).cmyk();
        return [
            Math.round(c*100),
            Math.round(m*100),
            Math.round(y*100),
            Math.round(k*100)
        ]
    }
    static rgbToHEX(r,g,b) {
        const hex = chroma.rgb(r,g,b).hex();
        return hex;
    }

    ////cmyk to others
    static cmykToHSL(c,m,y,k) {
        const [h,s,l] = chroma.cmyk(c/100,m/100,y/100,k/100).hsl();
        return [
            isNaN(h) ? 0 : h,
            s * 100,
            l * 100
        ]
    }
    static cmykToRGB(c,m,y,k) {
        const [r,g,b] = chroma.cmyk(c/100,m/100,y/100,k/100).rgb();
        return [r,g,b];
    }
    static cmykToHEX(c,m,y,k) {
        const hex = chroma.cmyk(c/100,m/100,y/100,k/100).hex();
        return hex;
    }

    ////hex to others

    static hexToHSL(hex) {
        const [h,s,l] = chroma.hex(hex).hsl();
        return [
            isNaN(h) ? 0 : h,
            s * 100,
            l * 100
        ]
    }

    static hexToCMYK(hex) {
        const [c,m,y,k] = chroma.hex(hex).cmyk();
        return [
            Math.round(c*100),
            Math.round(m*100),
            Math.round(y*100),
            Math.round(k*100)
        ]
    }
    static hexToRGB(hex) {
        const [r,g,b] = chroma.hex(hex).rgb();
        return [r,g,b];
    }

    //hsl to others
    static hslToRGB(h, s, l) {
        //older method 
        // s /= 100;
        // l /= 100;
        // const k = n => (n + h / 30) % 12;
        // const a = s * Math.min(l, 1 - l);
        // const f = n =>
        //   l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        // return [255 * f(0), 255 * f(8), 255 * f(4)];
        //older method 
        const [r,g,b] = chroma.hsl(h,s/100,l/100).rgb()
        return [r,g,b];
    }

    
    
}
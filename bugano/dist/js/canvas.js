//write this statement if js hot reloading needed withoout page refresj
// if(module.hot) {
//     module.hot.accept();
// }

var container = document.getElementById('canvas-holder');
var circle = document.getElementById('colorpicker-circle');
var canvas = document.getElementById('colorpicker');


document.addEventListener('alpine:init', () => {
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
            const [h, s, l] = this.rgbToHSL(r, g, b);
            this.setCircleBorderColor(l);
            canvas.dispatchEvent(new CustomEvent('color-selected', {
                bubbles: true,  detail: {r, g, b, h, s, l} 
            }));
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
                let [h,s,l] = [event.detail.h,event.detail.s, event.detail.l];
                let leftpx =  ((h * canvas.width) / 360) + 'px',
                    toppx = ((100- l) * (canvas.height/100)) + 'px';
                this.setCircleBorderColor(l);
                //console.log(leftpx, toppx)
                circle.style.left = leftpx;
                circle.style.top = toppx;
                
            }
        },
            
    }))
});


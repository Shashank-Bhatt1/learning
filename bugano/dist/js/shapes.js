//set shapes
document.addEventListener('alpine:init', () => {
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
});
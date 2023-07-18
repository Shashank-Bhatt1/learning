
document.addEventListener('alpine:init', () => {
    Alpine.store('canvas', {
        products: [
            {    
                id: 2,
                name: 'gr-5', 
                productImageUrl: 'images/product-gr5.svg', 
                overlapImageUrl: 'images/product-gr5-overlap.svg', 
                innerImageUrl: 'images/product-gr5-inner.svg',
                innerImageStrokeOnlyUrl: 'images/product-gr5-inner-strokeonly.svg', 
                tagImageUrl: 'images/gr5-tag.svg',
                tagCloneImageUrl: 'images/gr5-tag-cloned.svg',
                tagImageLeft: 4.12,
                tagImageTop: 37.25,
                tagImageWidth: 32.06,
                tagImageHeight: 45.50
           },
            {    id: 0,
                 name: 'gr-6', 
                 productImageUrl: 'images/product-gr6.svg', 
                 overlapImageUrl: 'images/product-gr6-overlap.svg', 
                 innerImageUrl: 'images/product-gr6-inner.svg',
                 innerImageStrokeOnlyUrl: 'images/product-gr6-inner-strokeonly.svg', 
                 tagImageUrl: 'images/gr6-tag.svg',
                 tagCloneImageUrl: 'images/gr6-tag-cloned.svg',
                 tagImageLeft: 6.20,
                 tagImageTop: 38.96,
                 tagImageWidth: 30.47,
                 tagImageHeight: 42.33
                 
                  
            },
            {   id: 1, 
                name: 'gr-7', 
                productImageUrl: 'images/product-gr7.svg', 
                overlapImageUrl: 'images/product-gr7-overlap.svg', 
                innerImageUrl: 'images/product-gr7-inner.svg',
                innerImageStrokeOnlyUrl: 'images/product-gr7-inner-strokeonly.svg', 
                tagImageUrl: 'images/gr7-tag.svg',
                tagCloneImageUrl: 'images/gr7-tag-cloned.svg',
                tagImageLeft: 5.24,
                tagImageTop: 50.32,
                tagImageWidth: 26.71,
                tagImageHeight: 39.32
            }
        ],
        canvasData: Alpine.$persist(''),
        selectedProduct: (function() {
            const urlParams = new URLSearchParams(window.location.search);
            const myProduct = urlParams.get('productKey');
            return myProduct || 'gr-6';
        })(),
        init() {
           
        },
        isDeletebtnDisabled: true,
        isInside3dView: false,
        enable3d() {
            const self = this, canvas =  window.__canvas;
            const product = this.getSelectedProductObj();
            this.isInside3dView = true;

            const clippedPathImageHeight = canvas.clipPath.getScaledHeight();
            const differenceInHeight = (canvas.height - clippedPathImageHeight)/2;

            

            window.__canvas.clone(function(clonedCanvas) {
                clonedCanvas.clipPath = null;

                window.clonedCanvas = clonedCanvas;

                const clonedCanvasObjects = clonedCanvas.getObjects();

                // clonedCanvasObjects.forEach(function(clonedCanvasObject,i) {

                //     console.log(clonedCanvasObject.top);

                //     const percentageFromClippedPath =  (clonedCanvasObject.top/clippedPathImageHeight)*100,
                //         topFromInnerShape = clonedCanvasObject.top - differenceInHeight,
                //         percentageFromInnerShape = (topFromInnerShape/clippedPathImageHeight)*100;
                //         console.log(percentageFromInnerShape);

                //     newObjTop = (percentageFromInnerShape*canvas.height)/100;

                //     console.log(newObjTop)

                //     clonedCanvasObject.set({
                //         clipPath: null,
                //         top: newObjTop,
                //     })
                //     clonedCanvas.renderAll()
                    
                // })

                fabric.Image.fromURL(product.tagCloneImageUrl,function(img) {
                    
                    img.scaleToWidth(clonedCanvas.width * (product.tagImageWidth/100));
                    
                    img.set({
                        left: clonedCanvas.width * product.tagImageLeft/100,
                        top: clonedCanvas.height - img.getScaledHeight()  
                    })
                    img.set({zIndex: 15})
                    clonedCanvas.add(img)

                    const url = clonedCanvas.toDataURL({
                        format: 'jpeg',
                        enableRetinaScaling: true,
                        multiplier: 1.4
                    });
                    //document.getElementById('canvasConvertedImage').src= url;
                    if(self.isInside3dView) {
                        window.dispatchEvent(new CustomEvent('toggle-3d', { detail: {
                            url: url,
                            topBottomTextureUrl: clonedCanvas.backgroundImage?.src
                        }, bubbles: true }));
                    }
                })

            })

        },    
        disable3d() {
            this.isInside3dView = false;
        },
        getSelectedProductObj() {
            return this.products.find(product => product.name === this.selectedProduct);
        },
        fitImageInCanvas(img,canvas) {
            if(img.width > img.height || img.width === img.height) {
                img.scaleToWidth(canvas.width)
                img.set({
                    left: 0,
                    top: (canvas.height - img.getScaledHeight()) /2
                })
            } else if(img.width < img.height || img.width === img.height) {
                img.scaleToHeight(canvas.height);
                img.set({
                    left:  (canvas.width - img.getScaledWidth()) /2,
                    top: 0
                })
            }
        },
        setCanvasClipPath(canvas) {
            const self = this, product = this.getSelectedProductObj();
            fabric.Image.fromURL(product.productImageUrl,function(img) {
                self.fitImageInCanvas(img,canvas);
                canvas.set({
                    clipPath: img
                })
                //canvas.add(img).renderAll()
                self.setCenter(img);
            });

            //this is for showing inner path
            fabric.Image.fromURL(product.innerImageStrokeOnlyUrl,function(img) {
                self.fitImageInCanvas(img, canvas);
                self.setCenter(img);
                self.preventInteraction(img)
                canvas.sendToBack(img)
                img.set({excludeFromExport: true, zIndex: 0})
                canvas.add(img)
                
            })
            
        },
        setCenter(obj) {
            //obj.center();
            window.__canvas.viewportCenterObject(obj)
            
        },
        preventInteraction(obj) {
            obj.set({
                // hasControls: false,
                // hasBorders: false,
                // lockMovementX: true,
                // lockMovementY: true,
                // lockScalingX: true,
                // lockScalingY: true,
                // lockRotation: true,
                selectable: false,
                evented: false
            })
        },
        addProductTagImage(canvas) {
            const self = this, product = this.getSelectedProductObj();
            fabric.Image.fromURL(product.tagImageUrl,function(img) {
                self.fitImageInCanvas(img,canvas);
                
                self.preventInteraction(img)
                img.set({
                    excludeFromExport: true,
                    zIndex: 15})
                canvas.add(img)
            })
        },
        addOverlapImage(canvas) {
            const self = this, product = this.getSelectedProductObj();
            fabric.Image.fromURL(product.overlapImageUrl,function(img) {
                self.fitImageInCanvas(img, canvas);
                self.setCenter(img);
                self.preventInteraction(img)
                img.set({excludeFromExport: true, zIndex: 15})
                canvas.add(img)
            })
        },
        removeObjectControls(obj) {
            obj.setControlsVisibility({
                ml: false,
                mt: false,
                mr: false,
                mb: false,
                // bl: false,
                // br: false,
                // tl: false,
                // tr: false
            })
        },
        getObjectsClipPathImg(canvas) {
            const self = this, product = this.getSelectedProductObj();
            return new Promise((resolve,reject) => {
                try {
                    fabric.Image.fromURL(product.innerImageUrl,function(img, isError) {
                        if(isError) {
                            reject('image could not be loaded');
                            return;
                        }
                        self.fitImageInCanvas(img,canvas);
                        img.set({
                            absolutePositioned: true
                        })
                        self.setCenter(img);
                        self.preventInteraction(img)
                        
                        resolve(img);
                    
                    })
                } catch {
                    reject('image could not be loaded')
                }
            })
        },
       
        layerColors: ['danger','black','success','primary'],
        layers: [],
        currentLayerId: 0,
        objectAddEvents(canvas,img) {
            const self = this;
            canvas.on('object:added',function(options) {
                const currentObj = options.target;
                currentObj.id = 'layer-' + self.currentLayerId;
                
                

                self.removeObjectControls(currentObj)
                if(currentObj.name === 'shape') {
                    currentObj.scaleToWidth(canvas.width/10 <= 50 ? 50 : canvas.width/10);

                    self.layers.push({
                        id: currentObj.id,
                        idNumeric: self.currentLayerId,
                        imageUrl: currentObj.getSrc(),
                        type: 'motive',
                        color: self.layerColors[self.currentLayerId%self.layerColors.length]
                    })
                    self.currentLayerId++;
                }
                if(currentObj.name === 'label') {
                    const size = Math.max(parseInt(canvas.width/25), 22);
                    currentObj.set("fontSize", size)
                    self.layers.push({
                        id: currentObj.id,
                        idNumeric: self.currentLayerId,
                        type: 'text',
                        color: self.layerColors[self.currentLayerId%self.layerColors.length]
                    })
                    self.currentLayerId++;
                }
                self.setCenter(currentObj)
                
                currentObj.setCoords().saveState();

                if(currentObj.name !== 'bgimage') {
                    currentObj.set({clipPath: img, zIndex: 2 });
                } else {
                    currentObj.set({zIndex: 0 });
                }
                self.sortObjects(canvas);
                
                //canvas.bringToFront(currentObj).renderAll();
            })
            canvas.on('object:removed',function(options) {
                const currentObj = options.target;
                const indexOfLayerToRemove = self.layers.findIndex(layer => layer.id === currentObj.id);
                (indexOfLayerToRemove >= 0) && self.layers.splice(indexOfLayerToRemove,1)

            })
        },
        objectSelectionEvents(canvas) {
            const self = this;
            canvas.on('selection:created',function(options) {
                self.isDeletebtnDisabled = false;
            }).on('selection:cleared',function(options) {
                self.isDeletebtnDisabled = true;
            })
        },
        objectModifyEvents(canvas,img) {
            const tempCanvasEl =  fabric.util.createCanvasElement(),
                            
            tempCanvasCtx = tempCanvasEl.getContext('2d',{ willReadFrequently: true }),
            tempCanvas = new fabric.Canvas(tempCanvasEl, {
                preserveObjectStacking: true,
                uniformScaling: true,
                enableRetinaScaling: false,
                width: canvas.width,
                height: canvas.height,
                
            });
            tempCanvas.clipPath = img;
            tempCanvasCtx.fillStyle = 'red';
            tempCanvas.add(img).renderAll()
            
            tempCanvasEl.style.zIndex = -1;
            tempCanvasEl.style.display = 'none';

            //appending in dom is not even necessary to getimagedata from canvas
            document.getElementById('product-canvas-holder').append(tempCanvasEl);    
        

            // using event system from fabric itself we can claim that this code will
            // be only executed once
            canvas.on('object:modified', function (options) {
                const currentObj = options.target;

                //console.log(currentObj.left, currentObj.top)

                //check if any of corners of object are not outside the inner image 
                //i.e by checking if it has pixel data below it
                const allowMove = Object.values(currentObj.aCoords).every((corner) => {
                    console.log(corner.x,corner.y)
                    const pxColor = tempCanvasCtx.getImageData(corner.x, corner.y, 1, 1).data;
                    return pxColor[3]
                })

                if(!allowMove && currentObj.name !== 'bgimage') {
                    //console.log( currentObj._stateProperties)
                    currentObj.set( {
                        top:  currentObj._stateProperties.top,
                        left: currentObj._stateProperties.left,
                        angle: currentObj._stateProperties.angle,
                        scaleX: currentObj._stateProperties.scaleX,
                        scaleY: currentObj._stateProperties.scaleY
                    })
                }
                currentObj.setCoords();
                currentObj.saveState();
                
            })
        },
        renderIcon(icon) {
            return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
                var size = this.cornerSize;
                ctx.save();
                ctx.translate(left, top);
                ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
                ctx.drawImage(icon, -size/2, -size/2);
                ctx.restore();
              }
        },
        addCustomRotationControl() {
            let self = this;
            fabric.Image.fromURL("images/rotate.svg",function(img, isError) {
                if(isError) {
                    console.log(isError);
                }
                img.scaleToWidth(20);
                const rotationIconDataUrl = img.toDataURL();
                const  rotationIcon = document.createElement('img');
               
                rotationIcon.src = rotationIconDataUrl;
    
                const mtr = new fabric.Control({
                    x: 0.5,
                    y: 0.5,
                    //offsetY: -16,
                    actionHandler: fabric.controlsUtils.rotationWithSnapping,
                    cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
                    withConnection: true,
                    actionName: 'rotate',
                    render: self.renderIcon(rotationIcon),
                    cornerSize: 20
                  });
                  
                fabric.Object.prototype.controls.mtr = mtr;
            });
        },
        addCustomDeleteControl() {
            let self = this;
            fabric.Image.fromURL("images/remove.svg",function(img, isError) {
                if(isError) {
                    console.log(isError);
                }
                img.scaleToWidth(20);
                const deleteIconDataUrl = img.toDataURL();
                const  deleteIcon = document.createElement('img');

                deleteIcon.src = deleteIconDataUrl;

                fabric.Object.prototype.controls.deleteControl =  new fabric.Control({
                    x: 0.5,
                    y: -0.5,
                    cursorStyle: 'pointer',
                    mouseUpHandler: self.openDeleteModal,
                    render: self.renderIcon(deleteIcon),
                    cornerSize: 20
                })
            })
        },
        addCustomSizeControls() {
            let self = this;
            fabric.Image.fromURL("images/size-down.svg",function(img, isError) {
                if(isError) {
                    console.log(isError);
                }
                img.scaleToWidth(20);
                const sizeDownIconDataUrl = img.toDataURL();
                const sizeDownIcon = document.createElement('img');
                sizeDownIcon.src = sizeDownIconDataUrl;

                fabric.Object.prototype.controls.sizeDownControl = new fabric.Control({
                    x: -0.5,
                    y: -0.5,
                    offsetY: 24,
                    cursorStyle: 'pointer',
                    render: self.renderIcon(sizeDownIcon),
                    mouseUpHandler: self.decreaseObjectSize,
                    cornerSize: 20
                })

            });

            fabric.Image.fromURL("images/size-up.svg",function(img, isError) {
                if(isError) {
                    console.log(isError);
                }
                img.scaleToWidth(20);
                const sizeUpIconDataUrl = img.toDataURL();
                const sizeUpIcon = document.createElement('img');
                sizeUpIcon.src = sizeUpIconDataUrl;

                fabric.Object.prototype.controls.sizeUpControl = new fabric.Control({
                    x: -0.5,
                    y: -0.5,
                    cursorStyle: 'pointer',
                    render: self.renderIcon(sizeUpIcon),
                    mouseUpHandler: self.increaseObjectSize,
                    cornerSize: 20
                })

            });
        },
        initFabricCanvas() {
            const canvas = window.__canvas = new fabric.Canvas('product-canvas', {
                preserveObjectStacking: true,
                uniformScaling: true,
                uniScaleTransform: true,
                backgroundColor: '#ffffff'
            });
            //this.enablePanning(canvas)
            this.setCanvasDimensions(canvas);
            
            this.initCanvasOperations(canvas);

            if(this.canvasData !== '') {
                //this.restoreCanvasData(canvas);
            }
            //this.canvas = canvas;
            
        },
        initCanvasOperations(canvas) {
            const self = this;
            this.setCanvasClipPath(canvas);
              
            //console.log(canvas.toDatalessJSON())
            this.addOverlapImage(canvas);
            this.addProductTagImage(canvas);


            const rect = new fabric.Rect({
                name: 'label',
                fill: 'red',
                width: 50,
                height: 50,
                statefullCache: true,
                zIndex: 2
            });
            
            this.getObjectsClipPathImg(canvas).then(function(img){
                self.objectAddEvents(canvas,img);
                self.objectSelectionEvents(canvas);

                //adding custom controls via custom control api
                self.addCustomRotationControl();
                self.addCustomDeleteControl();
                self.addCustomSizeControls();
                //self.objectModifyEvents(canvas,img);
                
                canvas.add(rect);
                
            }, function(error) {
                alert(error);
            });
            
        },
        setCanvasBackground(url) {
            const canvas = window.__canvas;
            fabric.Image.fromURL(url, (img) => {
                img.scaleToWidth(canvas.width);
                if(img.getScaledHeight() < canvas.height) {
                    img.scaleToHeight(canvas.height);
                }
                
                
                leftOffset = ((canvas.width - img.getScaledWidth()).toFixed(2))/2;
                topOffset = ((canvas.height - img.getScaledHeight()).toFixed(2))/2;
                
                img.set({
                    left: leftOffset,
                    top: topOffset,
                    name: 'bgimage'
                });
                canvas.backgroundImage = img;
                //canvas.add(img);

                canvas.renderAll();
            })
                
        },
        sortObjects(canvas) {
            canvas._objects.sort((a, b) => (a.zIndex > b.zIndex) ? 1 : -1);
            canvas.renderAll();
        },
        setCanvasDimensions(canvas) {
            //const ratio = canvas.getWidth() / canvas.getHeight();
            const containerSize = {
                width:  document.querySelector('.canvas-wrapper-container').offsetWidth,
                height:  document.querySelector('.canvas-wrapper-container').offsetWidth,
            }
           
            canvas.setDimensions(containerSize);
            canvas.renderAll();
        },
        
        resizeCanvas(canvas,event) {
            const containerSize = {
                width:  document.querySelector('.canvas-wrapper-container').offsetWidth,
                height:  document.querySelector('.canvas-wrapper-container').offsetWidth,
            }
            console.log(containerSize)
            if(containerSize.width === 0) {
                containerSize.width = containerSize.height = canvas.getWidth();
            }

            const newScale = containerSize.width / canvas.getWidth();
            // if(newScale === 0) {
            //     newScale = 1;
            // }
            const oldScale = canvas.getZoom();

            //console.log(newScale, oldScale);
            
            canvas.setDimensions(containerSize);
            canvas.setZoom(newScale * oldScale); 
            canvas.renderAll();
            //canvas.zoomToPoint(new fabric.Point(canvas.width / 2, canvas.height / 2), newScale * oldScale)
            //canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
        },
        zoomAmount: 1,
        zoomInCanvas() {
            const canvas = window.__canvas;
           
            this.zoomAmount += (25/100);
            canvas.zoomToPoint(new fabric.Point(canvas.width / 2, canvas.height / 2) ,this.zoomAmount);
        },
        zoomOutCanvas() {
            const canvas = window.__canvas;
            this.zoomAmount -= (25/100);
            canvas.zoomToPoint(new fabric.Point(canvas.width / 2, canvas.height / 2) ,this.zoomAmount);
        },
        isFullScreen: false,
        setFullScreenCanvas() {
            this.isFullScreen = !this.isFullScreen;
            
            window.dispatchEvent(new Event('resize'));
            

        },
        enablePanning(canvas) {
            canvas.on('mouse:down', function(opt) {
                const evt = opt.e;
                if (evt.altKey === true) {
                  this.isDragging = true;
                  this.selection = false;
                  this.lastPosX = evt.clientX;
                  this.lastPosY = evt.clientY;
                }
            });
            canvas.on('mouse:move', function(opt) {
                if (this.isDragging) {
                    const e = opt.e;
                    var vpt = this.viewportTransform;
                    vpt[4] += e.clientX - this.lastPosX;
                    vpt[5] += e.clientY - this.lastPosY;
                    this.requestRenderAll();
                    this.lastPosX = e.clientX;
                    this.lastPosY = e.clientY;
                }
            });
            canvas.on('mouse:up', function(opt) {
                // on mouse up we want to recalculate new interaction
                // for all objects, so we call setViewportTransform
                this.setViewportTransform(this.viewportTransform);
                this.isDragging = false;
                this.selection = true;
            });
        },
            
        addShapeToCanvas(url) {
            const canvas = window.__canvas;
            const shapeToAdd =  fabric.Image.fromURL(url,function(img) {
                img.name = 'shape';
                canvas.add(img);
            })
        },
        addLabelToCanvas(text) {
            const canvas = window.__canvas;
            const label = new fabric.IText(text);
            label.name = 'label'
            canvas.add(label);
        },
        increaseObjectSize() {
            const canvas = window.__canvas;
            const activeObj =  canvas.getActiveObject(),
                newScale = ((activeObj?.scaleX) + (activeObj?.scaleX/10));
            if(activeObj.getScaledWidth() < 200) {
                // activeObj.set({
                //     originX: 'left',
                //     originY: 'top',
                // })
                activeObj.scale(newScale)
            }
            canvas.fire('object:modified', {target: activeObj});
            canvas.renderAll();
        },
        decreaseObjectSize() {
            const canvas = window.__canvas;
            const activeObj =  canvas.getActiveObject(),
                newScale = ((activeObj?.scaleX) - (activeObj?.scaleX/10));
            if(activeObj.getScaledWidth() >= 50) {
                
                // activeObj.set({
                //     originX: 'left',
                //     originY: 'bottom',
                   
                // })
                activeObj.scale(newScale)
                
            }
            canvas.fire('object:modified', {target: activeObj});
            canvas.renderAll();
           
        },

        setHorizontalCenter() {
            const canvas = window.__canvas;
            const activeObj =  canvas.getActiveObject();
            if(activeObj) {
                window.__canvas.viewportCenterObjectH(activeObj)
            }
            //activeObj?.centerH();
        },
        setVerticalCenter() {
            const canvas = window.__canvas;
            const activeObj =  canvas.getActiveObject();
            if(activeObj) {
                window.__canvas.viewportCenterObjectV(activeObj)
            }

            //activeObj?.centerV();
        },
        setAngle(angle) {
            const canvas = window.__canvas;
            const activeObj =  canvas.getActiveObject();
            activeObj?.rotate(angle);
            canvas.renderAll();
        },
        openDeleteModal() {
            const deleteModal =  bootstrap.Modal.getOrCreateInstance(document.getElementById('objectDeleteConfirmModal'));
            deleteModal.show();
        },
        removeObject() {
            const canvas = window.__canvas;
            const activeObj =  canvas.getActiveObjects();
            canvas.discardActiveObject();
            canvas.remove(...activeObj);
            
        },
        setLabelColor(color) {
            const canvas = window.__canvas;
            const activeObj =  canvas.getActiveObject(),
                activeObjType = activeObj?.type;
            if(activeObjType === 'i-text') {
                activeObj.set({
                    fill:color
                });
                canvas.renderAll()
               
            }
        },
        setLabelFont(font) {
            const canvas = window.__canvas;
            const activeObj =  canvas.getActiveObject(),
                activeObjType = activeObj?.type;
           
            if(activeObjType === 'i-text') {
                activeObj.set({
                    fontFamily:font
                });
                canvas.renderAll()
            }
        },

        saveCanvasData(canvas) {
            console.log(JSON.stringify(canvas.toJSON()))
            this.canvasData = JSON.stringify(canvas.toJSON());
            console.log(this.canvasData);
        },
        restoreCanvasData(canvas) {
            canvas.loadFromJSON(this.canvasData);
        },
        saveCanvasAsImage() {
            
            
        }
    })
})
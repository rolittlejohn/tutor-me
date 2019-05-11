const ColorController = {
    boxContainer: null,
    animationToggleButton: null,
    boxAddButton: null,
    boxRemoveButton: null,
    clearBoxesButton: null,
    shouldAnimate: true,
    maxMargin: 450,
    rgbColorMax: 255,
    animationInterval: 10,
    leftToRightIntervals: [],
    topToBottomIntervals: [],

    initialize: function() {
        this.boxContainer = document.getElementById("box-container");
        this.boxAddButton = document.getElementById("box-add-button");
        this.boxRemoveButton = document.getElementById("box-remove-button");
        this.clearBoxesButton = document.getElementById("box-clear-button");
        this.animationToggleButton = document.getElementById("animation-toggle-button");
        this.boxAddButton.addEventListener("click", function() {
            ColorController.generateNewBox();
        });
        this.boxRemoveButton.addEventListener("click", function() {
            ColorController.removeLastAddedBox();
        });
        this.clearBoxesButton.addEventListener("click", function() {
            ColorController.clearBoxes();
        });
        this.animationToggleButton.addEventListener("click", function() {
            ColorController.toggleAnimation();
        });
    },

    /**
     * This method starts and stops box motion animation while also toggling the text of the animation toggle button.
     */
    toggleAnimation: function() {
        let animationButtonText = this.shouldAnimate ? "Start Animation" : "Stop Animation";
        this.shouldAnimate = !this.shouldAnimate;
        this.animationToggleButton.textContent = animationButtonText;
    },

    /**
     * This method removes the colored box added last from the box container.
     */
    removeLastAddedBox: function() {
        let colorBoxes = document.getElementsByClassName("color-box");
        if (colorBoxes.length > 0) {
            clearInterval(this.topToBottomIntervals[colorBoxes.length - 1]);
            clearInterval(this.leftToRightIntervals[colorBoxes.length - 1]);
            this.topToBottomIntervals.pop();
            this.leftToRightIntervals.pop();
            this.boxContainer.removeChild(colorBoxes[colorBoxes.length - 1]);
        }
    },

    /**
     * This method removes all colored boxes from the box container.
     */
    clearBoxes: function() {
        let colorBoxes = document.getElementsByClassName("color-box");
        for (let i = colorBoxes.length; i > 0; i--) {
            clearInterval(this.topToBottomIntervals[i - 1]);
            clearInterval(this.leftToRightIntervals[i - 1]);
            this.topToBottomIntervals.splice(i - 1);
            this.leftToRightIntervals.splice(i - 1);
            this.boxContainer.removeChild(colorBoxes[i - 1]);
        }
    },

    /**
     * This method generates an animated colored box and adds it to the box container.
     */
    generateNewBox: function() {
        // create initial color box
        let newColorBox = document.createElement("div");

        // add the usual color-box class to it
        newColorBox.classList.add("color-box");

        // add a random color to the box
        newColorBox.style.backgroundColor = this.generateRandomBoxColor();

        // determine random spot to place the box left to right
        newColorBox.style.marginLeft = this.generateRandomNumber(this.maxMargin) + "px";

        // determine random spot to place the box top to bottom
        newColorBox.style.marginTop = this.generateRandomNumber(this.maxMargin) + "px";

        // finally, add the box to the box container
        this.boxContainer.appendChild(newColorBox);

        // Now apply the never ending left to right motion
        this.applyLeftToRightMotion(newColorBox);

        // Finally apply the never ending top to bottom motion
        this.applyTopToBottomMotion(newColorBox);
    },

    /**
     * This method generates a random rgb style
     *
     * @return - a random rgb style in the format of: rgb(1, 2, 3)
     */
    generateRandomBoxColor: function() {
        let separator = ", ";
        let randomColor1 = this.generateRandomNumber(this.rgbColorMax);
        let randomColor2 = this.generateRandomNumber(this.rgbColorMax);
        let randomColor3 = this.generateRandomNumber(this.rgbColorMax);

        return "rgb(" + randomColor1 + separator + randomColor2 + separator + randomColor3 + ")"
    },

    /**
     * This method generates a random number in the range of 0 and the passed in max number (including the max itself)
     *
     * @return - a random number from 0 to the passed in max number
     */
    generateRandomNumber: function(maxNumberToGenerate) {
        return Math.floor(Math.random() * Math.floor(maxNumberToGenerate + 1));
    },

    /**
     * This method moves the passed in box left and right depending on if it has reached the border of the parent
     * container. For now, it is assumed that the parent in 500px by 500px.
     *
     * @param box - the box element to apply left to right animation to
     */
    applyLeftToRightMotion: function(box) {
        // Do we want to start this by moving right or left? Positive being true means to the right.
        let positiveMotion = this.generateRandomNumber(1) === 1;

        // Add a random start position for the box. Make sure it's not out of bounds
        let currentMargin = parseFloat(box.style.marginLeft);

        // Begin motion
        this.leftToRightIntervals.push(setInterval(function() {
                if (ColorController.shouldAnimate) {
                    if (positiveMotion) {
                        if (currentMargin !== ColorController.maxMargin) {
                            ColorController.moveBoxRight(box, currentMargin);
                            currentMargin = parseFloat(box.style.marginLeft);
                        } else {
                            positiveMotion = false;
                        }
                    } else {
                        if (currentMargin !== 0) {
                            ColorController.moveBoxLeft(box, currentMargin);
                            currentMargin = parseFloat(box.style.marginLeft);
                        } else {
                            positiveMotion = true;
                        }
                    }
                }
            }, this.animationInterval));
    },

    /**
     * This method moves the passed in box up and down depending on if it has reached the border of the parent
     * container. For now, it is assumed that the parent in 500px by 500px.
     *
     * @param box - the box element to apply top to bottom animation to
     */
    applyTopToBottomMotion: function(box) {
        // Do we want to start this by moving up or down? Positive being true means downwards.
        let positiveMotion = this.generateRandomNumber(1) === 1;

        // Add a random start position for the box. Make sure it's not out of bounds
        let currentMargin = parseFloat(box.style.marginTop);

        // Begin motion
        this.topToBottomIntervals.push(setInterval(function() {
                if (ColorController.shouldAnimate) {
                    if (positiveMotion) {
                        if (currentMargin !== ColorController.maxMargin) {
                            ColorController.moveBoxDown(box, currentMargin);
                            currentMargin = parseFloat(box.style.marginTop);
                        } else {
                            positiveMotion = false;
                        }
                    } else {
                        if (currentMargin !== 0) {
                            ColorController.moveBoxUp(box, currentMargin);
                            currentMargin = parseFloat(box.style.marginTop);
                        } else {
                            positiveMotion = true;
                        }
                    }
                }
            }, this.animationInterval));
    },

    /**
     * This method moves the passed in box to the right.
     *
     * @param box - the box element to be moved
     * @param currentMargin - the current left margin of the box
     */
    moveBoxRight: function(box, currentMargin) {
        currentMargin += 1;
        box.style.marginLeft = currentMargin + "px";
    },

    /**
     * This method moves the passed in box to the left.
     *
     * @param box - the box element to be moved
     * @param currentMargin - the current left margin of the box
     */
    moveBoxLeft: function(box, currentMargin) {
        currentMargin -= 1;
        box.style.marginLeft = currentMargin + "px";
    },

    /**
     * This method moves the passed in box upwards.
     *
     * @param box - the box element to be moved
     * @param currentMargin - the current top margin of the box
     */
    moveBoxUp: function(box, currentMargin) {
        currentMargin -= 1;
        box.style.marginTop = currentMargin + "px";
    },

    /**
     * This method moves the passed in box downwards.
     *
     * @param box - the box element to be moved
     * @param currentMargin - the current top margin of the box
     */
    moveBoxDown: function(box, currentMargin) {
        currentMargin += 1;
        box.style.marginTop = currentMargin + "px";
    }

}

module.exports = function(posX, width, imagesCount) {

    var left, right, tx;
    var maxWidth = imagesCount * width;

    posX = (posX | 0) % maxWidth;

    if (posX < 0) {
        posX = imagesCount * width + posX;
    }

    tx = posX % width;
    left = Math.floor((posX - tx) / width) % imagesCount;
    right = (left + 1) % imagesCount;

    return {
        leftImage: left,
        rightImage: right,
        translateX: -tx,
        currentImage: (imagesCount + Math.floor(posX / width) % imagesCount) % imagesCount
    };
};
const canvas = document.getElementById("battlemap");
const context = canvas.getContext("2d");

const grid_size = 50;
const map_width = 40;
const map_height = 20;
canvas.width = map_width * grid_size;
canvas.height = map_height * grid_size;

function draw_image(image_id, x, y) {
    let image = document.getElementById(image_id);
    if (!image) {
        // if the image isn't already cached in the dom, do it now
        image = document.createElement("img");
        image.id = image_id;
        image.src = "/static/images/" + image_id + ".png";
    }

    // todo: do we want to make it so that assets are drawn only once all assets are loaded?
    image.addEventListener("load", () => {
        context.drawImage(image, x * grid_size + 1, y * grid_size + 1, grid_size - 2, grid_size - 2);
    });
}

// draw grid
// todo: move this into a function for redraws
for (let x = 0; x < map_width; x++) {
    for (let y = 0; y < map_height; y++) {
        context.rect(x * grid_size, y * grid_size, grid_size, grid_size);
        context.stroke();
    }
}

// here for testing purposes
draw_image("bush", 2, 2);

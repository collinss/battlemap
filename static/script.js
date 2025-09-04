function debug(message){
    $("#debug").text(message)
}

const canvas = document.getElementById("battlemap");
const context = canvas.getContext("2d");

const grid_size = 50;
const map_width = 40;
const map_height = 20;

const object_layer = Array(map_width).fill().map(_ => Array(map_height).fill(''))

canvas.width = map_width * grid_size;
canvas.height = map_height * grid_size;

let click_method = null;
let click_method_mid = null;
let click_method_right = null;

let selected_palette = 'rock';
/******* sidebar functions *******/

/*********************************
 * function: switch_pane
 *
 * Switches the sidebar view to the given view
 *
 * param: view - the view to switch to
 *********************************/
function switch_pane(view) {
    if (view === "edit") {
        $("#edit-button").addClass("selected");
        $("#play-button").removeClass("selected");
        // todo: add edit pane
    }
    else if (view === "play") {
        $("#edit-button").removeClass("selected");
        $("#play-button").addClass("selected");
        // todo: add play pane
    }
}

/*********************************
 * function: draw_image
 *
 * Draws an image on the canvas
 *
 * param: image_id - the id of the image to draw
 * param: x - the x position of the image in grid coordinates
 * param: y - the y position of the image in grid coordinates
 *********************************/
function draw_image(image_id, x, y) {
    let image = document.getElementById(image_id);
    if (!image) {
        // if the image isn't already cached in the dom, do it now
        image = document.createElement("img");
        image.id = image_id;
        image.src = "/static/images/" + image_id + ".png";
        document.getElementById('images').appendChild(image);
    }

    // todo: do we want to make it so that assets are drawn only once all assets are loaded?
    //image.addEventListener("load", () => {
        context.drawImage(image, x * grid_size + 1, y * grid_size + 1, grid_size - 2, grid_size - 2);
    //});
}

/*********************************
 * function: click_mode_add_object
 *
 * Sets the click mode to object placement
 *
 * param: object_id - the id of the object to place
 *********************************/
function click_mode_add_object(object_id) {
    click_method = (event, x, y) => {
        draw_image(object_id, x, y);
    }
    click_method_mid = (event, x, y) => {
        debug('Middle Click');
    }
    click_method_right = (event, x, y) => {
        debug('Right Click This should probably remove object?');
    }
}

function click_mode_cur_object() {
    click_method = (event, x, y) => {
        object_layer[x][y] = selected_palette;
    }
    click_method_mid = (event, x, y) => {
        debug('Middle Click');
    }
    click_method_right = (event, x, y) => {
        object_layer[x][y] = '';
    }
}

function click_mode_select() {
    click_method = (event, x, y) => {
        debug('Select Not Implemented');
    }
    click_method_mid = null;
    click_method_right = null;
}

// draw grid
function redraw() {
    // Draw Grid
    drawGrid();
    drawObjectLayer();
    //drawNPCLayer();
    //drawPlayerLayer();
    //drawSelectLayer();
}

function drawGrid() {
    for (let x = 0; x < map_width; x++) {
        for (let y = 0; y < map_height; y++) {
            context.rect(x * grid_size, y * grid_size, grid_size, grid_size);
            context.stroke();
        }
    }
            // draw_image(selected_palette, x, y);
}

function drawObjectLayer() {
    for (let x = 0; x < map_width; x++) {
        for (let y = 0; y < map_height; y++) {
            if (object_layer[x][y] !== '')
                draw_image(object_layer[x][y],x,y);
        }
    }
}

$("#battlemap").on("mousedown", (event) => {
    event.preventDefault();
    const x = getGridXFromWindowX(event.offsetX);
    const y = getGridYFromWindowY(event.offsetY);
    if (click_method && event.which === 1) {
        click_method(event, x, y);
    }
    else if (click_method_mid && event.which === 2) {
        click_method_mid(event, x, y);
    }
    else if (click_method_right && event.which === 3) {
        click_method_right(event, x, y);
    }
    redraw();
    // console.log(x, y);
});


function getGridXFromWindowX(x) {
    const mapWidth = $("#battlemap").width();
    const map_canvas_ratio = (canvas.width) / mapWidth;
    return Math.floor((map_canvas_ratio * x) / grid_size);
}

function getGridYFromWindowY(y) {
    const mapHeight = $("#battlemap").height();
    const map_canvas_ratio = (canvas.height) / mapHeight;
    return Math.floor((map_canvas_ratio * y) / grid_size);
}

$(window).on("load", function() {
    $('input[type=radio][name="tool"]').on('change', function() {
        $('#palette').hide();
        switch ($(this).val()) {
            case 'select':
                click_mode_select();
            break;
            case 'place':
                click_mode_cur_object();
                $('#palette').show();
            break;
        }
    });
    $('input[type=radio][name="palette"]').on('change', function() {
        selected_palette = $(this).val();
    });
    // console.log(x, y);
});

// Setup Default Tool
click_mode_select();
selected_palette = 'rock';

redraw();
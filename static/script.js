function debug(message){
    $('#debug').text(message)
}

const canvas = document.getElementById('battlemap');
const context = canvas.getContext('2d');

const grid_size = 50;
const map_width = 40;
const map_height = 20;

const object_layer = Array(map_width).fill().map(_ => Array(map_height).fill(''))

canvas.width = map_width * grid_size;
canvas.height = map_height * grid_size;

let click_method = null;
let click_method_mid = null;
let click_method_right = null;

let image_cache = {};

/******* sidebar functions *******/

/*********************************
 * function: switch_pane
 *
 * Switches the sidebar view to the given view
 *
 * param: view - the view to switch to
 *********************************/
function switch_pane(view) {
    if (view === 'edit') {
        $('#edit-button').addClass('selected');
        $('#play-button').removeClass('selected');
        // todo: add edit pane
    }
    else if (view === 'play') {
        $('#edit-button').removeClass('selected');
        $('#play-button').addClass('selected');
        // todo: add play pane
    }
}

/*********************************
 * function: click_mode_add_object
 *
 * Sets the click mode to object placement
 *
 * param: object_id - the id of the object to place
 *********************************/
function click_mode_add_object(object_id) {
    // console.log('click_mode_add_object: ' + object_id);
    click_method = (event, x, y) => {
        let needs_redraw = false;
        if (object_layer[x][y] == object_id) {
            object_layer[x][y] = '';
            needs_redraw = true;
        }
        else {
            if (object_layer[x][y] == '') {
                draw_image(object_id, x, y);
            } else {
                needs_redraw = true;
            }

            object_layer[x][y] = object_id;
        }

        if (needs_redraw)
            redraw_cell(x, y);
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
    // console.log(image_id, x, y);
    let image = document.getElementById(image_id);
    if (image) {
        // if the image isn't already cached, do it now
        image = document.createElement('img');
        image.id = image_id;
        image.src = '/static/images/' + image_id + '.png';
        image_cache[image_id] = image;
        // document.getElementById('images').appendChild(image);
    }

    // todo: do we want to make it so that assets are drawn only once all assets are loaded?
    image.addEventListener('load', () => {
        context.drawImage(image, x * grid_size + 1, y * grid_size + 1, grid_size - 2, grid_size - 2);
    });
}

/*********************************
 * function: redraw_cell
 *
 * Redraws a single cell in the grid
 *
 * param: x - the x position of the cell in grid coordinates
 * param: y - the y position of the cell in grid coordinates
 *********************************/
function redraw_cell(x, y) {
    context.fillStyle = 'white';
    context.fillRect(x * grid_size, y * grid_size, grid_size, grid_size);
    context.strokeStyle = 'black';
    context.strokeRect(x * grid_size, y * grid_size, grid_size, grid_size);
    if (object_layer[x][y])
        draw_image(object_layer[x][y], x, y);
}

/*********************************
 * function: drawGrid
 *
 * Draws the grid on the entire canvas. This function should only be used during initial loading or if the entire map
 * needs to be redrawn for some reason. Instead, use redraw_cell() to redraw individual cells that need to be updated.
 *********************************/
function drawGrid() {
    for (let x = 0; x < map_width; x++) {
        for (let y = 0; y < map_height; y++) {
            context.rect(x * grid_size, y * grid_size, grid_size, grid_size);
            context.stroke();
        }
    }
}

/*********************************
 * function: drawObjectLayer
 *
 * Draws the object layer on the entire canvas. This function should only be used during initial loading or if the
 * entire map needs to be redrawn for some reason. Instead, use redraw_cell() to redraw individual cells that need to
 * be updated.
 *********************************/
function drawObjectLayer() {
    for (let x = 0; x < map_width; x++) {
        for (let y = 0; y < map_height; y++) {
            if (object_layer[x][y] !== '')
                draw_image(object_layer[x][y], x, y);
        }
    }
}

/*********************************
 * function: getGridXFromWindowX
 *
 * Converts window coordinates to grid coordinates
 *
 * param: x - the x position in window coordinates
 * returns: the x position in grid coordinates
 *********************************/
function getGridXFromWindowX(x) {
    const mapWidth = $('#battlemap').width();
    const map_canvas_ratio = (canvas.width) / mapWidth;

    return Math.floor((map_canvas_ratio * x) / grid_size);
}

/*********************************
 * function: getGridYFromWindowY
 *
 * Converts window coordinates to grid coordinates
 *
 * param: y - the y position in window coordinates
 * returns: the y position in grid coordinates
 *********************************/
function getGridYFromWindowY(y) {
    const mapHeight = $('#battlemap').height();
    const map_canvas_ratio = (canvas.height) / mapHeight;
    return Math.floor((map_canvas_ratio * y) / grid_size);
}

/* EVENT HANDLERS */
$('#battlemap').on('mousedown', (event) => {
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
    // console.log(x, y);
});

$(window).on('load', function() {
    $('input[type=radio][name="palette"]').on('change', function() {
        click_mode_add_object($(this).val());
    });

    drawGrid();
    drawObjectLayer();

    // Setup Default Tool
    click_mode_add_object('rock');
    $('#rock').click();
});


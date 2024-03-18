const enhanceX2 = document.getElementById("enhanceX2");
const enhanceX3 = document.getElementById("enhanceX3");
const enhanceX4 = document.getElementById("enhanceX4");
const radioTwo = document.getElementById("radioTwo");
const radioThree = document.getElementById("radioThree");
const radioFour = document.getElementById("radioFour");
const previewButton = document.getElementById("previewButton");
const downloadButton = document.getElementById("downloadButton");
let map;

initMap();
downloadButton.addEventListener("click", downloadImage);
previewButton.addEventListener("click", previewImage);
enhanceX2.addEventListener("click", () => setRadioButton(radioTwo, 2));
enhanceX3.addEventListener("click", () => setRadioButton(radioThree, 3));
enhanceX4.addEventListener("click", () => setRadioButton(radioFour, 4));

function downloadImage() {
    let option;

    if (radioTwo.checked) {
        option = "options/Test/test_single_x2.yml";
    } else if (radioThree.checked) {
        option = "options/Test/test_single_x3.yml";
    } else if (radioFour.checked) {
        option = "options/Test/test_single_x4.yml";
    } else {
        console.log("Error calling enhance: No enhance option selected.")
        return;
    }

    console.log(option);
    eel.execute_enhance(option);
}

function previewImage() {
    center = map.getCenter();
    zoom = map.getZoom();
    eel.getImage(center, zoom)
}

async function initMap() {
    const {Map} = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        mapTypeId: "satellite",
        tilt: 0,
        disableDefaultUI: true,
        keyboardShortcuts: false
    });
}

function setRadioButton(radioInput, buttonInput) {
    radioInput.checked = true;
    enhanceX2.style.color = "wheat";
    enhanceX3.style.color = "wheat";
    enhanceX4.style.color = "wheat";
    enhanceX2.style.border = "15px outset black";
    enhanceX3.style.border = "15px outset black";
    enhanceX4.style.border = "15px outset black";
    
    switch(buttonInput) {
        case 2:
            enhanceX2.style.border = "15px inset orange";
            // set value of the default enhance level
        break;
        case 3:
            enhanceX3.style.border = "15px inset orange";
            // set value of the default enhance level
        break;
        case 4:
            enhanceX4.style.border = "15px inset orange";
            // set value of the default enhance level
        break;
    }
}

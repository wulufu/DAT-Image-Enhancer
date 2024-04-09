const mapsDialog = document.getElementById("mapsDialog");
const enhancingDialog = document.getElementById("enhancingDialog");
const successDialog = document.getElementById("successDialog");
const okButton = document.getElementById("okButton");
const localImageTab = document.getElementById("localImageTab");
const satelliteTab = document.getElementById("satelliteTab");
const searchBox = document.getElementById("searchBox");
const fileSelect = document.getElementById("fileSelect");
const fileDropZone = document.getElementById("fileDropZone");
const chooseFileButton = document.getElementById("chooseFileButton");
const fileName = document.getElementById("fileName")
const enhanceButton = document.getElementById("enhanceButton");
const radioButtons = document.querySelectorAll(".radioButton");
let selectedRadioButton = document.querySelector(".radioButton.selected");
let map;

okButton.addEventListener("click", async () => {
    successDialog.close();
});

enhanceButton.addEventListener("click", async () => {
    if (currentTab === satelliteTab) {
        await getMapsImage();
    }

    await enhanceImage();
});

currentTab = document.querySelector(".tab.selected");
localImageTab.addEventListener("click", () => {
    if (currentTab === localImageTab) {
        return;
    }

    localImageTab.classList.add("selected");
    satelliteTab.classList.remove("selected");
    searchBox.style.display = "none";
    map.getDiv().style.display = "none";
    fileSelect.style.display = "flex";
    currentTab = localImageTab;
});

satelliteTab.addEventListener("click", async () => {
    if (currentTab === satelliteTab) {
        return;
    }

    if (map === undefined) {
        await initMap();
    }

    satelliteTab.classList.add("selected");
    localImageTab.classList.remove("selected");
    fileSelect.style.display = "none";
    map.getDiv().style.display = "block";
    searchBox.style.display = "block";
    currentTab = satelliteTab;
});

chooseFileButton.addEventListener("click", async () => {
    await window.pywebview.api.open_file_dialog();
});

fileDropZone.addEventListener("dragenter", () => {
    fileDropZone.classList.add("active");
});

fileDropZone.addEventListener("dragleave", () => {
    fileDropZone.classList.remove("active");
});

fileDropZone.addEventListener("drop", () => {
    fileDropZone.classList.remove("active");
});

document.addEventListener("dragenter", event => {
    event.preventDefault();
    event.stopPropagation();
});

document.addEventListener("dragstart", event => {
    event.preventDefault();
    event.stopPropagation();
});

document.addEventListener("dragover", event => {
    event.preventDefault();
    event.stopPropagation();
});

radioButtons.forEach(radioButton => {
    radioButton.addEventListener("click", event => {
        const clickedRadioButton = event.target;

        selectedRadioButton.classList.remove("selected");
        clickedRadioButton.classList.add("selected");
        selectedRadioButton = clickedRadioButton;
    });
});

async function initMap() {
    // Load the Maps JavaScript API dynamically
    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
        key: "AIzaSyAz7DIMRFMREUS1oea5JnwxDck_veuDqWI"
    });

    const {Map} = await google.maps.importLibrary("maps");
    const {SearchBox} = await google.maps.importLibrary("places")
    const {ControlPosition} = await google.maps.importLibrary("core")
    const {LatLngBounds} = await google.maps.importLibrary("core")

    map = new Map(document.getElementById("map"), {
        center: {lat: 42.684, lng: -73.827},
        zoom: 15,
        mapTypeId: "satellite",
        tilt: 0,
        minZoom: 3,
        mapTypeControl: false,
        streetViewControl: false,
        keyboardShortcuts: false
    });

    // Create the search box and link it to the UI element.
    const search = new SearchBox(searchBox);
    map.controls[ControlPosition.TOP_LEFT].push(searchBox);

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    search.addListener("places_changed", () => {
        const places = search.getPlaces();

        if (places.length === 0) {
            return;
        }

        // For each place, get the icon, name and location.
        const bounds = new LatLngBounds();

        places.forEach((place) => {
            if (!place.geometry || !place.geometry.location) {
                console.log("Returned place contains no geometry");
                return;
            }

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
    
        map.fitBounds(bounds);
    });
}

async function getMapsImage() {
    const mapCenter = map.getCenter();
    const mapZoom = map.getZoom();

    mapsDialog.showModal();
    await window.pywebview.api.get_maps_image(mapCenter, mapZoom);
    mapsDialog.close();
}

async function enhanceImage() {
    const enhanceLevel = selectedRadioButton.getAttribute("id");

    enhancingDialog.showModal();
    await window.pywebview.api.execute_enhance(enhanceLevel);
    enhancingDialog.close();
    successDialog.showModal();
}

// Called by Python when it receives a new file
function updateCurrentFile(file) {
    fileName.textContent = file;
}
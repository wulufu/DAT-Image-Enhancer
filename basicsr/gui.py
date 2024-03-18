import platform
import sys

import eel
import googlemaps
from basicsr import execute

API_KEY = "AIzaSyAz7DIMRFMREUS1oea5JnwxDck_veuDqWI"

@eel.expose
def execute_enhance(enhance_level):
    execute(enhance_level)


@eel.expose
def getImage(center, zoom, size=(640, 640), scale=2):
    client = googlemaps.Client(API_KEY)
    map = client.static_map(size, center, zoom, scale, "png32", "satellite")
    
    with open("web/img.png", "wb") as file:
        for chunk in map:
            if chunk:
                file.write(chunk)


if __name__ == '__main__':
    eel.init("web")

    try:
        eel.start("layout.html", mode="chrome")
    except EnvironmentError:
        # If Chrome isn't found, fallback to Microsoft Edge on Win10 or greater
        if sys.platform in ['win32', 'win64'] and int(platform.release()) >= 10:
            eel.start("layout.html", mode='edge')
        else:
            raise

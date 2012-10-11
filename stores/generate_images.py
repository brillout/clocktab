#!/usr/bin/python
import sys
import os
import inspect

FILE_DIR = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
os.system(FILE_DIR+"/../../generate_icon_images.py clock.png 'rgb(160,160,160)'")
#os.system(FILE_DIR+"/../../generate_promo_images.py bg.png clock.png Clock_Tab 'rgb(160,160,160)' 0")
#os.system(FILE_DIR+"/../../generate_promo_images.py bg_dark.png clock.png Clock_Tab 'rgb(100,100,160)' 0")
os.system(FILE_DIR+"/../../generate_promo_images.py bg_dark.png clock.png Clock_Tab 'rgb(100,100,100)' 0")

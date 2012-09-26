#!/usr/bin/python
import sys
import os
import inspect

FILE_DIR = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
os.system(FILE_DIR+"/../../generate_icon_images.py clock.png")
os.system(FILE_DIR+"/../../generate_promo_images.py bg.png clock.png Clock_Tab 'rgb(68,68,68)' 0")

from fastapi import FastAPI
from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
import requests
from PIL import ImageOps
from io import BytesIO
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Dict, Any ,Literal

app = FastAPI()


class Resized(BaseModel):
    width:int
    height:int

class Crop(BaseModel):
    left:int
    right:int
    top:int
    bottom:int


class ChangeParameter(BaseModel):
    resized : Resized
    crop : Crop
    format: Literal["JPEG", "PNG", "webp",'jpeg','jpg']
    flip: bool
    mirror: bool
    watermark:str
    quality:int
    # grayscale : Literal["L", "RGB", "RGBA", "1",'P']
    grayscale:str
    rotate:int

class TransformRequest(BaseModel):
    imageurl:str
    changingparameter:ChangeParameter


@app.post("/transform")
def home(data:TransformRequest):
    print('hyy in python code ')
    imageurl=data.imageurl
    response = requests.get(imageurl)
    response.raise_for_status()

    img = Image.open(BytesIO(response.content))

    crop_data=data.changingparameter.crop
    grayscale_data=data.changingparameter.grayscale
    resize_data=data.changingparameter.resized
    rotate = data.changingparameter.rotate
    format=data.changingparameter.format
    flip=data.changingparameter.flip
    mirror=data.changingparameter.mirror
    watermark=data.changingparameter.watermark
    quality=data.changingparameter.quality

    img=crop_meth(crop_data,img)
    img=resize_meth(resize_data,img)
    img=grayscale_meth(grayscale_data,img)
    img=rotate_meth(rotate,img)
    img=flip_meth(flip,img)
    img=mirror_meth(mirror,img)
    img=watermark_meth(watermark,img,grayscale_data)
    buffer = BytesIO()
    if format.upper() == "JPEG" and (img.mode != "RGB" or img.mode != "L" ) :
        img = img.convert("RGB")

    img.save(buffer, format=format, quality=quality)
    buffer.seek(0)

 
    return StreamingResponse(buffer, media_type='image/'+format.lower())   

def resize_meth(size_data,img):
    resized_w=size_data.width
    resized_h=size_data.height
    resized_img = img.resize((resized_w,resized_h))

    return resized_img

def crop_meth(crop_data,img):
    crop_t=crop_data.top
    crop_l=crop_data.left
    crop_b=crop_data.bottom
    crop_r=crop_data.right
    # (left, top, right, bottom)
    cropped =img.crop((crop_l,crop_t,crop_r,crop_b))
    return cropped


def grayscale_meth(grayscale_data,img):
    grayscale = img.convert(grayscale_data)
    return grayscale

def rotate_meth(rotate,img):
    rotate=img.rotate(-rotate)
    return rotate

def flip_meth(flip,img):
    if flip:
        img = ImageOps.flip(img)
    return img

def mirror_meth(mirror,img):
    if mirror:
        img = ImageOps.mirror(img)
    return img

def watermark_meth(watermark,img,grayscale_data):
    if watermark:
        font = ImageFont.truetype("arial.ttf", 50)

        if img.mode == "L":
            fill_color = 255
        elif img.mode=='1':
            fill_color= 1     
        else:
            fill_color = (255,255,255)

        draw=ImageDraw.Draw(img)
        draw.text((20,20),watermark,fill=fill_color,font=font)

    return img

# Go inside the the folder python.service cd RBAC/BACKEND/SRC/PYTHON.SERVICE
# and then run this command 
#How to run the python server command to run server=> 
#  python -m uvicorn main:app --reload 
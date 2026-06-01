from fastapi import FastAPI
from PIL import Image
import requests
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


    img=crop_meth(crop_data,img)
    img=resize_meth(resize_data,img)
    img=grayscale_meth(grayscale_data,img)
    img=rotate_meth(rotate,img)
    buffer = BytesIO()
    img.save(buffer, format="JPEG")
    buffer.seek(0)

 
    return StreamingResponse(buffer, media_type="image/jpeg")   

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
    rotate=img.rotate(rotate)
    return rotate
# Go inside the the folder python.service cd RBAC/BACKEND/SRC/PYTHON.SERVICE
# and then run this command 
#How to run the python server command to run server=> 
#  python -m uvicorn main:app --reload 
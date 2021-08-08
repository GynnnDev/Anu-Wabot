#!/usr/bin/bash

apt update && apt upgrade
apt install git libwebp ffmpeg tesseract nodejs
wget -O ~/../usr/share/tessdata/ind.traineddata "https://github.com/tesseract-ocr/tessdata/blob/master/ind.traineddata?raw=true"
npm install -g 
Instalation Done, node index atau npm start untuk run bot

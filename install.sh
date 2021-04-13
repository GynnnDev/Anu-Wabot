#!/usr/bin/bash

pkg update
pkg upgrade
pkg install toilet
pkg install git 
pkg install nodejs
pkg install libwebp
pkg install ffmpeg
pkg install wget
pkg install tesseract
wget -O ~/../usr/share/tessdata/ind.traineddata "https://github.com/tesseract-ocr/tessdata/blob/master/ind.traineddata?raw=true"
npm install -g 
clear
echo "[*] All dependencies have been installed, please run the command \"bash run.sh\" to immediately start the script"
echo "[*] Ketik $ bash run.sh Untuk Menjalankan"

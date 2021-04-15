# music-organizer-js

## Description
A CLI tool to organize your new or old music collection!

Currently Supported File Types:
* mp3

## Setup
Simply install the dependencies and you're good to go! 
```
npm install
```

## How to Run
Start the tool and follow the prompts with:
```
npm run organize
```

## What does it do?
This script will organize your music based on the metadata of the files.

Say your music looks like this:
```
Music/
  Band1-AlbumA-Song1.mp3
  Band2-AlbumZ-Song1.mp3
  folder/
    Band1-AlbumA-Song2.mp3
    Band1-AlbumB-Song2.mp3
```
It would be sorted to look like:
```
Music/
  Band1/
    AlbumA/
      Song1.mp3
      Song2.mp3
    AlbumB/
      Song2.mp3
  Band2/
    AlbumZ/
      Song1.mp3
```

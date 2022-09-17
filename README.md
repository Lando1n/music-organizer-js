# music-organizer-js

## Description
A CLI tool to organize your new or old music collection!

Currently Supported File Types:
* mp3
* flac

Currently Supported Operating Systems:
* Linux
* WSL

## Recommended Usage
It is recommended to make the target directory different from where you store your music. Generally this is your downloads folder. 

This will reduce any risk of causing harm to your music libraries, plus it will reduce the time it takes to run as you don't need to sort all music everytime. 

Use at your own risk, I do not take responsibility for messing up your music libraries. 

## Usage

Run setup first to determine the unsorted and sorted paths among other settings.
```bash
./music-organizer-js setup
```

Organize! This will use the settings from the setup step. You can run this multiple times with the same settings.
```bash
./music-organizer-js organize
```

## What does it do?
This script will organize your music based on the metadata of the files.

### Sorting your Music Directory
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

### Sorting newly downloaded music
You can even sort music from one directory into another. A prime example of this is getting new music in your Downloads folder and wanting to have it sorted into your Music directory.

Example:

Say your music and downloads directories looks like this:
```
Downloads/
  Band1-AlbumC-Song1.mp3
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
It would be sorted to look like:
```
Downloads/
  ...empty
Music/
  Band1/
    AlbumA/
      Song1.mp3
      Song2.mp3
    AlbumB/
      Song2.mp3
    AlbumC/
      Song1.mp3
  Band2/
    AlbumZ/
      Song1.mp3
```

## Development

### Setup

This project assumes you have installed node/npm: https://nodejs.org/en/download/

Simply install the dependencies and you're good to go! 
```
npm install
```

### How to Run
First, you need to run the setup to define the settings. 
```bash
npm run setup
```

Now you can organize!

Start the process using the settings from the setup by running:
```bash
npm run organize
```

### Build
Create the executables for all 3 operating systems
```bash
npm run build
```
Find the binaries under /dist

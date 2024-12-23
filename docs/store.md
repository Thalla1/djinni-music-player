---
title: DJinni Music Player FORK
description: "Mix sound effects and music with looping, fading, and more to provide an immersive experience!"
author: Keegan
image: https://raw.githubusercontent.com/kgbergman/music-player/main/docs/header.jpg
icon: https://raw.githubusercontent.com/kgbergman/music-player/main/public/logo.png
tags:
  - "tool"
  - "audio"
manifest: https://music-player-adrf.onrender.com/manifest.json
learn-more: https://github.com/kgbergman/music-player
---


# DJinni Music Player

Mix sound effects and music with looping, fading, and more to provide an immersive experience!

## How it Works

The DJinni Music Player allows the GM to curate YouTube links and play them for their players. You can mix music, monster noises, weather sounds, swords clashing, etc. Anything you find on YouTube can be added to DJinni.

Clicking the <img src="https://raw.githubusercontent.com/kgbergman/music-player/main/public/icon.svg" width=20 alt="DJinni Icon"> icon at the top of the page will open the DJinni Music Player.


### Header

![Header](https://raw.githubusercontent.com/kgbergman/music-player/main/docs/djinniheader.png)

At the top is the header, with icons to open and save .djinni files. Whenever you load up Owlbear Rodeo, you will need to open your .djinni file. They are too big to store within Owlbear Rodeo as part of the extension.

There is a button that toggles between <img src="https://raw.githubusercontent.com/kgbergman/music-player/main/docs/persons.png" width=20 alt="3 Person"> and <img src="https://raw.githubusercontent.com/kgbergman/music-player/main/docs/person.png" width=20 alt="1 Persons">. This means that you are either playing these sounds to all of your player's browsers and yours, or just locally to your own. This toggle can be useful if you'd like to share your audio through a service like Zoom or Discord.

There is a volume slider along with a mute toggle. This is only local to your browser, and each player will have their own volume controls on their browser.

![Header Pause Play](https://raw.githubusercontent.com/kgbergman/music-player/main/docs/headerpauseplay.png)

Once you play any stream(s), a pause and stop icon will appear in the header. Clicking the pause icon will pause all streams and turn into a play icon, which allows you to resume them. Clicking the stop icon will end all streams immediately without fading out.


### Folders

By default, a few preloaded folders will open with names that describe their scenes. Open a folder by double-clicking on it.

![Folders](https://raw.githubusercontent.com/kgbergman/music-player/main/docs/folders.png)

You can add a new folder by clicking the <img src="https://raw.githubusercontent.com/kgbergman/music-player/main/docs/plusicon.png" width=20 alt="Plus Icon"> on this page. You can name a folder and assign it a color. Clicking the <img src="https://raw.githubusercontent.com/kgbergman/music-player/main/docs/editicon.png" width=20 alt="Edit Icon"> on a folder will open a similar dialog, where you can rename a folder and reassign its color. 

Delete a folder by pressing the delete key while a folder is highlighted, or clicking the <img src="https://raw.githubusercontent.com/kgbergman/music-player/main/docs/deleteicon.png" width=20 alt="Delete Icon"> after opening the folder.


### Playing Streams

Within each folder are the playable streams. To play a stream, click on it once. Clicking on it again will stop it.  

![Playing Streams](https://raw.githubusercontent.com/kgbergman/music-player/main/docs/playingstreams.png)

You can play streams from any folder. Folders with streams playing will show an animated icon on their folder. If you have the streams paused, folders with streams playing will show a paused icon over them to remind you.

<img src="https://raw.githubusercontent.com/kgbergman/music-player/main/docs/playingfolder.png" alt="Playing Folder"><img src="https://raw.githubusercontent.com/kgbergman/music-player/main/docs/pausedfolder.png" alt="Paused Folder">


### Edit Streams

To edit a stream, click its <img src="https://raw.githubusercontent.com/kgbergman/music-player/main/docs/editicon.png" width=20 alt="Edit Icon"> icon. Here you can change many things about the stream, like its icon, name, volume levels, etc.

Each stream has a fade-out option. When you click on the stream to end it, it will either end instantly or you can choose to have it fade out from 1-10 seconds. 

![Edit Stream](https://raw.githubusercontent.com/kgbergman/music-player/main/docs/editstream.png)

From this page, you can also add, edit, and delete links.

For example, this stream has a few different sound effect links: waves, seagulls, and footsteps on sand. DJinni mixes these together to provide a "beach" ambience. Each stream has a volume level, and each link has a volume level (relative to the other links within that stream). 

You can see that the waves are playing on a constant loop, but the seagulls and footsteps will loop with a slightly randomized delay in between each. This sounds more organic and won't just be the same repeating noises over and over. 


### Player View

<img src="https://raw.githubusercontent.com/kgbergman/music-player/main/docs/playerview.png" alt="Player View"><img src="https://raw.githubusercontent.com/kgbergman/music-player/main/docs/playerviewlocal.png" alt="Player View Local">

A player can control their own local volume and mute options, as well as see how many streams the GM is playing at a time. It will also tell them if the GM is playing their sound locally, so they can know whether or not to expect sound to come out of Owlbear Rodeo.


### Troubleshooting

If you are having trouble hearing the streams, please be sure you are either using Firefox or Safari on a desktop computer, or [follow the instructions here](https://github.com/kgbergman/music-player/blob/main/docs/autoplay.md) to allow autoplay on Google Chrome or Microsoft Edge.

There is currently no way to autoplay streams on mobile browsers due to policies enacted from by Apple (iOS) and Google (Android). You can still use DJinni as a control-center on mobile devices, but you won't hear any audio.


### Support

If you want to support me financially, you can [buy me a coffee](https://www.buymeacoffee.com/keegandev)!

Feel free to email me at keegan.developer@gmail.com with any questions about the extension and I will try to answer them!

Copyright (C) 2023 Keegan Bergman

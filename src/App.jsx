import './App.css';
import { Header } from "./header/Header";
import { Content } from "./content/Content";
import { SavePopup } from './savepopup/SavePopup';
import React, { useState, useEffect } from 'react';
import { exampleFile } from './example/example';
import { MemoizedPlayer } from './player/Player';
import OBR from '@owlbear-rodeo/sdk';
import { getPluginId } from './getPluginId'
import { PlayerView } from "./playerview/PlayerView"

function App() {
  const [folders, setFolders] = useState(exampleFile);
  const [currentlyStreaming, setCurrentlyStreaming] = useState([]);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [masterVolume, setMasterVolume] = useState({volume: 50, mute: false});
  const [playerRole, setPlayerRole] = useState("");
  const [masterPaused, setMasterPaused] = useState(false);
  const [fadeOutVolume, setFadeOutVolume] = useState(100);

  let fadeOutInterval = 0;

  useEffect(() => {
    OBR.onReady(async () => {
      if (playerRole === "") {
        const newPlayerRole = await OBR.player.getRole();
        setPlayerRole(newPlayerRole);
        if (newPlayerRole === "PLAYER") {
          console.log(OBR.action.setWidth(205));
          console.log(OBR.action.setHeight(110));
        }
      }
      const checkMetadataInterval = setInterval(() => {
        const metadataArray = OBR.room.getMetadata();
        metadataArray.then(values => {
          console.log(values);
          if (values[getPluginId("currently")]) {
            const currently = values[getPluginId("currently")];
            console.log("received 1st metadata", currently);
            setCurrentlyStreaming(currently);
            clearInterval(checkMetadataInterval);
          }
          if (values[getPluginId("paused")]) {
            setMasterPaused(values[getPluginId("paused")][0]);
          }
        });
      }, 1000);
      OBR.room.onMetadataChange((metadata) => {
        const metadataArray = metadata[getPluginId("currently")];
        const pausedArray = metadata[getPluginId("paused")];
        console.log(metadata);
        if (metadataArray) {
          const currently = metadataArray;
          console.log("received metadata", currently);
          setCurrentlyStreaming(currently);
        }
        if (pausedArray) {
          setMasterPaused(pausedArray[0]);
        }
      })
    });
  }, []);

  function setCurrentlyStreamingMetadata(newCurrentlyStreaming) {
    sendMetadata("currently", structuredClone(newCurrentlyStreaming));
  }

  function sendMetadata(command, parameter) {
    if (OBR.isReady) {
      OBR.room.setMetadata({
        [getPluginId(command)]: parameter
      });
    }
  }

  useEffect(() => {
    //Check for streams that are fading
    for (let i = 0; i < currentlyStreaming.length; i++) {
      const stream = currentlyStreaming[i];
      if (stream.playing && stream.fading && fadeOutInterval === 0) {
        const fadeTime = parseInt(stream.streamFadeTime);
        const steps = 100;
        const decrementStep = 1;
        const timeInterval = fadeTime * 1000 / steps;
        let currentVolume = 100;
        updateVolumeLocally(stream, currentVolume);
        fadeOutInterval = setInterval(() => {
          currentVolume -= decrementStep;
          if (currentVolume <= 0) {
            clearInterval(fadeOutInterval);
            stopAllFadingStreams(stream);
            fadeOutInterval = 0;
            updateVolumeLocally(stream, 100);
          } else {
            updateVolumeLocally(stream, currentVolume);
          }
        }, timeInterval);
      }
    }
  },[currentlyStreaming]);

  function updateVolumeLocally(stream, volume) {
    setFadeOutVolume(volume); 
  }

  function saveButtonClicked() {
    setShowSavePopup(true);
  }

  function savePopupClose() {
    setShowSavePopup(false);
  }

  function parseVideoUrl(url) {
    var regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/watch\?v=|https?:\/\/youtu\.be\/|https?:\/\/(?:www\.)?youtube\.com\/embed\/)([\w-]{11})(?:\S+)?/;
    var match = url.match(regex);
    return match ? match[1] : null;
  }

  function updateVolume(streamToChange, volume) {
    let newCurrentlyStreaming = [...currentlyStreaming];
    for(let i = 0; i < newCurrentlyStreaming.length; i++) {
      const stream = newCurrentlyStreaming[i];
      if (streamToChange.id === stream.id) {
        stream.streamVolume = volume;
        newCurrentlyStreaming[i] = stream;
      }
    }
    setCurrentlyStreamingMetadata(newCurrentlyStreaming);
  }

  function streamClickedStart(streamToStart){ 
    startStream(streamToStart);
  }

  function streamClickedEnd(streamToEnd) {
    endStream(streamToEnd);
  }

  function startStream(streamToStart) {
    console.log("starting", streamToStart);
    let newCurrentlyStreaming = [...currentlyStreaming];
    if (newCurrentlyStreaming.some(stream => stream.id === streamToStart.id)) {
      for(let i = 0; i < newCurrentlyStreaming.length; i++) {
        let changed = false;
        const stream = newCurrentlyStreaming[i];
        if (stream.id === streamToStart.id) {
          stream.playing = true;
          stream.paused = masterPaused;
          stream.streamData.forEach(streamLink => {
              streamLink.playing = true;
              changed = true;
          })
        }
        if (changed) {
          newCurrentlyStreaming[i] = stream;
        }
      }
    }
    else {
      newCurrentlyStreaming.push(streamToStart);
      for(let i = 0; i < newCurrentlyStreaming.length; i++) {
        let changed = false;
        const stream = newCurrentlyStreaming[i];
        if (stream.id === streamToStart.id) {
          stream.playing = true;
          stream.streamData.forEach(streamLink => {
              streamLink.playing = true;
              changed = true;
          })
        }
        if (changed) {
          newCurrentlyStreaming[i] = stream;
        }
      }
    }
    setCurrentlyStreamingMetadata(newCurrentlyStreaming);
  }
  
  function stopAllFadingStreams() {
    let newCurrentlyStreaming = [...currentlyStreaming];
    for (let i = 0; i < newCurrentlyStreaming.length; i++) {
      if (newCurrentlyStreaming[i].fading) {
        newCurrentlyStreaming[i].fading = false;
        newCurrentlyStreaming[i].playing = false;
      }
    }
    setCurrentlyStreamingMetadata(newCurrentlyStreaming);
  }

  function stopStream(streamToStop) {
    console.log("stopping", streamToStop);
    let newCurrentlyStreaming = [...currentlyStreaming];
    for (let i = 0; i < newCurrentlyStreaming.length; i++) {
      if (streamToStop.id === newCurrentlyStreaming[i].id) {
        newCurrentlyStreaming[i].playing = false;
      }
    }
    setCurrentlyStreamingMetadata(newCurrentlyStreaming);
  }

  function endStream(stream) {
    if (stream.streamFade && stream.streamFadeTime > 0) {
      //Send command to fade out this stream
      setFading(stream, true);
    }
    else {
      stopStream(stream);
    }
  }

  function saveFolders(filename) {
    const saveFolders = {...folders};
    const keys = Object.keys(saveFolders);
    keys.forEach(key => {
      const thisFolder = saveFolders[key];
      thisFolder.streams.forEach(stream => {
        stream.playing = false;
        stream.streamData.forEach(streamLink => {
          streamLink.playing = false;
        })
      })
      saveFolders[key] = thisFolder;
    })
    const data = JSON.stringify(saveFolders, null, '\t');
    const fileName = `${filename}.djinni`;
    const type = 'text/plain';
    var file = new Blob([data], {type: type});
    var a = document.createElement("a"), url = URL.createObjectURL(file);
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);  
        setShowSavePopup(false);
    }, 0); 
  }

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function setFading(streamToFade, fade) {
    let newCurrentlyStreaming = [...currentlyStreaming];
    for(let i = 0; i < newCurrentlyStreaming.length; i++) {
      const stream = newCurrentlyStreaming[i];
      if (streamToFade.id === stream.id) {
        stream.fading = fade;
        if (!fade) {
          stream.playing = false;
        }
        newCurrentlyStreaming[i] = stream;
      }
    }
    setCurrentlyStreamingMetadata(newCurrentlyStreaming);
  }

  function endStreamLink(endedStreamLink) {
    let newCurrentlyStreaming = [...currentlyStreaming];
    for(let i = 0; i < newCurrentlyStreaming.length; i++) {
      let changed = false;
      const stream = newCurrentlyStreaming[i];
      if (!isEmpty(stream)) {
        stream.streamData.forEach(streamLink => {
          if (streamLink.id === endedStreamLink.id) {
            streamLink.playing = false;
            changed = true;
          }
        })
        if (changed) {
          newCurrentlyStreaming[i] = stream;
        }
      }
    }
    setCurrentlyStreamingMetadata(newCurrentlyStreaming);
  }

  function addStreamLink(addedStreamLink) {
    let newCurrentlyStreaming = [...currentlyStreaming];
    for(let i = 0; i < newCurrentlyStreaming.length; i++) {
      let changed = false;
      const stream = newCurrentlyStreaming[i];
      if (!isEmpty(stream)) {
        stream.streamData.forEach(streamLink => {
          if (streamLink.id === addedStreamLink.id) {
            streamLink.playing = true;
            changed = true;
          }
        })
        if (changed) {
          newCurrentlyStreaming[i] = stream;
        }
      }
    }
    setCurrentlyStreamingMetadata(newCurrentlyStreaming);
  }

  function removeFromCurrentlyStreaming(streamToRemove) {
    endStream(streamToRemove);
  }

  function checkIfRemoveFromCurrentlyStreaming(endedStreamLink) {
    //Find the stream that holds this streamlink
    currentlyStreaming.forEach(stream => {
      if (stream.streamData.some(streamLink => streamLink.id === endedStreamLink.id)) {
        //Check if all of the streams are not playing and don't loop
        let remove = true;
        stream.streamData.forEach(streamLink => {
          if (streamLink.playing || streamLink.loop) {
            remove = false;
          }
        })
        if (remove) {
          removeFromCurrentlyStreaming(stream);
        }
      }
    })
  }

  function endFunction(event, endedStreamLink) {
    endStreamLink(endedStreamLink);
    //This function should only call if the stream doesn't already loop, but to be safe
    if (!endedStreamLink.loop) {
      checkIfRemoveFromCurrentlyStreaming(endedStreamLink);
    } 
    else {
      const repeatIn = randomNumber(endedStreamLink.loop1, endedStreamLink.loop2);
      setTimeout(() => {
        addStreamLink(endedStreamLink);
      }, repeatIn * 1000);  
    }
  }

  function stopAllStreams() {
    let newCurrentlyStreaming = [];
    setCurrentlyStreamingMetadata(newCurrentlyStreaming);
  }

  function togglePlayPauseStreams() {
    if (masterPaused) {
      sendMetadata("paused", [false, new Date().getTime()]);
    }
    else {
      sendMetadata("paused", [true, new Date().getTime()]);
    }
  }

  function playerVolumeSliderChanged(volume) {
    const newMasterVolume = {...masterVolume};
    newMasterVolume.volume = volume;
    setMasterVolume(newMasterVolume);
  }

  function playerVolumeToggleClicked() {
    const newMasterVolume = {...masterVolume};
    newMasterVolume.mute = !newMasterVolume.mute;
    setMasterVolume(newMasterVolume);
  }

  const [folderKeys, setFolderKeys] = useState(Object.keys(folders));

  function renderVideosOld() {
    return folderKeys.map(folderKey => {
        if (folders.hasOwnProperty(folderKey)) {
          return folders[folderKey].streams.map(stream => {
              return stream.streamData.map(streamLink => {
                if (stream.playing && streamLink.playing) {
                  return <MemoizedPlayer
                    streamLinkId={streamLink.id}
                    url={streamLink.link}
                    playing={!masterPaused}
                    loop={streamLink.loop && streamLink.loop1 === 0 && streamLink.loop2 === 0}
                    volume={stream.streamVolume / 100 * streamLink.volume / 100 * masterVolume.volume / 100}
                    muted={stream.streamMute || streamLink.mute || masterVolume.mute}
                    onEnded={(event) => endFunction(event, streamLink)}
                  />
                }
              })
          })
        }
    })
  }
  
  function isEmpty(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }
  
    return true;
  }

  function renderVideos() {
    return currentlyStreaming.map(stream => {
      if (!isEmpty(stream)) {
        return stream.streamData.map(streamLink => {
          if (stream.playing && streamLink.playing) {
            let fadeVolume = 100;
            if (stream.fading) {
              fadeVolume = fadeOutVolume;
            }
            let volume = masterVolume.volume / 100 * stream.streamVolume / 100 * streamLink.volume / 100 * fadeVolume / 100;
            return <MemoizedPlayer
              streamLinkId={streamLink.id}
              url={streamLink.link}
              playing={!masterPaused}
              loop={streamLink.loop && streamLink.loop1 === 0 && streamLink.loop2 === 0}
              volume={volume}
              muted={stream.streamMute || streamLink.mute || masterVolume.mute}
              onEnded={(event) => endFunction(event, streamLink)}
            />
          }
        })
      }
    })
  }

  const addFolderKey = React.useCallback((folderKeyToAdd) => {
    setFolderKeys((folderKeys) => [...folderKeys, folderKeyToAdd]);
  }, []);

  if (playerRole === "GM") {
    return (
      <div className="App">
        <div className="audio-streams" id="audio-streams">
          {renderVideos()}
        </div>
        {showSavePopup && <SavePopup savePopupClose={savePopupClose} savePopupClicked={saveFolders}/>}
        <Header 
          folderKeys={folderKeys} 
          addFolderKey={addFolderKey} 
          masterVolume={masterVolume} 
          setMasterVolume={setMasterVolume} 
          setFolders={setFolders} 
          saveButtonClicked={saveButtonClicked} 
          currentlyStreaming={currentlyStreaming}
          togglePlayPauseStreams={togglePlayPauseStreams}
          stopAllStreams={stopAllStreams}
          masterPaused={masterPaused}
          fadeOutVolume={fadeOutVolume}
        />
        <Content 
          folders={folders} 
          addFolderKey={addFolderKey} 
          setFolderKeys={setFolderKeys} 
          folderKeys={folderKeys} 
          setFolders={setFolders} 
          currentlyStreaming={currentlyStreaming} 
          setCurrentlyStreamingMetadata={setCurrentlyStreamingMetadata} 
          setCurrentlyStreaming={setCurrentlyStreaming} 
          streamClickedStart={streamClickedStart}
          streamClickedEnd={streamClickedEnd}
          paused={masterPaused}
        />
      </div>
    );
  }
  else if (playerRole === "PLAYER") {
    return (
      <div className="App">
        <div className="audio-streams" id="audio-streams">
          {renderVideos()}
        </div>
          <PlayerView currentlyStreaming={currentlyStreaming} masterVolume={masterVolume} playerVolumeSliderChanged={playerVolumeSliderChanged} playerVolumeToggleClicked={playerVolumeToggleClicked}/>
      </div>
    );
  }
  else if (playerRole === "PLAYER") {
    return (
      <div className="App">
        Loading...
      </div>
    );
  }
}

export default App;
'use client';

import React, {useEffect, useRef} from 'react';
import WaveSurfer from 'wavesurfer.js';

type AudioWaveformProps = {
  audioUrl: string;
  onLoadedData?: () => void;
};

const AudioWaveform: React.FC<AudioWaveformProps> = ({audioUrl, onLoadedData}) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'violet',
        progressColor: 'purple',
        mediaControls: true
      });

      if (onLoadedData) {
        wavesurfer.current.on('ready', onLoadedData);
      }

      (wavesurfer.current as any).on('error', (e: any) => {
        console.error("WaveSurfer error: ", e);
      });


      wavesurfer.current.load(audioUrl);
    }

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [audioUrl, onLoadedData]);


  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
    wavesurfer.current?.playPause();
  };

  return (
    <div className="w-full">
      <div ref={waveformRef}></div>
    </div>
  );
};

export default AudioWaveform;

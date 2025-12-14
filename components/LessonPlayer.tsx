import React from "react";
import ReactPlayer from "react-player";

type Props = {
  youtubeUrl: string;
};

export default function LessonPlayer({ youtubeUrl }: Props) {
  return (
    <div className="w-full aspect-video bg-black">
      <ReactPlayer url={youtubeUrl} width="100%" height="100%" controls />
    </div>
  );
}

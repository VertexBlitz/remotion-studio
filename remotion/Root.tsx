import React from "react";
import { Composition } from "remotion";
import { TitleCard, type TitleCardProps } from "./TitleCard";
const defaults: TitleCardProps = { title: "A story worth watching", subtitle: "Turn an idea into a video.", accent: "#c7a6ff" };
export const RemotionRoot: React.FC = () => <Composition id="TitleCard" component={TitleCard} durationInFrames={150} fps={30} width={1080} height={1080} defaultProps={defaults} />;
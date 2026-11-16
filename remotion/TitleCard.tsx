import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
export type TitleCardProps = { title: string; subtitle: string; accent: string };
export const TitleCard: React.FC<TitleCardProps> = ({ title, subtitle, accent }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const rise = interpolate(frame, [0, 28], [34, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ backgroundColor: "#191a20", color: "#f5f3f8", padding: 92, fontFamily: "Arial, sans-serif", justifyContent: "space-between", overflow: "hidden" }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 80% 18%, ${accent}35, transparent 48%)` }} />
    <AbsoluteFill style={{ opacity: .18, backgroundImage: "linear-gradient(#ffffff12 1px, transparent 1px),linear-gradient(90deg,#ffffff12 1px,transparent 1px)", backgroundSize: "54px 54px" }} />
    <div style={{ position: "relative", fontSize: 20, letterSpacing: 4, color: accent }}>REMOTION STUDIO / 001</div>
    <div style={{ position: "relative", opacity, transform: `translateY(${rise}px)` }}>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: 104, lineHeight: 1.02, letterSpacing: -4, maxWidth: 850, margin: 0 }}>{title}</h1>
      <p style={{ color: "#b6b2bd", fontSize: 30, marginTop: 34, maxWidth: 720 }}>{subtitle}</p>
      <div style={{ width: 76, height: 6, background: accent, marginTop: 52 }} />
    </div>
    <div style={{ position: "relative", display: "flex", justifyContent: "space-between", color: "#85818d", fontSize: 16, letterSpacing: 3 }}><span>AN IDEA IN MOTION</span><span>2026</span></div>
  </AbsoluteFill>;
};
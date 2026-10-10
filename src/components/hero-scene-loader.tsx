"use client";
import dynamic from "next/dynamic";

// three.js hanya dimuat di browser, tidak menambah beban render server
const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false, loading: () => null });
export function HeroSceneLoader() {
  return <HeroScene />;
}

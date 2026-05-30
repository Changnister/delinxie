const logos = [
  { src: "Images/Globe & Mail Logo.png", alt: "Globe and Mail" },
  { src: "Images/Toronto Star Logo.png", alt: "Toronto Star" },
  { src: "Images/Ottawa Citizen Logo.png", alt: "Ottawa Citizen" },
  { src: "Images/hilltimeslogo.png", alt: "The Hill Times" },
  { src: "Images/HamiltonLogo.png", alt: "Hamilton Spectator" },
  { src: "Images/windsorstarlogo.png", alt: "Windsor Star" },
  { src: "Images/Policy Options Logo.png", alt: "Policy Options" },
  { src: "Images/GPJ Logo.png", alt: "Global Policy Journal" },
  { src: "Images/PQ Logo.png", alt: "Poets & Quants" },
  { src: "Images/Healthy Debate Logo.webp", alt: "Healthy Debate" },
  { src: "Images/MCN Logo.png", alt: "MedCity News" },
  { src: "Images/hospitalnewslogo.png", alt: "Hospital News" },
  { src: "Images/chnlogo.png", alt: "Canadian Healthcare Network" },
];

if (typeof window.initLogoMarqueeOnReady === "function") {
  window.initLogoMarqueeOnReady({
    elementId: "bylinesLogos",
    logos: logos,
    baseSeconds: 46,
    minSeconds: 28,
    maxSeconds: 120,
  });
}

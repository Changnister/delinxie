const logos = [
  { src: "Images/UTMlogo.png", alt: "University of Toronto Mississauga" },
  { src: "Images/LDFP Logo.png", alt: "Leslie Dan Faculty of Pharmacy" },
  { src: "Images/HBA Logo.png", alt: "HBA" },
  { src: "Images/CAPSI Logo.png", alt: "CAPSI" },
  { src: "Images/BCPA Logo.png", alt: "BCPA" },
  { src: "Images/AFS Logo.png", alt: "AFS" },
  { src: "Images/HMBlogo.png", alt: "HMB" },
];

if (typeof window.initLogoMarqueeOnReady === "function") {
  window.initLogoMarqueeOnReady({
    elementId: "speakingLogos",
    logos: logos,
    baseSeconds: 46,
    minSeconds: 28,
    maxSeconds: 120,
  });
}

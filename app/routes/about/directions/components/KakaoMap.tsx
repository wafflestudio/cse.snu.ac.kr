import { useEffect, useRef } from 'react';

const LATITUDE = 37.449996;
const LONGITUDE = 126.952509;
const KAKAO_SCRIPT_ID = 'kakao-map-sdk';

declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: 귀찮아
    kakao?: any;
  }
}

const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;

export default function KakaoMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeMap = () => {
      const options = {
        center: new window.kakao.maps.LatLng(LATITUDE, LONGITUDE),
        level: 3,
      };
      const map = new window.kakao.maps.Map(containerRef.current, options);
      const markerPosition = new window.kakao.maps.LatLng(LATITUDE, LONGITUDE);
      const marker = new window.kakao.maps.Marker({ position: markerPosition });
      marker.setMap(map);
    };

    if (window.kakao?.maps) {
      window.kakao.maps.load(initializeMap);
      return;
    }

    const existingScript = document.getElementById(
      KAKAO_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        window.kakao?.maps?.load(initializeMap);
      });
      return;
    }

    const script = document.createElement('script');
    script.id = KAKAO_SCRIPT_ID;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;
    script.onload = () => window.kakao?.maps?.load(initializeMap);
    document.head.appendChild(script);
  }, []);

  return (
    <div
      id="map"
      ref={containerRef}
      className="h-80 w-full rounded-lg bg-neutral-100"
    />
  );
}

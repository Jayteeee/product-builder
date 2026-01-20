import { useState, useEffect } from "react";

interface LocationState {
  loaded: boolean;
  coordinates?: { lat: number; lng: number };
  address?: string; // "서울시 강남구 역삼동" 형태
  error?: { code: number; message: string };
}

export function useGeolocation() {
  const [location, setLocation] = useState<LocationState>({
    loaded: false,
  });

  const onSuccess = async (location: GeolocationPosition) => {
    const { latitude, longitude } = location.coords;
    
    // 좌표는 얻었지만, 주소 변환이 필요함
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
        {
            headers: {
                'Accept-Language': 'ko-KR' // 한국어 응답 요청
            }
        }
      );
      const data = await response.json();
      
      // 주소 조합 (시/도 + 구/군 + 동/면/읍)
      const addr = data.address;
      const city = addr.city || addr.province || "";
      const district = addr.borough || addr.district || "";
      const neighborhood = addr.quarter || addr.neighbourhood || addr.suburb || addr.village || "";
      
      const fullAddress = `${city} ${district} ${neighborhood}`.trim();

      setLocation({
        loaded: true,
        coordinates: {
          lat: latitude,
          lng: longitude,
        },
        address: fullAddress || "알 수 없는 위치",
      });
    } catch (e) {
      console.error("Reverse geocoding failed", e);
      setLocation({
        loaded: true,
        coordinates: {
          lat: latitude,
          lng: longitude,
        },
        address: "내 주변", // 실패 시 기본값
      });
    }
  };

  const onError = (error: GeolocationPositionError) => {
    setLocation({
      loaded: true,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  };

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      onError({
        code: 0,
        message: "Geolocation not supported",
      } as GeolocationPositionError);
      return;
    }

    setLocation((prev) => ({ ...prev, loaded: false }));
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  };

  return { location, requestLocation };
}

type Coordinates = { lat: number; lng: number };

let kakaoLoader: Promise<void> | null = null;

function loadKakaoSdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.kakao?.maps?.services) return Promise.resolve();
  const appKey = import.meta.env.VITE_KAKAO_JS_KEY;
  if (!appKey) return Promise.resolve();

  if (!kakaoLoader) {
    kakaoLoader = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Kakao Maps SDK"));
      document.head.appendChild(script);
    });
  }

  return kakaoLoader;
}

function keywordSearchCount(
  places: any,
  kakaoRef: any,
  keyword: string,
  coords: Coordinates,
  radius: number
): Promise<number> {
  return new Promise((resolve) => {
    console.debug("[kakao] keywordSearch", { keyword, radius, coords });
    const options = {
      location: new kakaoRef.maps.LatLng(coords.lat, coords.lng),
      radius,
      size: 15,
      sort: kakaoRef.maps.services.SortBy.DISTANCE,
    };

    places.keywordSearch(keyword, (data: any, status: string) => {
      console.debug("[kakao] keywordSearch result", { keyword, status, count: Array.isArray(data) ? data.length : 0 });
      if (status === kakaoRef.maps.services.Status.OK) {
        resolve(Array.isArray(data) ? data.length : 0);
        return;
      }
      resolve(0);
    }, options);
  });
}

export async function getNearbyMenuCounts(
  menuNames: string[],
  coords: Coordinates,
  radius = 1600
): Promise<Record<string, number>> {
  try {
    await loadKakaoSdk();
  } catch (e) {
    console.error(e);
    return {};
  }

  const kakaoRef = window.kakao;
  if (!kakaoRef?.maps?.services) return {};
  console.debug("[kakao] SDK ready", { coords, radius, menuCount: menuNames.length });
  const places = new kakaoRef.maps.services.Places();
  const counts: Record<string, number> = {};

  for (const name of menuNames) {
    const keyword = `${name} 맛집`;
    counts[name] = await keywordSearchCount(places, kakaoRef, keyword, coords, radius);
  }

  return counts;
}

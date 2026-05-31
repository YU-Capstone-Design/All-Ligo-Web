const KAKAO_MAP_SCRIPT_ID = "kakao-map-script";

let kakaoMapPromise = null;

const getKakaoMapKey = () => import.meta.env.VITE_KAKAO_MAP_KEY;

const loadKakaoMap = () => {
  const kakaoMapKey = getKakaoMapKey();

  if (!kakaoMapKey) {
    return Promise.reject(new Error("Kakao map key is missing"));
  }

  if (window.kakao?.maps?.Map && window.kakao.maps.services) {
    return Promise.resolve(window.kakao);
  }

  if (kakaoMapPromise) {
    return kakaoMapPromise;
  }

  kakaoMapPromise = new Promise((resolve, reject) => {
    const finishLoad = () => {
      if (!window.kakao?.maps) {
        reject(new Error("Kakao Map SDK loaded without window.kakao.maps"));
        return;
      }

      window.kakao.maps.load(() => {
        if (!window.kakao?.maps?.Map || !window.kakao.maps.services) {
          reject(new Error("Kakao Map SDK services library is unavailable"));
          return;
        }

        resolve(window.kakao);
      });
    };

    const handleError = () => {
      kakaoMapPromise = null;
      reject(
        new Error(
          `Kakao Map SDK load failed. origin=${window.location.origin}`
        )
      );
    };

    const existingScript = document.getElementById(KAKAO_MAP_SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener("load", finishLoad, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });

      if (window.kakao?.maps) {
        finishLoad();
      }

      return;
    }

    const script = document.createElement("script");
    const kakaoMapSdkUrl = new URL("https://dapi.kakao.com/v2/maps/sdk.js");

    kakaoMapSdkUrl.searchParams.set("appkey", kakaoMapKey);
    kakaoMapSdkUrl.searchParams.set("libraries", "services");
    kakaoMapSdkUrl.searchParams.set("autoload", "false");

    script.id = KAKAO_MAP_SCRIPT_ID;
    script.src = kakaoMapSdkUrl.toString();
    script.async = true;
    script.onload = finishLoad;
    script.onerror = handleError;
    document.head.appendChild(script);
  });

  return kakaoMapPromise;
};

export default loadKakaoMap;

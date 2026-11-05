const KAKAO_MAP_SCRIPT_ID = "kakao-map-script";
let kakaoMapPromise = null;

const loadKakaoMap = () => {
  if (window.kakao?.maps?.Map && window.kakao.maps.services) {
    return Promise.resolve(window.kakao);
  }
  if (kakaoMapPromise) return kakaoMapPromise;
  const key = import.meta.env.VITE_KAKAO_MAP_KEY;
  if (!key) return Promise.reject(new Error("Kakao map key is missing"));

  kakaoMapPromise = new Promise((resolve, reject) => {
    let script = document.getElementById(KAKAO_MAP_SCRIPT_ID);
    let settled = false;
    const cleanup = () => {
      window.clearTimeout(timeout);
      script?.removeEventListener("load", finishLoad);
      script?.removeEventListener("error", fail);
    };
    const fail = () => {
      if (settled) return;
      settled = true;
      cleanup();
      script?.remove();
      reject(new Error(`Kakao Map SDK load failed. origin=${window.location.origin}`));
    };
    const finishLoad = () => {
      if (settled) return;
      if (!window.kakao?.maps?.load) return fail();
      window.kakao.maps.load(() => {
        if (settled) return;
        if (!window.kakao.maps.Map || !window.kakao.maps.services) return fail();
        settled = true;
        cleanup();
        resolve(window.kakao);
      });
    };
    const timeout = window.setTimeout(fail, 15000);

    if (!script) {
      script = document.createElement("script");
      const url = new URL("https://dapi.kakao.com/v2/maps/sdk.js");
      url.searchParams.set("appkey", key);
      url.searchParams.set("libraries", "services");
      url.searchParams.set("autoload", "false");
      script.id = KAKAO_MAP_SCRIPT_ID;
      script.src = url.toString();
      script.async = true;
      script.addEventListener("load", finishLoad, { once: true });
      script.addEventListener("error", fail, { once: true });
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", finishLoad, { once: true });
      script.addEventListener("error", fail, { once: true });
      if (window.kakao?.maps?.load) finishLoad();
    }
  }).catch((error) => {
    kakaoMapPromise = null;
    throw error;
  });
  return kakaoMapPromise;
};

export default loadKakaoMap;

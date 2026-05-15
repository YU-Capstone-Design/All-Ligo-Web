import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import arrowup from "../../assets/arrow-up.svg";
import AuthButton from "../../components/auth/AuthButton";

const DEFAULT_CENTER = { lat: 35.8338, lng: 128.7597 };

const loadKakaoMap = () => {
  const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY;
  const kakaoMapSdkUrl = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&libraries=services&autoload=false`;

  if (!kakaoMapKey) {
    return Promise.reject(new Error("Kakao map key is missing"));
  }

  return new Promise((resolve, reject) => {
    if (window.kakao?.maps?.Map) {
      window.kakao.maps.load(() => resolve(window.kakao));
      return;
    }

    const existingScript = document.getElementById("kakao-map-script");

    if (existingScript) {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => resolve(window.kakao));
        return;
      }

      existingScript.addEventListener(
        "load",
        () => {
          window.kakao.maps.load(() => resolve(window.kakao));
        },
        { once: true }
      );
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-map-script";
    script.src = kakaoMapSdkUrl;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => resolve(window.kakao));
    };
    script.onerror = () => reject(new Error("Kakao Map SDK load failed"));
    document.head.appendChild(script);
  });
};

const MyLocationSetting = () => {
  const navigate = useNavigate();
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const placesRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [mapError, setMapError] = useState("");
  const [selected, setSelected] = useState({
    title: "경북 경산시 현재 내 위치",
    subtitle: "경북 경산시 조영동1234-123",
  });

  const setSelectedLocation = useCallback((lat, lng, title, subtitle = "") => {
    const nextTitle = title || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    setSelected({
      title: nextTitle,
      subtitle,
    });

    if (!window.kakao?.maps || !mapRef.current || !markerRef.current) {
      return;
    }

    const position = new window.kakao.maps.LatLng(lat, lng);
    markerRef.current.setPosition(position);
    mapRef.current.setCenter(position);
  }, []);

  const setAddressFromCoords = useCallback(
    (lat, lng) => {
      if (!geocoderRef.current || !window.kakao?.maps) {
        setSelectedLocation(lat, lng);
        return;
      }

      geocoderRef.current.coord2Address(lng, lat, (result, status) => {
        if (status !== window.kakao.maps.services.Status.OK || !result.length) {
          setSelectedLocation(lat, lng);
          return;
        }

        const roadAddress = result[0].road_address?.address_name;
        const jibunAddress = result[0].address?.address_name;
        const title =
          roadAddress || jibunAddress || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        const subtitle = roadAddress && jibunAddress ? jibunAddress : "";

        setSelectedLocation(lat, lng, title, subtitle);
      });
    },
    [setSelectedLocation]
  );

  const searchLocation = () => {
    const query = searchText.trim();

    if (!query || !placesRef.current || !window.kakao?.maps) {
      return;
    }

    setMapError("");

    placesRef.current.keywordSearch(query, (result, status) => {
      if (status !== window.kakao.maps.services.Status.OK || !result.length) {
        setSearchResults([]);
        setMapError("검색 결과를 찾지 못했어요.");
        return;
      }

      const nextResults = result.slice(0, 5).map((place) => ({
        id: place.id,
        lat: Number(place.y),
        lng: Number(place.x),
        title:
          place.road_address_name || place.address_name || place.place_name,
        subtitle:
          place.place_name && place.place_name !== place.address_name
            ? place.place_name
            : place.address_name,
      }));

      setSearchResults(nextResults);
    });
  };

  const selectSearchResult = (place) => {
    setSelectedLocation(place.lat, place.lng, place.title, place.subtitle);
    setSearchText("");
    setSearchResults([]);
    setMapError("");
    setIsSearchMode(false);

    window.setTimeout(() => mapRef.current?.relayout(), 100);
  };

  const confirmSearch = () => {
    const query = searchText.trim();

    if (!query || !placesRef.current || !window.kakao?.maps) {
      return;
    }

    setMapError("");

    placesRef.current.keywordSearch(query, (result, status) => {
      if (status !== window.kakao.maps.services.Status.OK || !result.length) {
        setSearchResults([]);
        setMapError("검색 결과를 찾지 못했어요.");
        return;
      }

      const place = result[0];
      const title =
        place.road_address_name || place.address_name || place.place_name;
      const subtitle =
        place.place_name && place.place_name !== title
          ? place.place_name
          : place.address_name;

      setSelectedLocation(Number(place.y), Number(place.x), title, subtitle);
      setSearchText("");
      setSearchResults([]);
      setIsSearchMode(false);
      window.setTimeout(() => mapRef.current?.relayout(), 100);
    });
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMapError("현재 위치를 사용할 수 없어요.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapError("");
        setAddressFromCoords(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      () => {
        setMapError("현재 위치 권한을 확인해주세요.");
      }
    );
  };

  const handleSelect = () => {
    localStorage.setItem("mypageStoreLocation", selected.title);
    localStorage.setItem("mypageStoreLocationDetail", selected.subtitle);
    navigate("/mypage/profile");
  };

  useEffect(() => {
    if (!mapNodeRef.current) {
      return undefined;
    }

    let isMounted = true;

    loadKakaoMap()
      .then((kakao) => {
        if (!isMounted || !mapNodeRef.current) {
          return;
        }

        const initMap = (lat, lng) => {
          const center = new kakao.maps.LatLng(lat, lng);
          const map = new kakao.maps.Map(mapNodeRef.current, {
            center,
            level: 3,
          });
          const marker = new kakao.maps.Marker({
            position: center,
            map,
          });

          mapRef.current = map;
          markerRef.current = marker;
          geocoderRef.current = new kakao.maps.services.Geocoder();
          placesRef.current = new kakao.maps.services.Places();

          kakao.maps.event.addListener(map, "click", (mouseEvent) => {
            const latlng = mouseEvent.latLng;
            setAddressFromCoords(latlng.getLat(), latlng.getLng());
          });

          setAddressFromCoords(lat, lng);
          window.setTimeout(() => map.relayout(), 100);
        };

        initMap(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) =>
              setAddressFromCoords(
                position.coords.latitude,
                position.coords.longitude
              ),
            () => {}
          );
        }
      })
      .catch(() => {
        setMapError(
          "카카오맵을 불러오지 못했어요. API 키와 Web 플랫폼 도메인을 확인해주세요."
        );
      });

    return () => {
      isMounted = false;
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [setAddressFromCoords]);

  useEffect(() => {
    if (!isSearchMode) {
      return undefined;
    }

    const query = searchText.trim();

    if (!query) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      if (!placesRef.current || !window.kakao?.maps) {
        return;
      }

      placesRef.current.keywordSearch(query, (result, status) => {
        if (status !== window.kakao.maps.services.Status.OK || !result.length) {
          setSearchResults([]);
          return;
        }

        setSearchResults(
          result.slice(0, 5).map((place) => ({
            id: place.id,
            lat: Number(place.y),
            lng: Number(place.x),
            title:
              place.road_address_name || place.address_name || place.place_name,
            subtitle:
              place.place_name && place.place_name !== place.address_name
                ? place.place_name
                : place.address_name,
          }))
        );
      });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [isSearchMode, searchText]);

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      <header className="flex items-center py-[11px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="pl-[16px]"
        >
          <img src={arrowup} alt="뒤로가기" />
        </button>
        <div className="w-[314px] text-center text-[14px] leading-[20px]">
          위치 설정
        </div>
      </header>

      <div className="px-[16px] pt-[14px]">
        <div className="flex h-[40px] items-center gap-[8px] rounded-[10px] bg-[#F3F5F7] px-[12px]">
          <span
            className="relative h-[22px] w-[22px] shrink-0"
            aria-hidden="true"
          >
            <span className="absolute left-[3px] top-[3px] h-[12px] w-[12px] rounded-full border-2 border-[#9DA4AB]" />
            <span className="absolute left-[15px] top-[15px] h-[7px] w-[2px] rotate-[-45deg] rounded-full bg-[#9DA4AB]" />
          </span>
          <input
            value={searchText}
            onFocus={() => setIsSearchMode(true)}
            onChange={(event) => {
              setSearchText(event.target.value);
              setMapError("");
              setSearchResults([]);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                searchLocation();
              }
            }}
            placeholder="지번, 도로명, 건물명으로 검색"
            className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold outline-none placeholder:text-[#B8C0C8]"
          />
        </div>

        {mapError && (
          <p className="mt-[8px] text-[13px] font-semibold text-[#F06F6B]">
            {mapError}
          </p>
        )}
      </div>

      <div
        className={`relative mt-[14px] overflow-hidden ${
          isSearchMode
            ? "h-0 min-h-0 opacity-0 pointer-events-none"
            : "h-[calc(100dvh-250px)] min-h-[360px]"
        }`}
      >
        <div ref={mapNodeRef} className="h-full w-full" />
        <button
          type="button"
          onClick={useCurrentLocation}
          className="absolute bottom-[18px] right-[16px] z-[10] flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white text-[18px] font-bold text-[#5D6670] shadow-md"
          aria-label="현재 위치"
        >
          ⌾
        </button>
      </div>

      {isSearchMode && (
        <section className="flex flex-1 flex-col bg-white">
          {searchText.trim() === "" && searchResults.length === 0 ? (
            <div className="flex flex-1 items-center justify-center pb-[160px] text-center text-[15px] font-semibold leading-[24px] text-[#C1C7CE]">
              가게의 도로명 혹은
              <br />
              지번 주소를 입력해주세요.
            </div>
          ) : (
            <div className="px-[24px] pt-[20px]">
              {searchResults.map((place) => (
                <button
                  key={`${place.id}-${place.title}`}
                  type="button"
                  onClick={() => selectSearchResult(place)}
                  className="block w-full py-[13px] text-left"
                >
                  <p className="text-[15px] font-bold text-[#2A2D31]">
                    {place.title}
                  </p>
                  {place.subtitle && (
                    <p className="mt-[4px] text-[13px] font-semibold text-[#747E88]">
                      {place.subtitle}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {!isSearchMode && (
        <section className="bg-white px-[16px] pb-[calc(30px+env(safe-area-inset-bottom))] pt-[20px]">
          <h2 className="text-[17px] font-bold text-[#2A2D31]">
            {selected.title}
          </h2>
          {selected.subtitle && (
            <p className="mt-[8px] text-[14px] font-semibold text-[#747E88]">
              {selected.subtitle}
            </p>
          )}
          <div className="mt-[20px]">
            <AuthButton isActive onClick={handleSelect}>
              선택하기
            </AuthButton>
          </div>
        </section>
      )}
    </div>
  );
};

export default MyLocationSetting;

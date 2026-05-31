import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import OwnerSignupHeader from "../../components/auth/OwnerSignupHeader";
import AuthButton from "../../components/auth/AuthButton";
import { CiSearch } from "react-icons/ci";
import { updateOwnerSignupDraft } from "../../utils/ownerSignupDraft";
import loadKakaoMap from "../../utils/loadKakaoMap";

const DEFAULT_CENTER = { lat: 35.8338, lng: 128.7597 };

const OwnerStoreLocation = () => {
  const navigate = useNavigate();
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const overlayRef = useRef(null);
  const geocoderRef = useRef(null);
  const placesRef = useRef(null);
  const [locationText, setLocationText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapError, setMapError] = useState("");
  const [selectedCoords, setSelectedCoords] = useState(null);

  const hasLocation = locationText.trim() !== "";

  const getLineColor = () => {
    if (isFocused || hasLocation) return "border-[#2880EB]";
    return "border-[#B8C0C8]";
  };

  const shortenText = (text) => {
    if (text.length <= 19) return text;
    return `${text.slice(0, 19)}...`;
  };

  const setSelectedLocation = useCallback((lat, lng, label) => {
    const nextLabel = label || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    setLocationText(nextLabel);
    setSearchText(nextLabel);
    setSelectedCoords({ latitude: lat, longitude: lng });

    if (!window.kakao?.maps || !mapRef.current || !overlayRef.current) return;

    const position = new window.kakao.maps.LatLng(lat, lng);
    overlayRef.current.setPosition(position);
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

        const address =
          result[0].road_address?.address_name ||
          result[0].address?.address_name ||
          `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        setSelectedLocation(lat, lng, address);
      });
    },
    [setSelectedLocation]
  );

  const searchLocation = () => {
    const query = searchText.trim();
    if (!query || !placesRef.current || !window.kakao?.maps) return;
    setMapError("");
    placesRef.current.keywordSearch(query, (result, status) => {
      if (status !== window.kakao.maps.services.Status.OK || !result.length) {
        setMapError("검색 결과를 찾지 못했어요.");
        return;
      }
      const place = result[0];
      const label =
        place.road_address_name || place.address_name || place.place_name;
      setSelectedLocation(Number(place.y), Number(place.x), label);
    });
  };

  const handleNext = () => {
    if (!hasLocation || !selectedCoords) return;

    updateOwnerSignupDraft(selectedCoords);
    navigate("/owner-password");
  };

  useEffect(() => {
    if (!isMapOpen || !mapNodeRef.current) return;

    let isMounted = true;

    loadKakaoMap()
      .then((kakao) => {
        if (!isMounted || !mapNodeRef.current) return;

        const initMap = (lat, lng) => {
          const center = new kakao.maps.LatLng(lat, lng);
          const map = new kakao.maps.Map(mapNodeRef.current, {
            center,
            level: 3,
          });

          const content = document.createElement("div");
          content.className = "custom-marker";

          const overlay = new kakao.maps.CustomOverlay({
            position: center,
            content: content,
            zIndex: 10,
            xAnchor: 0.5,
            yAnchor: 0.5,
          });

          overlay.setMap(map);

          mapRef.current = map;
          overlayRef.current = overlay;
          geocoderRef.current = new kakao.maps.services.Geocoder();
          placesRef.current = new kakao.maps.services.Places();

          kakao.maps.event.addListener(map, "click", (mouseEvent) => {
            const latlng = mouseEvent.latLng;
            setAddressFromCoords(latlng.getLat(), latlng.getLng());
          });

          setAddressFromCoords(lat, lng);
          setTimeout(() => map.relayout(), 100);
        };

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => initMap(pos.coords.latitude, pos.coords.longitude),
            () => initMap(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng)
          );
        } else {
          initMap(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
        }
      })
      .catch((error) => {
        console.error(error);
        setMapError("카카오맵 로드 실패");
      });

    return () => {
      isMounted = false;
      mapRef.current = null;
      overlayRef.current = null;
    };
  }, [isMapOpen, setAddressFromCoords]);

  return (
    <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-white shadow-lg">
      <OwnerSignupHeader />

      <section className="px-[16px] pt-[24px]">
        <h1 className="text-[24px] leading-[41px] font-bold text-[#000000]">
          홍보할 가게 위치를 알려주세요
        </h1>
        <p className="mt-[16px] text-[16px] leading-[24px] font-medium text-[#7E858C]">
          가게 위치를 입력하면,
          <br />
          AI가 주변 상권과 함께 분석해 홍보에 활용해요.
        </p>

        <form className="mt-[34px]" onSubmit={(e) => e.preventDefault()}>
          <label className="block text-[12px] font-medium text-[#7E858C]">
            위치
          </label>
          <button
            type="button"
            onClick={() => {
              setSearchText(locationText);
              setIsMapOpen(true);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`mt-[8px] flex h-[41px] w-full items-center border-b-2 text-left ${getLineColor()}`}
          >
            <span
              className={`min-w-0 flex-1 truncate text-[28px] ${
                hasLocation
                  ? "text-[#000000] font-normal"
                  : "text-[#CAD0D6] font-normal"
              }`}
            >
              {hasLocation
                ? shortenText(locationText)
                : "지도에서 검색 해보세요."}
            </span>
            <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center">
              <CiSearch size={28} strokeWidth={0.5} color="#7E858C" />
            </span>
          </button>
        </form>
      </section>

      <div className="mt-auto px-[16px] pb-[calc(54px+env(safe-area-inset-bottom))]">
        <AuthButton isActive={hasLocation} onClick={handleNext}>
          다음
        </AuthButton>
      </div>

      {isMapOpen && (
        <div className="absolute inset-0 z-50 flex items-end bg-black/40">
          <div className="relative flex h-[93%] w-full flex-col overflow-hidden rounded-t-[30px] bg-white shadow-2xl transition-all">
            <div className="z-20 px-[20px] pt-[20px] bg-white">
              <button
                type="button"
                onClick={() => setIsMapOpen(false)}
                className="mb-[12px] flex h-[32px] w-[32px] items-center"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#9DA4AB"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-[10px] border-b-2 border-[#2880EB] pb-[8px]">
                <input
                  type="text"
                  autoFocus
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchLocation()}
                  placeholder="지도에서 검색 해보세요."
                  className="flex-1 bg-transparent text-[28px] font-normal text-[#000000] placeholder:text-[#CAD0D6] outline-none"
                />
                <button
                  type="button"
                  onClick={searchLocation}
                  className="flex items-center justify-center"
                >
                  <CiSearch size={28} strokeWidth={0.8} color="#7E858C" />
                </button>
              </div>
              {mapError && (
                <p className="mt-[8px] text-[13px] text-[#F06F6B] font-medium">
                  {mapError}
                </p>
              )}
            </div>

            <div className="absolute inset-0 z-10 pt-[130px]">
              <div ref={mapNodeRef} className="h-full w-full" />
            </div>

            <div className="z-20 mt-auto w-full px-[16px] pb-[calc(54px+env(safe-area-inset-bottom))] bg-transparent">
              <AuthButton
                isActive={hasLocation}
                onClick={() => setIsMapOpen(false)}
              >
                완료
              </AuthButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerStoreLocation;

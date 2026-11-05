import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoChevronDown, IoChevronForward, IoChevronUp, IoClose, IoCompassOutline, IoImageOutline, IoListOutline, IoLocateOutline, IoLocationOutline, IoMapOutline, IoRefreshOutline, IoSearchOutline, IoStorefrontOutline, IoTicketOutline, IoAdd, IoRemove } from "react-icons/io5";
import logo from "../assets/ligoicon.svg";
import GuestMap from "../components/guest/GuestMap";
import GuestStoreDetails, { StoreImage } from "../components/guest/GuestStoreDetails";
import { getNearbyGuestStores } from "../apis/GuestStoreApi";
import { DEFAULT_GUEST_CENTER, distanceInMeters, filterStores, formatDistance } from "../utils/guestDiscovery";

const FILTERS = [
  { id: "all", label: "전체", Icon: IoCompassOutline },
  { id: "coupons", label: "쿠폰", Icon: IoTicketOutline },
  { id: "contents", label: "콘텐츠", Icon: IoImageOutline },
];

const Guest = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const requestRef = useRef(null);
  const searchRequestRef = useRef(0);
  const locationRequestRef = useRef(0);
  const [mapReady, setMapReady] = useState(false);
  const [center, setCenter] = useState(DEFAULT_GUEST_CENTER);
  const [searchCenter, setSearchCenter] = useState(DEFAULT_GUEST_CENTER);
  const [target, setTarget] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [searchPending, setSearchPending] = useState(false);
  const [areaName, setAreaName] = useState("영남대 주변");
  const [filter, setFilter] = useState("all");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [sheet, setSheet] = useState("preview");
  const [refreshKey, setRefreshKey] = useState(0);
  const selectedStore = stores.find((store) => store.id === selectedId);
  const visibleStores = useMemo(() => filterStores(stores, filter, appliedQuery)
    .sort((a, b) => distanceInMeters(searchCenter, a) - distanceInMeters(searchCenter, b)), [stores, filter, appliedQuery, searchCenter]);
  const moved = (distanceInMeters(center, searchCenter) || 0) > 80;

  const loadStores = useCallback((location, { quiet = false } = {}) => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    return getNearbyGuestStores(location, { signal: controller.signal }).then((nextStores) => {
      if (!controller.signal.aborted) { setStores(nextStores); setError(""); setRefreshKey((value) => value + 1); }
    }).catch((error) => {
      if (import.meta.env.DEV && !controller.signal.aborted) console.error("Guest store discovery failed:", error.message);
      if (!controller.signal.aborted) setError(quiet ? "새 소식을 확인하지 못했어요. 다시 시도해 주세요." : "가게 정보를 불러오지 못했어요. 다시 시도해 주세요.");
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadStores(searchCenter);
    const refresh = () => {
      if (document.visibilityState === "visible") loadStores(searchCenter, { quiet: true });
    };
    const timer = window.setInterval(refresh, 60000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      requestRef.current?.abort();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [searchCenter, loadStores]);

  useEffect(() => () => {
    searchRequestRef.current += 1;
    locationRequestRef.current += 1;
  }, []);

  const onMapReady = useCallback((map) => { mapRef.current = map; setMapReady(true); }, []);
  const selectStore = useCallback((store) => {
    setSelectedId(store.id);
    setSheet("expanded");
    setTarget({ latitude: store.latitude, longitude: store.longitude });
  }, []);

  const moveToArea = (location, label) => {
    searchRequestRef.current += 1;
    locationRequestRef.current += 1;
    setSearchPending(false);
    setLocating(false);
    setLoading(true);
    setError("");
    setStores([]);
    setSelectedId(null);
    setAppliedQuery("");
    setSheet("preview");
    setTarget({ ...location, level: 5 });
    setSearchCenter({ ...location });
    setCenter(location);
    setAreaName(label);
  };

  const locate = () => {
    searchRequestRef.current += 1;
    setSearchPending(false);
    if (!navigator.geolocation) {
      setNotice("이 브라우저에서는 내 위치를 사용할 수 없어요. 지역을 검색해 주세요.");
      return;
    }
    const requestId = ++locationRequestRef.current;
    setLocating(true);
    setNotice("");
    navigator.geolocation.getCurrentPosition((position) => {
      if (requestId !== locationRequestRef.current) return;
      const location = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      setCurrentLocation(location);
      setQuery("");
      moveToArea(location, "내 위치 주변");
    }, (locationError) => {
      if (requestId !== locationRequestRef.current) return;
      setLocating(false);
      setNotice(locationError.code === 1
        ? "위치 권한이 꺼져 있어요. 브라우저 설정에서 허용하거나 지역을 검색해 주세요."
        : "현재 위치를 확인하지 못했어요. 지도를 움직이거나 지역을 검색해 주세요.");
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
  };

  const search = (event) => {
    event.preventDefault();
    locationRequestRef.current += 1;
    setLocating(false);
    const keyword = query.trim();
    setNotice("");
    if (!keyword) { setAppliedQuery(""); return; }
    const matching = filterStores(stores, "all", keyword);
    if (matching.length) {
      searchRequestRef.current += 1;
      setSearchPending(false);
      setFilter("all");
      setAppliedQuery(keyword);
      setSelectedId(null);
      setSheet("preview");
      setTarget({ latitude: matching[0].latitude, longitude: matching[0].longitude, level: 4 });
      return;
    }
    if (!mapReady) { setNotice("지도 연결 후 지역을 검색할 수 있어요."); return; }
    const requestId = ++searchRequestRef.current;
    setSearchPending(true);
    const places = new window.kakao.maps.services.Places();
    places.keywordSearch(keyword, (results, status) => {
      if (requestId !== searchRequestRef.current) return;
      setSearchPending(false);
      if (status !== window.kakao.maps.services.Status.OK || !results.length) {
        setNotice("검색 결과가 없어요. 지역명이나 가게 이름을 다시 입력해 주세요.");
        return;
      }
      moveToArea({ latitude: Number(results[0].y), longitude: Number(results[0].x) }, `${results[0].place_name} 주변`);
    }, { location: mapRef.current.getCenter(), sort: window.kakao.maps.services.SortBy.ACCURACY });
  };

  const searchHere = () => {
    setQuery("");
    setNotice("");
    moveToArea(center, "이 지도 주변");
  };

  const refreshStores = () => {
    setLoading(true);
    setError("");
    loadStores(searchCenter);
  };

  const changeFilter = (value) => {
    setFilter(value);
    setSelectedId(null);
    setSheet("preview");
  };

  return (
    <main className={`relative h-[100dvh] w-full overflow-hidden bg-[#F6F6F8] tracking-[-0.35px] text-[#202A38] [&_button]:cursor-pointer [&_button:disabled]:cursor-default [&_button:disabled]:opacity-50 [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-2 [&_button:focus-visible]:outline-[#89BAFF] [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-[#89BAFF] ${sheet === "expanded" ? "[--sheet-height:60%]" : sheet === "collapsed" ? "[--sheet-height:76px]" : "[--sheet-height:34%]"}`}>
      <GuestMap stores={visibleStores} selectedId={selectedId} onSelect={selectStore} onCenterChange={setCenter} onReady={onMapReady} target={target} currentLocation={currentLocation} />
      <header className="absolute inset-x-0 top-0 z-20 h-[146px] bg-white px-4 pt-3 shadow-[0_3px_8px_#2d45630a]">
        <div className="mb-2.5 flex h-[25px] items-center gap-1.5 [&>img]:h-[23px] [&>img]:w-[22px]">
          <button className="-ml-1.5 flex h-8 w-6 items-center justify-center text-[#7E858C]" type="button" aria-label="시작 화면으로 돌아가기" onClick={() => navigate("/splash")}><IoArrowBack /></button>
          <img src={logo} alt="" />
          <span className="ml-auto flex items-center gap-1 whitespace-nowrap text-[9px] text-[#8793A2] max-[360px]:hidden [&_i]:h-[5px] [&_i]:w-[5px] [&_i]:rounded-full [&_i]:bg-[#2880EB]"><i /> 우리 동네 발견</span>
        </div>
        <form className="flex h-[45px] items-center gap-2 rounded-xl border-[1.5px] border-[#2880EB] bg-white px-3 shadow-[0_4px_12px_#2880eb08] [&>svg]:shrink-0 [&>svg]:text-[22px] [&>svg]:text-[#2880EB] [&_input]:min-w-0 [&_input]:w-full [&_input]:bg-transparent [&_input]:text-xs [&_input]:outline-none [&_input]:placeholder:text-[#9DA4AB] [&_button]:flex [&_button]:h-8 [&_button]:w-6 [&_button]:shrink-0 [&_button]:items-center [&_button]:justify-center [&_button]:text-[#2880EB]" onSubmit={search} role="search">
          <IoSearchOutline aria-hidden="true" />
          <input aria-label="지역 또는 가게 검색" placeholder="어떤 동네, 어떤 가게가 궁금하세요?" value={query} onChange={(event) => {
            setQuery(event.target.value);
            searchRequestRef.current += 1;
            setSearchPending(false);
            if (!event.target.value.trim()) setAppliedQuery("");
          }} />
          {query && <button className="!w-[18px] !text-[#9DA4AB]" type="button" aria-label="검색어 지우기" onClick={() => { setQuery(""); setAppliedQuery(""); searchRequestRef.current += 1; setSearchPending(false); }}><IoClose /></button>}
          <button type="submit" aria-label="검색" disabled={searchPending}>{searchPending ? <span className="inline-block h-[18px] w-[18px] shrink-0 animate-spin rounded-full border-2 border-[#DBEAFF] border-t-[#2880EB] motion-reduce:animate-none" /> : <IoChevronForward />}</button>
        </form>
        <nav className="mt-2.5 flex gap-2 [&_button]:flex [&_button]:items-center [&_button]:justify-center [&_button]:gap-1.5 [&_button]:rounded-full [&_button]:border [&_button]:border-[#E6EAF0] [&_button]:bg-white [&_button]:px-[15px] [&_button]:py-[7px] [&_button]:text-xs [&_button]:font-semibold [&_button]:text-[#626D7B] [&_button]:transition-colors [&_button[aria-pressed=true]]:border-[#2880EB] [&_button[aria-pressed=true]]:bg-[#2880EB] [&_button[aria-pressed=true]]:text-white [&_button[aria-pressed=true]]:shadow-[0_3px_8px_#2880eb24] [&_svg]:text-base" aria-label="가게 필터">
          {FILTERS.map(({ id, label, Icon }) => <button type="button" key={id} aria-pressed={filter === id} onClick={() => changeFilter(id)}><Icon />{label}</button>)}
        </nav>
              </header>

      <div className="absolute left-1/2 top-[163px] z-5 -translate-x-1/2">
        <button type="button" className="flex items-center gap-[5px] whitespace-nowrap rounded-full border border-[#E5EBF3] bg-white px-3.5 py-[9px] text-[11px] font-semibold text-[#2880EB] shadow-[0_3px_16px_#263c6521] [&_svg]:text-[15px]" onClick={searchHere} disabled={loading || !mapReady}><IoRefreshOutline className={loading ? "animate-spin motion-reduce:animate-none" : ""} />{moved ? "이 지역 다시 검색" : "이 지역 새로고침"}</button>
      </div>
      <div className="absolute bottom-[calc(var(--sheet-height)+28px)] right-3.5 z-5 flex flex-col gap-[9px] [&_button]:flex [&_button]:h-[38px] [&_button]:w-[38px] [&_button]:items-center [&_button]:justify-center [&_button]:bg-white [&_button]:text-[21px] [&_button]:text-[#59697A]" aria-label="지도 조작">
        <div className="overflow-hidden rounded-xl border border-[#E5EBF3] shadow-[0_3px_14px_#263c651a] [&_button+button]:border-t [&_button+button]:border-[#EDF0F4] [@media(max-height:600px)]:hidden">
          <button type="button" aria-label="지도 확대" disabled={!mapReady} onClick={() => mapRef.current.setLevel(Math.max(1, mapRef.current.getLevel() - 1))}><IoAdd /></button>
          <button type="button" aria-label="지도 축소" disabled={!mapReady} onClick={() => mapRef.current.setLevel(Math.min(14, mapRef.current.getLevel() + 1))}><IoRemove /></button>
        </div>
        <button type="button" className="rounded-full border border-[#E5EBF3] !text-[#2880EB] shadow-[0_3px_14px_#263c651a]" aria-label="내 위치로 이동" disabled={locating || !mapReady} onClick={locate}>{locating ? <span className="inline-block h-[18px] w-[18px] shrink-0 animate-spin rounded-full border-2 border-[#DBEAFF] border-t-[#2880EB] motion-reduce:animate-none" /> : <IoLocateOutline />}</button>
      </div>
      {notice && <div className="absolute bottom-[calc(var(--sheet-height)+22px)] left-4 right-[63px] z-30 flex items-center gap-3 rounded-xl bg-[#243951ED] px-3 py-[11px] text-white shadow-[0_4px_20px_#152d4f24] [&_p]:text-[11px] [&_p]:leading-relaxed [&_button]:flex [&_button]:shrink-0 [&_button]:p-1" role="status"><p>{notice}</p><button type="button" aria-label="안내 닫기" onClick={() => setNotice("")}><IoClose /></button></div>}

      <section className="absolute inset-x-0 bottom-0 z-10 flex h-[var(--sheet-height)] flex-col rounded-t-[22px] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_#243d6514]" aria-label={selectedStore ? `${selectedStore.name} 상세 정보` : "주변 가게 목록"}>
        <button className="flex h-[22px] w-full shrink-0 items-center justify-center rounded-t-[22px] [&>span]:h-1 [&>span]:w-[34px] [&>span]:rounded-full [&>span]:bg-[#DCE2EA]" type="button" aria-label={sheet === "expanded" ? "패널 줄이기" : "패널 펼치기"} aria-expanded={sheet === "expanded"} onClick={() => setSheet(sheet === "expanded" ? "preview" : "expanded")}><span /></button>
        <div className="flex min-h-[43px] shrink-0 items-center justify-between border-b border-[#EDF0F4] px-5 pb-3 pt-[5px] text-xs [&>div]:flex [&>div]:min-w-0 [&>div]:max-w-[calc(100%-75px)] [&>div]:items-center [&>div]:gap-[5px] [&>div]:font-semibold [&>div>span]:truncate [&_svg]:shrink-0 [&_svg]:text-base [&_svg]:text-[#2880EB]">
          <div><IoLocationOutline /><span>{areaName}</span></div>
          <button type="button" className="flex items-center gap-1 py-[5px] pl-2.5 text-[11px] text-[#8793A2] [&_svg]:!text-sm [&_svg]:!text-[#8793A2]" aria-label={sheet === "collapsed" ? "가게 목록 열기" : "지도 넓게 보기"} onClick={() => setSheet(sheet === "collapsed" ? "preview" : "collapsed")}>{sheet === "collapsed" ? <><IoListOutline /> 목록 <IoChevronUp /></> : <><IoMapOutline /> 지도 <IoChevronDown /></>}</button>
                  </div>
        <div className={`min-h-0 flex-1 overflow-y-auto overscroll-contain ${sheet === "collapsed" ? "hidden" : ""}`}>
          {selectedStore ? <GuestStoreDetails key={selectedStore.id} store={selectedStore} initialTab={filter === "contents" || !selectedStore.hasCoupons ? "contents" : "coupons"} refreshKey={refreshKey} onClose={() => setSelectedId(null)} /> : <>
            <div className="flex items-center justify-between px-5 pb-2.5 pt-[18px] [&_h2]:text-[17px] [&_h2]:font-bold [&_h2]:leading-snug [&_h2_span]:ml-1 [&_h2_span]:text-[#2880EB] [&_p]:mt-1 [&_p]:text-[11px] [&_p]:text-[#8793A2]"><div><h2>{appliedQuery ? `‘${appliedQuery}’ 검색 결과` : "발견한 동네 가게"} <span>{loading ? "" : visibleStores.length}</span></h2><p>{filter === "contents" ? "가게가 직접 전하는 새로운 이야기" : "지도 속 가게를 눌러 소식을 만나보세요"}</p></div><button type="button" className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-[#EDF0F4] text-[#7E858C]" aria-label="가게 목록 새로고침" disabled={loading} onClick={refreshStores}><IoRefreshOutline /></button></div>
            {error && <div className="mx-5 mb-4 mt-1 rounded-[10px] bg-[#FFF4F3] p-[13px] text-xs leading-relaxed text-[#BC5753] [&_button]:mt-1.5 [&_button]:font-semibold [&_button]:underline" role="alert"><p>{error}</p><button type="button" onClick={refreshStores}>다시 시도</button></div>}
            {loading ? <div className="flex items-center justify-center gap-3 px-5 py-11 text-[13px] text-[#8793A2]" role="status"><span className="inline-block h-[18px] w-[18px] shrink-0 animate-spin rounded-full border-2 border-[#DBEAFF] border-t-[#2880EB] motion-reduce:animate-none" />주변 가게를 찾고 있어요</div>
                : !visibleStores.length && !error ? <div className="flex flex-col items-center justify-center gap-3 px-5 py-6 text-center text-[13px] leading-relaxed text-[#8492A3] [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-[#47576A]"><div className="mb-1 grid h-[60px] w-[60px] place-items-center rounded-[22px] bg-[#EFF5FF] text-[27px] text-[#73A9EC]"><IoStorefrontOutline /></div><h3>{appliedQuery ? "검색된 가게가 없어요" : "아직 등록된 가게가 없어요"}</h3><p>지도를 움직여 다른 동네를 둘러보거나<br />검색창에서 지역을 찾아보세요.</p>{appliedQuery && <button className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#EAF3FF] px-3 py-2 text-xs font-semibold text-[#2880EB]" type="button" onClick={() => { setQuery(""); setAppliedQuery(""); }}>검색 초기화</button>}</div>
                  : <div className="px-5">{visibleStores.map((store) => <button type="button" className="group relative flex w-full items-center gap-[13px] border-b border-[#EDF0F4] py-[17px] text-left first:pt-2.5 max-[360px]:gap-[9px] [&_h3]:my-[5px] [&_h3]:text-base [&_h3]:font-bold [&_h3]:leading-snug [&_h3]:[overflow-wrap:anywhere] hover:[&_h3]:text-[#2880EB]" key={store.id} onClick={() => selectStore(store)}><div className="min-w-0 flex-1 [&>p]:truncate [&>p]:text-xs [&>p]:text-[#8793A2]"><div className="flex items-center gap-[3px] text-[11px] font-semibold text-[#2880EB] [&_span]:ml-1 [&_span]:text-[10px] [&_span]:font-normal [&_span]:text-[#9DA4AB]"><IoLocationOutline />{formatDistance(distanceInMeters(currentLocation || searchCenter, store))}<span>{currentLocation ? "내 위치에서" : "지도 중심에서"}</span></div><h3>{store.name}</h3><p>{store.address}</p><div className="mt-2.5 flex flex-wrap gap-[5px] [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1 [&>span]:rounded-[5px] [&>span]:bg-[#EEF5FF] [&>span]:px-[7px] [&>span]:py-1 [&>span]:text-[11px] [&>span]:font-semibold [&>span]:leading-[15px] [&>span]:text-[#2880EB]">{store.hasCoupons && <span><IoTicketOutline />쿠폰{store.couponCount !== null ? ` ${store.couponCount}` : ""}</span>}{store.hasContents && <span className="!bg-[#F3F2FC] !text-[#786BC7]"><IoImageOutline />콘텐츠{store.contentCount !== null ? ` ${store.contentCount}` : ""}</span>}</div></div><StoreImage src={store.imageUrl} /><IoChevronForward className="shrink-0 text-sm text-[#BDC7D4]" /></button>)}</div>}
            <div className="flex items-center justify-center gap-1.5 px-3 py-7 text-[10px] text-[#A0A8B2]"><span className="h-1 w-1 rounded-full bg-[#8CBCFF]" />동네 가게의 새로운 소식을 함께 발견해요</div>
          </>}
        </div>
      </section>
    </main>
  );
};

export default Guest;

import { useEffect, useRef, useState } from "react";
import { IoMapOutline, IoRefreshOutline } from "react-icons/io5";
import loadKakaoMap from "../../utils/loadKakaoMap";
import { DEFAULT_GUEST_CENTER } from "../../utils/guestDiscovery";
import ticketIcon from "../../assets/ticket-outline.svg";

const GuestMap = ({ stores, selectedId, onSelect, onCenterChange, onReady, target, currentLocation }) => {
  const containerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    let resizeObserver;
    let instance;
    let idle;
    let rememberCenter;
    const container = containerRef.current;
    loadKakaoMap().then((kakao) => {
      if (!active || !containerRef.current) return;
      instance = new kakao.maps.Map(containerRef.current, {
        center: new kakao.maps.LatLng(DEFAULT_GUEST_CENTER.latitude, DEFAULT_GUEST_CENTER.longitude),
        level: 5,
      });
      instance.setCopyrightPosition(kakao.maps.CopyrightPosition.BOTTOMLEFT, false);
      let lastCenter = instance.getCenter();
      rememberCenter = () => { lastCenter = instance.getCenter(); };
      idle = () => {
        const center = instance.getCenter();
        onCenterChange({ latitude: center.getLat(), longitude: center.getLng() });
      };
      kakao.maps.event.addListener(instance, "idle", idle);
      kakao.maps.event.addListener(instance, "center_changed", rememberCenter);
      resizeObserver = new ResizeObserver(() => {
        // getCenter() can already be offset after its container changes size.
        const center = lastCenter;
        instance.relayout();
        instance.setCenter(center);
      });
      resizeObserver.observe(containerRef.current);
      setMap(instance);
      onReady(instance);
    }).catch(() => { if (active) setError(true); });
    return () => {
      active = false;
      resizeObserver?.disconnect();
      if (instance && idle) window.kakao.maps.event.removeListener(instance, "idle", idle);
      if (instance && rememberCenter) window.kakao.maps.event.removeListener(instance, "center_changed", rememberCenter);
      container?.replaceChildren();
    };
  }, [attempt, onCenterChange, onReady]);

  useEffect(() => {
    if (!map || !target) return;
    const position = new window.kakao.maps.LatLng(target.latitude, target.longitude);
    if (target.level) map.setLevel(target.level, { anchor: position });
    // Center synchronously so bottom-sheet resizing cannot interrupt a pan animation.
    map.setCenter(position);
  }, [map, target]);

  useEffect(() => {
    if (!map) return;
    const kakao = window.kakao;
    const overlays = stores.map((store) => {
      const selected = store.id === selectedId;
      const content = document.createElement("button");
      content.type = "button";
      content.className = `relative flex min-h-[30px] cursor-pointer items-center gap-[5px] rounded-[10px] border-[1.5px] py-1 pl-1 pr-[7px] font-[inherit] shadow-[0_3px_12px_#182b4d29] after:absolute after:-bottom-[5px] after:left-1/2 after:h-[9px] after:w-[9px] after:-translate-x-1/2 after:rotate-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#89BAFF] ${selected ? "border-[#2880EB] bg-[#2880EB] text-white after:bg-[#2880EB]" : "border-white bg-white text-[#36485E] after:bg-white"}`;
      content.setAttribute("aria-label", `${store.name} 가게 보기`);
      content.setAttribute("aria-pressed", String(selected));
      const badge = document.createElement("span");
      badge.className = "flex shrink-0 items-center gap-1 px-1 py-1 text-[10px] font-medium";
      if (store.hasCoupons) {
        const icon = document.createElement("img");
        icon.src = ticketIcon;
        icon.alt = "쿠폰";
        icon.className = `h-4 w-4 ${selected ? "brightness-0 invert" : ""}`;
        badge.append(icon);
      }
      if (store.hasContents) {
        const label = document.createElement("span");
        label.textContent = "콘텐츠";
        badge.append(label);
      }
      const name = document.createElement("span");
      name.className = "block max-w-[120px] truncate text-[11px] font-bold";
      name.textContent = store.name;
      content.append(badge, name);
      content.onclick = (event) => {
        event.stopPropagation();
        kakao.maps.event.preventMap();
        onSelect(store);
      };
      return new kakao.maps.CustomOverlay({
        map, content, clickable: true,
        position: new kakao.maps.LatLng(store.latitude, store.longitude),
        yAnchor: 1.25,
        zIndex: selected ? 10 : 3,
      });
    });
    return () => overlays.forEach((overlay) => overlay.setMap(null));
  }, [map, stores, selectedId, onSelect]);

  useEffect(() => {
    if (!map || !currentLocation) return;
    const content = document.createElement("div");
    content.className = "h-[18px] w-[18px] rounded-full border-[3px] border-white bg-[#2880EB] shadow-[0_0_0_8px_#2880eb24,0_2px_5px_#2b5d9033]";
    content.setAttribute("aria-label", "내 현재 위치");
    const overlay = new window.kakao.maps.CustomOverlay({
      map, content, zIndex: 2,
      position: new window.kakao.maps.LatLng(currentLocation.latitude, currentLocation.longitude),
      xAnchor: 0.5, yAnchor: 0.5,
    });
    return () => overlay.setMap(null);
  }, [map, currentLocation]);

  return (
    <div className="absolute inset-x-0 bottom-[var(--sheet-height)] top-[146px] bg-[#EEF2F4]" aria-label="주변 가게 카카오 지도">
      <div ref={containerRef} className="h-full w-full" />
      {!map && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#EEF3F8] p-6 text-center text-[#7794B3] [&_strong]:text-[17px] [&_strong]:text-[#526880] [&_p]:max-w-[260px] [&_p]:text-[13px] [&_p]:leading-relaxed" role="status">
          <IoMapOutline size={36} />
          <strong>{error ? "지도를 불러오지 못했어요" : "우리 동네 지도를 펼치는 중"}</strong>
          <p>{error ? "연결 상태를 확인하고 다시 시도해 주세요." : "가까운 가게의 새로운 소식을 만나보세요."}</p>
          {error && <button type="button" className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#EAF3FF] px-3 py-2 text-xs font-semibold text-[#2880EB]" onClick={() => { setError(false); setAttempt((value) => value + 1); }}><IoRefreshOutline /> 다시 시도</button>}
        </div>
      )}
    </div>
  );
};

export default GuestMap;

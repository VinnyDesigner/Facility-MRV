import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, X, Check, Navigation, Search, Layers, Compass } from 'lucide-react';

interface LocationMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCoordinates?: string;
  facilityName?: string;
  facilityAddress?: string;
  onSelectCoordinates: (coords: string) => void;
}

// Abu Dhabi Industrial Presets
const ABU_DHABI_PRESETS = [
  { name: 'Musaffah / ICAD', coords: [24.3644, 54.4988] as [number, number] },
  { name: 'KEZAD / Khalifa Port', coords: [24.7601, 54.7082] as [number, number] },
  { name: 'Ruwais Complex', coords: [24.1205, 52.7308] as [number, number] },
  { name: 'Al Ain Industrial', coords: [24.1956, 55.7605] as [number, number] },
  { name: 'Abu Dhabi Island', coords: [24.4539, 54.3773] as [number, number] },
];

export const LocationMapModal: React.FC<LocationMapModalProps> = ({
  isOpen,
  onClose,
  initialCoordinates = '',
  facilityName = 'Facility Location',
  facilityAddress = 'Abu Dhabi, UAE',
  onSelectCoordinates,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Default Abu Dhabi Coordinates: [24.3644, 54.4988] (Musaffah / Abu Dhabi)
  const parseCoordinates = (str: string): [number, number] => {
    if (!str) return [24.3644, 54.4988];
    const parts = str.split(',').map((p) => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      if (parts[0] >= -90 && parts[0] <= 90 && parts[1] >= -180 && parts[1] <= 180) {
        return [parts[0], parts[1]];
      }
    }
    return [24.3644, 54.4988];
  };

  const initialPos = parseCoordinates(initialCoordinates);
  const [selectedLat, setSelectedLat] = useState<number>(initialPos[0]);
  const [selectedLng, setSelectedLng] = useState<number>(initialPos[1]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tileLayerType, setTileLayerType] = useState<'streets' | 'satellite'>('streets');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Custom stylish SVG Marker Icon
  const createCustomMarker = () => {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(2, 132, 199, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #0284C7, #004B87); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,75,135,0.4); border: 2.5px solid #ffffff; cursor: grab;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });
  };

  // Initialize and manage map instance
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [selectedLat, selectedLng],
        zoom: 13,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Tile Layer (CartoDB / OpenStreetMap)
      const streetTile = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap',
          maxZoom: 19,
        }
      ).addTo(map);
      tileLayerRef.current = streetTile;

      // Add Marker
      const marker = L.marker([selectedLat, selectedLng], {
        icon: createCustomMarker(),
        draggable: true,
      }).addTo(map);

      marker.bindPopup(
        `<div style="font-family: sans-serif; font-size: 11px; padding: 2px;">
          <strong style="color: #004B87; font-size: 12px; display: block; margin-bottom: 2px;">${facilityName}</strong>
          <span style="color: #64748b;">${facilityAddress}</span>
          <div style="margin-top: 4px; font-family: monospace; font-weight: bold; color: #0284c7;">
            ${selectedLat.toFixed(5)}, ${selectedLng.toFixed(5)}
          </div>
        </div>`
      );

      marker.on('dragend', (e) => {
        const newPos = e.target.getLatLng();
        setSelectedLat(newPos.lat);
        setSelectedLng(newPos.lng);
      });

      // Click to pick location
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setSelectedLat(lat);
        setSelectedLng(lng);
        marker.setLatLng([lat, lng]);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Ensure proper canvas size rendering
      map.invalidateSize();
    }, 50);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // Update marker position when state coordinates change
  const setPosition = (lat: number, lng: number, zoomLevel = 14) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([lat, lng], zoomLevel, { animate: true });
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.getPopup()?.setContent(
        `<div style="font-family: sans-serif; font-size: 11px; padding: 2px;">
          <strong style="color: #004B87; font-size: 12px; display: block; margin-bottom: 2px;">${facilityName}</strong>
          <span style="color: #64748b;">${facilityAddress}</span>
          <div style="margin-top: 4px; font-family: monospace; font-weight: bold; color: #0284c7;">
            ${lat.toFixed(5)}, ${lng.toFixed(5)}
          </div>
        </div>`
      );
    }
  };

  // Toggle Satellite vs Street Layer
  const toggleLayer = () => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    if (tileLayerType === 'streets') {
      const satLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye',
          maxZoom: 18,
        }
      ).addTo(mapInstanceRef.current);
      tileLayerRef.current = satLayer;
      setTileLayerType('satellite');
    } else {
      const streetLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; CARTO & OpenStreetMap',
          maxZoom: 19,
        }
      ).addTo(mapInstanceRef.current);
      tileLayerRef.current = streetLayer;
      setTileLayerType('streets');
    }
  };

  const handleApply = () => {
    const formatted = `${selectedLat.toFixed(5)}, ${selectedLng.toFixed(5)}`;
    onSelectCoordinates(formatted);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl h-[90vh] max-h-[680px] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#003B6D] to-[#004B87] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-sky-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Facility GIS Location Picker</h3>
              <p className="text-[11px] text-sky-200">
                Abu Dhabi Emirate (WGS84 Coordinates) • Click map or drag pin to position
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar & Presets */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#336D9F]" />
              Hubs:
            </span>
            {ABU_DHABI_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPosition(preset.coords[0], preset.coords[1], 13)}
                className="px-2 py-1 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-[4px] text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Layer Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLayer}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-[4px] text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Layers className="w-3 h-3 text-sky-600" />
              <span>{tileLayerType === 'streets' ? 'Satellite View' : 'Street Map'}</span>
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 min-h-0 relative">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Floating Live Coordinates HUD */}
          <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg p-2.5 shadow-lg text-xs flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-sky-50 flex items-center justify-center text-sky-700 font-bold">
              <Navigation className="w-3.5 h-3.5 text-[#0284C7]" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Selected Centroid</div>
              <div className="font-mono font-bold text-[#004B87] text-xs">
                {selectedLat.toFixed(5)}, {selectedLng.toFixed(5)}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Click anywhere on the map or drag the pin to set facility centroid.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 h-[32px] bg-white hover:bg-slate-50 border border-slate-300 rounded-[4px] text-xs font-semibold text-slate-700 cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-1.5 h-[32px] bg-[#004B87] hover:bg-[#003B6D] active:scale-95 text-white font-bold text-xs rounded-[4px] shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Coordinates</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMapModal;

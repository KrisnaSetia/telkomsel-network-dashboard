/* eslint-disable @typescript-eslint/no-explicit-any */
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { Icon, divIcon, point } from "leaflet";
import style from "./Map.module.css";
import markerBronze from "@/../public/assets/marker/marker-bronze.png";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { useSearch } from "@/hooks/useSearch";
import Accordion from "react-bootstrap/Accordion";
const customIcon = new Icon({
  iconUrl: markerBronze.src,
  iconSize: [30, 45], // Ukuran ikon
});

const createClusterCustomIcon = (cluster: any) => {
  return divIcon({
    html: `<div class="${style.clusterIcon}">${cluster.getChildCount()}</div>`,
    className: "",
    iconSize: point(33, 33, true),
  });
};

interface BTSData {
  site_id: string;
  longitude: number;
  latitude: number;
  trx_date: string;
  total_rev: number;
  total_traffic: number;
  total_payload: number;
}

interface SiteMapInfo {
  handleShow: (site_id: string) => void;
}

const MapPage: React.FC<SiteMapInfo> = ({ handleShow }) => {
  const [btsData, setBtsData] = useState<BTSData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { filteredData, searchQuery } = useSearch(btsData, {
    fields: ["site_id"],
    exact: false,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/site");
        const data: BTSData[] = await res.json();
        setBtsData(data);
      } catch (err) {
        console.error("Failed to fetch BTS data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const GeneralInfo = () => {
    const totalSite = new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 2,
    }).format(btsData.length);

    return (
      <Accordion className={style.generalInfoContainer}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <h6 className={style.generalInfoTitle}>Site Map Information</h6>
          </Accordion.Header>
          <Accordion.Body>
            <div className={style.generalInfoContent}>
              <div className={style.generalInfoItem}>
                <span className={style.generalInfoLabel}>Region: </span>
                <span className={style.generalInfoValue}>
                  JATIM - JATENG - BALI NUSRA
                </span>
              </div>
              <div className={style.generalInfoItem}>
                <span className={style.generalInfoLabel}>Total Site: </span>
                <span className={style.generalInfoValue}>{totalSite} site</span>
              </div>
              <div className={style.generalInfoItem}>
                <span className={style.generalInfoLabel}>Periode:</span>
                <span className={style.generalInfoValue}>
                  Oktober - Desember 2024
                </span>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  if (isLoading) {
    return <LoadingScreen />;
  }
  // Gunakan filteredData untuk marker jika ada pencarian, jika tidak gunakan btsData
  const displayData = searchQuery ? filteredData : btsData;
  return (
    <div style={{ position: "relative" }}>
      <GeneralInfo />
      <MapContainer
        center={[-7.863382, 114.757731]} // Ganti dengan koordinat pusat area Anda
        zoom={6}
        scrollWheelZoom={true}
        className={style.leafletContainer}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {displayData.map((bts, index) => (
            <Marker
              key={index}
              position={[bts.latitude, bts.longitude]}
              icon={customIcon}
              eventHandlers={{
                mouseover: (e) => {
                  const marker = e.target;
                  setTimeout(() => marker.openPopup(), 100); // Tambahkan sedikit delay
                },
                mouseout: (e) => {
                  const marker = e.target;
                  setTimeout(() => marker.closePopup(), 100); // Tambahkan sedikit delay
                },
                click: () => handleShow(bts.site_id),
              }}
            >
              <Popup>
                <p>
                  <strong>Site ID: </strong>
                  {bts.site_id}
                </p>
                <p>
                  <strong>Latitude</strong>: {bts.latitude}
                </p>
                <p>
                  <strong>Longitude</strong>: {bts.longitude}
                </p>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default MapPage;

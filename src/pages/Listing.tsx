import { getAuth } from "firebase/auth";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Link, useParams } from "react-router-dom";
import shareIcon from "../assets/svg/shareIcon.svg";
import Spinner from "../components/Spinner";
import { db } from "../firebase.config";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";

function Listing() {
  const [listing, setListing] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [sliderActive, setSliderActive] = useState(false);

  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId!);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  const onSliderClick = () => {
    setSliderActive(!sliderActive);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
      >
        {listing?.imgUrls.map((url: any, index: any) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: sliderActive ? "contain" : "cover",
              }}
              onClick={onSliderClick}
              className={
                sliderActive ? "swiperSlideDivActive" : "swiperSlideDiv"
              }
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="share icon" />
      </div>

      {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}

      <div className="listingDetails">
        <p className="listingName">
          {listing?.name} - $
          {listing?.offer
            ? listing?.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing?.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="listingLocation">{listing?.location}</p>
        <p className="listingType">
          For {listing?.type === "rent" ? "Rent" : "Sale"}
        </p>
        {listing?.offer && (
          <p className="discountPrice">
            ${listing?.regularPrice - listing?.discountedPrice} discount
          </p>
        )}
        <ul className="listingDetailsList">
          <li>
            {listing?.bedrooms > 1
              ? `${listing?.bedrooms} Bedrooms`
              : "1 Bedroom"}
          </li>
          <li>
            {listing?.bathrooms > 1
              ? `${listing?.bathrooms} Bathrooms`
              : "1 Bathroom"}
          </li>
          <li>{listing?.parking && "Parking Spot"}</li>
          <li>{listing?.furnished && "Furnished"}</li>
        </ul>
        <p className="listingLocationTitle">Location</p>
        <MapContainer
          center={[listing?.geolocation.lat, listing?.geolocation.lng]}
          zoom={13}
          scrollWheelZoom={false}
          className="map-container"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[listing?.geolocation.lat, listing?.geolocation.lng]}
          >
            <Popup>{listing?.location}</Popup>
          </Marker>
        </MapContainer>

        {auth.currentUser?.uid !== listing?.userRef && (
          <Link
            to={`/contact/${listing?.userRef}?listingName=${listing?.name}`}
            className="primaryButton"
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listing;

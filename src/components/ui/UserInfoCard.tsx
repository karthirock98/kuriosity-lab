import { SESSION_STORAGE_KEYS } from "@/lib/app.constants";
import { getUserDataByGender } from "@/services/common.service";
import type { UserInfo } from "@/types/userInfo";
import { useEffect, useState } from "react";
import "../../assets/css/user-info-card.scss";

export interface UserInfoCardProps {
  gender: "male" | "female";
}

const UserInfoCard = ({ gender }: UserInfoCardProps) => {
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const getUserDataFromAPI = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use cached data only if it belongs to the requested gender.
        const cachedData = sessionStorage.getItem(
          `${SESSION_STORAGE_KEYS.USER_INFO}`,
        );

        if (cachedData) {
          const parsedData: UserInfo = JSON.parse(cachedData);

          if (parsedData.gender === gender) {
            if (!cancelled) setUserData(parsedData);
            return;
          }
        }

        const apiResult: UserInfo = await getUserDataByGender(gender);

        if (!apiResult) {
          throw new Error("Unable to fetch user information.");
        }

        if (!cancelled) {
          apiResult.name.first =
            sessionStorage.getItem(SESSION_STORAGE_KEYS.USER_NAME) || "";
          apiResult.name.last =
            sessionStorage
              .getItem(SESSION_STORAGE_KEYS.USER_NAME)?.[0]
              .toLocaleUpperCase() || "";
          setUserData(apiResult);

          sessionStorage.setItem(
            `${SESSION_STORAGE_KEYS.USER_INFO}`,
            JSON.stringify(apiResult),
          );
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load user information. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    getUserDataFromAPI();

    return () => {
      cancelled = true;
    };
  }, [gender]);

  if (loading) {
    return (
      <div className="user-info-container user-info-state">
        Loading profile...
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="user-info-container user-info-state">
        <p>{error ?? "No user information available."}</p>
        <button onClick={() => window.location.reload()}>Try again</button>
      </div>
    );
  }

  const fullAddress = [
    userData.location.street.number,
    userData.location.street.name,
    userData.location.city,
    userData.location.state,
    userData.location.postcode,
    userData.location.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="user-info-container">
      <div className="user-info-header">
        <img
          className="user-info-avatar"
          src={userData.picture.large}
          alt="User profile"
        />

        <div className="user-info-heading">
          <span className="user-info-label">USER PROFILE</span>
          <h2>
            {userData.name.first} {userData.name.last}
          </h2>
        </div>

        <span className={`gender-badge ${gender}`}>{userData.gender}</span>
      </div>

      <div className="user-info-grid">
        <div className="user-info-item">
          <span>Age</span>
          <strong>{userData.dob.age} years</strong>
        </div>

        <div className="user-info-item">
          <span>Date of birth</span>
          <strong>{new Date(userData.dob.date).toLocaleDateString()}</strong>
        </div>

        <div className="user-info-item">
          <span>Nationality</span>
          <strong>{userData.nat}</strong>
        </div>
      </div>

      <section className="user-info-section">
        <h3>Location</h3>

        <p className="user-info-address">{fullAddress}</p>

        <div className="user-info-grid">
          <div className="user-info-item">
            <span>Latitude</span>
            <strong>{userData.location.coordinates.latitude}</strong>
          </div>

          <div className="user-info-item">
            <span>Longitude</span>
            <strong>{userData.location.coordinates.longitude}</strong>
          </div>

          <div className="user-info-item">
            <span>Timezone</span>
            <strong>{userData.location.timezone.offset}</strong>
          </div>

          <div className="user-info-item">
            <span>Timezone region</span>
            <strong>{userData.location.timezone.description}</strong>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserInfoCard;

import { Input } from "@/components/ui/input";
import "../assets/css/domain-finder.scss";
import RoamingImages from "@/components/ui/RoamingImages";

const DomainFinder = () => {
    return (
        <div className="main-cont">

            {/* Logos */}
            <div className="company-logo-cont">
                <RoamingImages />
            </div>

            {/* Frosted glass layer */}
            <div className="frosted-glass" />

            {/* Actual page content */}
            <div className="page-content">
                <Input placeholder="What's your million-dollar domain?" className="input-domain" />
            </div>

        </div>
    );
};

export default DomainFinder;
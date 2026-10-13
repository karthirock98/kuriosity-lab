import { useState } from "react";
import "../assets/css/detective.scss";
import { urlBreaker } from "@/utils/generic.utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { IResult } from "tldts-core";
import { Button } from "@/components/ui/button";
import { getURLInvestigatedData } from "@/services/common.service";

const InternetDetective = () => {
  const [serverFetchedURLDetails, setServerFetchedURLDetails] =
    useState<any>(null);
  const [URLDetailsDialogOpen, setURLDetailsDialogOpen] =
    useState<boolean>(false);
  const [parsedURLDetails, setParsedURLDetails] = useState<IResult | null>();
  const [searchValue, setSearchValue] = useState<string | any>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchResults = () => {
    setParsedURLDetails(urlBreaker(searchValue));
    setURLDetailsDialogOpen(true);
    console.log(parsedURLDetails);
  };

  // InvestigateURL by sending to server
  const startInvestigation = async () => {
    setIsSubmitting(true);
    setTimeout(async () => {
      const res = await getURLInvestigatedData(searchValue);
      setServerFetchedURLDetails(res?.data || null);
    }, 3000);
  };

  function resetAll() {
    setServerFetchedURLDetails(null);
    setParsedURLDetails(null);
    setSearchValue(null);
    setIsSubmitting(false)
  }

  return (
    <>
      {/* Background layer */}
      <div className="video-background">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/videos/server.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Actual application */}
      <div className="internet-detective">
        <div className="search-animation-wrapper">

        
        {!serverFetchedURLDetails && (
          <div
            className={`search-input-cont ${isSubmitting ? "zoom-away" : ""}`}
          >
            <div>
              <div className="form-control">
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="input input-alt text-center"
                  placeholder="Type the damn domain address..."
                  type="text"
                />
                <span className="input-border input-border-alt"></span>
              </div>
            </div>
            {searchValue && (
              <div className="submit-btn mt-4">
                <button className="ui-btn" onClick={searchResults}>
                  <span>Search</span>
                </button>
              </div>
            )}
          </div>
        )}
        </div>

        {serverFetchedURLDetails && (
          <>
            <div className="url-details-container">
              <h2>Domain Investigation</h2>

              <div className="url-detail-card">
                <h3>Domain Information</h3>

                <p>
                  <strong>Domain:</strong>{" "}
                  {serverFetchedURLDetails.rdapDetails?.domain}
                </p>

                <p>
                  <strong>Registrar:</strong>{" "}
                  {serverFetchedURLDetails.rdapDetails?.registrar?.name ??
                    "N/A"}
                </p>

                <p>
                  <strong>Registrar ID:</strong>{" "}
                  {serverFetchedURLDetails.rdapDetails?.registrar?.id ?? "N/A"}
                </p>

                <p>
                  <strong>Registered:</strong>{" "}
                  {serverFetchedURLDetails.rdapDetails?.dates?.registered ??
                    "N/A"}
                </p>

                <p>
                  <strong>Expires:</strong>{" "}
                  {serverFetchedURLDetails.rdapDetails?.dates?.expires ?? "N/A"}
                </p>

                <p>
                  <strong>Last Updated:</strong>{" "}
                  {serverFetchedURLDetails.rdapDetails?.dates?.lastUpdated ??
                    "N/A"}
                </p>
              </div>

              <div className="url-detail-card">
                <h3>Network Information</h3>

                <p>
                  <strong>IPv4 Address:</strong>{" "}
                  {serverFetchedURLDetails.ipv4Address ?? "N/A"}
                </p>

                <p>
                  <strong>HTTP Status:</strong>{" "}
                  {serverFetchedURLDetails.httpStatus ?? "N/A"}
                </p>

                <p>
                  <strong>DNSSEC:</strong>{" "}
                  {serverFetchedURLDetails.rdapDetails?.dnssec?.enabled
                    ? "Enabled"
                    : "Disabled"}
                </p>
              </div>

              <div className="url-detail-card">
                <h3>Domain Status</h3>

                <div className="domain-status-list">
                  {(serverFetchedURLDetails.rdapDetails?.status ?? []).map(
                    (status: any) => (
                      <span key={status} className="domain-status-badge">
                        {status}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div className="url-detail-card">
                <h3>Nameservers</h3>

                <ul>
                  {(serverFetchedURLDetails.rdapDetails?.nameservers ?? []).map(
                    (server: any) => (
                      <li key={server}>{server}</li>
                    ),
                  )}
                </ul>
              </div>
            </div>
            <div className="flex w-full justify-center mb-6">
              <Button
                variant={"destructive"}
                className={"mx-auto"}
                onClick={resetAll}
              >
                Reset
              </Button>
            </div>
          </>
        )}

        {/* url details dialog */}
        <Dialog
          open={URLDetailsDialogOpen}
          onOpenChange={setURLDetailsDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Before Fetching Results confirming the below details
              </DialogTitle>
            </DialogHeader>
            <div className="details-card">
              The domain you're investigating is{" "}
              <span className="text-highlight font-semibold">
                {parsedURLDetails?.domain}
              </span>
              <span>. Shall we proceed with the investigation?</span>
            </div>
            <DialogFooter>
              <DialogClose
                render={
                  <Button onClick={startInvestigation} variant="outline">
                    Proceed
                  </Button>
                }
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default InternetDetective;

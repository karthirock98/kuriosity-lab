/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CountryDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  response: any;
};

const formatNumber = (value?: number) =>
  value != null ? new Intl.NumberFormat("en-IN").format(value) : "—";

const Detail = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="min-w-0 space-y-1">
    <p className="text-xs text-muted-foreground">{label}</p>
    <div className="wrap-break-word text-sm font-medium">{value ?? "—"}</div>
  </div>
);

const CountryDetailsDialog = ({
  open,
  onOpenChange,
  response,
}: CountryDetailsDialogProps) => {
  const country = response?.data?.country ?? response?.country;

  if (!country) return null;

  const names = country.names;
  const capital = country.capitals?.[0];
  const currencies = country.currencies ?? [];
  const languages = country.languages ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            {country.flag?.url_png && (
              <img
                src={country.flag.url_png}
                alt={`${names?.common ?? "Country"} flag`}
                className="h-16 w-24 rounded-md border object-cover"
              />
            )}

            <div className="min-w-0">
              <DialogTitle className="text-2xl">
                {country.flag?.emoji} {names?.common ?? "Country details"}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {names?.official}
              </DialogDescription>
              <p className="mt-1 text-xs text-muted-foreground">
                {country.codes?.alpha_2} · {country.codes?.alpha_3}
              </p>
            </div>
          </div>
        </DialogHeader>

        {country.descriptions?.short && (
          <p className="text-sm leading-6 text-muted-foreground">
            {country.descriptions.short}
          </p>
        )}

        <section className="space-y-3">
          <h3 className="text-sm font-semibold">General information</h3>
          <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 sm:grid-cols-3">
            <Detail label="Capital" value={capital?.name} />
            <Detail label="Region" value={country.region} />
            <Detail label="Subregion" value={country.subregion} />
            <Detail
              label="Population"
              value={formatNumber(country.population)}
            />
            <Detail
              label="Area"
              value={
                country.area?.kilometers != null
                  ? `${formatNumber(country.area.kilometers)} km²`
                  : undefined
              }
            />
            <Detail
              label="Government"
              value={country.government_type}
            />
            <Detail
              label="Continent"
              value={country.continents?.join(", ")}
            />
            <Detail
              label="Calling code"
              value={country.calling_codes?.map((code: string) => `+${code}`).join(", ")}
            />
            <Detail
              label="TLD"
              value={country.tlds?.join(", ")}
            />
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Culture and daily life</h3>
          <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 sm:grid-cols-3">
            <Detail
              label="Currencies"
              value={currencies
                .map(
                  (currency: any) =>
                    `${currency.name} (${currency.code}) ${currency.symbol ?? ""}`,
                )
                .join(", ")}
            />
            <Detail
              label="Languages"
              value={languages.map((language: any) => language.name).join(", ")}
            />
            <Detail
              label="Driving side"
              value={country.cars?.driving_side}
            />
            <Detail
              label="Start of week"
              value={country.date?.start_of_week}
            />
            <Detail
              label="Time zones"
              value={country.timezones?.join(", ")}
            />
            <Detail
              label="Measurement system"
              value={country.units?.measurement_system}
            />
            <Detail
              label="Temperature scale"
              value={country.units?.temperature_scale}
            />
            <Detail
              label="Landlocked"
              value={
                country.landlocked == null
                  ? "—"
                  : country.landlocked
                    ? "Yes"
                    : "No"
              }
            />
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Country codes and borders</h3>
          <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 sm:grid-cols-3">
            <Detail label="Numeric code" value={country.codes?.ccn3} />
            <Detail label="IOC code" value={country.codes?.cioc} />
            <Detail label="FIFA code" value={country.codes?.fifa} />
            <Detail
              label="Bordering countries"
              value={country.borders?.join(", ") || "None"}
            />
            <Detail
              label="Native names"
              value={Object.values(names?.native ?? {})
                .map((item: any) => item.common)
                .join(", ")}
            />
            <Detail
              label="Alternate names"
              value={names?.alternates?.join(", ")}
            />
          </div>
        </section>

        {country.descriptions?.long && (
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">About</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              {country.descriptions.long}
            </p>
          </section>
        )}

        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Explore</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            {country.links?.official && (
              <a
                href={country.links.official}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-4"
              >
                Official website
              </a>
            )}
            {country.links?.google_maps && (
              <a
                href={country.links.google_maps}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-4"
              >
                Google Maps
              </a>
            )}
            {country.links?.wikipedia && (
              <a
                href={country.links.wikipedia}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-4"
              >
                Wikipedia
              </a>
            )}
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default CountryDetailsDialog;

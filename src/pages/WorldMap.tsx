/* eslint-disable @typescript-eslint/no-explicit-any */

import { useLayoutEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5plugins_json from "@amcharts/amcharts5/plugins/json";
import * as am5map from "@amcharts/amcharts5/map";
import worldLow from "@amcharts/amcharts5-geodata/worldLow";
import mapConfig from "../assets/game-map.json";
import "../assets/css/game-map.scss";
import CountryDetailsDialog from "@/components/ui/CountryDetailsDialog";
import { getCountryDetailsByCode } from "@/services/common.service";

const WorldMap = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [countryResponse, setCountryResponse] = useState<any>(null);

  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");
    const config: any = structuredClone(mapConfig);

    config.settings.panX = "rotateX";
    config.settings.panY = "rotateY";

    const worldSeriesRef = config.refs.find((ref: any) => ref["series-1"]);

    if (worldSeriesRef) {
      worldSeriesRef["series-1"].settings.geoJSON = worldLow;
    }

    const parser = am5plugins_json.JsonParser.new(root);

    parser
      .parse(config, { parent: root.container })
      .then(() => {
        root.container.walkChildren((child) => {
          if (child instanceof am5map.MapPolygonSeries) {
            child.mapPolygons.template.events.on("click", async (event) => {
              const data = event.target.dataItem?.dataContext as any;
              const countryCode = data?.id;

              if (!countryCode) return;

              try {
                // Replace this URL with your actual API endpoint.
                const response = await getCountryDetailsByCode(countryCode);
                if (response.statusCode !== 200) {
                  throw new Error("Failed to fetch country details");
                }

                setCountryResponse(response.data);
                setDialogOpen(true);
              } catch (error) {
                console.error("Failed to fetch country details:", error);
              }
            });
          }
        });
      })
      .catch((error: any) => {
        console.error("Failed to load map:", error);
        root.dispose();
      });

    return () => root.dispose();
  }, []);

  return (
    <>
      <div id="chartdiv" className="chartdiv" />

      <CountryDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        response={countryResponse}
      />
    </>
  );
};

export default WorldMap;

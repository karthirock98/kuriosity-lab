import { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5plugins_json from "@amcharts/amcharts5/plugins/json";
import * as am5map from "@amcharts/amcharts5/map";
import worldLow from "@amcharts/amcharts5-geodata/worldLow";
import mapConfig from "../assets/game-map.json";
import "../assets/css/game-map.scss";

const GameMap = () => {
  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");
    const config: any = structuredClone(mapConfig);

    config.settings.panX = "rotateX";
    config.settings.panY = "rotateY";

    const worldSeriesRef = config.refs.find(
      (ref: any) => ref["series-1"]
    );

    if (worldSeriesRef) {
      worldSeriesRef["series-1"].settings.geoJSON = worldLow;
    }

    const parser = am5plugins_json.JsonParser.new(root);

    parser
      .parse(config, { parent: root.container })
      .then(() => {
        // Find the map polygon series created from your JSON config
        const polygonSeries = root.container.children
          .getIndex(0)
          ?.children;

        // Find the actual MapPolygonSeries in the parsed chart
        if (!polygonSeries) return;

        root.container.walkChildren((child) => {
          if (child instanceof am5map.MapPolygonSeries) {
            child.mapPolygons.template.events.on("click", (event) => {
              const data = event.target.dataItem?.dataContext as any;

              console.log("Country name:", data?.name);
              console.log("Country ID:", data?.id);
              console.log("Full country data:", data);
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

  return <div id="chartdiv" className="chartdiv" />;
};

export default GameMap;
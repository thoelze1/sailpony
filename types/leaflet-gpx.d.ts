import * as L from "leaflet";

declare module "leaflet" {
  namespace GPX {
    interface Options extends L.GeoJSONOptions {
      async?: boolean;
      marker_options?: {
        startIconUrl?: string;
        endIconUrl?: string;
        shadowUrl?: string;
      };
      markers?: {
        startIcon?: L.Icon;
        endIcon?: L.Icon;
        shadowUrl?: string;
      };
    }
  }

  class GPX extends L.FeatureGroup {
    constructor(gpx: string, options?: GPX.Options );
    getBounds(): L.LatLngBounds;
  }
}

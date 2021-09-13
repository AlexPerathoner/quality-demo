import { Marker } from "mapbox-gl"

export type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right"
export class NamedMarker extends Marker {
    name: string
}
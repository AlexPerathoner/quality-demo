import { LatLngId, LatLngIdScores } from "@targomo/core"
import { Marker } from "mapbox-gl"

export type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right"
export class NamedMarker extends Marker {
    name: string
    id: number
}



export interface NamedLatLngId extends LatLngId {
    name: string
}
export interface NamedLatLngIdScores extends LatLngIdScores {
    name: string
}
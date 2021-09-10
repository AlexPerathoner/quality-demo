import { EdgeWeightType, TargomoClient, TravelType } from "@targomo/core"
import { environment } from "../environments/environment"

export const client = new TargomoClient('britishisles', environment.Targomo_API_KEY)
// Coordinates of the markers

// Travel options
export const EDGE_WEIGHT: EdgeWeightType = 'time' // Can be 'time' or 'distance'

export let MAX_TRAVEL = 1800 // Integer that represents meters or seconds, depending on EDGE_WEIGHT's value
export let TRAVEL_MODE: TravelType = 'walk' // Can be 'walk', 'car', 'bike' or 'transit'

export function setTravelMode(travelMode: TravelType) {
    TRAVEL_MODE = travelMode
}
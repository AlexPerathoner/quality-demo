import { Injectable } from '@angular/core';
import { LatLng } from '@targomo/core';
import { ReverseGeocodingResponse, responseFailed } from 'app/types/reverse-geocoding.model';

@Injectable({
  providedIn: 'root'
})
export class LocationNamesService {
  
  private async fetchReverseGeocoding(latLng: LatLng): Promise<ReverseGeocodingResponse> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latLng.lat}&lon=${latLng.lng}&format=json`
    const response = await fetch(url)
    const data = response.json()
    return data
  }

  async getNameOfLocation(pos: LatLng): Promise<[string, string]>{
    const data = await this.fetchReverseGeocoding(pos)
    let str1 = ""
    let str2 = ""
    if(responseFailed(data)) {
      str1 = "Unknown Address"
    } else {
      str1 = data.address.road + (data.address.house_number ? ", "+data.address.house_number : "")
      str2 = data.address.city 
    }
    
    return [str1, str2]
  }

}

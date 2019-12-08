import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { House } from '../models/house';

@Component({
  selector: 'app-house-list',
  templateUrl: './house-list.component.html',
  styleUrls: ['./house-list.component.css']
})

export class HouseListComponent implements OnInit {

  houseData: any;

  houseData_from_Eberswalder_stasse: Array<House>;
  houseData_with_more_than_five_rooms: Array<House>;
  houseData_without_complete_data: Array<House>;

  sorted_houseData_from_Eberswalder_stasse: Array<House>;
  sorted_houseData_with_more_than_five_rooms: Array<House>;
  sorted_houseData_without_complete_data: Array<House>;


  /**
   *  constructor to init the varibales 
   */
  constructor(
    public apiService: ApiService
  ) {
    this.houseData = [];
    this.houseData_from_Eberswalder_stasse = [];
    this.houseData_with_more_than_five_rooms = [];
    this.houseData_without_complete_data = [];

    this.sorted_houseData_from_Eberswalder_stasse = [];
    this.sorted_houseData_with_more_than_five_rooms = [];
    this.sorted_houseData_without_complete_data = [];
  }

  ngOnInit() {
    this.getAllHouses();
  }

  /**
   *  This funtion get the list of houses depening upon conditions described below
      1. a list of all the houses sorted according to their distance to your sisters home in Eberswalder Straße 55. Start w ith the house
          w ith the low est distance.
      2. a list of houses w hich have more then 5 rooms. Start w ith the low est number of rooms.
      3. a list of houses that you do not have all the data for. Sort them by the street-name.
   */

  getAllHouses() {
    //Get saved list of houses
    this.apiService.getList().subscribe(response => {
      console.log(response);
      this.houseData = response;

      this.getAllHouses_from_Eberswalder_stasse();

      this.getAllHouses_with_more_than_five_rooms();
      this.sortHouseWithRooms();

      this.getAllHouses_without_complete_data();
      this.sortHouseWithoutData();

    })
  }

  /**
   *  This Sorts the houses based on rooms
   */
  private sortHouseWithRooms() {
    this.sorted_houseData_with_more_than_five_rooms = this.houseData_with_more_than_five_rooms.sort(function (a, b) {
      if (a.params.rooms < b.params.rooms) {
        return -1;
      }
      if (a.params.rooms > b.params.rooms) {
        return 1;
      }
      return 0;
    });
  }

  /**
   *  This Sorts the houses based on street Name
   */
  private sortHouseWithoutData() {
    this.sorted_houseData_without_complete_data = this.houseData_without_complete_data.sort((a, b) => a.street.localeCompare(b.street))
  }

  /**
   *  This Sorts the houses based on distance from street Eberswalder Straße 55
   */
  getAllHouses_from_Eberswalder_stasse() {

    let { lang1, long1 } = this.get_base_langitude_and_longitude();

    this.sorted_houseData_from_Eberswalder_stasse = this.houseData_from_Eberswalder_stasse.sort(function (a, b) {
      let dist1: number = this.distance(lang1, long1, a.cordinate.latitude, a.cordinate.longitude);
      let dist2: number = this.distance(lang1, long1, b.cordinate.latitude, b.cordinate.longitude);
      if (dist1 < dist2) {
        return -1;
      }
      if (dist1 > dist2) {
        return 1;
      }
      return 0;
    });

  }

  /**
   *  This funtion calculates the distance between two langitudes and longitude
   */
  private get_base_langitude_and_longitude() {
    let lang1: number = 0;
    let long1: number = 0;
    Array<House>(this.houseData).forEach(function (house) {
      let streetName: string = "";
      if (house.street.toLowerCase().match("Eberswalder Straße 55")) {
        lang1 = house.cordinate.latitude;
        long1 = house.cordinate.longitude;
      }
    });
    return { lang1, long1 };
  }

  /**
   *  This funtion calculates the distance of streets from Eberswalder Straße 55
   */
  getAllHouses_with_more_than_five_rooms() {
    //Get saved list of houses

    Array<House>(this.houseData).forEach(function (house) {
      if (house.params.rooms > 5 && house.params.value) {
        this.houseData_with_more_than_five_rooms.push(house);
      }
    });
  }

  /**
   *  This funtion checks for houses which has has missing data
   */
  getAllHouses_without_complete_data() {
    //Get saved list of houses
    Array<House>(this.houseData).forEach(function (house) {
      if (!house.params.value) {
        this.houseData_without_complete_data.push(house);
        return;
      }

      if (!house.params.rooms) {
        this.houseData_without_complete_data.push(house);
        return;
      }

      if (!house.params.value) {
        this.houseData_without_complete_data.push(house);
      }

    });
  }

  /**
   *  This funtion calculates the distance between two given langitudes and longitude
   */
  private distance(lat1: number, lon1: number, lat2: number, lon2: number) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      let radlat1: any = Math.PI * lat1 / 180;
      var radlat2: any = Math.PI * lat2 / 180;
      let theta: any = lon1 - lon2;
      let radtheta: any = Math.PI * theta / 180;
      let dist: any = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344

      return dist;
    }
  }
}

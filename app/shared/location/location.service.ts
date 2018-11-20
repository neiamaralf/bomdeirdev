import { Injectable } from "@angular/core";
import { DbService } from "../db/db.service";
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "ui/enums";
import { MapView, Marker, Position, Bounds } from 'nativescript-google-maps-sdk';

export interface LocationData {
    latitude?: number;
    longitude?: number;
    altitude?: number;
}

@Injectable()
export class LocationService {
    watchId: any;
    constructor(private db: DbService) {

    }

    enableLocation(callback, errorcalback) {
        var __this = this;
        geolocation.isEnabled().then(function (isEnabled) {
            if (!isEnabled) {
                geolocation.enableLocationRequest().then(function () {
                    __this.getLocationOnce()
                        .then(function (location) {
                            callback();
                            console.dir(location)
                        })
                }, function (e) {
                    console.log("Error: " + (e.message || e));
                    errorcalback()
                });
            }
            else callback();
        }//, function (e) {
          //  console.log("Error: " + (e.message || e));
        //}
        );
    }

    getEndFromlatlong(callback) {
        var _this = this;
        this.getLocationOnce()
            .then(function (location) {
                console.log("Location received: ");
                var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
                url = url + location.latitude.toString() + "," + location.longitude.toString();
                url = url + "&result_type=administrative_area_level_1|administrative_area_level_2&key=AIzaSyBjF_58qpK1CsH2SMZdhNtFmab87Q4wfWU";
                console.log(url);
                _this.db.geturl(url, "application/json").subscribe(function (res) {
                   // console.log("res localizacao:")
                    //console.dir(res);
                    callback(res)
                });
            }).catch(function (error) {
                console.log("Location error received: " + error);
                alert("Location error received: " + error);
            });
    };

    getlatlongFromEnd(enddata) {
        var url = "https://maps.googleapis.com/maps/api/geocode/json?address=";
        var end = enddata.logradouro.split(" ");
        end.forEach(function (e) {
            url = url + e + "+";
        });
        url.replace(/.$/, ",");
        url = url + "+" + enddata.numero + "+-+";
        var bair = enddata.bairro.split(" ");
        bair.forEach(function (e) {
            url = url + e + "+";
        });
        url.replace(/.$/, ",");
        url = url + "+";
        var cid = enddata.localidade.split(" ");
        cid.forEach(function (e) {
            url = url + e + "+";
        });
        url.replace(/.$/, ",");
        url = url + "-+" + enddata.uf + ",+" + enddata.cep;
        url = url + "&key=AIzaSyBjF_58qpK1CsH2SMZdhNtFmab87Q4wfWU";
        return this.db.geturl(url, "application/json");
    };

    getLocationOnce() {
        return geolocation.getCurrentLocation({
            desiredAccuracy: Accuracy.high,
            updateDistance: 5,
            timeout: 5000
        });
    };

    startwatch(__this, marker) {
        this.watchId = geolocation.watchLocation(function (loc) {
            if (loc) {
                marker = __this.mapView.findMarker(function (marker) {
                    return marker.userData.index === 1;
                });
                loc.altitude = 0;
                marker.position = Position.positionFromLatLng(loc.latitude, loc.longitude);
                marker.snippet = "distância = " + geolocation.distance(loc, __this.location).toFixed(0) + " metros";
                // console.log("Received location: " + loc.latitude);
                // console.log("Received longitude: " + loc.longitude);
                // console.dir(loc);
                marker.showInfoWindow();
            }
        }, function (e) {
            console.log("Error: " + e.message);
        }, { desiredAccuracy: Accuracy.high, updateDistance: 3, minimumUpdateTime: 1000 * 3 });
    };

    stopwath() {
        if (this.watchId)
            geolocation.clearWatch(this.watchId);
    };
}
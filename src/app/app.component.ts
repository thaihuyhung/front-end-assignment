import {Component, OnInit, ElementRef, ViewChild, ViewChildren, AfterViewInit, QueryList} from '@angular/core';
import {CommonService} from "./services/common.service";
import {DomSanitizer} from "@angular/platform-browser";

const SERVICE_ITEM_CARD_WIDTH = 200;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('servicesContainerElem')
  servicesContainerElem: ElementRef;

  @ViewChildren('serviceItemElems')
  serviceItemElems: QueryList<ElementRef>;

  services = [];
  serviceMap = [];
  transformItem = [];
  connections = [];

  clientCoordinates = {};
  serverCoordinates = {};

  oldServicesCount = 0;

  circleSize: number = 300;

  lastUpdate;
  updateAfter = 0;

  constructor(private commonService: CommonService, private sanitizer: DomSanitizer) {}

  ngOnInit() {

  }

  prepareCoordinateData(){
    this.serviceItemElems.toArray().forEach((item, index) => {
      const serviceItemCard = item.nativeElement.querySelector('.mat-card');
      const boundingClientRect = serviceItemCard.getBoundingClientRect();

      const itemName = this.services[index].service;

      this.clientCoordinates[itemName] = {
        left: boundingClientRect.left + SERVICE_ITEM_CARD_WIDTH / 2,
        top: boundingClientRect.top - 8,
      };

      this.serverCoordinates[itemName] = {
        left: boundingClientRect.left + SERVICE_ITEM_CARD_WIDTH / 2,
        top: boundingClientRect.top + boundingClientRect.height,
      };
    });
    console.log("this.clientCoordinates", this.clientCoordinates);
    console.log("this.serverCoordinates", this.serverCoordinates);
  }

  ngAfterViewInit(){
    this.commonService.statistics.subscribe(data => {
      console.log("Data Updated");
      if (Object.keys(this.clientCoordinates).length === 0 && this.serviceItemElems){
        this.prepareCoordinateData();
      }

      this.handleReceiveData(data);
      const now = new Date();
      if (this.lastUpdate){
        this.updateAfter = (now.getTime() - this.lastUpdate.getTime()) / 1000;
      }
      this.lastUpdate = now;
    });
  }

  addNewConnection(clientCoordinate, serverCoordinate){
    const leftX = clientCoordinate.left;
    const topX = clientCoordinate.top;

    const leftY = serverCoordinate.left;
    const topY = serverCoordinate.top;

    const distanceXY = Math.sqrt(Math.pow(leftX - leftY, 2) + Math.pow(topX - topY, 2));

    const leftZ = leftY;
    const topZ = topX;

    const distanceXZ = Math.sqrt(Math.pow(leftX - leftZ, 2) + Math.pow(topX - topZ, 2));
    const distanceYZ = Math.sqrt(Math.pow(leftY - leftZ, 2) + Math.pow(topY - topZ, 2));

    const angleA = Math.acos((distanceXY * distanceXY + distanceXZ * distanceXZ - distanceYZ * distanceYZ) / (2 * distanceXY * distanceXZ));

    let angleADeg = angleA * 180 / Math.PI;

    if (topX > topY){
      angleADeg += 180;
    } else if (leftX > leftY){
      angleADeg = angleADeg + (90 - angleADeg) * 2;
    }

    this.connections.push({
      top: topX,
      left: leftX,
      width: distanceXY,
      rotate: `rotate(${angleADeg}deg)`,
    });
  }

  handleReceiveData(data) {
    this.services = data.services;
    this.serviceMap = data['service-map'].sort((x, y) => x.client.localeCompare(y.client));

    if (this.oldServicesCount !== this.services.length){
      this.updateTransformStylingArray();
      this.oldServicesCount = this.services.length;
    }

    this.updateServiceMapConnections();
  }

  updateServiceMapConnections(){
    this.connections = [];
    this.serviceMap.forEach((item) => {
      if (this.clientCoordinates[item.client] && this.serverCoordinates[item.server]){
        this.addNewConnection(this.clientCoordinates[item.client], this.serverCoordinates[item.server]);
      }
    });
  }

  updateTransformStylingArray() {
    if (this.services && this.services.length){
      const angle = 360 / this.services.length;
      this.circleSize = this.servicesContainerElem.nativeElement.clientWidth * 0.8;
      const translate = `translate(${this.circleSize/2}px)`;

      let rot = -90;

      for(let i = 0; i < this.services.length; i++) {
        const rotate1 = `rotate(${rot}deg)`;
        const rotate2 = `rotate(${-rot}deg)`;
        this.transformItem.push(this.sanitizer.bypassSecurityTrustStyle(`${rotate1} ${translate} ${rotate2}`));
        rot += angle;
      }

    }
  }

  getTransformStyling(index) {
    return this.transformItem[index];
  }
}

import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {WebSocketService} from "../core/web-socket.service";

const WEBSOCKET_URL = 'ws://127.0.0.1:8080/ws';

@Injectable()
export class CommonService {

  public statistics: Subject<any> = new Subject<any>();

  constructor(private wsService: WebSocketService) {

    this.statistics = <Subject<any>>this.wsService
      .connect(WEBSOCKET_URL)
      .map((response: MessageEvent): any => {
        console.log("response.data", response.data);
        let data = JSON.parse(response.data);
        return data;
      });
  }

}

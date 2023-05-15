export interface Device {
    uid: number;
    vendor: string;
    date_created: Date;
    status: "online" | "offline";
  }
  
  export interface Gateway {
    serial_number: string;
    name: string;
    ip_address: string;
    devices: Device[];
  }
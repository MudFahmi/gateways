import { getLocalStorage, setLocalStorage } from "../utils/localStorage";
import { Gateway, Device } from "../@types";

export default class GatewayService {
  async getAllGateways(): Promise<Gateway[]> {
    const response = getLocalStorage("gateways");
    return response ? (response as Gateway[]) : [];
  }

  async getGateway(serialNumber: string): Promise<Gateway | undefined> {
    const response = getLocalStorage("gateways") as Gateway[];
    return response.find((gateway) => gateway.serial_number === serialNumber);
  }
  async addGateway(body: Gateway): Promise<boolean> {
    const gateways = getLocalStorage("gateways") as Gateway[];
    const response = setLocalStorage("gateways", [...gateways, body]);
    return !!response;
  }

  async removeGateway(serialNumber: string): Promise<boolean> {
    const gateways = getLocalStorage("gateways") as Gateway[];
    const response = setLocalStorage("gateways", [
      ...gateways.filter((gateway) => gateway.serial_number !== serialNumber),
    ]);
    return !!response;
  }

  async getAllDecives(serialNumber: string): Promise<Device[]> {
    const response = getLocalStorage("gateways") as Gateway[];
    const devices = response.find(
      (gateway) => gateway.serial_number === serialNumber
    )?.devices;
    return devices as Device[];
  }

  async addDevice(serialNumber: string, device: Device): Promise<boolean> {
    const gateways = getLocalStorage("gateways") as Gateway[];
    const gatewayArrayIndex = gateways.findIndex(
      (gateway) => gateway.serial_number === serialNumber
    );
    gateways[gatewayArrayIndex].devices.push(device);
    const response = setLocalStorage("gateways", gateways);
    return !!response;
  }

  async removeDevice(serialNumber: string, uid: number): Promise<boolean> {
    const gateways = getLocalStorage("gateways") as Gateway[];
    const gatewayArrayIndex = gateways.findIndex(
      (gateway) => gateway.serial_number === serialNumber
    );
    const deviceArrayIndex = gateways[gatewayArrayIndex].devices.findIndex(
      (device) => device.uid === uid
    );
    gateways[gatewayArrayIndex].devices.splice(deviceArrayIndex, 1);
    const response = setLocalStorage("gateways", gateways);
    return !!response;
  }
}

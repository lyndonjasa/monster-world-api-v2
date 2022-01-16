export class UploadItemRequest {
  name: string;
  description: string;
  cost: number;
  type: string;
  rate: {
    rookie: number;
    champion: number;
    ultimate: number;
    mega: number;
    ultra: number;
  }
}
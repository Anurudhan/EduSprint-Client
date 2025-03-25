// export interface BannerEntity {
//     _id?: string;
//     title: string;
//     description?: string;
//     imageUrl?: string | null;
//     status?: 'Active' | 'Scheduled' | 'Expired';
//     startDate?: Date;
//     endDate?: Date;
//     targetUrl?: string;
//     position?: 'top' | 'bottom' | 'sidebar';
//   }
export enum BannerStatus {
    Scheduled = 'Scheduled',
    Active = 'Active',
    Expired = 'Expired',
  }

export interface BannerEntity {
  _id?: string;
  title: string;
  imageUrl : string ;
  status?: BannerStatus;
  startDate?: string;
  endDate?: string;
}
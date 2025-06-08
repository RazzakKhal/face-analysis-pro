export interface GlobalReport {
    report: Report,
    images: ReportImages
}


export interface Report {
  tier1: number;
  tier2: number;
  tier3: number;
  totalHeight: number;
  segment_widths: number[];
  totalWidth: number;
  interpupillary_distance: number;
  face_width_no_ears: number;
  ratio_height_width: number;
  ratios: Ratios;
}

export interface Ratios {
  eye_ratio: number;
  lip_ratio: number;
  nose_lip_menton_ratio: number;
  nose_mouth_ratio: number;
  nose_ratio: number;
}

export interface ReportImages {
  eye_dims: string;
  face_dims: string;
  grid_horizontal: string;
  grid_vertical: string;
  lip_thickness: string;
  mouth_nose_widths: string;
  nose_dims: string;
  nose_lip_chin: string;
  original: string;
}

import { Injectable } from '@angular/core';
import * as DataSectionType from './sectionType.json';
import { SectionType } from '@barassistantshared/entities';

@Injectable({
  providedIn: 'root'
})
export class SectionTypeService {
  data: SectionType[] = (DataSectionType as any).default as SectionType[];
  getData(): SectionType[] {
    return this.data;
  }
}

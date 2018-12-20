import { AxiosResponse } from "axios";

export interface IRelationship {
  resourceId: string;
  field: string;
  getId?: (data: any) => string;
  many?: boolean;
}

export interface IResource {
  createOperation?: string;
  deleteOperation?: string;
  getOperation: string;
  id: string;
  idField: string;
  getListItems?: (response: AxiosResponse) => any[];
  listItemSchema?: string;
  listOperation: string;
  name: string;
  nameField: string;
  namePlural: string;
  parameterName: string;
  spec: string;
  relationships?: IRelationship[];
}
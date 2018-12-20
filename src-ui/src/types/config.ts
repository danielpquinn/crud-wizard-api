import { AxiosResponse, AxiosStatic } from "axios";
import { IOperationArguments } from "../lib/swagger";
import { IResource } from "./resource";
import { Spec } from "./swagger";

/**
 * Project configuration provided by customers
 */
export interface IConfig {

  /**
   * Based on the current state of the list view, can we load the next page?
   */
  hasNextPage?: (

    /**
     * Current page, tracked in list view state
     */
    currentPage: number,

    /**
     * Total number of pages, returned from getTotalPages and stored in list view state
     */
    totalPages: number,

    /**
     * The last page of results loaded
     */
    currentResponse: AxiosResponse
  ) => boolean;

  /**
   * Function to call when next page button is clicked
   */
  nextPage?: (

    /**
     * Current page, tracked in list view state
     */
    currentPage: number,

    /**
     * Current page, tracked in list view state
     */
    totalPages: number,

    /**
     * Current page, tracked in list view state
     */
    currentResponse: AxiosResponse,

    /**
     * Current page, tracked in list view state
     */
    args: IOperationArguments
  ) => Promise<AxiosResponse>;

  initialize?: (axios: AxiosStatic) => Promise<any>,

  signOut?: () => Promise<any>;

  resources: IResource[],

  specs: { [id: string]: Spec }
}

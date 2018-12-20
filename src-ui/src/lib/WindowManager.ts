import { pick } from "lodash";
import {
  defaultWindowHeight,
  defaultWindowWidth,
  headerHeight
} from "src/constants";
import { Publisher } from "src/lib/Publisher";

const localStorageWindowsKey = "windowState";

export enum WindowType {
  Create,
  List,
  Detail
}

interface IWindow {
  active: boolean;
  height: number;
  index: number;
  left: number;
  props: any;
  savedProps: string[];
  top: number;
  width: number;
  windowType: WindowType;
}

export interface IWindows {
  [id: string]: IWindow;
}

let windowManager: WindowManager;

class WindowManager extends Publisher<IWindows> {
  private windows: IWindows;

  constructor() {
    super();
    this.loadWindows();
  }

  public addWindow(id: string, windowType: WindowType, props: any, savedProps: string[]) {

    Object.keys(this.windows).forEach((windowId: string) => {
      this.windows[windowId].active = false;
      this.windows[windowId].index += 1;
    });

    this.windows[id] = {
      active: true,
      height: defaultWindowHeight,
      index: 0,
      left: (window.innerWidth - defaultWindowWidth) / 2,
      props,
      savedProps,
      top: headerHeight + 50,
      width: defaultWindowWidth,
      windowType,
    };

    this.publish("updated", this.windows);
  }

  public removeWindow(id: string) {
    delete this.windows[id];
    this.publish("updated", this.windows);
  }

  public getWindows(): IWindows {
    return this.windows;
  }

  public getWindow(windowId: string): IWindow {
    return this.getWindows()[windowId];
  }

  public updateWindow(windowId: string, windowState: Partial<IWindow>) {
    const window = this.getWindow(windowId);
    Object.keys(windowState).forEach(key => {
      window[key] = windowState[key];
    });
    this.publish("updated", this.windows);
  }

  public moveToFront(windowId: string) {
    Object.keys(this.windows).forEach((id: string) => {
      if (this.windows[id].index < this.windows[windowId].index) {
        this.windows[id].active = false;
        this.windows[id].index += 1;
      }
    });
    this.windows[windowId].active = true;
    this.windows[windowId].index = 0;
    this.publish("updated", this.windows);
  }

  public saveWindows() {
    const serialized = Object.keys(this.windows).reduce((last: IWindows, key: string) => {
      const window = this.windows[key];
      last[key] = {
        active: window.active,
        height: window.height,
        index: window.index,
        left: window.left,
        props: pick(window.props, window.savedProps),
        savedProps: window.savedProps,
        top: window.top,
        width: window.width,
        windowType: window.windowType,
      };
      return last;
    }, {});
    const stringified = JSON.stringify(serialized);
    localStorage.setItem(localStorageWindowsKey, stringified);
  }

  private loadWindows() {
    const serializedWindows = localStorage.getItem(localStorageWindowsKey);
    if (!serializedWindows) {
      this.windows = {};
      return;
    }
    let windowStateIndex: IWindows = {};
    try {
      windowStateIndex = JSON.parse(serializedWindows as string);
    } catch (e) {
      localStorage.removeItem(localStorageWindowsKey);
    }
    this.windows = windowStateIndex;
  }
}

export const getWindowManager = () => {
  if (!windowManager) {
    windowManager = new WindowManager();
  }
  return windowManager;
};

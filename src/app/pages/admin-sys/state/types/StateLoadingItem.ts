export class StateLoadingItem {
  isLoading: boolean;       // current state is loading of data
  isLoadingError: boolean;  // loading completed with errors
  errorData?: Error;        // errors data, if loading completed with errors
  isCompleted: boolean;     // loading completed without errors

  /**
   * 
   */
  constructor() {
    let statePurified = StateLoadingItem.reset();
    this.isLoading = statePurified.isLoading;
    this.isLoadingError = statePurified.isLoadingError;
    this.isCompleted = statePurified.isCompleted;
  }


  /**
   * 
   * @returns 
   */
  static reset(): StateLoadingItem {
    return {
      isLoading: false,
      isLoadingError: false,
      errorData: undefined,
      isCompleted: false,
    }
  }


  /**
   * 
   * @returns 
   */
  static loading(): StateLoadingItem {
    return {
      isLoading: true,
      isLoadingError: false,
      isCompleted: false,
    }
  }


  /**
   * 
   * @param err 
   * @returns 
   */
  static error(err: any): StateLoadingItem {
    return {
      isLoading: false,
      isLoadingError: true,
      errorData: err,
      isCompleted: false,
    }
  }


  /**
   * 
   * @returns 
   */
  static complete(): StateLoadingItem {
    return {
      isLoading: false,
      isLoadingError: false,
      isCompleted: true,
    }
  }
}